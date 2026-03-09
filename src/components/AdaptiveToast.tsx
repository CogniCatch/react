import React from 'react';
import { Toaster, toast } from 'sonner';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../libs/utils';
import type { ThemeOptions } from '../types';

type AdaptiveToastProviderProps = React.ComponentProps<typeof Toaster> & { 
  customTheme?: ThemeOptions; 
};

export function AdaptiveToastProvider({ 
  customTheme, 
  toastOptions, 
  position = "top-right",
  ...props 
}: AdaptiveToastProviderProps) {
  return (
    <Toaster
      position={position}
      toastOptions={{
        ...toastOptions,
        classNames: {
          ...toastOptions?.classNames,
          toast: cn(
            "backdrop-blur-md font-sans rounded-xl px-4 py-3 transition-colors",
            "!bg-white/90 !border !border-zinc-200 !text-zinc-900 !shadow-xl",
            "dark:!bg-zinc-950/80 dark:!border-zinc-800 dark:!text-zinc-50 dark:!shadow-2xl",
            customTheme?.fontFamily,
            toastOptions?.classNames?.toast 
          ),
          title: cn(
            "!font-medium !text-sm !text-zinc-900 dark:!text-zinc-50", 
            toastOptions?.classNames?.title
          ),
          description: cn(
            "!mt-0.5 !text-sm !text-zinc-500 dark:!text-zinc-400 !line-clamp-2", 
            toastOptions?.classNames?.description
          ),
          actionButton: cn(
            "!font-medium !rounded-md !shadow-sm transition-colors !px-3 !py-1.5 !border",
            "!bg-zinc-900 !text-white !border-transparent hover:!bg-zinc-800",
            "dark:!bg-white dark:!text-black dark:!border-zinc-300 dark:hover:!bg-zinc-100",
            toastOptions?.classNames?.actionButton
          ),
        },
        style: {
          backgroundColor: customTheme?.backgroundColor,
          color: customTheme?.textColor,
          borderColor: customTheme?.primaryColor ? `${customTheme.primaryColor}40` : undefined,
          ...toastOptions?.style,
        }
      }}
    />
  );
}

export function triggerAdaptiveToast(
  title: string, 
  description: string, 
  actionLabel?: string, 
  onRecover?: () => void
) {
  toast(title, {
    description: description,
    icon: <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400" />,
    action: actionLabel ? {
      label: actionLabel,
      onClick: () => {
        if (onRecover) onRecover();
      },
    } : undefined,
  });
}

export const adaptiveToast = {
  success: (title: string, description?: string) => 
    toast(title, { 
      description, 
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400" /> 
    }),
  
  error: (title: string, description?: string) => 
    toast(title, { 
      description, 
      icon: <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400" /> 
    }),
  
  warning: (title: string, description?: string) => 
    toast(title, { 
      description, 
      icon: <AlertTriangle className="w-5 h-5 text-amber-500 dark:text-amber-400" /> 
    }),
  
  info: (title: string, description?: string) => 
    toast(title, { 
      description, 
      icon: <Info className="w-5 h-5 text-blue-500 dark:text-blue-400" /> 
    }),

  message: (title: string, description?: string) => 
    toast(title, { description }),

  customTheme: (title: string, description: string, theme: ThemeOptions) => {
    toast.custom((t) => (
      <div
        className={cn("w-full flex gap-3 p-4 shadow-2xl transition-all", theme.fontFamily)}
        style={{
          backgroundColor: theme.backgroundColor || '#ffffff',
          color: theme.textColor || '#000000',
          border: `1px solid ${theme.primaryColor || '#e4e4e7'}`,
          borderRadius: theme.borderRadius || '12px',
        }}
      >
        <div 
          className="w-1.5 rounded-full shrink-0" 
          style={{ backgroundColor: theme.primaryColor || '#3b82f6' }} 
        />
        <div className="flex flex-col gap-1">
          <span className="font-medium text-sm leading-none">{title}</span>
          <span className="text-sm opacity-80 leading-relaxed mt-1">{description}</span>
        </div>
      </div>
    ));
  }
};
