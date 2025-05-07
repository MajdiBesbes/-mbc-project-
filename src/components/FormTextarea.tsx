import React, { forwardRef } from 'react';
import { UseFormRegister } from 'react-hook-form';

interface FormTextareaProps {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  register: UseFormRegister<any>;
  error?: string;
  className?: string;
  disabled?: boolean;
  maxLength?: number;
  minLength?: number;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(({
  label,
  name,
  placeholder,
  required = false,
  rows = 4,
  register,
  error,
  className = '',
  disabled = false,
  maxLength,
  minLength,
  ariaLabel,
  ariaDescribedBy
}, ref) => {
  const textareaId = `${name}-textarea`;
  const errorId = `${name}-error`;

  return (
    <div className={`form-group ${className}`}>
      <label 
        htmlFor={textareaId} 
        className="form-label"
        aria-required={required}
      >
        {label}
        {required && <span className="required" aria-hidden="true">*</span>}
      </label>
      <textarea
        id={textareaId}
        rows={rows}
        placeholder={placeholder}
        className={`form-input ${error ? 'error' : ''}`}
        disabled={disabled}
        maxLength={maxLength}
        minLength={minLength}
        aria-label={ariaLabel}
        aria-describedby={error ? errorId : ariaDescribedBy}
        aria-invalid={!!error}
        {...register(name)}
        ref={ref}
      />
      {error && (
        <span 
          id={errorId} 
          className="form-error" 
          role="alert"
        >
          {error}
        </span>
      )}
      {maxLength && (
        <div className="form-character-count">
          <span id={`${textareaId}-count`} aria-live="polite">
            {0}/{maxLength} caractères
          </span>
        </div>
      )}
    </div>
  );
});

FormTextarea.displayName = 'FormTextarea';

export default React.memo(FormTextarea); 