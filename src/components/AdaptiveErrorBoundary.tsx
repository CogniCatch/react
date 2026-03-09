import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { sanitizeText } from '../libs/pii-sanitizer';
import { AdaptiveBanner } from './AdaptiveBanner';
import { AdaptiveFatalError } from './AdaptiveFatalError';
import { triggerAdaptiveToast } from './AdaptiveToast';
import { AdaptiveContext } from './AdaptiveProvider';
import type { AdaptiveErrorProps, GenUIResponse, AutoModeProps } from '../types';

type Props = AdaptiveErrorProps & { 
  children: ReactNode;
};

interface State {
  hasError: boolean;
  error: Error | null;
  aiData: GenUIResponse | null;
  isProcessingAuto: boolean;
}

export class AdaptiveErrorBoundary extends Component<Props, State> {
  static contextType = AdaptiveContext;
  declare context: React.ContextType<typeof AdaptiveContext>;

  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      aiData: null,
      isProcessingAuto: false 
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { mode } = this.props;

    if (mode === 'manual' && this.props.severity === 'low') {
      triggerAdaptiveToast(
        this.props.title,
        this.props.description,
        this.props.actionLabel ?? undefined,
        this.handleRecover
      );
    }

    if (mode === 'auto') {
      this.setState({ isProcessingAuto: true });
      this.processAutoMode(error);
    }
  }

  processAutoMode = async (error: Error) => {
    const props = this.props as AutoModeProps;

    const finalApiKey = props.apiKey || this.context?.apiKey;
    const finalApiUrl = props.apiUrl || this.context?.apiUrl;
    
    const browserLang = typeof navigator !== 'undefined' ? navigator.language : 'en-US';
    const finalLanguage = props.language || this.context?.language || browserLang;

    if (!finalApiKey) {
      console.error("AdaptiveUI: Missing API Key for auto mode. Provide it via props or <AdaptiveProvider>.");
      this.setState({ isProcessingAuto: false });
      return;
    }
    
    if (finalApiKey === 'sk_test_mock') {
      setTimeout(() => {
        this.setState({
          isProcessingAuto: false,
          aiData: {
            severity: 'medium',
            title: 'Incomplete data',
            description: 'The dashboard encountered an error while attempting to read user information. Our team has already been notified.',
            actionLabel: 'Reload Widget'
          }
        });
      }, 1500);
      return;
    }

    try {
      const safeMessage = sanitizeText(error.message).slice(0, 500);
      const safeStack = sanitizeText(error.stack || "").slice(0, 1500);

      const saasEndpoint = finalApiUrl || 'https://api.cognicatch.dev/v1/analyze-error';

      const response = await fetch(saasEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${finalApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: safeMessage, 
          stack: safeStack,
          language: finalLanguage 
        })
      });

      if (!response.ok) {
        throw new Error(`SaaS API returned ${response.status}`);
      }

      const aiResult = await response.json();

      if (aiResult) {
        if (aiResult.severity === 'low') {
          triggerAdaptiveToast(
            aiResult.title, 
            aiResult.description, 
            aiResult.actionLabel ?? undefined, 
            this.handleRecover
          );
          this.setState({ isProcessingAuto: false, hasError: false, error: null });
        } else {
          this.setState({ isProcessingAuto: false, aiData: aiResult });
        }
      }
    } catch (e) {
      console.error("AdaptiveUI AI Request failed:", e);
      this.setState({
        isProcessingAuto: false,
        aiData: {
          severity: 'medium',
          title: 'Communication Error',
          description: 'We were unable to connect to the analytics servers at this time. Our team has already been notified.',
          actionLabel: 'Reload Component'
        }
      });
    }
  };

  handleRecover = () => {
    this.setState({ hasError: false, error: null, aiData: null });
    if (this.props.onRecover) {
      this.props.onRecover();
    }
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const { mode, theme, className } = this.props;

    if (mode === 'manual') {
      const { severity, title, description, actionLabel } = this.props;
      if (severity === 'high') return <AdaptiveFatalError isOpen={true} onOpenChange={(open) => { if (!open) this.handleRecover(); }} title={title} description={description} theme={theme} />;
      if (severity === 'medium') return <AdaptiveBanner title={title} description={description} primaryAction={actionLabel ? { label: actionLabel, onClick: this.handleRecover } : undefined} theme={theme} className={className} />;
      if (severity === 'low') return null; 
    }

    if (mode === 'auto') {
      if (this.state.isProcessingAuto) {
        return (
          <div className="w-full h-full min-h-[100px] rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/20 flex flex-col items-center justify-center p-6 animate-pulse">
            <div className="w-5 h-5 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-3" />
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Analyzing error context...</p>
          </div>
        );
      }

      if (this.state.aiData) {
        const { severity, title, description, actionLabel } = this.state.aiData;
        
        if (severity === 'high') {
          return <AdaptiveFatalError isOpen={true} onOpenChange={(open) => { if (!open) this.handleRecover(); }} title={title} description={description} theme={theme} />;
        }
        
        if (severity === 'medium') {
          return <AdaptiveBanner title={title} description={description} primaryAction={actionLabel ? { label: actionLabel, onClick: this.handleRecover } : undefined} theme={theme} className={className} />;
        }
      }
    }

    return null;
  }
}
