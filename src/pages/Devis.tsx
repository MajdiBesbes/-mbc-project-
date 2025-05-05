import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FileText, Check, Euro, Calculator, ArrowRight, Briefcase, Building, Phone, Mail, User } from 'lucide-react';
import { useCRM } from '../hooks/useCRM';
import { Helmet } from 'react-helmet-async';

// Schéma de validation
const devisSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  telephone: z.string().regex(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/, 'Numéro de téléphone invalide'),
  societe: z.string().optional(),
  statut: z.string().min(1, 'Veuillez sélectionner un statut juridique'),
  activite: z.string().min(1, 'Veuillez sélectionner un secteur d\'activité'),
  services: z.array(z.string()).min(1, 'Veuillez sélectionner au moins un service'),
  chiffreAffaires: z.string().optional(),
  nombreSalaries: z.string().optional(),
  gdprConsent: z.boolean().refine(val => val === true, 'Vous devez accepter la politique de confidentialité')
});

type DevisFormData = z.infer<typeof devisSchema>;

// Tarifs des services
const tarifs = {
  comptabilite: {
    base: {
      'auto-entrepreneur': 50,
      'eurl-sarl': 150,
      'sas-sasu': 180,
      'sci': 120,
      'association': 100,
      'profession-liberale': 130
    },
    // Multiplicateurs selon le CA
    caMultiplier: {
      'moins-50k': 1,
      '50k-100k': 1.2,
      '100k-300k': 1.5,
      '300k-1m': 2,
      'plus-1m': 3
    },
    // Multiplicateurs selon le nombre de salariés
    salariesMultiplier: {
      '0': 1,
      '1-5': 1.1,
      '6-20': 1.2,
      'plus-20': 1.3
    }
  },
  social: {
    base: {
      'auto-entrepreneur': 0, // Non applicable
      'eurl-sarl': 60,
      'sas-sasu': 60,
      'sci': 0, // Non applicable
      'association': 50,
      'profession-liberale': 50
    },
    // Prix par bulletin
    prixParBulletin: {
      '1-5': 25,
      '6-20': 20,
      'plus-20': 18
    }
  },
  fiscal: {
    base: {
      'auto-entrepreneur': 80,
      'eurl-sarl': 200,
      'sas-sasu': 250,
      'sci': 150,
      'association': 100,
      'profession-liberale': 180
    }
  },
  juridique: {
    base: {
      'auto-entrepreneur': 100,
      'eurl-sarl': 300,
      'sas-sasu': 350,
      'sci': 250,
      'association': 200,
      'profession-liberale': 250
    }
  },
  creation: {
    base: {
      'auto-entrepreneur': 150,
      'eurl-sarl': 600,
      'sas-sasu': 800,
      'sci': 500,
      'association': 300,
      'profession-liberale': 450
    }
  },
  previsionnel: {
    base: {
      'auto-entrepreneur': 300,
      'eurl-sarl': 600,
      'sas-sasu': 700,
      'sci': 500,
      'association': 400,
      'profession-liberale': 500
    }
  }
};

// Options pour les secteurs d'activité
const secteurs = [
  { value: 'commerce', label: 'Commerce' },
  { value: 'services', label: 'Services' },
  { value: 'artisanat', label: 'Artisanat' },
  { value: 'profession-liberale', label: 'Profession libérale' },
  { value: 'batiment', label: 'Bâtiment / Construction' },
  { value: 'restauration', label: 'Restauration / Hôtellerie' },
  { value: 'transport', label: 'Transport / Logistique' },
  { value: 'immobilier', label: 'Immobilier' },
  { value: 'sante', label: 'Santé' },
  { value: 'tech', label: 'Technologie / IT' },
  { value: 'autre', label: 'Autre' }
];

const Devis: React.FC = () => {
  const [step, setStep] = useState(1);
  const [devisGenere, setDevisGenere] = useState(false);
  const [tarifEstime, setTarifEstime] = useState(0);
  const [tarifDetails, setTarifDetails] = useState<Record<string, number>>({});
  const { handleLead } = useCRM();
  
  const { register, handleSubmit, control, watch, formState: { errors }, reset } = useForm<DevisFormData>({
    resolver: zodResolver(devisSchema),
    defaultValues: {
      services: []
    }
  });

  const watchedValues = {
    statut: watch('statut'),
    services: watch('services'),
    chiffreAffaires: watch('chiffreAffaires'),
    nombreSalaries: watch('nombreSalaries')
  };

  // Calculer le tarif estimé à chaque changement des valeurs surveillées
  useEffect(() => {
    if (watchedValues.statut && watchedValues.services && watchedValues.services.length > 0) {
      calculerTarif();
    }
  }, [watchedValues.statut, watchedValues.services, watchedValues.chiffreAffaires, watchedValues.nombreSalaries]);

  const calculerTarif = () => {
    const details: Record<string, number> = {};
    let total = 0;

    // Statut juridique sélectionné
    const statut = watchedValues.statut;
    
    // Calcul pour chaque service sélectionné
    watchedValues.services.forEach(service => {
      let tarifService = 0;
      
      // Tarif de base selon le statut
      if (tarifs[service as keyof typeof tarifs]?.base[statut as keyof typeof tarifs.comptabilite.base]) {
        tarifService = tarifs[service as keyof typeof tarifs].base[statut as keyof typeof tarifs.comptabilite.base];
      }
      
      // Ajustements spécifiques
      if (service === 'comptabilite' && watchedValues.chiffreAffaires) {
        const caMultiplier = tarifs.comptabilite.caMultiplier[watchedValues.chiffreAffaires as keyof typeof tarifs.comptabilite.caMultiplier] || 1;
        tarifService *= caMultiplier;
        
        if (watchedValues.nombreSalaries) {
          const salariesMultiplier = tarifs.comptabilite.salariesMultiplier[watchedValues.nombreSalaries as keyof typeof tarifs.comptabilite.salariesMultiplier] || 1;
          tarifService *= salariesMultiplier;
        }
      }
      
      // Cas spécial pour le social (paie)
      if (service === 'social' && watchedValues.nombreSalaries && watchedValues.nombreSalaries !== '0') {
        let prixBulletin = 0;
        let nombreBulletins = 0;
        
        if (watchedValues.nombreSalaries === '1-5') {
          prixBulletin = tarifs.social.prixParBulletin['1-5'];
          nombreBulletins = 3; // Moyenne
        } else if (watchedValues.nombreSalaries === '6-20') {
          prixBulletin = tarifs.social.prixParBulletin['6-20'];
          nombreBulletins = 12; // Moyenne
        } else if (watchedValues.nombreSalaries === 'plus-20') {
          prixBulletin = tarifs.social.prixParBulletin['plus-20'];
          nombreBulletins = 30; // Moyenne
        }
        
        tarifService += prixBulletin * nombreBulletins;
      }
      
      // Arrondir et ajouter au total
      tarifService = Math.round(tarifService);
      details[service] = tarifService;
      total += tarifService;
    });
    
    setTarifDetails(details);
    setTarifEstime(total);
  };

  const onSubmit = async (data: DevisFormData) => {
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    
    try {
      // Enregistrer le lead dans le CRM
      const leadData = {
        nom: data.nom,
        email: data.email,
        telephone: data.telephone,
        societe: data.societe || '',
        source: 'devis-en-ligne',
        type_contact: 'comptabilité',
        gdpr_consent: data.gdprConsent,
        metadata: {
          statut: data.statut,
          activite: data.activite,
          services: data.services.join(', '),
          chiffreAffaires: data.chiffreAffaires || 'Non spécifié',
          nombreSalaries: data.nombreSalaries || 'Non spécifié',
          tarifEstime: tarifEstime
        }
      };
      
      await handleLead(leadData, 'devis-en-ligne');
      
      // Afficher le devis généré
      setDevisGenere(true);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du devis:', error);
    }
  };

  const resetForm = () => {
    reset();
    setStep(1);
    setDevisGenere(false);
    setTarifEstime(0);
    setTarifDetails({});
  };

  return (
    <>
      <Helmet>
        <title>Devis gratuit – Cabinet comptable MBC</title>
        <meta name="description" content="Simulez votre devis gratuitement en ligne pour vos prestations comptables, sociales ou juridiques avec le cabinet MBC" />
      </Helmet>
      
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Simulez votre devis en ligne</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Obtenez une estimation tarifaire personnalisée pour nos services d'expertise comptable
              </p>
            </div>

            {!devisGenere ? (
              <div className="bg-white rounded-lg shadow-lg p-8">
                {/* Étapes */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
                      }`}>
                        <Building className="w-5 h-5" />
                      </div>
                      <span className={`ml-2 font-medium ${
                        step >= 1 ? 'text-primary' : 'text-gray-500'
                      }`}>Entreprise</span>
                    </div>
                    <div className="flex-1 mx-4 h-1 bg-gray-200">
                      <div className={`h-full bg-primary transition-all ${
                        step >= 2 ? 'w-full' : 'w-0'
                      }`}></div>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
                      }`}>
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <span className={`ml-2 font-medium ${
                        step >= 2 ? 'text-primary' : 'text-gray-500'
                      }`}>Services</span>
                    </div>
                    <div className="flex-1 mx-4 h-1 bg-gray-200">
                      <div className={`h-full bg-primary transition-all ${
                        step >= 3 ? 'w-full' : 'w-0'
                      }`}></div>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        step >= 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
                      }`}>
                        <User className="w-5 h-5" />
                      </div>
                      <span className={`ml-2 font-medium ${
                        step >= 3 ? 'text-primary' : 'text-gray-500'
                      }`}>Contact</span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Étape 1: Informations sur l'entreprise */}
                  {step === 1 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Informations sur votre entreprise</h2>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Statut juridique *
                        </label>
                        <select
                          {...register('statut')}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value="">Sélectionnez votre statut</option>
                          <option value="auto-entrepreneur">Auto-entrepreneur</option>
                          <option value="eurl-sarl">EURL / SARL</option>
                          <option value="sas-sasu">SAS / SASU</option>
                          <option value="sci">SCI</option>
                          <option value="association">Association</option>
                          <option value="profession-liberale">Profession libérale</option>
                        </select>
                        {errors.statut && (
                          <p className="mt-1 text-sm text-red-600">{errors.statut.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Secteur d'activité *
                        </label>
                        <select
                          {...register('activite')}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value="">Sélectionnez votre secteur</option>
                          {secteurs.map(secteur => (
                            <option key={secteur.value} value={secteur.value}>{secteur.label}</option>
                          ))}
                        </select>
                        {errors.activite && (
                          <p className="mt-1 text-sm text-red-600">{errors.activite.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Chiffre d'affaires annuel
                        </label>
                        <select
                          {...register('chiffreAffaires')}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value="">Sélectionnez une tranche</option>
                          <option value="moins-50k">Moins de 50 000 €</option>
                          <option value="50k-100k">50 000 € - 100 000 €</option>
                          <option value="100k-300k">100 000 € - 300 000 €</option>
                          <option value="300k-1m">300 000 € - 1 000 000 €</option>
                          <option value="plus-1m">Plus de 1 000 000 €</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre de salariés
                        </label>
                        <select
                          {...register('nombreSalaries')}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value="">Sélectionnez une tranche</option>
                          <option value="0">0 salarié</option>
                          <option value="1-5">1 à 5 salariés</option>
                          <option value="6-20">6 à 20 salariés</option>
                          <option value="plus-20">Plus de 20 salariés</option>
                        </select>
                      </div>

                      <div className="pt-6 flex justify-end">
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          disabled={!watchedValues.statut || !watchedValues.activite}
                          className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-colors disabled:opacity-50 flex items-center"
                        >
                          Suivant
                          <ArrowRight className="ml-2 w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Étape 2: Services */}
                  {step === 2 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Services souhaités</h2>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Sélectionnez les services qui vous intéressent *
                        </label>
                        
                        <div className="space-y-3">
                          <Controller
                            name="services"
                            control={control}
                            render={({ field }) => (
                              <>
                                <div className="flex items-start">
                                  <input
                                    type="checkbox"
                                    id="service-comptabilite"
                                    value="comptabilite"
                                    className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      const isChecked = e.target.checked;
                                      const currentValues = field.value || [];
                                      
                                      field.onChange(
                                        isChecked
                                          ? [...currentValues, value]
                                          : currentValues.filter(v => v !== value)
                                      );
                                    }}
                                    checked={field.value?.includes('comptabilite') || false}
                                  />
                                  <label htmlFor="service-comptabilite" className="ml-3 block">
                                    <span className="text-gray-900 font-medium">Comptabilité</span>
                                    <p className="text-gray-500 text-sm">Tenue comptable, bilan annuel, déclarations fiscales</p>
                                  </label>
                                </div>

                                <div className="flex items-start">
                                  <input
                                    type="checkbox"
                                    id="service-social"
                                    value="social"
                                    className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      const isChecked = e.target.checked;
                                      const currentValues = field.value || [];
                                      
                                      field.onChange(
                                        isChecked
                                          ? [...currentValues, value]
                                          : currentValues.filter(v => v !== value)
                                      );
                                    }}
                                    checked={field.value?.includes('social') || false}
                                  />
                                  <label htmlFor="service-social" className="ml-3 block">
                                    <span className="text-gray-900 font-medium">Social & Paie</span>
                                    <p className="text-gray-500 text-sm">Bulletins de paie, déclarations sociales, contrats de travail</p>
                                  </label>
                                </div>

                                <div className="flex items-start">
                                  <input
                                    type="checkbox"
                                    id="service-fiscal"
                                    value="fiscal"
                                    className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      const isChecked = e.target.checked;
                                      const currentValues = field.value || [];
                                      
                                      field.onChange(
                                        isChecked
                                          ? [...currentValues, value]
                                          : currentValues.filter(v => v !== value)
                                      );
                                    }}
                                    checked={field.value?.includes('fiscal') || false}
                                  />
                                  <label htmlFor="service-fiscal" className="ml-3 block">
                                    <span className="text-gray-900 font-medium">Conseil fiscal</span>
                                    <p className="text-gray-500 text-sm">Optimisation fiscale, accompagnement contrôle fiscal</p>
                                  </label>
                                </div>

                                <div className="flex items-start">
                                  <input
                                    type="checkbox"
                                    id="service-juridique"
                                    value="juridique"
                                    className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      const isChecked = e.target.checked;
                                      const currentValues = field.value || [];
                                      
                                      field.onChange(
                                        isChecked
                                          ? [...currentValues, value]
                                          : currentValues.filter(v => v !== value)
                                      );
                                    }}
                                    checked={field.value?.includes('juridique') || false}
                                  />
                                  <label htmlFor="service-juridique" className="ml-3 block">
                                    <span className="text-gray-900 font-medium">Juridique</span>
                                    <p className="text-gray-500 text-sm">Secrétariat juridique, assemblées générales, modifications statutaires</p>
                                  </label>
                                </div>

                                <div className="flex items-start">
                                  <input
                                    type="checkbox"
                                    id="service-creation"
                                    value="creation"
                                    className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      const isChecked = e.target.checked;
                                      const currentValues = field.value || [];
                                      
                                      field.onChange(
                                        isChecked
                                          ? [...currentValues, value]
                                          : currentValues.filter(v => v !== value)
                                      );
                                    }}
                                    checked={field.value?.includes('creation') || false}
                                  />
                                  <label htmlFor="service-creation" className="ml-3 block">
                                    <span className="text-gray-900 font-medium">Création d'entreprise</span>
                                    <p className="text-gray-500 text-sm">Accompagnement à la création, choix du statut, formalités</p>
                                  </label>
                                </div>

                                <div className="flex items-start">
                                  <input
                                    type="checkbox"
                                    id="service-previsionnel"
                                    value="previsionnel"
                                    className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      const isChecked = e.target.checked;
                                      const currentValues = field.value || [];
                                      
                                      field.onChange(
                                        isChecked
                                          ? [...currentValues, value]
                                          : currentValues.filter(v => v !== value)
                                      );
                                    }}
                                    checked={field.value?.includes('previsionnel') || false}
                                  />
                                  <label htmlFor="service-previsionnel" className="ml-3 block">
                                    <span className="text-gray-900 font-medium">Prévisionnel financier</span>
                                    <p className="text-gray-500 text-sm">Business plan sur 3 ans, simulations financières et fiscales</p>
                                  </label>
                                </div>
                              </>
                            )}
                          />
                        </div>
                        
                        {errors.services && (
                          <p className="mt-1 text-sm text-red-600">{errors.services.message}</p>
                        )}
                      </div>

                      {/* Affichage du tarif estimé */}
                      {watchedValues.services && watchedValues.services.length > 0 && (
                        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <Calculator className="w-6 h-6 mr-2 text-primary" />
                            Estimation tarifaire mensuelle
                          </h3>
                          
                          <div className="space-y-3">
                            {Object.entries(tarifDetails).map(([service, montant]) => (
                              <div key={service} className="flex justify-between items-center">
                                <span className="text-gray-600">
                                  {service === 'comptabilite' ? 'Comptabilité' :
                                   service === 'social' ? 'Social & Paie' :
                                   service === 'fiscal' ? 'Conseil fiscal' :
                                   service === 'juridique' ? 'Juridique' :
                                   service === 'creation' ? 'Création d\'entreprise' :
                                   service === 'previsionnel' ? 'Prévisionnel financier' : service}
                                </span>
                                <span className="font-medium">{montant} € HT</span>
                              </div>
                            ))}
                            
                            <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                              <span className="font-semibold text-gray-800">Total mensuel estimé</span>
                              <span className="font-bold text-xl text-primary">{tarifEstime} € HT</span>
                            </div>
                          </div>
                          
                          <p className="mt-4 text-sm text-gray-500">
                            * Cette estimation est donnée à titre indicatif. Le tarif final sera établi après étude approfondie de votre dossier.
                          </p>
                        </div>
                      )}

                      <div className="pt-6 flex justify-between">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-colors"
                        >
                          Retour
                        </button>
                        <button
                          type="button"
                          onClick={() => setStep(3)}
                          disabled={!watchedValues.services || watchedValues.services.length === 0}
                          className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-colors disabled:opacity-50 flex items-center"
                        >
                          Suivant
                          <ArrowRight className="ml-2 w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Étape 3: Coordonnées */}
                  {step === 3 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Vos coordonnées</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        <div>
                          <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
                            Nom complet *
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              id="nom"
                              type="text"
                              {...register('nom')}
                              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                          </div>
                          {errors.nom && (
                            <p className="mt-1 text-sm text-red-600">{errors.nom.message}</p>
                          )}
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email professionnel *
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              id="email"
                              type="email"
                              {...register('email')}
                              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                          </div>
                          {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-1">
                            Téléphone *
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Phone className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              id="telephone"
                              type="tel"
                              {...register('telephone')}
                              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                          </div>
                          {errors.telephone && (
                            <p className="mt-1 text-sm text-red-600">{errors.telephone.message}</p>
                          )}
                        </div>
                        
                        <div>
                          <label htmlFor="societe" className="block text-sm font-medium text-gray-700 mb-1">
                            Nom de l'entreprise
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Building className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              id="societe"
                              type="text"
                              {...register('societe')}
                              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Récapitulatif du devis */}
                      <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                          <FileText className="w-6 h-6 mr-2 text-primary" />
                          Récapitulatif de votre devis
                        </h3>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Statut juridique</span>
                            <span className="font-medium">
                              {watchedValues.statut === 'auto-entrepreneur' ? 'Auto-entrepreneur' :
                               watchedValues.statut === 'eurl-sarl' ? 'EURL / SARL' :
                               watchedValues.statut === 'sas-sasu' ? 'SAS / SASU' :
                               watchedValues.statut === 'sci' ? 'SCI' :
                               watchedValues.statut === 'association' ? 'Association' :
                               watchedValues.statut === 'profession-liberale' ? 'Profession libérale' : ''}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Services sélectionnés</span>
                            <span className="font-medium">
                              {watchedValues.services?.map(service => 
                                service === 'comptabilite' ? 'Comptabilité' :
                                service === 'social' ? 'Social & Paie' :
                                service === 'fiscal' ? 'Conseil fiscal' :
                                service === 'juridique' ? 'Juridique' :
                                service === 'creation' ? 'Création d\'entreprise' :
                                service === 'previsionnel' ? 'Prévisionnel financier' : service
                              ).join(', ')}
                            </span>
                          </div>
                          
                          <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                            <span className="font-semibold text-gray-800">Total mensuel estimé</span>
                            <span className="font-bold text-xl text-primary">{tarifEstime} € HT</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start mt-6">
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

                      <div className="pt-6 flex justify-between">
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-colors"
                        >
                          Retour
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-colors disabled:opacity-50"
                        >
                          Recevoir mon devis
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Votre devis a été généré avec succès !</h2>
                
                <div className="max-w-md mx-auto mb-8">
                  <p className="text-gray-600 mb-6">
                    Merci pour votre demande. Un récapitulatif de votre devis a été envoyé à votre adresse email.
                  </p>
                  
                  <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 text-left mb-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                      <Euro className="w-6 h-6 mr-2 text-primary" />
                      Votre tarif mensuel estimé
                    </h3>
                    
                    <div className="text-center">
                      <span className="text-4xl font-bold text-primary">{tarifEstime} € HT</span>
                      <p className="text-gray-500 text-sm mt-2">
                        * Ce tarif est une estimation et pourra être ajusté après étude de votre dossier
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600">
                    Un de nos experts vous contactera dans les 24 heures pour discuter de vos besoins spécifiques et finaliser votre offre.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={resetForm}
                    className="px-6 py-3 border-2 border-primary text-primary rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Faire une nouvelle simulation
                  </button>
                  <a
                    href="/contact"
                    className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                  >
                    Prendre rendez-vous
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Avantages */}
          <div className="max-w-4xl mx-auto mt-16">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
              Pourquoi choisir MBC pour votre comptabilité ?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">100% Digital</h3>
                <p className="text-gray-600">
                  Tous nos services sont accessibles à distance, avec signature électronique et espace client sécurisé.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Expertise Franco-Maghrébine</h3>
                <p className="text-gray-600">
                  Une équipe qui comprend les enjeux spécifiques des entrepreneurs entre la France et le Maghreb.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Accompagnement Personnalisé</h3>
                <p className="text-gray-600">
                  Un expert dédié à votre dossier et disponible par téléphone, email ou visioconférence.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="max-w-4xl mx-auto mt-16">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
              Questions fréquentes
            </h2>
            
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Comment est calculé le tarif de mon devis ?</h3>
                <p className="text-gray-600">
                  Le tarif est calculé en fonction de votre statut juridique, des services sélectionnés, de votre chiffre d'affaires et du nombre de salariés. Cette estimation est indicative et sera affinée après étude de votre dossier.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Quels documents devrai-je fournir ?</h3>
                <p className="text-gray-600">
                  Après validation de votre devis, nous vous demanderons vos statuts, K-bis, relevés bancaires, factures et autres documents nécessaires à la tenue de votre comptabilité. Tout peut être transmis via notre espace client sécurisé.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Comment se déroule la collaboration à distance ?</h3>
                <p className="text-gray-600">
                  Nous utilisons des outils digitaux sécurisés pour échanger documents et informations. Des rendez-vous réguliers par visioconférence ou téléphone sont organisés pour faire le point sur votre dossier. Notre équipe reste disponible pour répondre à vos questions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Devis;