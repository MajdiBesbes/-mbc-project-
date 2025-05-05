import { useState, useCallback } from 'react';
import { analytics } from '../services/analytics';

export const useErrorBoundary = () => {
  const [error, setError] = useState<Error | null>(null);

  const handleError = useCallback((error: Error, componentInfo?: string) => {
    setError(error);
    
    // Track error in analytics
    analytics.trackEvent('error', {
      error: error.toString(),
      component: componentInfo,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    });

    // Log in development only
    if (import.meta.env.DEV) {
      console.group('Error caught by boundary:');
      console.error(error);
      if (componentInfo) console.info('Component:', componentInfo);
      console.groupEnd();
    }
  }, []);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return { 
    error, 
    handleError, 
    resetError,
    hasError: error !== null
  };
};