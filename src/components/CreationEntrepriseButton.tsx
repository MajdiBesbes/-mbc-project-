import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building, X } from 'lucide-react';

const CreationEntrepriseButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  useEffect(() => {
    // Afficher le bouton après un délai pour ne pas perturber l'expérience utilisateur immédiatement
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    // Afficher le tooltip après un délai supplémentaire
    const tooltipTimer = setTimeout(() => {
      if (isVisible) {
        setIsTooltipVisible(true);
        // Cacher le tooltip après 5 secondes
        setTimeout(() => {
          setIsTooltipVisible(false);
        }, 5000);
      }
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearTimeout(tooltipTimer);
    };
  }, [isVisible]);

  // Vérifier si l'utilisateur est déjà sur la page de création d'entreprise
  useEffect(() => {
    const currentPath = window.location.pathname;
    if (currentPath === '/creation-entreprise') {
      setIsVisible(false);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {isTooltipVisible && (
        <div className="fixed bottom-48 left-6 z-40 bg-white rounded-lg shadow-xl p-4 max-w-xs animate-fadeIn">
          <button 
            onClick={() => setIsTooltipVisible(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            aria-label="Fermer l'info-bulle"
          >
            <X size={16} />
          </button>
          <p className="text-gray-700 text-sm">
            Découvrez la structure juridique idéale pour votre projet d'entreprise grâce à notre guide interactif !
          </p>
        </div>
      )}
      
      <Link
        to="/creation-entreprise"
        className="fixed bottom-36 left-6 z-40 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary-dark transition-colors flex items-center justify-center"
        aria-label="Créer mon entreprise"
        onClick={() => setIsTooltipVisible(false)}
      >
        <Building className="w-6 h-6" />
      </Link>
    </>
  );
};

export default CreationEntrepriseButton;