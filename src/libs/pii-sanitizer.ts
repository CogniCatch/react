/**
 * pii-sanitizer.ts
 *
 * Strips potential PII from error context before it ever reaches the LLM.
 * This is the Zero-PII contract: raw errors NEVER leave the boundary unsanitized.
 */

// ─── Regex Patterns ───────────────────────────────────────────────────────────

const PII_PATTERNS: Array<{ name: string; pattern: RegExp; replacement: string }> = [
  // Emails
  {
    name: "email",
    pattern: /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g,
    replacement: "[EMAIL_REDACTED]",
  },
  // Bearer / API tokens in Authorization headers
  {
    name: "bearer_token",
    pattern: /Bearer\s+[A-Za-z0-9\-._~+/]+=*/gi,
    replacement: "Bearer [TOKEN_REDACTED]",
  },
  // JWT tokens (three base64url segments)
  {
    name: "jwt",
    pattern: /eyJ[A-Za-z0-9\-_]+\.eyJ[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+/g,
    replacement: "[JWT_REDACTED]",
  },
  // Generic API keys (long hex or base64-looking strings 32+ chars)
  {
    name: "api_key",
    pattern: /\b([A-Za-z0-9]{32,})\b/g,
    replacement: "[KEY_REDACTED]",
  },
  // Phone numbers (loose match)
  {
    name: "phone",  
    pattern: /(\+?\d[\d\s\-().]{7,}\d)/g,
    replacement: "[PHONE_REDACTED]",
  },
  // IP addresses
  {
    name: "ipv4",
    pattern: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g,
    replacement: "[IP_REDACTED]",
  },
  // URL query parameters that could carry tokens/emails
  {
    name: "url_query_params",
    pattern: /([?&](?:token|key|secret|auth|email|user|access_token|refresh_token|api_key|apikey|password|passwd|pwd)=[^&\s]+)/gi,
    replacement: "[PARAM_REDACTED]",
  },
  // Potential SSNs
  {
    name: "ssn",
    pattern: /\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/g,
    replacement: "[SSN_REDACTED]",
  },
  // Credit card numbers (Luhn-ish pattern)
  {
    name: "credit_card",
    pattern: /\b(?:\d[ -]?){13,19}\b/g,
    replacement: "[CC_REDACTED]",
  },
];

// ─── Sanitize ─────────────────────────────────────────────────────────────────

export function sanitizeText(input: string): string {
  let sanitized = input;
  for (const { pattern, replacement } of PII_PATTERNS) {
    sanitized = sanitized.replace(pattern, replacement);
  }
  return sanitized;
}

export interface SanitizedErrorContext {
  /** The sanitized error message */
  message: string;
  /** HTTP status code if from an API call */
  httpStatus?: number;
  /** Error code / type — no values, just the shape */
  errorCode?: string;
  /** The route/path where the error occurred — query params stripped */
  routePath?: string;
  /** Component name from the React error boundary */
  componentName?: string;
}

export interface RawErrorContext {
  message: string;
  httpStatus?: number;
  errorCode?: string;
  /** Full URL — will be cleaned */
  url?: string;
  componentStack?: string;
  componentName?: string;
}

export function sanitizeErrorContext(raw: RawErrorContext): SanitizedErrorContext {
  // Strip only path, drop query string (could contain tokens)
  let routePath: string | undefined;
  if (raw.url) {
    try {
      const parsed = new URL(raw.url);
      routePath = parsed.pathname; // path only, no query
    } catch {
      routePath = undefined;
    }
  }

  // Extract component name from stack (first line only, strip file paths)
  let componentName = raw.componentName;
  if (!componentName && raw.componentStack) {
    const firstLine = raw.componentStack.split("\n")[1] ?? "";
    const match = /at (\w+)/.exec(firstLine);
    componentName = match?.[1];
  }

  return {
    message: sanitizeText(raw.message).slice(0, 500), // hard cap
    httpStatus: raw.httpStatus,
    errorCode: raw.errorCode ? sanitizeText(raw.errorCode).slice(0, 100) : undefined,
    routePath,
    componentName,
  };
}
