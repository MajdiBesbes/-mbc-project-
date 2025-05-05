import React, { useState } from 'react';
import { MessageCircle, X, Phone } from 'lucide-react';

const WhatsAppButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const phoneNumber = '33676570097';
  const message = 'Bonjour, je souhaite prendre contact avec un expert-comptable.';
  
  return (
    <>
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 bg-white rounded-lg shadow-xl w-[350px]">
          <div className="p-4 border-b flex justify-between items-center bg-green-500 text-white rounded-t-lg">
            <h3 className="font-semibold">WhatsApp</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
              aria-label="Fermer"
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-4 space-y-3">
            <p className="text-gray-700 mb-4">
              Discutez avec nous sur WhatsApp pour une réponse rapide à vos questions comptables et fiscales.
            </p>
            <a
              href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-green-500 text-white text-center py-3 rounded-lg hover:bg-green-600 transition-colors"
            >
              <MessageCircle className="inline-block w-5 h-5 mr-2" />
              Démarrer une conversation
            </a>
            <a
              href={`tel:${phoneNumber}`}
              className="block w-full bg-green-500 text-white text-center py-3 rounded-lg hover:bg-green-600 transition-colors"
            >
              <Phone className="inline-block w-5 h-5 mr-2" />
              Appeler directement
            </a>
          </div>
        </div>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-6 z-40 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors"
        aria-label="Contacter sur WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    </>
  );
};

export default WhatsAppButton;