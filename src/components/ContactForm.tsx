import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload, X, Loader2 } from 'lucide-react';
import { useCRM } from '../hooks/useCRM';

// Schéma de validation
const contactSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  phone: z.string().regex(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/, 'Numéro de téléphone invalide'),
  company: z.string().optional(),
  turnover: z.string().optional(),
  employees: z.string().optional(),
  subject: z.string().min(1, 'Veuillez sélectionner un sujet'),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères'),
  gdprConsent: z.boolean().refine(val => val === true, 'Vous devez accepter la politique de confidentialité')
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactFormProps {
  onSubmitSuccess?: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSubmitSuccess }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleLead, loading, error } = useCRM();
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ContactFormData) => {
    if (!recaptchaValue) {
      alert('Veuillez valider le reCAPTCHA');
      return;
    }

    setIsSubmitting(true);
    try {
      const lead = await handleLead(data, 'formulaire');
      if (lead) {
        reset();
        setFiles([]);
        setRecaptchaValue(null);
        if (onSubmitSuccess) {
          onSubmitSuccess();
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du formulaire:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nom complet *
          </label>
          <input
            id="name"
            type="text"
            {...register('name')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email professionnel *
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Téléphone *
          </label>
          <input
            id="phone"
            type="tel"
            {...register('phone')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
            Nom de l'entreprise
          </label>
          <input
            id="company"
            type="text"
            {...register('company')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="turnover" className="block text-sm font-medium text-gray-700 mb-1">
            Chiffre d'affaires annuel
          </label>
          <select
            id="turnover"
            {...register('turnover')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Sélectionnez une tranche</option>
            <option value="< 50K">Moins de 50 000 €</option>
            <option value="50K-200K">50 000 € - 200 000 €</option>
            <option value="200K-500K">200 000 € - 500 000 €</option>
            <option value="500K-1M">500 000 € - 1 000 000 €</option>
            <option value="> 1M">Plus de 1 000 000 €</option>
          </select>
        </div>

        <div>
          <label htmlFor="employees" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre d'employés
          </label>
          <select
            id="employees"
            {...register('employees')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Sélectionnez une tranche</option>
            <option value="0">0 employé</option>
            <option value="1-5">1 à 5 employés</option>
            <option value="6-20">6 à 20 employés</option>
            <option value="21-50">21 à 50 employés</option>
            <option value="> 50">Plus de 50 employés</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
          Sujet *
        </label>
        <select
          id="subject"
          {...register('subject')}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="">Sélectionnez un sujet</option>
          <option value="comptabilite">Comptabilité</option>
          <option value="fiscalite">Fiscalité</option>
          <option value="conseil">Conseil</option>
          <option value="paie">Externalisation paie</option>
          <option value="creation">Création d'entreprise</option>
          <option value="autre">Autre demande</option>
        </select>
        {errors.subject && (
          <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Message *
        </label>
        <textarea
          id="message"
          rows={5}
          {...register('message')}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Documents joints
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <div className="flex flex-col items-center">
            <Upload className="h-12 w-12 text-gray-400" />
            <p className="mt-1 text-sm text-gray-600">
              Glissez-déposez vos fichiers ici ou
            </p>
            <label className="mt-2 cursor-pointer">
              <span className="text-primary hover:text-primary-dark">parcourez vos fichiers</span>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
              />
            </label>
            <p className="mt-1 text-xs text-gray-500">
              PDF, Word, Excel ou images (max. 10 Mo par fichier)
            </p>
          </div>
        </div>

        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <span className="text-sm text-gray-600 truncate">{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-start">
        <input
          type="checkbox"
          id="gdprConsent"
          {...register('gdprConsent')}
          className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
        />
        <label htmlFor="gdprConsent" className="ml-2 text-sm text-gray-600">
          J'accepte que mes données soient traitées conformément à la politique de confidentialité *
        </label>
      </div>
      {errors.gdprConsent && (
        <p className="mt-1 text-sm text-red-600">{errors.gdprConsent.message}</p>
      )}

      <div className="mt-6">
        <ReCAPTCHA
          sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'}
          onChange={(value) => setRecaptchaValue(value)}
        />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">* Champs obligatoires</p>
        <button
          type="submit"
          disabled={isSubmitting || !recaptchaValue}
          className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-colors disabled:opacity-70 flex items-center"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Envoi en cours...
            </>
          ) : (
            'Envoyer'
          )}
        </button>
      </div>
    </form>
  );
};

export default ContactForm;