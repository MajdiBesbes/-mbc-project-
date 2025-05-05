import React from 'react';
import { Link } from 'react-router-dom';
import { Building, ArrowRight, CheckCircle } from 'lucide-react';

const ServiceCreationCTA: React.FC = () => {
  return (
    <div className="bg-primary/5 rounded-lg p-8 border border-primary/20">
      <div className="flex flex-col md:flex-row items-center">
        <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
          <div className="flex items-center mb-4">
            <Building className="w-8 h-8 text-primary mr-3" />
            <h3 className="text-2xl font-bold text-gray-900">Vous souhaitez créer votre entreprise ?</h3>
          </div>
          
          <p className="text-gray-700 mb-6">
            Découvrez la structure juridique idéale pour votre projet grâce à notre guide interactif. 
            En quelques minutes, obtenez une recommandation personnalisée et un accompagnement sur-mesure.
          </p>
          
          <ul className="space-y-3 mb-6">
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">Questionnaire interactif pour déterminer la structure adaptée à votre projet</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">Conseils personnalisés d'experts-comptables spécialisés</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">Accompagnement complet pour toutes vos démarches administratives</span>
            </li>
          </ul>
          
          <Link 
            to="/creation-entreprise" 
            className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-md font-medium hover:bg-primary-dark transition-colors"
          >
            Créer mon entreprise
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
        
        <div className="md:w-1/3">
          <img 
            src="https://images.pexels.com/photos/7681091/pexels-photo-7681091.jpeg" 
            alt="Création d'entreprise" 
            className="rounded-lg shadow-md w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default ServiceCreationCTA;