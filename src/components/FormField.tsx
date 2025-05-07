import React, { forwardRef } from 'react';
import { UseFormRegister } from 'react-hook-form';

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  register: UseFormRegister<any>;
  error?: string;
  className?: string;
  disabled?: boolean;
  autoComplete?: string;
  min?: number;
  max?: number;
  step?: number;
  pattern?: string;
  title?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(({
  label,
  name,
  type = 'text',
  placeholder,
  required = false,
  register,
  error,
  className = '',
  disabled = false,
  autoComplete,
  min,
  max,
  step,
  pattern,
  title,
  ariaLabel,
  ariaDescribedBy
}, ref) => {
  const inputId = `${name}-input`;
  const errorId = `${name}-error`;

  return (
    <div className={`form-group ${className}`}>
      <label 
        htmlFor={inputId} 
        className="form-label"
        aria-required={required}
      >
        {label}
        {required && <span className="required" aria-hidden="true">*</span>}
      </label>
      <input
        id={inputId}
        type={type}
        placeholder={placeholder}
        className={`form-input ${error ? 'error' : ''}`}
        disabled={disabled}
        autoComplete={autoComplete}
        min={min}
        max={max}
        step={step}
        pattern={pattern}
        title={title}
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
    </div>
  );
});

FormField.displayName = 'FormField';

export default React.memo(FormField); 