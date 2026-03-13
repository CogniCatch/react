import React, { Component, type ErrorInfo, type ReactNode } from 'react'
// Importação ajustada da nossa função sanitizadora auditada (o maxLength já foi resolvido nela)
import { sanitizeErrorContext } from '../libs/pii-sanitizer'
import { AdaptiveBanner } from './AdaptiveBanner'
import { AdaptiveFatalError } from './AdaptiveFatalError'
import { triggerAdaptiveToast } from './AdaptiveToast'
import { AdaptiveContext } from './AdaptiveProvider'
import type { AdaptiveErrorProps, GenUIResponse, AutoModeProps, ThemeOptions } from '../types'

type Props = AdaptiveErrorProps & {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  aiData: GenUIResponse | null
  isProcessingAuto: boolean
  hasCrashedFallback: boolean
}

interface StaticFallbackProps {
  onRecover: () => void
  theme?: 'light' | 'dark' | ThemeOptions
}

const StaticFallback = ({ onRecover, theme }: StaticFallbackProps) => {
  const isDark = theme === 'dark'

  return (
    <div className={`p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm ${isDark ? 'dark' : ''}`}>
      <div className="flex flex-col items-center text-center gap-4">
        <div className="p-3 rounded-full bg-red-50 dark:bg-red-900/20">
          <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Component Unavailable</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">An unexpected error occurred in the interface.</p>
        </div>
        <button
          onClick={onRecover}
          style={{
            // Se o usuário definiu uma cor primária no objeto ThemeOptions, usamos aqui!
            backgroundColor: (theme as ThemeOptions)?.primaryColor || undefined
          }}
          className="px-4 py-2 text-xs font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg hover:opacity-90 transition-opacity"
        >
          Try Reloading
        </button>
      </div>
    </div>
  )
}

export class AdaptiveErrorBoundary extends Component<Props, State> {
  static contextType = AdaptiveContext
  declare context: React.ContextType<typeof AdaptiveContext>

  private _isMounted = false

  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      aiData: null,
      isProcessingAuto: false,
      hasCrashedFallback: false
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

    const { mode } = this.props

    if (mode === 'manual' && this.props.severity === 'low') {
      triggerAdaptiveToast(
        this.props.title,
        this.props.description,
        this.props.actionLabel ?? undefined,
        this.handleRecover
      )
    }

    if (mode === 'auto') {
      if (this._isMounted) {
        this.setState({ isProcessingAuto: true })
        this.processAutoMode(error, errorInfo)
      }
    }
  }

  processAutoMode = async (error: Error, errorInfo: ErrorInfo) => {
    const props = this.props as AutoModeProps

    const finalApiKey = props.apiKey || this.context?.apiKey
    const finalApiUrl = props.apiUrl || this.context?.apiUrl

    const browserLang = typeof navigator !== 'undefined' ? navigator.language : 'en-US'
    const finalLanguage = props.language || this.context?.language || browserLang

    if (!finalApiKey) {
      console.error("AdaptiveUI: Missing API Key for auto mode. Provide it via props or <AdaptiveProvider>.")
      if (this._isMounted) this.setState({ isProcessingAuto: false })
      return
    }

    // MOCK MODE
    if (finalApiKey === 'sk_test_mock') {
      setTimeout(() => {
        if (this._isMounted) {
          this.setState({
            isProcessingAuto: false,
            aiData: {
              severity: 'medium',
              title: 'Mock Mode Error',
              description: 'This is a mocked response because sk_test_mock was used.',
              actionLabel: 'Reload Component'
            }
          })
        }
      }, 1500)
      return
    }

    try {
      const rawContext = {
        message: error.message,
        componentStack: errorInfo.componentStack || undefined,
        url: typeof window !== 'undefined' ? window.location.href : undefined
      }

      const safeContext = sanitizeErrorContext(rawContext)

      const saasEndpoint = finalApiUrl || 'https://api.cognicatch.dev/v1/analyze-error'

      const response = await fetch(saasEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${finalApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          error: safeContext.message,
          stack: safeContext.componentName ? `Component: ${safeContext.componentName}` : "No stack",
          routePath: safeContext.routePath,
          language: finalLanguage
        })
      })

      if (!response.ok) {
        throw new Error(`SaaS API returned ${response.status}`)
      }

      const aiResult = await response.json()

      if (aiResult && this._isMounted) {
        if (aiResult.severity === 'low') {
          triggerAdaptiveToast(
            aiResult.title,
            aiResult.description,
            aiResult.actionLabel ?? undefined,
            this.handleRecover
          )
          this.setState({ isProcessingAuto: false, aiData: aiResult })
        } else {
          this.setState({ isProcessingAuto: false, aiData: aiResult })
        }
      }
    } catch (e) {
      console.error("AdaptiveUI AI Request failed:", e)
      if (this._isMounted) {
        this.setState({
          isProcessingAuto: false,
          aiData: {
            severity: 'medium',
            title: 'Communication Error',
            description: 'We were unable to connect to the analytics servers at this time. Our team has already been notified.',
            actionLabel: 'Reload Component'
          }
        })
      }
    }
  }

  handleRecover = () => {
    if (this._isMounted) {
      this.setState({ hasError: false, error: null, aiData: null, hasCrashedFallback: false })
    }
    if (this.props.onRecover) {
      this.props.onRecover()
    }
  }

  render() {
    if (this.state.hasCrashedFallback) {
      return (
        <StaticFallback
          onRecover={this.handleRecover}
          theme={this.props.theme}
        />
      )
    }

    if (!this.state.hasError) {
      return this.props.children
    }

    const { mode, theme, className } = this.props

    if (mode === 'manual') {
      const { severity, title, description, actionLabel } = this.props

      try {
        if (severity === 'high') return <AdaptiveFatalError isOpen={true} onOpenChange={(open) => { if (!open) this.handleRecover() }} title={title} description={description} theme={theme} />
        if (severity === 'medium') return <AdaptiveBanner title={title} description={description} primaryAction={actionLabel ? { label: actionLabel, onClick: this.handleRecover } : undefined} theme={theme} className={className} />

        if (severity === 'low') return null
      } catch (renderError) {
        this.setState({ hasCrashedFallback: true })
        return null
      }
    }

    if (mode === 'auto') {
      if (this.state.isProcessingAuto) {
        return (
          <div className="w-full h-full min-h-[100px] rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/20 flex flex-col items-center justify-center p-6 animate-pulse">
            <div className="w-5 h-5 border-2 border-zinc-400/30 dark:border-zinc-500/30 border-t-zinc-900 dark:border-t-zinc-100 rounded-full animate-spin mb-3" />
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Analyzing error context...</p>
          </div>
        )
      }

      if (this.state.aiData) {
        const { severity, title, description, actionLabel } = this.state.aiData

        try {
          if (severity === 'high') {
            return <AdaptiveFatalError isOpen={true} onOpenChange={(open) => { if (!open) this.handleRecover() }} title={title} description={description} theme={theme} />
          }
          if (severity === 'medium') {
            return <AdaptiveBanner title={title} description={description} primaryAction={actionLabel ? { label: actionLabel, onClick: this.handleRecover } : undefined} theme={theme} className={className} />
          }
          if (severity === 'low') {
            return null
          }
        } catch (renderError) {
          this.setState({ hasCrashedFallback: true })
          return null
        }
      }
    }

    return null
  }
}
