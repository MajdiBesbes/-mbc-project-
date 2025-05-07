import { useState, useCallback } from 'react';

interface FormState {
  isDirty: boolean;
  isSubmitting: boolean;
  isSubmitted: boolean;
  isValid: boolean;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

interface UseFormStateProps {
  initialValues: Record<string, any>;
  validate?: (values: Record<string, any>) => Record<string, string>;
}

export const useFormState = ({ initialValues, validate }: UseFormStateProps) => {
  const [values, setValues] = useState(initialValues);
  const [state, setState] = useState<FormState>({
    isDirty: false,
    isSubmitting: false,
    isSubmitted: false,
    isValid: true,
    errors: {},
    touched: {},
  });

  const setFieldValue = useCallback((name: string, value: any) => {
    setValues(prev => {
      const newValues = { ...prev, [name]: value };
      const errors = validate ? validate(newValues) : {};
      
      setState(prev => ({
        ...prev,
        isDirty: true,
        touched: { ...prev.touched, [name]: true },
        errors,
        isValid: Object.keys(errors).length === 0,
      }));

      return newValues;
    });
  }, [validate]);

  const setFieldTouched = useCallback((name: string) => {
    setState(prev => ({
      ...prev,
      touched: { ...prev.touched, [name]: true },
    }));
  }, []);

  const handleSubmit = useCallback(async (onSubmit: (values: Record<string, any>) => Promise<void>) => {
    setState(prev => ({ ...prev, isSubmitting: true }));

    try {
      const errors = validate ? validate(values) : {};
      
      if (Object.keys(errors).length === 0) {
        await onSubmit(values);
        setState(prev => ({
          ...prev,
          isSubmitted: true,
          isSubmitting: false,
        }));
      } else {
        setState(prev => ({
          ...prev,
          errors,
          isValid: false,
          isSubmitting: false,
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isSubmitting: false,
        errors: {
          ...prev.errors,
          submit: error instanceof Error ? error.message : 'Une erreur est survenue',
        },
      }));
    }
  }, [values, validate]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setState({
      isDirty: false,
      isSubmitting: false,
      isSubmitted: false,
      isValid: true,
      errors: {},
      touched: {},
    });
  }, [initialValues]);

  const getFieldError = useCallback((name: string) => {
    return state.errors[name] || '';
  }, [state.errors]);

  const isFieldTouched = useCallback((name: string) => {
    return state.touched[name] || false;
  }, [state.touched]);

  return {
    values,
    state,
    setFieldValue,
    setFieldTouched,
    handleSubmit,
    resetForm,
    getFieldError,
    isFieldTouched,
  };
}; 