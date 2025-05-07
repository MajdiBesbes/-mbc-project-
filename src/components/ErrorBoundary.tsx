import React, { Component, ErrorInfo } from 'react';
import '../styles/error-boundary.css';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log l'erreur à un service externe
    console.error('Erreur capturée:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary">
          <div className="error-content">
            <h1 className="error-title">Oups ! Une erreur est survenue</h1>
            <p className="error-message">
              Nous nous excusons pour ce désagrément. Notre équipe a été notifiée.
            </p>
            <div className="error-details">
              <p className="error-type">{this.state.error?.name}</p>
              <p className="error-description">{this.state.error?.message}</p>
            </div>
            <div className="error-actions">
              <button 
                className="error-button"
                onClick={this.handleReset}
              >
                Réessayer
              </button>
              <button 
                className="error-button error-button-secondary"
                onClick={() => window.location.reload()}
              >
                Rafraîchir la page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 