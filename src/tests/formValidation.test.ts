import { z } from 'zod';
import {
  commonValidations,
  validationSchemas,
  validateWithCustomMessages,
  validateAsync,
  validateFile,
} from '../utils/formValidation';

describe('Form Validation', () => {
  describe('commonValidations', () => {
    it('devrait retourner le message correct pour required', () => {
      expect(commonValidations.required('Nom')).toBe('Nom est requis');
    });

    it('devrait retourner le message correct pour minLength', () => {
      expect(commonValidations.minLength('Mot de passe', 8))
        .toBe('Mot de passe doit contenir au moins 8 caractères');
    });
  });

  describe('validationSchemas', () => {
    it('devrait valider un email correct', () => {
      const result = validationSchemas.email.safeParse('test@example.com');
      expect(result.success).toBe(true);
    });

    it('devrait rejeter un email incorrect', () => {
      const result = validationSchemas.email.safeParse('invalid-email');
      expect(result.success).toBe(false);
    });

    it('devrait valider un mot de passe correct', () => {
      const result = validationSchemas.password.safeParse('Password123');
      expect(result.success).toBe(true);
    });

    it('devrait rejeter un mot de passe incorrect', () => {
      const result = validationSchemas.password.safeParse('weak');
      expect(result.success).toBe(false);
    });
  });

  describe('validateWithCustomMessages', () => {
    const schema = z.object({
      name: z.string().min(2),
      email: z.string().email(),
    });

    it('devrait valider des données correctes', () => {
      const data = { name: 'John', email: 'john@example.com' };
      const result = validateWithCustomMessages(schema, data);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('devrait retourner des erreurs pour des données invalides', () => {
      const data = { name: 'J', email: 'invalid-email' };
      const result = validateWithCustomMessages(schema, data);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveProperty('name');
      expect(result.errors).toHaveProperty('email');
    });

    it('devrait utiliser les messages personnalisés', () => {
      const data = { name: 'J', email: 'invalid-email' };
      const customMessages = {
        name: 'Le nom doit contenir au moins 2 caractères',
        email: 'Format d\'email invalide',
      };
      const result = validateWithCustomMessages(schema, data, customMessages);
      expect(result.errors.name).toBe(customMessages.name);
      expect(result.errors.email).toBe(customMessages.email);
    });
  });

  describe('validateAsync', () => {
    const schema = z.object({
      name: z.string().min(2),
      email: z.string().email(),
    });

    it('devrait valider des données correctes de manière asynchrone', async () => {
      const data = { name: 'John', email: 'john@example.com' };
      const result = await validateAsync(schema, data);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('devrait retourner des erreurs pour des données invalides de manière asynchrone', async () => {
      const data = { name: 'J', email: 'invalid-email' };
      const result = await validateAsync(schema, data);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveProperty('name');
      expect(result.errors).toHaveProperty('email');
    });
  });

  describe('validateFile', () => {
    const createFile = (name: string, size: number, type: string) => {
      return new File([''], name, { type });
    };

    it('devrait valider un fichier conforme', () => {
      const file = createFile('test.jpg', 1024 * 1024, 'image/jpeg');
      const result = validateFile(file, {
        maxSize: 2 * 1024 * 1024,
        allowedTypes: ['image/jpeg', 'image/png'],
      });
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('devrait rejeter un fichier trop volumineux', () => {
      const file = createFile('test.jpg', 3 * 1024 * 1024, 'image/jpeg');
      const result = validateFile(file, {
        maxSize: 2 * 1024 * 1024,
        allowedTypes: ['image/jpeg', 'image/png'],
      });
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain('2MB');
    });

    it('devrait rejeter un type de fichier non autorisé', () => {
      const file = createFile('test.pdf', 1024 * 1024, 'application/pdf');
      const result = validateFile(file, {
        maxSize: 2 * 1024 * 1024,
        allowedTypes: ['image/jpeg', 'image/png'],
      });
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain('Types acceptés');
    });
  });
}); 