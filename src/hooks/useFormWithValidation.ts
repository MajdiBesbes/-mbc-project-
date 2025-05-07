import { useState, useCallback } from 'react';
import { z } from 'zod';
import { validateWithCustomMessages, validateAsync } from '../utils/formValidation';

interface UseFormWithValidationProps<T extends z.ZodType> {
  initialValues: z.infer<T>;
  validationSchema: T;
  onSubmit: (values: z.infer<T>) => Promise<void>;
  customMessages?: Record<string, string>;
}

interface FormState<T> {
  values: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isSubmitted: boolean;
  isValid: boolean;
}

export const useFormWithValidation = <T extends z.ZodType>({
  initialValues,
  validationSchema,
  onSubmit,
  customMessages,
}: UseFormWithValidationProps<T>) => {
  const [state, setState] = useState<FormState<z.infer<T>>>({
    values: initialValues,
    errors: {},
    touched: {},
    isSubmitting: false,
    isSubmitted: false,
    isValid: true,
  });

  const validateField = useCallback(async (name: string, value: any) => {
    try {
      await validationSchema.parseAsync({ ...state.values, [name]: value });
      return { isValid: true, error: '' };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.errors.find(err => err.path[0] === name);
        return {
          isValid: false,
          error: fieldError ? (customMessages?.[name] || fieldError.message) : '',
        };
      }
      return { isValid: false, error: 'Une erreur de validation est survenue' };
    }
  }, [state.values, validationSchema, customMessages]);

  const handleChange = useCallback(async (name: string, value: any) => {
    const { isValid, error } = await validateField(name, value);
    
    setState(prev => ({
      ...prev,
      values: { ...prev.values, [name]: value },
      errors: { ...prev.errors, [name]: error },
      touched: { ...prev.touched, [name]: true },
      isValid,
    }));
  }, [validateField]);

  const handleBlur = useCallback(async (name: string) => {
    const { isValid, error } = await validateField(name, state.values[name]);
    
    setState(prev => ({
      ...prev,
      errors: { ...prev.errors, [name]: error },
      touched: { ...prev.touched, [name]: true },
      isValid,
    }));
  }, [validateField, state.values]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    setState(prev => ({ ...prev, isSubmitting: true }));

    try {
      const { isValid, errors } = await validateAsync(
        validationSchema,
        state.values,
        customMessages
      );

      if (isValid) {
        await onSubmit(state.values);
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
  }, [state.values, validationSchema, onSubmit, customMessages]);

  const resetForm = useCallback(() => {
    setState({
      values: initialValues,
      errors: {},
      touched: {},
      isSubmitting: false,
      isSubmitted: false,
      isValid: true,
    });
  }, [initialValues]);

  const setFieldValue = useCallback((name: string, value: any) => {
    setState(prev => ({
      ...prev,
      values: { ...prev.values, [name]: value },
    }));
  }, []);

  const setFieldError = useCallback((name: string, error: string) => {
    setState(prev => ({
      ...prev,
      errors: { ...prev.errors, [name]: error },
      isValid: false,
    }));
  }, []);

  return {
    values: state.values,
    errors: state.errors,
    touched: state.touched,
    isSubmitting: state.isSubmitting,
    isSubmitted: state.isSubmitted,
    isValid: state.isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
  };
}; 