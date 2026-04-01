import { z } from "zod"

export type SeverityLevel = "low" | "medium" | "high"

export interface ThemeOptions {
	primaryColor?: string
	backgroundColor?: string
	textColor?: string
	borderRadius?: string
	fontFamily?: string
}

export interface BaseAdaptiveProps {
	theme?: ThemeOptions
	onRecover?: () => void
	className?: string
}

// ==========================================
// 2. OPEN SOURCE
// ==========================================

export interface ManualModeProps extends BaseAdaptiveProps {
	mode: "manual"
	severity: SeverityLevel
	title: string
	description: string
	actionLabel?: string
}

// ==========================================
// 3. SaaS / PRO
// ==========================================

export interface AutoModeProps extends BaseAdaptiveProps {
	mode: "auto"
	apiKey?: string
	apiUrl?: string
	error?: Error
	language?: string
	handleUserBilling?: boolean
}
export type AdaptiveErrorProps = ManualModeProps | AutoModeProps

// ==========================================
// 5. ZOD SCHEMA
// ==========================================

export const GenUIResponseSchema = z.object({
	severity: z
		.enum(["low", "medium", "high"])
		.describe(
			"The severity level based on the error. " +
				"'low' for background sync/minor issues. " +
				"'medium' for isolated component crashes. " +
				"'high' for fatal app crashes/routing failures.",
		),
	title: z
		.string()
		.describe("A short, user-friendly title for the error (max 5 words)."),
	description: z
		.string()
		.describe(
			"A clear, empathetic, non-technical explanation of what went wrong. " +
				"CRITICAL RULE: If severity is 'low', strictly limit to a maximum of 90 characters. " +
				"For 'medium' or 'high', limit to 200 characters. Never show stack traces.",
		),
	actionLabel: z
		.string()
		.nullable()
		.describe(
			"Short text for the recovery button (e.g., 'Try Again', 'Reload'). Max 3 words.",
		),
})

export type GenUIResponse = z.infer<typeof GenUIResponseSchema>

// ==========================================
// AI / GENERATIVE UI BOUNDARY PROPS
// ==========================================

export interface BaseAIBoundaryProps extends BaseAdaptiveProps {
	children: React.ReactNode
	rawPayload?: unknown
	showRawData?: boolean
	onError?: (
		error: Error,
		errorInfo: React.ErrorInfo,
		rawPayload?: unknown,
	) => void
}

export interface ManualAIBoundaryProps extends BaseAIBoundaryProps {
	mode: "manual"
	title?: string
	description?: string
}

export interface AutoAIBoundaryProps extends BaseAIBoundaryProps {
	mode: "auto"
	apiKey?: string
	apiUrl?: string
	language?: string
}

export type AIBoundaryProps = ManualAIBoundaryProps | AutoAIBoundaryProps

// ==========================================
// ZOD SCHEMA: AI FALLBACK RESPONSE (MODO PRO)
// ==========================================

export const AIFallbackResponseSchema = z.object({
	title: z
		.string()
		.describe("A short, user-friendly, translated title for the AI failure."),
	description: z
		.string()
		.describe(
			"A clear, empathetic, translated explanation. Tell the user the visual failed but the data is safe.",
		),
	formattedData: z
		.string()
		.describe(
			"Take the hallucinated raw JSON data and format it into clean, readable Markdown (tables, lists). Do not include code blocks, just readable text/markdown.",
		),
	actionLabel: z
		.string()
		.nullable()
		.describe("Short text for the recovery button (e.g., 'Try Again')."),
})

export type AIFallbackResponse = z.infer<typeof AIFallbackResponseSchema>
