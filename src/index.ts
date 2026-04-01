import "./styles.css"

export { AdaptiveErrorBoundary } from "./components/AdaptiveErrorBoundary"
export { AdaptiveProvider, useAdaptive } from "./components/AdaptiveProvider"
export {
	AdaptiveToastProvider,
	adaptiveToast,
} from "./components/AdaptiveToast"
export { AIBoundary } from "./components/ai/AIBoundary"

export type {
	// Core Types
	AdaptiveErrorProps,
	// AI Types
	AIBoundaryProps,
	AIFallbackResponse,
	AutoAIBoundaryProps,
	AutoModeProps,
	BaseAdaptiveProps,
	BaseAIBoundaryProps,
	ManualAIBoundaryProps,
	ManualModeProps,
	ThemeOptions,
} from "./types"
