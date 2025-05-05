import React, { useState, useEffect } from 'react';
import { X, Info, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CookieConsentProps {
  onAccept: () => void;
  onDecline: () => void;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ onAccept, onDecline }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà fait un choix
    const consentChoice = localStorage.getItem('cookieConsent');
    
    if (!consentChoice) {
      // Afficher la bannière après un court délai
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
    onAccept();
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setIsVisible(false);
    onDecline();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700 animate-slideDown">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="flex items-start mb-4 md:mb-0 md:mr-8">
            <div className="flex-shrink-0 mr-3">
              <Info className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-base font-medium text-gray-900 dark:text-white">
                Nous utilisons des cookies
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                Ce site utilise des cookies pour améliorer votre expérience et analyser le trafic. 
                {!showDetails && (
                  <button 
                    onClick={() => setShowDetails(true)}
                    className="ml-1 text-primary hover:underline focus:outline-none"
                  >
                    En savoir plus
                  </button>
                )}
              </p>
              
              {showDetails && (
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  <p className="mb-2">Nous utilisons différents types de cookies :</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Cookies essentiels : nécessaires au fonctionnement du site</li>
                    <li>Cookies analytiques : pour comprendre comment vous utilisez notre site</li>
                    <li>Cookies de préférences : pour mémoriser vos choix et paramètres</li>
                  </ul>
                  <p className="mt-2">
                    Pour plus d'informations, consultez notre{' '}
                    <Link to="/privacy" className="text-primary hover:underline">
                      politique de confidentialité
                    </Link>.
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleDecline}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              Refuser
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors flex items-center"
            >
              <Check className="w-4 h-4 mr-1" />
              Accepter
            </button>
            {showDetails && (
              <button
                onClick={() => setShowDetails(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Réduire
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;