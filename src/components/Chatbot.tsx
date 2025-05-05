import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useErrorBoundary } from '../hooks/useErrorBoundary';

interface Message {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: 'Bonjour ! Je suis l\'assistant virtuel de MBC. Comment puis-je vous aider aujourd\'hui ?'
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { handleError } = useErrorBoundary();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (user) {
      loadChatHistory();
    }
  }, [user]);

  const loadChatHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('historique_messages')
        .select('*')
        .eq('type', 'chatbot')
        .order('date_envoi', { ascending: true })
        .limit(50);

      if (error) throw error;

      if (data && data.length > 0) {
        const formattedMessages = data.map(msg => ({
          id: msg.id,
          role: msg.role as 'user' | 'assistant',
          content: msg.contenu,
          timestamp: msg.date_envoi
        }));
        setMessages(formattedMessages);
      }
    } catch (error) {
      handleError(error as Error, 'Chatbot.loadChatHistory');
      setMessages([{
        role: 'assistant',
        content: 'Désolé, je ne peux pas charger l\'historique des messages pour le moment.'
      }]);
    }
  };

  const saveMessage = async (message: Message) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('historique_messages')
        .insert([{
          client_id: user.id,
          contenu: message.content,
          type: 'chatbot',
          role: message.role
        }]);

      if (error) throw error;
    } catch (error) {
      handleError(error as Error, 'Chatbot.saveMessage');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    const newUserMessage = { role: 'user' as const, content: userMessage };
    setMessages(prev => [...prev, newUserMessage]);
    await saveMessage(newUserMessage);
    
    setIsLoading(true);

    try {
      // Simuler une réponse si l'API n'est pas configurée
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const simulatedResponses = [
          "Je comprends votre question. Pour plus d'informations sur nos services comptables, je vous invite à consulter notre page Services ou à prendre rendez-vous avec un expert.",
          "Merci pour votre question. MBC Consulting propose une expertise comptable spécialisée pour les entrepreneurs franco-maghrébins. N'hésitez pas à nous contacter pour plus de détails.",
          "Excellente question ! Nos experts-comptables sont disponibles pour vous accompagner dans vos démarches. Vous pouvez prendre rendez-vous via notre calendrier en ligne.",
          "Pour répondre précisément à votre demande, je vous recommande de contacter directement notre équipe ou de remplir notre formulaire de diagnostic rapide."
        ];
        
        const randomResponse = simulatedResponses[Math.floor(Math.random() * simulatedResponses.length)];
        
        const assistantMessage = { 
          role: 'assistant' as const, 
          content: randomResponse
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        await saveMessage(assistantMessage);
        setRetryCount(0);
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ message: userMessage })
      });

      if (!response.ok) throw new Error('Erreur réseau');

      const data = await response.json();
      const assistantMessage = { 
        role: 'assistant' as const, 
        content: data.message 
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      await saveMessage(assistantMessage);
      setRetryCount(0);
    } catch (error) {
      handleError(error as Error, 'Chatbot.handleSubmit');
      
      // Gestion des retries
      if (retryCount < 2) {
        setRetryCount(prev => prev + 1);
        const retryMessage = { 
          role: 'assistant' as const, 
          content: "Désolé, je rencontre des difficultés techniques. Je réessaie..." 
        };
        setMessages(prev => [...prev, retryMessage]);
        setTimeout(() => handleSubmit(e), 2000);
      } else {
        const fallbackMessage = { 
          role: 'assistant' as const, 
          content: "Je suis désolé, je rencontre des difficultés techniques. Je vous invite à nous contacter directement ou à prendre rendez-vous pour un échange personnalisé." 
        };
        setMessages(prev => [...prev, fallbackMessage]);
        setRetryCount(0);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Suggestions de questions prédéfinies
  const suggestions = [
    "Quels sont vos services pour les entrepreneurs franco-maghrébins ?",
    "Comment fonctionne votre accompagnement fiscal international ?",
    "Quels sont vos tarifs pour la comptabilité d'une SASU ?",
    "Comment prendre rendez-vous avec un expert-comptable ?"
  ];

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 bg-white rounded-lg shadow-xl">
          <div className="p-4 border-b flex justify-between items-center bg-primary text-white rounded-t-lg">
            <h3 className="font-semibold">Assistant MBC</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
              aria-label="Fermer le chat"
            >
              <X size={20} />
            </button>
          </div>

          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={message.id || index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {message.timestamp && (
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 rounded-lg p-3">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions de questions */}
          {messages.length <= 2 && !isLoading && (
            <div className="px-4 py-2 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-2">Questions fréquentes :</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setInput(suggestion);
                      // Soumettre automatiquement après un court délai
                      setTimeout(() => {
                        const event = new Event('submit', { bubbles: true });
                        document.getElementById('chatbot-form')?.dispatchEvent(event);
                      }, 500);
                    }}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-1 rounded-full transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form id="chatbot-form" onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Posez votre question..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Envoyer"
              >
                <Send size={20} />
              </button>
            </div>
          </form>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary-dark transition-colors"
        aria-label="Chat avec l'assistant"
      >
        <MessageCircle size={24} />
      </button>
    </>
  );
};

export default Chatbot;