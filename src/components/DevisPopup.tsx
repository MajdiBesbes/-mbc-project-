import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Calculator } from 'lucide-react';

interface DevisPopupProps {
  delay?: number;
  showOnce?: boolean;
}

const DevisPopup: React.FC<DevisPopupProps> = ({ 
  delay = 10000, // 10 secondes par défaut
  showOnce = true 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Vérifier si le popup a déjà été affiché et fermé
    const hasBeenShown = localStorage.getItem('devisPopupShown');
    
    // Vérifier si l'utilisateur est sur la page de devis
    const isDevisPage = window.location.pathname === '/devis';
    
    if ((showOnce && hasBeenShown === 'true') || isDevisPage) {
      return;
    }
    
    // Afficher le popup après le délai spécifié
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay, showOnce]);
  
  const handleClose = () => {
    setIsVisible(false);
    if (showOnce) {
      localStorage.setItem('devisPopupShown', 'true');
    }
  };
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Fermer"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calculator className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Simulez votre devis en ligne</h2>
          <p className="text-gray-600 mt-2">
            Obtenez une estimation tarifaire immédiate pour nos services d'expertise comptable
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="ml-2 text-gray-600">Estimation tarifaire immédiate</p>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="ml-2 text-gray-600">Adapté à votre statut juridique</p>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="ml-2 text-gray-600">Sans engagement</p>
          </div>
        </div>
        
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link
            to="/devis"
            className="flex-1 px-6 py-3 bg-primary text-white rounded-md text-center hover:bg-primary-dark transition-colors"
            onClick={handleClose}
          >
            Simuler mon devis
          </Link>
          <button
            onClick={handleClose}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-md text-center hover:bg-gray-50 transition-colors"
          >
            Plus tard
          </button>
        </div>
      </div>
    </div>
  );
};

export default DevisPopup;