import React from 'react';
import Loader from './Loader';

interface FormLoadingStateProps {
  isLoading: boolean;
  loadingText?: string;
  className?: string;
}

const FormLoadingState: React.FC<FormLoadingStateProps> = ({
  isLoading,
  loadingText = 'Chargement en cours...',
  className = ''
}) => {
  if (!isLoading) return null;

  return (
    <div 
      className={`form-loading-state ${className}`}
      role="status"
      aria-live="polite"
    >
      <Loader size="small" />
      <span className="form-loading-text">{loadingText}</span>
    </div>
  );
};

export default React.memo(FormLoadingState); 