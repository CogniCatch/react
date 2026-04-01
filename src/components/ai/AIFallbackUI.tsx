import { AlertCircle, ChevronDown, ChevronUp, RefreshCw } from "lucide-react"
import React from "react"
import type { ThemeOptions } from "../../types"

interface AIFallbackUIProps {
	title: string
	description: string
	actionLabel?: string | null
	onRecover: () => void
	theme?: ThemeOptions
	rawData?: string
}

export const AIFallbackUI = ({
	title,
	description,
	actionLabel,
	onRecover,
	theme,
	rawData,
}: AIFallbackUIProps) => {
	const [isExpanded, setIsExpanded] = React.useState(false)

	return (
		<div className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 overflow-hidden shadow-sm">
			<div className="p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg shrink-0">
						<AlertCircle className="w-5 h-5" />
					</div>
					<div>
						<h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
							{title}
						</h3>
						<p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
							{description}
						</p>
					</div>
				</div>

				<div className="flex gap-2 w-full sm:w-auto">
					{rawData && (
						<button
							type="button"
							onClick={() => setIsExpanded(!isExpanded)}
							className="flex-1 sm:flex-none px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center gap-1.5"
						>
							{isExpanded ? "Hide Data" : "View Data"}
							{isExpanded ? (
								<ChevronUp className="w-3 h-3" />
							) : (
								<ChevronDown className="w-3 h-3" />
							)}
						</button>
					)}
					<button
						type="button"
						onClick={onRecover}
						style={{ backgroundColor: theme?.primaryColor || undefined }}
						className="flex-1 sm:flex-none px-3 py-1.5 text-xs font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5"
					>
						<RefreshCw className="w-3 h-3" />
						{actionLabel || "Retry"}
					</button>
				</div>
			</div>

			{/* Expansible Raw Data / Markdown Area */}
			{isExpanded && rawData && (
				<div className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-900/50 p-4">
					<pre className="text-xs text-zinc-700 dark:text-zinc-300 font-mono whitespace-pre-wrap break-words max-h-60 overflow-y-auto custom-scrollbar">
						{rawData}
					</pre>
				</div>
			)}
		</div>
	)
}
