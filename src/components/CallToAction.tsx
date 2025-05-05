import React from 'react';
import { Link } from 'react-router-dom';

const CallToAction: React.FC = () => {
  return (
    <div className="text-center space-y-4 sm:space-y-0 sm:space-x-4">
      <Link 
        to="/contact" 
        className="inline-block px-8 py-4 bg-primary text-white rounded-md shadow-lg hover:bg-primary-dark transition-colors sm:mr-4"
      >
        Prendre rendez-vous avec un expert
      </Link>
      <Link 
        to="/contact" 
        className="inline-block px-8 py-4 bg-white text-primary border-2 border-primary rounded-md shadow-lg hover:bg-gray-50 transition-colors"
      >
        Demander un devis personnalisé
      </Link>
    </div>
  );
};

export default CallToAction;