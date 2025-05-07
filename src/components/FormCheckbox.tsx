import React from 'react';
import { UseFormRegister } from 'react-hook-form';

interface FormCheckboxProps {
  label: string;
  name: string;
  required?: boolean;
  register: UseFormRegister<any>;
  error?: string;
  className?: string;
}

const FormCheckbox: React.FC<FormCheckboxProps> = ({
  label,
  name,
  required = false,
  register,
  error,
  className = ''
}) => {
  return (
    <div className={`form-checkbox ${className}`}>
      <input
        type="checkbox"
        id={name}
        {...register(name)}
        className={error ? 'error' : ''}
      />
      <label htmlFor={name}>
        {label}
        {required && <span className="required">*</span>}
      </label>
      {error && <span className="form-error">{error}</span>}
    </div>
  );
};

export default React.memo(FormCheckbox); 