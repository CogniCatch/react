import { createFileRoute } from "@tanstack/react-router"
import { Bomb, Moon, Palette, Sun } from "lucide-react"
import { useEffect, useState } from "react"
import { AdaptiveErrorBoundary } from "../components/AdaptiveErrorBoundary"
import { AdaptiveFatalError } from "../components/AdaptiveFatalError"
import { adaptiveToast } from "../components/AdaptiveToast"
import type { ThemeOptions } from "../types"

export const Route = createFileRoute("/")({
	component: Index,
})

function BuggyWidget() {
	const [shouldCrash, setShouldCrash] = useState(false)
	if (shouldCrash)
		throw new Error(
			"Payment failed for user admin@empresa.com.br with SSN 123-45-6789 using Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
		)
	return (
		<div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-900/50">
			<p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 text-center">
				This component is working perfectly... for now.
			</p>
			<button
				type="button"
				onClick={() => setShouldCrash(true)}
				className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors shadow-md"
			>
				<Bomb className="w-4 h-4" /> Force Error
			</button>
		</div>
	)
}

function Index() {
	const [isFatalOpen, setIsFatalOpen] = useState(false)
	const [isDarkMode, setIsDarkMode] = useState(false)
	const [resetKey, setResetKey] = useState(0)

	const [themeInput, setThemeInput] = useState<ThemeOptions>({
		backgroundColor: "#0f172a",
		textColor: "#f8fafc",
		primaryColor: "#3b82f6",
		borderRadius: "16px",
	})

	useEffect(() => {
		const html = document.documentElement
		if (isDarkMode) html.classList.add("dark")
		else html.classList.remove("dark")
	}, [isDarkMode])

	return (
		<div className="flex flex-col items-center min-h-[70vh] gap-8 max-w-2xl mx-auto transition-colors pb-12">
			<div className="flex w-full justify-between items-center mb-4">
				<h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">
					Playground
				</h1>
				<button
					type="button"
					onClick={() => setIsDarkMode(!isDarkMode)}
					className="p-2 rounded-full bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-colors shadow-sm"
				>
					{isDarkMode ? (
						<Sun className="w-5 h-5" />
					) : (
						<Moon className="w-5 h-5" />
					)}
				</button>
			</div>

			<div className="w-full p-1 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl">
				<div className="w-full bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
					<div className="mb-6">
						<h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
							Circuit Breaker Test (Error Boundary)
						</h2>
					</div>
					<AdaptiveErrorBoundary
						mode="auto"
						apiKey={import.meta.env.VITE_OPENAI_API_KEY}
						onRecover={() => setResetKey((prev) => prev + 1)}
					>
						<BuggyWidget key={resetKey} />
					</AdaptiveErrorBoundary>
				</div>
			</div>

			<div className="w-full border-t border-zinc-200 dark:border-zinc-800 pt-8 flex flex-col items-center gap-4">
				<div className="flex flex-wrap justify-center gap-3">
					<button
						type="button"
						onClick={() =>
							adaptiveToast.success(
								"Perfil Atualizado",
								"As alterações foram salvas com sucesso.",
							)
						}
						className="px-3 py-1.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 rounded-md text-sm hover:scale-105 transition-transform"
					>
						Success
					</button>
					<button
						type="button"
						onClick={() =>
							adaptiveToast.warning(
								"Atenção",
								"Sua assinatura expira em 3 dias.",
							)
						}
						className="px-3 py-1.5 bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 rounded-md text-sm hover:scale-105 transition-transform"
					>
						Warning
					</button>
					<button
						type="button"
						onClick={() => setIsFatalOpen(true)}
						className="px-3 py-1.5 bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400 border border-red-200 dark:border-red-500/20 rounded-md text-sm hover:scale-105 transition-transform"
					>
						Test Critical Modal
					</button>
				</div>
			</div>

			<div className="w-full border-t border-zinc-200 dark:border-zinc-800 pt-8 flex flex-col items-center gap-6">
				<div className="text-center">
					<h2 className="text-lg font-semibold text-zinc-900 dark:text-white flex items-center justify-center gap-2">
						<Palette className="w-5 h-5 text-indigo-500" />
						White-label support
					</h2>
					<p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
						Simulate how the Toast adapts to other companies’ Design Systems.
					</p>
				</div>

				<div className="grid grid-cols-2 gap-4 w-full bg-white dark:bg-zinc-900/50 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
					<div className="flex flex-col gap-1.5">
						<label
							className="text-xs font-medium text-zinc-700 dark:text-zinc-300"
							htmlFor="#backgroundColorInput"
						>
							Background Color
						</label>
						<div className="flex gap-2">
							<input
								type="color"
								id="backgroundColorInput"
								value={themeInput.backgroundColor}
								onChange={(e) =>
									setThemeInput({
										...themeInput,
										backgroundColor: e.target.value,
									})
								}
								className="w-8 h-8 rounded cursor-pointer border-0 p-0 bg-transparent"
							/>
							<input
								type="text"
								value={themeInput.backgroundColor}
								onChange={(e) =>
									setThemeInput({
										...themeInput,
										backgroundColor: e.target.value,
									})
								}
								className="flex-1 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
							/>
						</div>
					</div>

					<div className="flex flex-col gap-1.5">
						<label
							className="text-xs font-medium text-zinc-700 dark:text-zinc-300"
							htmlFor="#backgroundTextInput"
						>
							Text Color
						</label>
						<div className="flex gap-2">
							<input
								type="color"
								id="backgroundTextInput"
								value={themeInput.textColor}
								onChange={(e) =>
									setThemeInput({ ...themeInput, textColor: e.target.value })
								}
								className="w-8 h-8 rounded cursor-pointer border-0 p-0 bg-transparent"
							/>
							<input
								type="text"
								value={themeInput.textColor}
								onChange={(e) =>
									setThemeInput({ ...themeInput, textColor: e.target.value })
								}
								className="flex-1 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
							/>
						</div>
					</div>

					<div className="flex flex-col gap-1.5">
						<label
							className="text-xs font-medium text-zinc-700 dark:text-zinc-300"
							htmlFor="#backgroundPrimaryColorInput"
						>
							Primary Color (Border/Accent)
						</label>
						<div className="flex gap-2">
							<input
								type="color"
								id="backgroundPrimaryColorInput"
								value={themeInput.primaryColor}
								onChange={(e) =>
									setThemeInput({ ...themeInput, primaryColor: e.target.value })
								}
								className="w-8 h-8 rounded cursor-pointer border-0 p-0 bg-transparent"
							/>
							<input
								type="text"
								value={themeInput.primaryColor}
								onChange={(e) =>
									setThemeInput({ ...themeInput, primaryColor: e.target.value })
								}
								className="flex-1 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
							/>
						</div>
					</div>

					<div className="flex flex-col gap-1.5">
						<label
							className="text-xs font-medium text-zinc-700 dark:text-zinc-300"
							htmlFor="#backgroundPrimaryColorInput"
						>
							Border Radius
						</label>
						<input
							type="text"
							id="backgroundBorderRadiusInput"
							value={themeInput.borderRadius}
							onChange={(e) =>
								setThemeInput({ ...themeInput, borderRadius: e.target.value })
							}
							className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-2 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
						/>
					</div>
				</div>

				<button
					type="button"
					onClick={() =>
						adaptiveToast.custom(
							"Applied Theme",
							"This component has been overridden to follow the exact visual guidelines of your product.",
							themeInput,
						)
					}
					className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
				>
					Trigger Custom Toast
				</button>
			</div>

			<AdaptiveFatalError
				isOpen={isFatalOpen}
				onOpenChange={setIsFatalOpen}
				title="Ocorreu um erro crítico"
				description="Nossos servidores falharam."
			/>
		</div>
	)
}
