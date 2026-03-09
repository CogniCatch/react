import './styles.css';

export { AdaptiveErrorBoundary } from './components/AdaptiveErrorBoundary';
export { adaptiveToast, AdaptiveToastProvider,  } from './components/AdaptiveToast';
export { AdaptiveProvider, useAdaptive } from './components/AdaptiveProvider';

export type { 
  AdaptiveErrorProps, 
  ThemeOptions, 
  BaseAdaptiveProps, 
  ManualModeProps, 
  AutoModeProps 
} from './types';
