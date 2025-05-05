import React from 'react';
import TawkMessengerReact from '@tawk.to/tawk-messenger-react';

declare global {
  interface Window {
    Tawk_API?: {
      setLanguage?: (lang: string) => void;
    };
  }
}

const ChatWidget: React.FC = () => {
  const onLoad = () => {
    // Attendre que l'API Tawk soit complètement chargée
    const checkAndSetLanguage = () => {
      if (window.Tawk_API && window.Tawk_API.setLanguage) {
        window.Tawk_API.setLanguage('fr');
      } else {
        setTimeout(checkAndSetLanguage, 100);
      }
    };

    checkAndSetLanguage();
  };

  return (
    <TawkMessengerReact
      propertyId="6813b448ce1acc190d04c899"
      widgetId="1iq6fgf0f"
      customStyle={{
        zIndex: 1000
      }}
      onLoad={onLoad}
    />
  );
};

export default ChatWidget;