import "./styles.css"

export { AdaptiveErrorBoundary } from "./components/AdaptiveErrorBoundary"
export { AdaptiveProvider, useAdaptive } from "./components/AdaptiveProvider"
export {
	AdaptiveToastProvider,
	adaptiveToast,
} from "./components/AdaptiveToast"

export type {
	AdaptiveErrorProps,
	AutoModeProps,
	BaseAdaptiveProps,
	ManualModeProps,
	ThemeOptions,
} from "./types"
