import * as Dialog from '@radix-ui/react-dialog';
import { AlertOctagon, ExternalLink, RefreshCcw } from 'lucide-react';
import { cn } from '../libs/utils';
import type { ThemeOptions } from '../types';

export interface AdaptiveFatalErrorProps {
  title: string;
  description: string;
  statusUrl?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  theme?: ThemeOptions;
}

export function AdaptiveFatalError({
  title,
  description,
  statusUrl,
  isOpen,
  onOpenChange,
  theme,
}: AdaptiveFatalErrorProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay 
          className="radix-overlay fixed inset-0 z-50 bg-zinc-900/20 dark:bg-black/80 backdrop-blur-sm" 
        />
        
        <Dialog.Content
          className={cn(
            "radix-content fixed z-50 flex flex-col items-center text-center shadow-2xl transition-colors",
            
            "bg-white border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800",
            
            "bottom-0 left-0 right-0 border-t rounded-t-3xl p-8 pb-10",
            
            "sm:bottom-auto sm:top-[50%] sm:left-[50%] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-md sm:rounded-2xl sm:border",
            
            theme?.fontFamily
          )}
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
            <button
              onClick={() => window.location.reload()}
              className={cn(
                "flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-medium transition-all shadow-sm",
                "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white hover:scale-[1.02] active:scale-95"
              )}
            >
              <RefreshCcw className="w-4 h-4" />
              Atualizar a página
            </button>

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
                Verificar status do sistema
                <ExternalLink className="w-4 h-4 opacity-70" />
              </a>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
