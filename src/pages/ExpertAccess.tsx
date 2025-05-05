import React, { useState } from 'react';
import { Building, Lock, Briefcase, Calculator, Users, BarChart3, FileText } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import VideoSection from '../components/VideoSection';

const ExpertAccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'client';

  const coTraitanceAdvantages = [
    {
      icon: <Calculator className="w-8 h-8 text-primary" />,
      title: "Flexibilité et scalabilité",
      description: "Gérez les pics d'activité sans recrutement supplémentaire. Adaptez vos ressources selon vos besoins."
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Expertise spécialisée",
      description: "Accédez à notre expertise en comptabilité franco-maghrébine et gestion de paie complexe."
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-primary" />,
      title: "Rentabilité optimisée",
      description: "Réduisez vos coûts fixes et optimisez votre rentabilité grâce à notre tarification adaptée."
    },
    {
      icon: <FileText className="w-8 h-8 text-primary" />,
      title: "Qualité garantie",
      description: "Bénéficiez de notre engagement qualité et de nos process certifiés."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Espace Connexion</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Accès Client */}
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-center group">
              <div className="mb-6 flex justify-center">
                <div className="p-4 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                  <Building className="w-10 h-10 text-primary" />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Espace Client</h2>
              <p className="text-gray-600 text-sm mb-6">
                Accédez à vos documents et suivez vos dossiers en temps réel
              </p>
              <a 
                href="https://client.mbc-consulting.fr" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
              >
                Connexion
              </a>
            </div>

            {/* Accès Expert */}
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-center group">
              <div className="mb-6 flex justify-center">
                <div className="p-4 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                  <Lock className="w-10 h-10 text-primary" />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Espace Expert</h2>
              <p className="text-gray-600 text-sm mb-6">
                Portail dédié aux experts-comptables partenaires
              </p>
              <a 
                href="https://expert.mbc-consulting.fr" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
              >
                Connexion
              </a>
            </div>

            {/* Accès Collaborateur */}
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-center group">
              <div className="mb-6 flex justify-center">
                <div className="p-4 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                  <Briefcase className="w-10 h-10 text-primary" />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Espace Collaborateur</h2>
              <p className="text-gray-600 text-sm mb-6">
                Accès réservé aux collaborateurs du cabinet
              </p>
              <a 
                href="https://collab.mbc-consulting.fr" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
              >
                Connexion
              </a>
            </div>
          </div>

          {/* Section Co-traitance */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Co-traitance Experts-Comptables
            </h2>
            <p className="text-lg text-gray-600 mb-8 text-center">
              Optimisez votre cabinet avec notre solution de co-traitance comptable et paie
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {coTraitanceAdvantages.map((advantage, index) => (
                <div key={index} className="flex items-start space-x-4 p-6 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    {advantage.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {advantage.title}
                    </h3>
                    <p className="text-gray-600">
                      {advantage.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <a
                href="https://calendly.com/majdi-besbes/cotraitance"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-4 bg-primary text-white rounded-md shadow-lg hover:bg-primary-dark transition-colors"
              >
                Planifier un rendez-vous découverte
              </a>
            </div>
          </div>

          {/* Section Vidéos */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Découvrez notre offre de co-traitance
            </h2>
            <VideoSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertAccess;