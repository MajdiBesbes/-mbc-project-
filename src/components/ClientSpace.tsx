import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FileUp, File, Trash2, Settings, Bell } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import UserPreferences from '../components/UserPreferences';
import EmailVerification from '../components/EmailVerification';
import NotificationPreferences from '../components/NotificationPreferences';
import { notificationService } from '../services/notificationService';

interface Document {
  id: string;
  nom: string;
  type: string;
  date_depot: string;
  statut: string;
}

const ClientSpace: React.FC = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'documents' | 'preferences' | 'notifications'>('documents');

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleFileDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/zip': ['.zip']
    },
    maxSize: 10485760 // 10MB
  });

  useEffect(() => {
    fetchDocuments();
  }, [user]);

  async function fetchDocuments() {
    try {
      const { data, error } = await supabase
        .from('dossiers')
        .select('*')
        .order('date_depot', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des documents:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleFileDrop(acceptedFiles: File[]) {
    if (!user) return;
    
    setUploading(true);
    try {
      for (const file of acceptedFiles) {
        const fileName = `${Date.now()}-${file.name}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { error: dbError } = await supabase
          .from('dossiers')
          .insert([{
            nom: file.name,
            type: file.type,
            fichier_url: filePath,
            client_id: user.id
          }]);

        if (dbError) throw dbError;
        
        // Envoyer une notification de document téléchargé
        const { data: notificationTypes } = await supabase
          .from('notification_types')
          .select('id')
          .eq('code', 'document_uploaded')
          .single();
          
        if (notificationTypes?.id) {
          await notificationService.sendNotification({
            userId: user.id,
            typeId: notificationTypes.id,
            metadata: {
              document_name: file.name,
              document_id: filePath
            }
          });
        }
      }

      fetchDocuments();
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
    } finally {
      setUploading(false);
    }
  }

  async function deleteDocument(docId: string) {
    if (!user) return;
    
    try {
      // Récupérer le document pour obtenir le chemin du fichier
      const { data: document, error: fetchError } = await supabase
        .from('dossiers')
        .select('*')
        .eq('id', docId)
        .single();
        
      if (fetchError) throw fetchError;
      
      // Supprimer l'entrée de la base de données
      const { error: deleteError } = await supabase
        .from('dossiers')
        .delete()
        .eq('id', docId);
        
      if (deleteError) throw deleteError;
      
      // Supprimer le fichier du stockage
      if (document.fichier_url) {
        const { error: storageError } = await supabase.storage
          .from('documents')
          .remove([document.fichier_url]);
          
        if (storageError) throw storageError;
      }
      
      // Mettre à jour la liste des documents
      setDocuments(prev => prev.filter(doc => doc.id !== docId));
      
    } catch (error) {
      console.error('Erreur lors de la suppression du document:', error);
    }
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Espace Client</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('documents')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'documents' 
                  ? 'bg-primary text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <File className="w-5 h-5 inline mr-2" />
              Documents
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'preferences' 
                  ? 'bg-primary text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <Settings className="w-5 h-5 inline mr-2" />
              Préférences
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'notifications' 
                  ? 'bg-primary text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <Bell className="w-5 h-5 inline mr-2" />
              Notifications
            </button>
          </div>
        </div>

        <EmailVerification />

        {activeTab === 'preferences' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <UserPreferences />
          </div>
        )}
        
        {activeTab === 'notifications' && (
          <NotificationPreferences />
        )}
        
        {activeTab === 'documents' && (
          <>
            {/* Zone de dépôt de fichiers */}
            <div className="mb-8">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <input {...getInputProps()} disabled={uploading} />
                <FileUp className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  {uploading ? 'Téléchargement en cours...' : 'Glissez-déposez vos fichiers ici ou cliquez pour sélectionner'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  PDF, Word ou ZIP (max. 10 Mo)
                </p>
              </div>
            </div>

            {/* Liste des documents */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Mes documents
                </h2>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700">
                {loading ? (
                  <div className="flex justify-center items-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : documents.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    <File className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                    <p>Vous n'avez pas encore de documents</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {documents.map((doc) => (
                      <li key={doc.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <File className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {doc.nom}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Déposé le {format(new Date(doc.date_depot), 'dd MMMM yyyy', { locale: fr })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              doc.statut === 'nouveau' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                              doc.statut === 'en_traitement' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                              'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            }`}>
                              {doc.statut === 'nouveau' ? 'Nouveau' :
                               doc.statut === 'en_traitement' ? 'En traitement' :
                               'Traité'}
                            </span>
                            <button
                              onClick={() => deleteDocument(doc.id)}
                              className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ClientSpace;