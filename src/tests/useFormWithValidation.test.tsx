import { renderHook, act } from '@testing-library/react';
import { z } from 'zod';
import { useFormWithValidation } from '../hooks/useFormWithValidation';

describe('useFormWithValidation', () => {
  const schema = z.object({
    name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
    email: z.string().email('Format d\'email invalide'),
  });

  const initialValues = {
    name: '',
    email: '',
  };

  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devrait initialiser le formulaire avec les valeurs par défaut', () => {
    const { result } = renderHook(() =>
      useFormWithValidation({
        initialValues,
        validationSchema: schema,
        onSubmit: mockOnSubmit,
      })
    );

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.isSubmitted).toBe(false);
    expect(result.current.isValid).toBe(true);
  });

  it('devrait mettre à jour les valeurs et valider le champ', async () => {
    const { result } = renderHook(() =>
      useFormWithValidation({
        initialValues,
        validationSchema: schema,
        onSubmit: mockOnSubmit,
      })
    );

    await act(async () => {
      await result.current.handleChange('name', 'John');
    });

    expect(result.current.values.name).toBe('John');
    expect(result.current.errors.name).toBe('');
    expect(result.current.touched.name).toBe(true);
  });

  it('devrait afficher une erreur pour une valeur invalide', async () => {
    const { result } = renderHook(() =>
      useFormWithValidation({
        initialValues,
        validationSchema: schema,
        onSubmit: mockOnSubmit,
      })
    );

    await act(async () => {
      await result.current.handleChange('name', 'J');
    });

    expect(result.current.errors.name).toBe('Le nom doit contenir au moins 2 caractères');
    expect(result.current.isValid).toBe(false);
  });

  it('devrait soumettre le formulaire avec des données valides', async () => {
    const { result } = renderHook(() =>
      useFormWithValidation({
        initialValues,
        validationSchema: schema,
        onSubmit: mockOnSubmit,
      })
    );

    await act(async () => {
      await result.current.handleChange('name', 'John');
      await result.current.handleChange('email', 'john@example.com');
      await result.current.handleSubmit();
    });

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'John',
      email: 'john@example.com',
    });
    expect(result.current.isSubmitted).toBe(true);
    expect(result.current.isSubmitting).toBe(false);
  });

  it('devrait ne pas soumettre le formulaire avec des données invalides', async () => {
    const { result } = renderHook(() =>
      useFormWithValidation({
        initialValues,
        validationSchema: schema,
        onSubmit: mockOnSubmit,
      })
    );

    await act(async () => {
      await result.current.handleChange('name', 'J');
      await result.current.handleChange('email', 'invalid-email');
      await result.current.handleSubmit();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.errors).toHaveProperty('name');
    expect(result.current.errors).toHaveProperty('email');
  });

  it('devrait réinitialiser le formulaire', async () => {
    const { result } = renderHook(() =>
      useFormWithValidation({
        initialValues,
        validationSchema: schema,
        onSubmit: mockOnSubmit,
      })
    );

    await act(async () => {
      await result.current.handleChange('name', 'John');
      await result.current.handleChange('email', 'john@example.com');
      result.current.resetForm();
    });

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.isSubmitted).toBe(false);
    expect(result.current.isValid).toBe(true);
  });

  it('devrait gérer les erreurs de soumission', async () => {
    const error = new Error('Erreur de soumission');
    const mockOnSubmitWithError = jest.fn().mockRejectedValue(error);

    const { result } = renderHook(() =>
      useFormWithValidation({
        initialValues,
        validationSchema: schema,
        onSubmit: mockOnSubmitWithError,
      })
    );

    await act(async () => {
      await result.current.handleChange('name', 'John');
      await result.current.handleChange('email', 'john@example.com');
      await result.current.handleSubmit();
    });

    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.errors.submit).toBe('Erreur de soumission');
  });
}); 