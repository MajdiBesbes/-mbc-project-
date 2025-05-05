import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { MessageCircle, User, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  contenu: string;
  date_envoi: string;
  lu: boolean;
  role?: 'client' | 'expert';
}

const MessageList: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchMessages();
    }
  }, [user]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('historique_messages')
        .select('*')
        .eq('type', 'espace_client')
        .order('date_envoi', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Ajouter un rôle fictif pour la démo (à remplacer par la vraie logique)
      const messagesWithRoles = data?.map((msg, index) => ({
        ...msg,
        role: index % 2 === 0 ? 'client' : 'expert' as 'client' | 'expert'
      })) || [];

      setMessages(messagesWithRoles);
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('historique_messages')
        .update({ lu: true })
        .eq('id', messageId);

      if (error) throw error;

      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, lu: true } : msg
        )
      );
    } catch (error) {
      console.error('Erreur lors du marquage du message comme lu:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <MessageCircle className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Aucun message
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Vous n'avez pas encore de messages. Commencez une conversation avec votre expert-comptable.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div 
          key={message.id}
          className={`p-4 rounded-lg ${
            message.role === 'client'
              ? 'bg-primary/10 ml-12'
              : 'bg-gray-100 dark:bg-gray-700 mr-12'
          } ${!message.lu && message.role === 'expert' ? 'border-l-4 border-primary' : ''}`}
          onClick={() => !message.lu && message.role === 'expert' && markAsRead(message.id)}
        >
          <div className="flex items-center mb-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              message.role === 'client'
                ? 'bg-primary text-white'
                : 'bg-gray-600 text-white'
            }`}>
              <User className="w-4 h-4" />
            </div>
            <div className="ml-2">
              <p className="font-medium text-gray-900 dark:text-white">
                {message.role === 'client' ? 'Vous' : 'Expert MBC'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {format(new Date(message.date_envoi), 'dd MMMM yyyy à HH:mm', { locale: fr })}
              </p>
            </div>
            {!message.lu && message.role === 'expert' && (
              <span className="ml-auto px-2 py-1 bg-primary text-white text-xs rounded-full">
                Nouveau
              </span>
            )}
          </div>
          <div className="pl-10">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {message.contenu}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;