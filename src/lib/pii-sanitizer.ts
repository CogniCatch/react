/**
 * pii-sanitizer.ts
 *
 * Strips potential PII from error context before it ever reaches the LLM or Sentry.
 * This is the Zero-PII contract: raw errors NEVER leave the boundary unsanitized.
 * * * AUDITED FOR:
 * 1. Client-Side Performance (Main Thread blocking prevention via max limits)
 * 2. ReDoS (Flattened Regexes to prevent catastrophic backtracking)
 * 3. Deep Object Sanitization (Safe Payload stripping)
 */

// ─── Regex Patterns (Hardened against ReDoS) ──────────────────────────────────

const PII_PATTERNS: Array<{
	name: string
	pattern: RegExp
	replacement: string
}> = [
	{
		name: "email",
		pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
		replacement: "[EMAIL_REDACTED]",
	},
	{
		name: "bearer_token",
		pattern: /Bearer\s+[A-Za-z0-9\-._~+/]+=*/gi,
		replacement: "Bearer [TOKEN_REDACTED]",
	},
	{
		name: "jwt",
		pattern: /eyJ[A-Za-z0-9\-_]+\.eyJ[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+/g,
		replacement: "[JWT_REDACTED]",
	},
	{
		name: "api_key",
		pattern:
			/\b(?:sk|pk|key|api|sec)_[a-zA-Z0-9]{20,}\b|\b[A-Za-z0-9]{32,48}\b/g,
		replacement: "[KEY_REDACTED]",
	},
	{
		name: "phone",
		pattern:
			/\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{4}\b/g,
		replacement: "[PHONE_REDACTED]",
	},
	{
		name: "ipv4",
		pattern: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
		replacement: "[IP_REDACTED]",
	},
	{
		name: "url_query_params",
		pattern:
			/([?&](?:token|key|secret|auth|email|user|access_token|refresh_token|api_key|apikey|password|passwd|pwd)=)[^&\s]+/gi,
		replacement: "$1[PARAM_REDACTED]",
	},
	{
		name: "ssn",
		pattern: /\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/g,
		replacement: "[SSN_REDACTED]",
	},
	{
		name: "credit_card",
		pattern: /\b(?:\d{4}[ -]?){3}\d{4}\b|\b\d{13,19}\b/g,
		replacement: "[CC_REDACTED]",
	},
]

// ─── Sanitize ─────────────────────────────────────────────────────────────────

export function sanitizeText(input: string, maxLength: number = 1000): string {
	if (!input) return ""

	let sanitized = String(input)
	if (sanitized.length > maxLength) {
		sanitized = `${sanitized.slice(0, maxLength)}... [TRUNCATED]`
	}

	return PII_PATTERNS.reduce((text, { pattern, replacement }) => {
		return text.replace(pattern, replacement)
	}, sanitized)
}

export function sanitizePayload(payload: unknown): unknown {
	if (payload === null || payload === undefined) return payload

	try {
		if (typeof payload === "string") {
			return sanitizeText(payload, 5000)
		}

		const stringified = JSON.stringify(payload)
		const sanitizedString = sanitizeText(stringified, 10000)

		try {
			return JSON.parse(sanitizedString)
		} catch {
			return sanitizedString
		}
	} catch (_e) {
		return "[CIRCULAR_PAYLOAD_REDACTED]"
	}
}

export interface SanitizedErrorContext {
	message: string
	httpStatus?: number
	errorCode?: string
	routePath?: string
	componentName?: string
}

export interface RawErrorContext {
	message: string
	httpStatus?: number
	errorCode?: string
	url?: string
	componentStack?: string
	componentName?: string
}

export function sanitizeErrorContext(
	raw: RawErrorContext,
): SanitizedErrorContext {
	let routePath: string | undefined
	if (raw.url) {
		try {
			const parsed = new URL(raw.url, "http://dummy.com")
			routePath = parsed.pathname
		} catch {
			routePath = undefined
		}
	}

	let componentName = raw.componentName

	if (!componentName && raw.componentStack) {
		const stackLines = raw.componentStack
			.split("\n")
			.map((line) => line.trim())
			.filter(Boolean)

		const targetLine: string = stackLines[0] || ""

		const match = /^at (\w+)/.exec(targetLine)

		componentName = match?.[1] || "UnknownComponent"
	}

	return {
		message: sanitizeText(raw.message, 500),
		httpStatus: raw.httpStatus,
		errorCode: raw.errorCode ? sanitizeText(raw.errorCode, 100) : undefined,
		routePath,
		componentName,
	}
}
