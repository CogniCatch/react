import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react"
import type React from "react"
import { Toaster, toast } from "sonner"
import { cn } from "../libs/utils"
import type { ThemeOptions } from "../types"

type AdaptiveToastProviderProps = React.ComponentProps<typeof Toaster> & {
	customTheme?: ThemeOptions
}

export function AdaptiveToastProvider({
	customTheme,
	toastOptions,
	position = "top-right",
	...props
}: AdaptiveToastProviderProps) {
	return (
		<Toaster
			position={position}
			containerAriaLabel="Notifications"
			{...props}
			toastOptions={{
				...toastOptions,
				classNames: {
					...toastOptions?.classNames,
					toast: cn(
						"bg-white/90 border-zinc-200 text-zinc-900 shadow-xl backdrop-blur-md",
						"dark:bg-zinc-950/80 dark:border-zinc-800 dark:text-zinc-50 dark:shadow-2xl",
						customTheme?.fontFamily,
						toastOptions?.classNames?.toast,
					),
					title: cn(
						"font-medium text-sm text-zinc-900 dark:text-zinc-50",
						toastOptions?.classNames?.title,
					),
					description: cn(
						"mt-0.5 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2",
						toastOptions?.classNames?.description,
					),
					actionButton: cn(
						"font-medium rounded-lg transition-all px-3 py-1.5 border text-xs",
						"bg-zinc-900 text-white border-transparent hover:scale-[1.02] active:scale-95",
						"dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white",
						toastOptions?.classNames?.actionButton,
					),
				},
				style: {
					borderRadius: customTheme?.borderRadius || "0.75rem",
					backgroundColor: customTheme?.backgroundColor,
					color: customTheme?.textColor,
					fontFamily: customTheme?.fontFamily,
					...toastOptions?.style,
				},
			}}
		/>
	)
}

export function triggerAdaptiveToast(
	title: string,
	description: string,
	actionLabel?: string,
	onRecover?: () => void,
	severity: "low" | "medium" | "high" = "medium",
) {
	const icons = {
		low: <Info className="w-5 h-5 text-blue-500" />,
		medium: <AlertTriangle className="w-5 h-5 text-amber-500" />,
		high: <AlertCircle className="w-5 h-5 text-red-500" />,
	}

	return toast(title, {
		description: description,
		icon: icons[severity],
		duration: severity === "high" ? 8000 : 5000,
		action: actionLabel
			? {
					label: actionLabel,
					onClick: () => onRecover?.(),
				}
			: undefined,
	})
}

export const adaptiveToast = {
	success: (title: string, description?: string) =>
		toast(title, {
			description,
			icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
		}),

	error: (title: string, description?: string) =>
		toast(title, {
			description,
			icon: <AlertCircle className="w-5 h-5 text-red-500" />,
		}),

	warning: (title: string, description?: string) =>
		toast(title, {
			description,
			icon: (
				<AlertTriangle className="w-5 h-5 text-amber-500 dark:text-amber-400" />
			),
		}),

	loading: (title: string, description?: string) =>
		toast.loading(title, { description }),

	custom: (title: string, description: string, theme: ThemeOptions) => {
		toast.custom((t) => (
			<div
				className={cn("flex gap-3 p-4 shadow-2xl border", theme.fontFamily)}
				style={{
					backgroundColor: theme.backgroundColor || "var(--bg-card)",
					color: theme.textColor || "var(--text-card)",
					borderColor: theme.primaryColor || "#e4e4e7",
					borderRadius: theme.borderRadius || "12px",
				}}
			>
				<div className="flex flex-col gap-1">
					<span className="font-semibold text-sm">{title}</span>
					<span className="text-xs opacity-70">{description}</span>
				</div>
			</div>
		))
	},
}
