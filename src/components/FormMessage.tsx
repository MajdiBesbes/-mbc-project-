import React from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';

interface FormMessageProps {
  type: 'success' | 'error' | 'info';
  message: string;
  className?: string;
}

export const FormMessage: React.FC<FormMessageProps> = ({
  type,
  message,
  className = '',
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="form-message-icon form-message-icon-success" />;
      case 'error':
        return <FaExclamationCircle className="form-message-icon form-message-icon-error" />;
      case 'info':
        return <FaInfoCircle className="form-message-icon form-message-icon-info" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`form-message form-message-${type} ${className}`}
      role={type === 'error' ? 'alert' : 'status'}
      aria-live={type === 'error' ? 'assertive' : 'polite'}
    >
      {getIcon()}
      <span className="form-message-text">{message}</span>
    </div>
  );
}; 