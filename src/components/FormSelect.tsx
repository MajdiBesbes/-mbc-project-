import React, { forwardRef } from 'react';
import { UseFormRegister } from 'react-hook-form';

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

interface FormSelectProps {
  label: string;
  name: string;
  options: Option[];
  placeholder?: string;
  required?: boolean;
  register: UseFormRegister<any>;
  error?: string;
  className?: string;
  disabled?: boolean;
  multiple?: boolean;
  size?: number;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(({
  label,
  name,
  options,
  placeholder,
  required = false,
  register,
  error,
  className = '',
  disabled = false,
  multiple = false,
  size,
  ariaLabel,
  ariaDescribedBy
}, ref) => {
  const selectId = `${name}-select`;
  const errorId = `${name}-error`;

  return (
    <div className={`form-group ${className}`}>
      <label 
        htmlFor={selectId} 
        className="form-label"
        aria-required={required}
      >
        {label}
        {required && <span className="required" aria-hidden="true">*</span>}
      </label>
      <select
        id={selectId}
        className={`form-input ${error ? 'error' : ''}`}
        disabled={disabled}
        multiple={multiple}
        size={size}
        aria-label={ariaLabel}
        aria-describedby={error ? errorId : ariaDescribedBy}
        aria-invalid={!!error}
        {...register(name)}
        ref={ref}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
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

FormSelect.displayName = 'FormSelect';

export default React.memo(FormSelect); 