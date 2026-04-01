import React, { Component, type ErrorInfo } from "react"
import { AdaptiveContext } from "../../components/AdaptiveProvider"
import { sanitizeErrorContext } from "../../lib/pii-sanitizer"
import type {
	AIBoundaryProps,
	AIFallbackResponse,
	AutoAIBoundaryProps,
} from "../../types"
import { AIFallbackUI } from "./AIFallbackUI"

const safeStringify = (data: unknown): string => {
	if (typeof data !== "object" || data === null) return String(data)
	try {
		return JSON.stringify(data, null, 2)
	} catch (_error) {
		return "[Complex Object - Cannot be stringified]"
	}
}

interface State {
	hasError: boolean
	error: Error | null
	isProcessingAuto: boolean
	aiData: AIFallbackResponse | null
	hasCrashedFallback: boolean
}

export class AIBoundary extends Component<AIBoundaryProps, State> {
	static contextType = AdaptiveContext
	declare context: React.ContextType<typeof AdaptiveContext>

	private _isMounted = false

	constructor(props: AIBoundaryProps) {
		super(props)
		this.state = {
			hasError: false,
			error: null,
			isProcessingAuto: false,
			aiData: null,
			hasCrashedFallback: false,
		}
	}

	componentDidMount() {
		this._isMounted = true
	}

	componentWillUnmount() {
		this._isMounted = false
	}

	static getDerivedStateFromError(error: Error): Partial<State> {
		return { hasError: true, error }
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		if (this.state.hasCrashedFallback) return

		// 1. Trigger the Observability callback
		if (this.props.onError) {
			try {
				this.props.onError(error, errorInfo, this.props.rawPayload)
			} catch (callbackError) {
				console.error(
					"CogniCatch: External onError callback failed.",
					callbackError,
				)
			}
		}

		// 2. Handle Auto Mode Translation & Formatting
		if (this.props.mode === "auto") {
			if (this._isMounted) {
				this.setState({ isProcessingAuto: true })
				this.processAutoMode(error, errorInfo)
			}
		}
	}

	processAutoMode = async (error: Error, errorInfo: ErrorInfo) => {
		const props = this.props as AutoAIBoundaryProps
		const finalApiKey = props.apiKey || this.context?.apiKey
		const finalApiUrl = props.apiUrl || this.context?.apiUrl
		const browserLang =
			typeof navigator !== "undefined" ? navigator.language : "en-US"
		const finalLanguage =
			props.language || this.context?.language || browserLang

		if (!finalApiKey) {
			console.error("CogniCatch AIBoundary: Missing API Key for auto mode.")
			if (this._isMounted) this.setState({ isProcessingAuto: false })
			return
		}

		// MOCK MODE
		if (finalApiKey === "sk_test_mock") {
			setTimeout(() => {
				if (this._isMounted) {
					this.setState({
						isProcessingAuto: false,
						aiData: {
							title: "AI Widget Error",
							description: "The AI generated an invalid component structure.",
							formattedData: safeStringify(this.props.rawPayload),
							actionLabel: "Try Again",
						},
					})
				}
			}, 1000)
			return
		}

		try {
			// Sanitize React Error Context (We DO NOT sanitize rawPayload here, the Edge does it)
			const rawContext = {
				message: error.message,
				componentStack: errorInfo.componentStack || undefined,
			}
			const safeContext = sanitizeErrorContext(rawContext)

			const saasEndpoint =
				finalApiUrl || "https://api.cognicatch.dev/v1/ai-fallback"

			const response = await fetch(saasEndpoint, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${finalApiKey}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					error: safeContext.message,
					stack: safeContext.componentName
						? `Component: ${safeContext.componentName}`
						: "No stack",
					rawPayload: this.props.rawPayload,
					language: finalLanguage,
				}),
			})

			if (!response.ok) throw new Error(`SaaS API returned ${response.status}`)

			const aiResult: AIFallbackResponse = await response.json()

			if (this._isMounted) {
				this.setState({ isProcessingAuto: false, aiData: aiResult })
			}
		} catch (e) {
			console.error("CogniCatch AI Request failed:", e)
			if (this._isMounted) {
				this.setState({
					isProcessingAuto: false,
					aiData: {
						title: "Communication Error",
						description: "Could not format AI data due to a network error.",
						formattedData: safeStringify(this.props.rawPayload),
						actionLabel: "Retry",
					},
				})
			}
		}
	}

	handleRecover = () => {
		if (this._isMounted) {
			this.setState({
				hasError: false,
				error: null,
				aiData: null,
				hasCrashedFallback: false,
			})
		}
		if (this.props.onRecover) {
			this.props.onRecover()
		}
	}

	render() {
		if (this.state.hasCrashedFallback) {
			return (
				<div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm">
					Critical Error rendering AI Fallback UI.
					<button
						type="button"
						onClick={this.handleRecover}
						className="ml-4 underline font-medium"
					>
						Retry
					</button>
				</div>
			)
		}

		if (!this.state.hasError) {
			return this.props.children
		}

		const { mode, theme, showRawData, rawPayload } = this.props

		if (mode === "auto") {
			if (this.state.isProcessingAuto) {
				return (
					<div className="w-full rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/20 p-6 flex flex-col items-center justify-center animate-pulse gap-3 shadow-sm">
						<div className="w-5 h-5 border-2 border-zinc-400/30 border-t-zinc-900 dark:border-t-zinc-100 rounded-full animate-spin" />
						<p className="text-xs font-medium text-zinc-500">
							Safely parsing AI response...
						</p>
					</div>
				)
			}

			if (this.state.aiData) {
				return (
					<AIFallbackUI
						title={this.state.aiData.title}
						description={this.state.aiData.description}
						actionLabel={this.state.aiData.actionLabel}
						onRecover={this.handleRecover}
						theme={theme}
						rawData={showRawData ? this.state.aiData.formattedData : undefined}
					/>
				)
			}
		}

		if (mode === "manual") {
			const safeRawData =
				showRawData && rawPayload ? safeStringify(rawPayload) : undefined

			return (
				<AIFallbackUI
					title={this.props.title || "Widget Error"}
					description={
						this.props.description ||
						"An error occurred while generating this interface."
					}
					actionLabel="Try Again"
					onRecover={this.handleRecover}
					theme={theme}
					rawData={safeRawData}
				/>
			)
		}

		return null
	}
}
