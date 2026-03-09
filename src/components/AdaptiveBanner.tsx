import { AlertTriangle } from 'lucide-react';
import { cn } from '../libs/utils';
import type { ThemeOptions } from '../types';

interface BannerAction {
  label: string;
  onClick: () => void;
}

export interface AdaptiveBannerProps {
  title: string;
  description: string;
  primaryAction?: BannerAction;
  secondaryAction?: BannerAction;
  theme?: ThemeOptions;
  className?: string;
}

export function AdaptiveBanner({
  title,
  description,
  primaryAction,
  secondaryAction,
  theme,
  className,
}: AdaptiveBannerProps) {
  return (
    <div
      className={cn(
        "rounded-xl border p-4 transition-colors",
        "bg-amber-50 border-amber-200/60 shadow-sm",
        "dark:bg-amber-950/20 dark:border-amber-900/40 dark:shadow-[0_1px_2px_rgba(0,0,0,0.1)]",
        theme?.fontFamily,
        className
      )}
      style={{
        backgroundColor: theme?.backgroundColor,
        borderColor: theme?.primaryColor ? `${theme.primaryColor}30` : undefined,
      }}
    >
      <div className="flex gap-3">
        <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5 text-amber-500 dark:text-amber-400" />
        
        <div className="flex-1">
          <h3 className="text-sm font-medium leading-none text-amber-900 dark:text-amber-100">
            {title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-amber-800 dark:text-amber-200/80">
            {description}
          </p>

          {(primaryAction || secondaryAction) && (
            <div className="mt-4 flex items-center gap-3">
              {primaryAction && (
                <button
                  onClick={primaryAction.onClick}
                  className={cn(
                    "text-xs font-medium px-3 py-1.5 rounded-md transition-colors",
                    "focus-visible:ring-2 focus-visible:ring-amber-500/30 focus:outline-none",
                    "bg-amber-100 border border-amber-200 text-amber-900 hover:bg-amber-200 hover:border-amber-300",
                    "dark:bg-amber-950/50 dark:border-amber-800/50 dark:text-amber-100 dark:hover:bg-amber-900/70 dark:hover:border-amber-700/50"
                  )}
                >
                  {primaryAction.label}
                </button>
              )}

              {secondaryAction && (
                <button
                  onClick={secondaryAction.onClick}
                  className={cn(
                    "text-xs font-medium transition-colors focus-visible:underline focus:outline-none",
                    "text-amber-700 hover:text-amber-900",
                    "dark:text-amber-200/70 dark:hover:text-amber-100"
                  )}
                >
                  {secondaryAction.label}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
