import { AlertCircle, AlertTriangle } from "lucide-react"
import { cn } from "../libs/utils"
import type { ThemeOptions } from "../types"

interface BannerAction {
	label: string
	onClick: () => void
}

export interface AdaptiveBannerProps {
	title: string
	description: string
	severity?: "low" | "medium" | "high"
	primaryAction?: BannerAction
	secondaryAction?: BannerAction
	theme?: ThemeOptions
	className?: string
}

export function AdaptiveBanner({
	title,
	description,
	severity = "medium",
	primaryAction,
	secondaryAction,
	theme,
	className,
}: AdaptiveBannerProps) {
	const isHigh = severity === "high"

	return (
		<div
			role="alert"
			aria-live="polite"
			className={cn(
				"rounded-xl border p-4 transition-all shadow-sm",
				!theme?.backgroundColor &&
					"bg-amber-50 border-amber-200/60 dark:bg-amber-950/20 dark:border-amber-900/40",
				theme?.fontFamily,
				className,
			)}
			style={{
				backgroundColor: theme?.backgroundColor,
				color: theme?.textColor,
				borderColor: theme?.primaryColor
					? `${theme.primaryColor}40`
					: undefined,
			}}
		>
			<div className="flex gap-3">
				<div className="shrink-0 mt-0.5">
					{isHigh ? (
						<AlertCircle className="h-5 w-5 text-red-500" />
					) : (
						<AlertTriangle className="h-5 w-5 text-amber-500" />
					)}
				</div>

				<div className="flex-1 min-w-0">
					<h3
						className="text-sm font-medium leading-none text-amber-900 dark:text-amber-100"
						style={{ color: theme?.textColor }}
					>
						{title}
					</h3>
					<p
						className="mt-2 text-sm leading-relaxed opacity-90"
						style={{ color: theme?.textColor }}
					>
						{description}
					</p>

					{(primaryAction || secondaryAction) && (
						<div className="mt-4 flex flex-wrap items-center gap-3">
							{primaryAction && (
								<button
									onClick={primaryAction.onClick}
									style={
										theme?.primaryColor
											? { backgroundColor: theme.primaryColor, color: "#fff" }
											: {}
									}
									className={cn(
										"text-xs font-medium px-3 py-1.5 rounded-lg transition-all active:scale-95",
										"bg-amber-100 border border-amber-200 text-amber-900 hover:bg-amber-200",
										"dark:bg-amber-950/50 dark:border-amber-800/50 dark:text-amber-100",
									)}
								>
									{primaryAction.label}
								</button>
							)}

							{secondaryAction && (
								<button
									onClick={secondaryAction.onClick}
									className="text-xs font-medium opacity-70 hover:opacity-100 transition-opacity underline-offset-4 hover:underline"
									style={{ color: theme?.textColor }}
								>
									{secondaryAction.label}
								</button>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
