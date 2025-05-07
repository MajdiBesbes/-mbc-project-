import React from 'react';
import { FieldError } from 'react-hook-form';

interface FormErrorProps {
  error?: FieldError | string;
  className?: string;
}

const FormError: React.FC<FormErrorProps> = ({ error, className = '' }) => {
  if (!error) return null;

  const errorMessage = typeof error === 'string' ? error : error.message;

  return (
    <span 
      className={`form-error ${className}`}
      role="alert"
      aria-live="polite"
    >
      {errorMessage}
    </span>
  );
};

export default React.memo(FormError); 