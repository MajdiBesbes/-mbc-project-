import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  Building, 
  Users, 
  Briefcase, 
  BarChart3, 
  Calendar, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  FileText, 
  MapPin, 
  Euro, 
  Lightbulb, 
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import { useCRM } from '../hooks/useCRM';

// Types pour le questionnaire
interface Question {
  id: string;
  text: string;
  explanation?: string;
  type: 'single' | 'multiple' | 'text';
  options?: Option[];
  nextQuestion?: string | ((answer: string | string[]) => string);
}

interface Option {
  id: string;
  text: string;
  icon?: React.ReactNode;
}

interface UserAnswers {
  [key: string]: string | string[];
}

// Définition des questions du questionnaire
const questions: Record<string, Question> = {
  secteur: {
    id: 'secteur',
    text: 'Quel est votre secteur d\'activité ?',
    explanation: 'Certains secteurs ont des réglementations spécifiques qui influencent le choix de la structure juridique.',
    type: 'single',
    options: [
      { id: 'commerce', text: 'Commerce', icon: <Building size={24} /> },
      { id: 'services', text: 'Services', icon: <Briefcase size={24} /> },
      { id: 'artisanat', text: 'Artisanat', icon: <Users size={24} /> },
      { id: 'profession-liberale', text: 'Profession libérale', icon: <FileText size={24} /> },
      { id: 'batiment', text: 'Bâtiment / Construction', icon: <MapPin size={24} /> },
      { id: 'restauration', text: 'Restauration / Hôtellerie', icon: <Users size={24} /> },
      { id: 'autre', text: 'Autre', icon: <HelpCircle size={24} /> }
    ],
    nextQuestion: 'associes'
  },
  associes: {
    id: 'associes',
    text: 'Travaillerez-vous seul ou avec des associés ?',
    explanation: 'Le nombre d\'associés détermine les structures juridiques possibles pour votre entreprise.',
    type: 'single',
    options: [
      { id: 'seul', text: 'Seul', icon: <Users size={24} /> },
      { id: 'associes', text: 'Avec des associés', icon: <Users size={24} /> }
    ],
    nextQuestion: (answer) => answer === 'seul' ? 'forme-juridique-solo' : 'nombre-associes'
  },
  'nombre-associes': {
    id: 'nombre-associes',
    text: 'Combien d\'associés envisagez-vous ?',
    type: 'single',
    options: [
      { id: '2', text: '2 associés' },
      { id: '3-5', text: '3 à 5 associés' },
      { id: '5+', text: 'Plus de 5 associés' }
    ],
    nextQuestion: 'forme-juridique-multi'
  },
  'forme-juridique-solo': {
    id: 'forme-juridique-solo',
    text: 'Quelle forme juridique envisagez-vous ?',
    explanation: 'Pour un entrepreneur seul, plusieurs options sont possibles selon vos besoins de protection et votre régime fiscal souhaité.',
    type: 'single',
    options: [
      { id: 'ei', text: 'Entreprise Individuelle', icon: <Building size={24} /> },
      { id: 'micro', text: 'Micro-entreprise', icon: <Building size={24} /> },
      { id: 'eurl', text: 'EURL (SARL unipersonnelle)', icon: <Building size={24} /> },
      { id: 'sasu', text: 'SASU (SAS unipersonnelle)', icon: <Building size={24} /> },
      { id: 'indecis', text: 'Je ne sais pas encore', icon: <HelpCircle size={24} /> }
    ],
    nextQuestion: 'chiffre-affaires'
  },
  'forme-juridique-multi': {
    id: 'forme-juridique-multi',
    text: 'Quelle forme juridique envisagez-vous ?',
    explanation: 'Pour plusieurs associés, le choix dépend de la répartition du capital et du mode de gestion souhaité.',
    type: 'single',
    options: [
      { id: 'sarl', text: 'SARL', icon: <Building size={24} /> },
      { id: 'sas', text: 'SAS', icon: <Building size={24} /> },
      { id: 'sa', text: 'SA', icon: <Building size={24} /> },
      { id: 'sci', text: 'SCI (immobilier)', icon: <Building size={24} /> },
      { id: 'indecis', text: 'Je ne sais pas encore', icon: <HelpCircle size={24} /> }
    ],
    nextQuestion: 'chiffre-affaires'
  },
  'chiffre-affaires': {
    id: 'chiffre-affaires',
    text: 'Quel est votre chiffre d\'affaires prévisionnel annuel ?',
    explanation: 'Le chiffre d\'affaires prévisionnel influence le choix du régime fiscal et les obligations comptables.',
    type: 'single',
    options: [
      { id: 'moins-10k', text: 'Moins de 10 000 €', icon: <Euro size={24} /> },
      { id: '10k-30k', text: '10 000 € - 30 000 €', icon: <Euro size={24} /> },
      { id: '30k-70k', text: '30 000 € - 70 000 €', icon: <Euro size={24} /> },
      { id: '70k-170k', text: '70 000 € - 170 000 €', icon: <Euro size={24} /> },
      { id: 'plus-170k', text: 'Plus de 170 000 €', icon: <Euro size={24} /> }
    ],
    nextQuestion: 'besoins-specifiques'
  },
  'besoins-specifiques': {
    id: 'besoins-specifiques',
    text: 'Avez-vous des besoins spécifiques pour votre activité ?',
    explanation: 'Ces éléments peuvent influencer votre structure juridique et vos obligations.',
    type: 'multiple',
    options: [
      { id: 'local', text: 'Local commercial', icon: <MapPin size={24} /> },
      { id: 'salaries', text: 'Embauche de salariés', icon: <Users size={24} /> },
      { id: 'investissement', text: 'Investissements importants', icon: <Euro size={24} /> },
      { id: 'international', text: 'Activité internationale', icon: <Building size={24} /> },
      { id: 'propriete-intellectuelle', text: 'Protection de propriété intellectuelle', icon: <FileText size={24} /> },
      { id: 'aucun', text: 'Aucun besoin spécifique', icon: <CheckCircle size={24} /> }
    ],
    nextQuestion: 'experience'
  },
  'experience': {
    id: 'experience',
    text: 'Avez-vous déjà créé ou géré une entreprise ?',
    type: 'single',
    options: [
      { id: 'oui', text: 'Oui', icon: <CheckCircle size={24} /> },
      { id: 'non', text: 'Non, c\'est ma première fois', icon: <Briefcase size={24} /> }
    ],
    nextQuestion: 'delai'
  },
  'delai': {
    id: 'delai',
    text: 'Dans quel délai souhaitez-vous créer votre entreprise ?',
    type: 'single',
    options: [
      { id: 'immediat', text: 'Immédiatement', icon: <Calendar size={24} /> },
      { id: '1-3-mois', text: 'Dans 1 à 3 mois', icon: <Calendar size={24} /> },
      { id: '3-6-mois', text: 'Dans 3 à 6 mois', icon: <Calendar size={24} /> },
      { id: 'plus-6-mois', text: 'Plus de 6 mois', icon: <Calendar size={24} /> }
    ],
    nextQuestion: 'contact'
  },
  'contact': {
    id: 'contact',
    text: 'Pour recevoir votre recommandation personnalisée, merci de nous laisser vos coordonnées',
    type: 'text',
    nextQuestion: 'fin'
  },
  'fin': {
    id: 'fin',
    text: 'Merci pour vos réponses !',
    type: 'single',
    options: [
      { id: 'fin', text: 'Voir ma recommandation', icon: <CheckCircle size={24} /> }
    ],
    nextQuestion: 'fin'
  }
};

// Composant principal
const CreationEntreprise: React.FC = () => {
  const [currentQuestionId, setCurrentQuestionId] = useState('secteur');
  const [answers, setAnswers] = useState<UserAnswers>({});
  const [progress, setProgress] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    nom: '',
    email: '',
    telephone: ''
  });
  const [formErrors, setFormErrors] = useState({
    nom: false,
    email: false,
    telephone: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  
  const { handleLead } = useCRM();

  // Calculer la progression
  useEffect(() => {
    const totalQuestions = Object.keys(questions).length;
    const answeredQuestions = Object.keys(answers).length;
    setProgress(Math.round((answeredQuestions / (totalQuestions - 1)) * 100));
  }, [answers]);

  // Gérer la réponse à une question
  const handleAnswer = (questionId: string, answer: string | string[]) => {
    // Mettre à jour les réponses
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));

    // Déterminer la question suivante
    const currentQuestion = questions[questionId];
    if (currentQuestion.nextQuestion) {
      if (typeof currentQuestion.nextQuestion === 'function') {
        const nextQuestionId = currentQuestion.nextQuestion(answer as string);
        setCurrentQuestionId(nextQuestionId);
      } else {
        setCurrentQuestionId(currentQuestion.nextQuestion);
      }
    }

    // Si c'est la dernière question, afficher les résultats
    if (questionId === 'contact') {
      validateContactForm();
    }
  };

  // Valider le formulaire de contact
  const validateContactForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
    
    const errors = {
      nom: !contactInfo.nom,
      email: !emailRegex.test(contactInfo.email),
      telephone: !phoneRegex.test(contactInfo.telephone)
    };
    
    setFormErrors(errors);
    
    if (!errors.nom && !errors.email && !errors.telephone) {
      submitForm();
    }
  };

  // Soumettre le formulaire
  const submitForm = async () => {
    setIsSubmitting(true);
    
    try {
      // Préparer les données pour le CRM
      const leadData = {
        nom: contactInfo.nom,
        email: contactInfo.email,
        telephone: contactInfo.telephone,
        source: 'creation-entreprise',
        type_contact: 'creation',
        gdpr_consent: true,
        metadata: {
          ...answers,
          recommandation: getRecommendation()
        }
      };
      
      // Envoyer au CRM
      await handleLead(leadData, 'creation-entreprise');
      
      // Afficher les résultats
      setSubmissionSuccess(true);
      setShowResult(true);
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Revenir à la question précédente
  const handleBack = () => {
    // Logique simplifiée pour revenir en arrière
    const questionIds = Object.keys(questions);
    const currentIndex = questionIds.indexOf(currentQuestionId);
    
    if (currentIndex > 0) {
      setCurrentQuestionId(questionIds[currentIndex - 1]);
    }
  };

  // Recommencer le questionnaire
  const handleRestart = () => {
    setAnswers({});
    setCurrentQuestionId('secteur');
    setShowResult(false);
    setSubmissionSuccess(false);
    setContactInfo({
      nom: '',
      email: '',
      telephone: ''
    });
  };

  // Générer une recommandation basée sur les réponses
  const getRecommendation = () => {
    const { secteur, associes, 'forme-juridique-solo': formeSolo, 'forme-juridique-multi': formeMulti, 'chiffre-affaires': ca } = answers;
    
    // Logique de recommandation
    if (associes === 'seul') {
      if (formeSolo === 'micro' || (formeSolo === 'indecis' && (ca === 'moins-10k' || ca === '10k-30k'))) {
        return {
          structure: 'Micro-entreprise',
          avantages: [
            'Simplicité administrative',
            'Pas de capital social minimum',
            'Charges calculées sur le CA réel'
          ],
          inconvenients: [
            'Plafond de chiffre d\'affaires limité',
            'Pas de déduction des charges',
            'Protection juridique limitée'
          ],
          description: 'La micro-entreprise est idéale pour démarrer une activité avec peu de charges et d\'investissements. Simple à créer et à gérer, elle convient parfaitement aux entrepreneurs débutants ou à temps partiel.'
        };
      } else if (formeSolo === 'eurl' || (formeSolo === 'indecis' && (ca === '30k-70k' || ca === '70k-170k'))) {
        return {
          structure: 'EURL',
          avantages: [
            'Responsabilité limitée au capital social',
            'Patrimoine personnel protégé',
            'Crédibilité auprès des partenaires'
          ],
          inconvenients: [
            'Formalités de création plus complexes',
            'Frais de création plus élevés',
            'Comptabilité obligatoire'
          ],
          description: 'L\'EURL offre une bonne protection juridique tout en permettant une gestion souple. Elle est adaptée aux entrepreneurs souhaitant séparer clairement leur patrimoine personnel et professionnel.'
        };
      } else if (formeSolo === 'sasu' || (formeSolo === 'indecis' && ca === 'plus-170k')) {
        return {
          structure: 'SASU',
          avantages: [
            'Régime social du dirigeant avantageux (assimilé salarié)',
            'Grande flexibilité statutaire',
            'Facilité pour lever des fonds'
          ],
          inconvenients: [
            'Charges sociales plus élevées',
            'Formalités administratives importantes',
            'Coûts de fonctionnement plus élevés'
          ],
          description: 'La SASU est particulièrement adaptée aux entrepreneurs ayant un chiffre d\'affaires important ou prévoyant une forte croissance. Elle offre une grande souplesse et facilite l\'entrée d\'investisseurs.'
        };
      } else {
        return {
          structure: 'Entreprise Individuelle',
          avantages: [
            'Création simple et rapide',
            'Coûts de création réduits',
            'Gestion administrative simplifiée'
          ],
          inconvenients: [
            'Responsabilité illimitée sur les biens personnels',
            'Difficultés pour lever des fonds',
            'Image moins professionnelle'
          ],
          description: 'L\'entreprise individuelle convient aux activités à faible risque et nécessitant peu d\'investissements. Simple à créer, elle implique cependant une responsabilité totale de l\'entrepreneur sur ses biens personnels.'
        };
      }
    } else {
      // Avec associés
      if (formeMulti === 'sarl' || (formeMulti === 'indecis' && (ca === '30k-70k' || ca === '70k-170k'))) {
        return {
          structure: 'SARL',
          avantages: [
            'Responsabilité limitée aux apports',
            'Fonctionnement bien encadré juridiquement',
            'Crédibilité auprès des partenaires'
          ],
          inconvenients: [
            'Formalisme juridique important',
            'Régime social et fiscal du gérant parfois moins avantageux',
            'Moins de flexibilité dans la gestion'
          ],
          description: 'La SARL est une structure éprouvée, adaptée aux petites et moyennes entreprises avec plusieurs associés. Elle offre un bon équilibre entre protection juridique et contrôle de l\'entreprise.'
        };
      } else if (formeMulti === 'sas' || (formeMulti === 'indecis' && ca === 'plus-170k')) {
        return {
          structure: 'SAS',
          avantages: [
            'Grande liberté statutaire',
            'Facilité pour faire entrer des investisseurs',
            'Régime social avantageux pour le président'
          ],
          inconvenients: [
            'Coûts de création et de fonctionnement élevés',
            'Expertise juridique nécessaire pour les statuts',
            'Formalisme pour certaines décisions'
          ],
          description: 'La SAS est idéale pour les projets ambitieux nécessitant des investissements importants. Sa flexibilité permet d\'adapter la gouvernance aux besoins spécifiques des associés et facilite la levée de fonds.'
        };
      } else if (formeMulti === 'sci') {
        return {
          structure: 'SCI',
          avantages: [
            'Gestion optimisée du patrimoine immobilier',
            'Transmission facilitée des biens immobiliers',
            'Possibilité d\'opter pour l\'impôt sur les sociétés'
          ],
          inconvenients: [
            'Objet social limité à l\'immobilier',
            'Formalisme juridique important',
            'Responsabilité des associés au-delà de leurs apports'
          ],
          description: 'La SCI est spécifiquement adaptée à la gestion et à la détention d\'un patrimoine immobilier. Elle facilite la transmission et permet d\'optimiser la fiscalité liée aux biens immobiliers.'
        };
      } else {
        return {
          structure: 'SA',
          avantages: [
            'Image prestigieuse',
            'Possibilité de faire appel public à l\'épargne',
            'Structure adaptée aux projets de grande envergure'
          ],
          inconvenients: [
            'Capital social minimum élevé (37 000 €)',
            'Gouvernance complexe (conseil d\'administration)',
            'Coûts de fonctionnement très importants'
          ],
          description: 'La SA est adaptée aux grandes entreprises ou aux projets nécessitant des capitaux importants. Sa structure de gouvernance élaborée et son capital minimum élevé en font une option pour des projets d\'envergure.'
        };
      }
    }
  };

  // Afficher la question courante
  const renderQuestion = () => {
    const currentQuestion = questions[currentQuestionId];
    
    if (!currentQuestion) return null;
    
    if (currentQuestionId === 'contact') {
      return (
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">{currentQuestion.text}</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
                Nom complet *
              </label>
              <input
                id="nom"
                type="text"
                value={contactInfo.nom}
                onChange={(e) => setContactInfo(prev => ({ ...prev, nom: e.target.value }))}
                className={`w-full px-4 py-2 border ${formErrors.nom ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
              />
              {formErrors.nom && (
                <p className="mt-1 text-sm text-red-600">Veuillez entrer votre nom</p>
              )}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email professionnel *
              </label>
              <input
                id="email"
                type="email"
                value={contactInfo.email}
                onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                className={`w-full px-4 py-2 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
              />
              {formErrors.email && (
                <p className="mt-1 text-sm text-red-600">Veuillez entrer un email valide</p>
              )}
            </div>
            
            <div>
              <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone *
              </label>
              <input
                id="telephone"
                type="tel"
                value={contactInfo.telephone}
                onChange={(e) => setContactInfo(prev => ({ ...prev, telephone: e.target.value }))}
                className={`w-full px-4 py-2 border ${formErrors.telephone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
              />
              {formErrors.telephone && (
                <p className="mt-1 text-sm text-red-600">Veuillez entrer un numéro de téléphone valide</p>
              )}
            </div>
            
            <div className="flex items-start mt-4">
              <input
                id="gdpr"
                type="checkbox"
                checked={true}
                readOnly
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded mt-1"
              />
              <label htmlFor="gdpr" className="ml-2 text-sm text-gray-600">
                J'accepte que mes données soient traitées conformément à la politique de confidentialité pour recevoir ma recommandation personnalisée.
              </label>
            </div>
          </div>
          
          <div className="mt-8 flex justify-between">
            <button
              onClick={handleBack}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </button>
            
            <button
              onClick={() => validateContactForm()}
              disabled={isSubmitting}
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors flex items-center disabled:opacity-50"
            >
              {isSubmitting ? 'Traitement...' : 'Obtenir ma recommandation'}
              {!isSubmitting && <ArrowRight className="w-4 h-4 ml-2" />}
            </button>
          </div>
        </div>
      );
    }
    
    return (
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">{currentQuestion.text}</h2>
        
        {currentQuestion.explanation && (
          <div className="mb-6 flex items-start p-4 bg-blue-50 rounded-lg">
            <Lightbulb className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <p className="ml-3 text-sm text-blue-700">{currentQuestion.explanation}</p>
          </div>
        )}
        
        <div className="space-y-3 mt-6">
          {currentQuestion.type === 'single' && currentQuestion.options && (
            <>
              {currentQuestion.options.map(option => (
                <button
                  key={option.id}
                  onClick={() => handleAnswer(currentQuestion.id, option.id)}
                  className="w-full p-4 text-left border-2 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors flex items-center"
                >
                  {option.icon && <span className="mr-3 text-primary">{option.icon}</span>}
                  <span>{option.text}</span>
                </button>
              ))}
            </>
          )}
          
          {currentQuestion.type === 'multiple' && currentQuestion.options && (
            <>
              {currentQuestion.options.map(option => (
                <label
                  key={option.id}
                  className="flex items-center p-4 border-2 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded"
                    onChange={(e) => {
                      const currentAnswers = answers[currentQuestion.id] as string[] || [];
                      let newAnswers: string[];
                      
                      if (e.target.checked) {
                        // Si l'option "aucun" est cochée, décocher toutes les autres
                        if (option.id === 'aucun') {
                          newAnswers = ['aucun'];
                        } else {
                          // Si une autre option est cochée, décocher "aucun"
                          newAnswers = [...currentAnswers.filter(a => a !== 'aucun'), option.id];
                        }
                      } else {
                        newAnswers = currentAnswers.filter(a => a !== option.id);
                      }
                      
                      setAnswers(prev => ({
                        ...prev,
                        [currentQuestion.id]: newAnswers
                      }));
                    }}
                    checked={Array.isArray(answers[currentQuestion.id]) && (answers[currentQuestion.id] as string[]).includes(option.id)}
                  />
                  <div className="ml-3 flex items-center">
                    {option.icon && <span className="mr-3 text-primary">{option.icon}</span>}
                    <span>{option.text}</span>
                  </div>
                </label>
              ))}
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => {
                    const selectedOptions = answers[currentQuestion.id] as string[] || [];
                    if (selectedOptions.length > 0) {
                      handleAnswer(currentQuestion.id, selectedOptions);
                    }
                  }}
                  disabled={(answers[currentQuestion.id] as string[] || []).length === 0}
                  className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors flex items-center disabled:opacity-50"
                >
                  Continuer
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </>
          )}
        </div>
        
        {currentQuestionId !== 'secteur' && (
          <div className="mt-8 flex justify-start">
            <button
              onClick={handleBack}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </button>
          </div>
        )}
      </div>
    );
  };

  // Afficher les résultats
  const renderResults = () => {
    const recommendation = getRecommendation();
    
    return (
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Votre recommandation personnalisée</h2>
          <p className="text-gray-600 mt-2">
            Basée sur vos réponses, voici notre recommandation pour votre projet d'entreprise
          </p>
        </div>
        
        <div className="mb-8">
          <div className="bg-primary/5 p-6 rounded-lg border border-primary/20">
            <h3 className="text-xl font-semibold text-primary mb-2">Structure recommandée : {recommendation.structure}</h3>
            <p className="text-gray-700 mb-4">{recommendation.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Avantages
                </h4>
                <ul className="space-y-2">
                  {recommendation.avantages.map((avantage, index) => (
                    <li key={index} className="flex items-start">
                      <ChevronRight className="w-4 h-4 text-green-500 mt-1 mr-2" />
                      <span className="text-gray-700">{avantage}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <HelpCircle className="w-5 h-5 text-amber-500 mr-2" />
                  Points d'attention
                </h4>
                <ul className="space-y-2">
                  {recommendation.inconvenients.map((inconvenient, index) => (
                    <li key={index} className="flex items-start">
                      <ChevronRight className="w-4 h-4 text-amber-500 mt-1 mr-2" />
                      <span className="text-gray-700">{inconvenient}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Prochaines étapes recommandées</h3>
          <ol className="space-y-3">
            <li className="flex items-start">
              <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm font-medium mr-3">1</span>
              <span className="text-gray-700">Consultation avec un expert-comptable pour affiner votre projet</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm font-medium mr-3">2</span>
              <span className="text-gray-700">Élaboration d'un prévisionnel financier sur 3 ans</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm font-medium mr-3">3</span>
              <span className="text-gray-700">Rédaction des statuts adaptés à votre situation</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm font-medium mr-3">4</span>
              <span className="text-gray-700">Accompagnement pour les formalités administratives</span>
            </li>
          </ol>
        </div>
        
        <div className="text-center space-y-4">
          <p className="text-gray-700">
            Nos experts-comptables sont disponibles pour vous accompagner dans toutes les étapes de la création de votre entreprise.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <Link
              to="/contact"
              className="px-6 py-3 bg-primary text-white rounded-md text-center hover:bg-primary-dark transition-colors"
            >
              Prendre rendez-vous avec un expert
            </Link>
            <button
              onClick={handleRestart}
              className="px-6 py-3 border-2 border-primary text-primary rounded-md hover:bg-gray-50 transition-colors"
            >
              Recommencer le questionnaire
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Créer mon entreprise - Guide interactif | MBC Consulting</title>
        <meta name="description" content="Découvrez la structure juridique idéale pour votre projet d'entreprise grâce à notre guide interactif. Obtenez une recommandation personnalisée en quelques clics." />
      </Helmet>
      
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Créer mon entreprise</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Découvrez la structure juridique idéale pour votre projet en répondant à quelques questions simples
              </p>
            </div>
            
            {!showResult && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">Progression</span>
                  <span className="text-sm font-medium text-primary">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-primary h-2.5 rounded-full transition-all duration-300" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {showResult ? renderResults() : renderQuestion()}
            
            <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pourquoi faire appel à un expert-comptable pour créer votre entreprise ?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="text-primary mb-3">
                    <FileText className="w-8 h-8" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">Expertise juridique et fiscale</h4>
                  <p className="text-sm text-gray-600">Choix de la structure optimale selon votre situation personnelle et professionnelle.</p>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="text-primary mb-3">
                    <BarChart3 className="w-8 h-8" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">Prévisionnel financier</h4>
                  <p className="text-sm text-gray-600">Élaboration d'un business plan crédible pour vos partenaires financiers.</p>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="text-primary mb-3">
                    <Briefcase className="w-8 h-8" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">Accompagnement complet</h4>
                  <p className="text-sm text-gray-600">Suivi personnalisé de A à Z, des formalités administratives au démarrage de l'activité.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreationEntreprise;