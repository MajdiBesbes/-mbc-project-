import React from 'react';
import { Smartphone, Cloud, Lock, Clock, Globe, Zap, FileText, Users } from 'lucide-react';

const DigitalFeatures: React.FC = () => {
  const features = [
    {
      icon: <Smartphone className="w-10 h-10 text-primary" />,
      title: "Application mobile",
      description: "Accédez à vos documents et suivez vos dossiers depuis votre smartphone"
    },
    {
      icon: <Cloud className="w-10 h-10 text-primary" />,
      title: "Stockage cloud sécurisé",
      description: "Tous vos documents sont stockés en toute sécurité et accessibles 24/7"
    },
    {
      icon: <Lock className="w-10 h-10 text-primary" />,
      title: "Sécurité renforcée",
      description: "Authentification à deux facteurs et chiffrement de bout en bout"
    },
    {
      icon: <Clock className="w-10 h-10 text-primary" />,
      title: "Disponibilité 24/7",
      description: "Accédez à vos informations comptables à tout moment, où que vous soyez"
    },
    {
      icon: <Globe className="w-10 h-10 text-primary" />,
      title: "Collaboration internationale",
      description: "Outils adaptés aux entrepreneurs opérant entre la France et le Maghreb"
    },
    {
      icon: <Zap className="w-10 h-10 text-primary" />,
      title: "Automatisation intelligente",
      description: "Récupération automatique des relevés bancaires et catégorisation des opérations"
    },
    {
      icon: <FileText className="w-10 h-10 text-primary" />,
      title: "Signature électronique",
      description: "Signez vos documents officiels en ligne, sans déplacement"
    },
    {
      icon: <Users className="w-10 h-10 text-primary" />,
      title: "Support multilingue",
      description: "Assistance en français, arabe et anglais pour une communication fluide"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            CABINET 100% DIGITAL
          </span>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Une expertise comptable moderne et connectée
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez les avantages de notre approche 100% digitale pour une gestion comptable efficace et sans contraintes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Notre écosystème digital
              </h3>
              <p className="text-gray-600 mb-4">
                MBC utilise les technologies les plus avancées pour vous offrir une expérience comptable moderne, efficace et sécurisée.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="ml-2 text-gray-700">Logiciels comptables connectés à vos outils</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="ml-2 text-gray-700">Tableaux de bord personnalisés</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="ml-2 text-gray-700">Assistance multicanal 7j/7</span>
                </li>
              </ul>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.pexels.com/photos/6804604/pexels-photo-6804604.jpeg" 
                alt="Écosystème digital MBC" 
                className="rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DigitalFeatures;