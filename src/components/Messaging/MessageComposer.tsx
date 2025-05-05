import React, { useState } from 'react';
import { Send, PaperclipIcon, X, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface MessageComposerProps {
  onMessageSent?: () => void;
}

const MessageComposer: React.FC<MessageComposerProps> = ({ onMessageSent }) => {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [sending, setSending] = useState(false);
  const { user } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && files.length === 0) return;
    if (!user) return;

    setSending(true);
    try {
      // Télécharger les fichiers si présents
      let attachments: string[] = [];
      
      if (files.length > 0) {
        for (const file of files) {
          const fileName = `${Date.now()}-${file.name}`;
          const filePath = `messages/${user.id}/${fileName}`;
          
          const { error: uploadError } = await supabase.storage
            .from('documents')
            .upload(filePath, file);
            
          if (uploadError) throw uploadError;
          
          attachments.push(filePath);
        }
      }
      
      // Envoyer le message
      const { error } = await supabase
        .from('historique_messages')
        .insert({
          client_id: user.id,
          contenu: message,
          type: 'espace_client',
          attachments: attachments.length > 0 ? attachments : null
        });
        
      if (error) throw error;
      
      // Réinitialiser le formulaire
      setMessage('');
      setFiles([]);
      
      // Notifier le parent
      if (onMessageSent) {
        onMessageSent();
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      alert('Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <form onSubmit={handleSubmit}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Écrivez votre message ici..."
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
          rows={4}
          disabled={sending}
        />
        
        {files.length > 0 && (
          <div className="mt-2 space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded">
                <span className="text-sm text-gray-600 dark:text-gray-300 truncate">
                  {file.name} ({(file.size / 1024).toFixed(0)} KB)
                </span>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                  disabled={sending}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex justify-between items-center mt-4">
          <label className="cursor-pointer text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-white transition-colors">
            <PaperclipIcon className="w-5 h-5 inline-block" />
            <span className="ml-1">Joindre un fichier</span>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
              disabled={sending}
            />
          </label>
          
          <button
            type="submit"
            disabled={sending || (!message.trim() && files.length === 0)}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-colors disabled:opacity-50 flex items-center"
          >
            {sending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Envoi...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Envoyer
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageComposer;