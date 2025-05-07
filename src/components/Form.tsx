import React, { useState, useCallback } from 'react';
import { useForm, SubmitHandler, FieldValues, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from './Button';

interface FormProps<T extends FieldValues> {
  schema: z.ZodType<T>;
  onSubmit: SubmitHandler<T>;
  defaultValues?: Partial<T>;
  children: React.ReactNode;
  submitLabel?: string;
  className?: string;
  mode?: 'onBlur' | 'onChange' | 'onSubmit' | 'onTouched' | 'all';
  debug?: boolean;
}

function Form<T extends FieldValues>({
  schema,
  onSubmit,
  defaultValues,
  children,
  submitLabel = 'Soumettre',
  className = '',
  mode = 'onTouched',
  debug = false
}: FormProps<T>) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const methods = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
    mode,
    reValidateMode: 'onChange'
  });

  const {
    handleSubmit,
    formState: { errors, isDirty, isValid }
  } = methods;

  const onSubmitForm = useCallback(async (data: T) => {
    try {
      setGlobalError(null);
      setIsSubmitting(true);
      await onSubmit(data);
      methods.reset();
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire:', error);
      setGlobalError(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  }, [onSubmit, methods]);

  return (
    <FormProvider {...methods}>
      <form 
        onSubmit={handleSubmit(onSubmitForm)} 
        className={`form ${className}`}
        noValidate
      >
        {globalError && (
          <div className="form-global-error" role="alert">
            {globalError}
          </div>
        )}
        
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              error: errors[child.props.name]?.message
            });
          }
          return child;
        })}

        {debug && (
          <div className="form-debug">
            <pre>{JSON.stringify({ isDirty, isValid, errors }, null, 2)}</pre>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting || (!isDirty && !isValid)}
          className="form-submit"
        >
          {isSubmitting ? 'Envoi en cours...' : submitLabel}
        </Button>
      </form>
    </FormProvider>
  );
}

export default React.memo(Form); 