import { z } from 'zod';

// Schémas de validation communs
export const commonValidations = {
  required: (fieldName: string) => `${fieldName} est requis`,
  email: 'Format d\'email invalide',
  minLength: (fieldName: string, length: number) => 
    `${fieldName} doit contenir au moins ${length} caractères`,
  maxLength: (fieldName: string, length: number) => 
    `${fieldName} ne doit pas dépasser ${length} caractères`,
  password: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre',
  phone: 'Format de numéro de téléphone invalide',
  url: 'Format d\'URL invalide',
  number: 'Veuillez entrer un nombre valide',
  date: 'Format de date invalide',
};

// Schémas de validation pour les champs communs
export const validationSchemas = {
  email: z.string().email(commonValidations.email),
  password: z.string()
    .min(8, commonValidations.minLength('Mot de passe', 8))
    .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
    .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
    .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre'),
  phone: z.string()
    .regex(/^(\+33|0)[1-9](\d{2}){4}$/, commonValidations.phone),
  url: z.string().url(commonValidations.url),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, commonValidations.date),
  number: z.number().min(0, 'Le nombre doit être positif'),
};

// Fonction de validation personnalisée
export const createValidationSchema = (schema: Record<string, z.ZodTypeAny>) => {
  return z.object(schema);
};

// Fonction de validation avec messages d'erreur personnalisés
export const validateWithCustomMessages = (
  schema: z.ZodSchema,
  data: unknown,
  customMessages?: Record<string, string>
) => {
  try {
    schema.parse(data);
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = customMessages?.[path] || err.message;
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: { _form: 'Une erreur de validation est survenue' } };
  }
};

// Fonction de validation asynchrone
export const validateAsync = async (
  schema: z.ZodSchema,
  data: unknown,
  customMessages?: Record<string, string>
) => {
  try {
    await schema.parseAsync(data);
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = customMessages?.[path] || err.message;
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: { _form: 'Une erreur de validation est survenue' } };
  }
};

// Fonction de validation de fichier
export const validateFile = (
  file: File,
  options: {
    maxSize?: number;
    allowedTypes?: string[];
    maxFiles?: number;
  } = {}
) => {
  const errors: string[] = [];

  if (options.maxSize && file.size > options.maxSize) {
    errors.push(`Le fichier ne doit pas dépasser ${options.maxSize / 1024 / 1024}MB`);
  }

  if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
    errors.push(`Type de fichier non autorisé. Types acceptés : ${options.allowedTypes.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}; 