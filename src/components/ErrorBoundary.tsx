import React, { Component, ErrorInfo, ReactNode } from 'react';
import { analytics } from '../services/analytics';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId?: string;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorId: `err_${Date.now().toString(36)}` };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Envoi des erreurs à notre service d'analytics
    analytics.trackEvent('error', {
      error: error.toString(),
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      errorId: this.state.errorId,
      url: window.location.href,
      userAgent: navigator.userAgent
    });

    this.setState({
      error,
      errorInfo
    });

    // Log en console uniquement en développement
    if (import.meta.env.DEV) {
      console.group('Erreur capturée par ErrorBoundary:');
      console.error(error);
      console.info('Informations sur l\'erreur:', errorInfo);
      console.groupEnd();
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleReportError = () => {
    // Simuler l'envoi d'un rapport d'erreur détaillé
    const errorReport = {
      id: this.state.errorId,
      error: this.state.error?.toString(),
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    };
    
    console.log('Envoi du rapport d\'erreur:', errorReport);
    
    // Afficher un message de confirmation
    alert('Merci d\'avoir signalé cette erreur. Notre équipe technique a été notifiée et travaille sur une solution.');
  };

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full text-center">
            <div className="mb-6">
              <svg className="mx-auto h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Une erreur est survenue
            </h1>
            <p className="text-gray-600 mb-8">
              Nous nous excusons pour ce désagrément. Notre équipe a été notifiée et travaille sur la résolution du problème.
            </p>
            <div className="space-y-4">
              <button
                onClick={this.handleRetry}
                className="w-full px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
              >
                Réessayer
              </button>
              <a
                href="/"
                className="block w-full px-6 py-3 border-2 border-primary text-primary rounded-md hover:bg-gray-50 transition-colors"
              >
                Retour à l'accueil
              </a>
              <button
                onClick={this.handleReportError}
                className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Signaler ce problème
              </button>
            </div>
            {this.state.error && import.meta.env.DEV && (
              <div className="mt-8 text-left">
                <p className="text-red-600 font-mono text-sm whitespace-pre-wrap">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <pre className="mt-2 text-gray-600 text-xs overflow-auto p-4 bg-gray-100 rounded-md">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;