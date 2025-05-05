import React, { useState, useEffect } from 'react';
import MessageList from './MessageList';
import MessageComposer from './MessageComposer';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const MessagingSystem: React.FC = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Mettre à jour les messages non lus comme lus quand l'utilisateur ouvre la messagerie
      const updateUnreadMessages = async () => {
        await supabase
          .from('historique_messages')
          .update({ lu: true })
          .eq('client_id', user.id)
          .eq('lu', false)
          .eq('type', 'espace_client');
      };

      updateUnreadMessages();
    }
  }, [user]);

  const handleMessageSent = () => {
    // Déclencher un rafraîchissement de la liste des messages
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Messagerie
      </h2>
      
      <div className="space-y-6">
        <MessageList key={refreshTrigger} />
        <MessageComposer onMessageSent={handleMessageSent} />
      </div>
    </div>
  );
};

export default MessagingSystem;