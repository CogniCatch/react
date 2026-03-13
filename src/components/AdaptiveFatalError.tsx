import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import * as Dialog from '@radix-ui/react-dialog'
import { AlertOctagon, ExternalLink, RefreshCcw } from 'lucide-react'
import { cn } from '../libs/utils'
import type { ThemeOptions } from '../types'

export interface AdaptiveFatalErrorProps {
  title: string
  description: string
  statusUrl?: string
  showRefresh?: boolean
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  theme?: ThemeOptions | 'light' | 'dark'
  onPrimaryAction?: () => void
  primaryActionLabel?: string
}

export function AdaptiveFatalError({
  title,
  description,
  statusUrl,
  showRefresh = true,
  isOpen,
  onOpenChange,
  theme,
  onPrimaryAction,
  primaryActionLabel = "Atualizar a página",
}: AdaptiveFatalErrorProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = theme === 'dark' || (typeof theme === 'object' && theme?.backgroundColor === 'dark')
  const primaryColor = typeof theme === 'object' ? theme.primaryColor : undefined
  const fontFamily = typeof theme === 'object' ? theme.fontFamily : undefined

  if (!mounted) return null

  const modalContent = (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <div className={`cognicatch-ui-wrapper ${isDark ? 'dark' : ''} ${fontFamily || ''}`}>
          <Dialog.Overlay 
            className="radix-overlay fixed inset-0 z-[99999] bg-zinc-900/20 dark:bg-black/80 backdrop-blur-sm" 
          />
          
          <Dialog.Content
            onInteractOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
            className={cn(
              "radix-content fixed z-[999999] flex flex-col items-center text-center shadow-2xl transition-all",
              "bg-white border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800",
              "bottom-0 left-0 right-0 border-t rounded-t-3xl p-8 pb-10",
              "sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-md sm:rounded-2xl sm:border",
            )}
            style={{ boxSizing: 'border-box' }} 
          >
            <div className="mx-auto w-12 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 mb-6 sm:hidden" />

            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 border bg-red-50 border-red-100 dark:bg-red-500/10 dark:border-red-500/20">
              <AlertOctagon className="w-8 h-8 text-red-600 dark:text-red-500" />
            </div>

            <Dialog.Title className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-3 tracking-tight">
              {title}
            </Dialog.Title>
            
            <Dialog.Description className="text-sm leading-relaxed mb-8 max-w-[280px] sm:max-w-none text-zinc-600 dark:text-zinc-400">
              {description}
            </Dialog.Description>

            <div className="flex flex-col w-full gap-3">
              {showRefresh && (
                <button
                  onClick={() => onPrimaryAction ? onPrimaryAction() : window.location.reload()}
                  style={primaryColor ? { backgroundColor: primaryColor, borderColor: primaryColor } : {}}
                  className={cn(
                    "flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-medium transition-all shadow-sm",
                    primaryColor 
                      ? "text-white hover:opacity-90 hover:scale-[1.02] active:scale-95" 
                      : "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white hover:scale-[1.02] active:scale-95"
                  )}
                >
                  <RefreshCcw className="w-4 h-4" />
                  {primaryActionLabel}
                </button>
              )}

              {statusUrl && (
                <a
                  href={statusUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-medium transition-colors border border-transparent",
                    "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-900 dark:hover:border-zinc-800"
                  )}
                >
                  Check system status
                  <ExternalLink className="w-4 h-4 opacity-70" />
                </a>
              )}
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  )

  return createPortal(modalContent, document.body)
}
