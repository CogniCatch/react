import React, { createContext, useContext, useCallback, useMemo, type ReactNode } from 'react'
import { toast } from 'sonner'
import { sanitizeErrorContext } from '../libs/pii-sanitizer'
export interface CaptureAsyncOptions {
  handleUserBilling?: boolean;
}

export interface AdaptiveContextType {
  apiKey: string
  apiUrl?: string
  language?: string
  handleUserBilling?: boolean
  captureAsyncError: (error: Error | unknown, options?: CaptureAsyncOptions) => Promise<void>
}

export const AdaptiveContext = createContext<AdaptiveContextType | undefined>(undefined)

export function AdaptiveProvider({ 
  apiKey, 
  apiUrl,
  language, 
  handleUserBilling = false,
  children 
}: { 
  apiKey: string 
  apiUrl?: string 
  language?: string
  handleUserBilling?: boolean
  children: ReactNode 
}) {
  
  const captureAsyncError = useCallback(async (rawError: Error | unknown, options?: CaptureAsyncOptions) => {
    const error = rawError instanceof Error ? rawError : new Error(String(rawError))

    const toastId = toast.loading("Analyzing error context...", {
      description: "Applying AI recovery heuristics..."
    })

    if (apiKey === 'sk_test_mock') {
      setTimeout(() => {
        toast.info("Mock Mode Analysis", {
          id: toastId,
          description: "This is a mocked async recovery because sk_test_mock was used."
        })
      }, 1500)
      return
    }

    try {
      const rawContext = {
        message: error.message,
        componentStack: error.stack,
        url: typeof window !== 'undefined' ? window.location.href : undefined
      }
      
      const safeContext = sanitizeErrorContext(rawContext)

      const saasEndpoint = apiUrl || 'https://api.cognicatch.dev/v1/analyze-error'
      const browserLang = typeof navigator !== 'undefined' ? navigator.language : 'en-US'
      const finalLanguage = language || browserLang
      
      const finalHandleUserBilling = options?.handleUserBilling !== undefined 
        ? options.handleUserBilling 
        : handleUserBilling

      const response = await fetch(saasEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: safeContext.message, 
          stack: safeContext.componentName ? `Component: ${safeContext.componentName}` : (safeContext.errorCode || "Async Error"),
          routePath: safeContext.routePath,
          language: finalLanguage,
          handleUserBilling: finalHandleUserBilling
        })
      })

      if (!response.ok) throw new Error("SaaS API Error")

      const aiResult = await response.json()

      if (aiResult) {
        const severity = aiResult.severity || aiResult.level

        if (severity === 'low') {
          toast.info(aiResult.title, { id: toastId, description: aiResult.description })
        } else {
          toast.error(aiResult.title, { id: toastId, description: aiResult.description })
        }
      }
    } catch (e) {
      console.error("AdaptiveUI API Request failed:", e)
      
      toast.error("Analysis Failed", { 
        id: toastId, 
        description: "We couldn't reach the AI servers. Please try again later." 
      })
    }
  }, [apiKey, apiUrl, language, handleUserBilling])

  const contextValue = useMemo(() => ({
    apiKey,
    apiUrl,
    language,
    handleUserBilling,
    captureAsyncError
  }), [apiKey, apiUrl, language, handleUserBilling, captureAsyncError])

  return (
    <AdaptiveContext.Provider value={contextValue}>
      {children}
    </AdaptiveContext.Provider>
  )
}

export function useAdaptive() {
  const context = useContext(AdaptiveContext)
  
  if (!context) {
    throw new Error(
      "❌ AdaptiveUI Developer Error: You tried to use the 'useAdaptive' hook outside of an <AdaptiveProvider>. " +
      "Please wrap the root of your application (e.g., App.tsx or layout.tsx) with <AdaptiveProvider apiKey='YOUR_KEY'>"
    )
  }
  
  return context
}
