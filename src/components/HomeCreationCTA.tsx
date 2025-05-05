import React from 'react';
import { Link } from 'react-router-dom';
import { Building, ArrowRight, FileText, Users, Calendar } from 'lucide-react';

const HomeCreationCTA: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/2 bg-primary p-8 text-white">
          <div className="flex items-center mb-4">
            <Building className="w-8 h-8 mr-3" />
            <h3 className="text-2xl font-bold">Je crée mon entreprise</h3>
          </div>
          
          <p className="mb-6 text-white/90">
            Découvrez la structure juridique idéale pour votre projet grâce à notre guide interactif. 
            Obtenez une recommandation personnalisée en quelques clics.
          </p>
          
          <ul className="space-y-3 mb-8">
            <li className="flex items-start">
              <FileText className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>Recommandation personnalisée selon votre profil</span>
            </li>
            <li className="flex items-start">
              <Users className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>Conseils d'experts-comptables spécialisés</span>
            </li>
            <li className="flex items-start">
              <Calendar className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>Accompagnement complet pour vos démarches</span>
            </li>
          </ul>
          
          <Link 
            to="/creation-entreprise" 
            className="inline-flex items-center px-6 py-3 bg-white text-primary rounded-md font-medium hover:bg-gray-100 transition-colors"
          >
            Démarrer mon projet
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
        
        <div className="md:w-1/2 p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Pourquoi choisir MBC pour créer votre entreprise ?
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="ml-3 text-gray-700">
                <span className="font-medium">Expertise franco-maghrébine</span> - Nous comprenons les spécificités des entrepreneurs entre la France et le Maghreb
              </p>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="ml-3 text-gray-700">
                <span className="font-medium">Accompagnement 100% digital</span> - Toutes vos démarches simplifiées et accessibles en ligne
              </p>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="ml-3 text-gray-700">
                <span className="font-medium">Suivi personnalisé</span> - Un expert dédié vous accompagne à chaque étape de votre projet
              </p>
            </div>
          </div>
          
          <div className="mt-6">
            <Link 
              to="/contact" 
              className="text-primary hover:text-primary-dark font-medium flex items-center"
            >
              Prendre rendez-vous avec un expert
              <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeCreationCTA;