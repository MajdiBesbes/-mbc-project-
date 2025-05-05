import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Bell, Mail, Globe, AlertCircle, Loader2 } from 'lucide-react';

interface NotificationType {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  priority: number;
}

interface NotificationPreference {
  id?: string;
  user_id: string;
  type_id: string;
  email_enabled: boolean;
  push_enabled: boolean;
  in_app_enabled: boolean;
}

const NotificationPreferences: React.FC = () => {
  const [types, setTypes] = useState<NotificationType[]>([]);
  const [preferences, setPreferences] = useState<Record<string, NotificationPreference>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Charger les types de notifications
      const { data: typesData, error: typesError } = await supabase
        .from('notification_types')
        .select('*')
        .order('priority', { ascending: false });

      if (typesError) throw typesError;
      setTypes(typesData || []);

      // Charger les préférences de l'utilisateur
      const { data: prefsData, error: prefsError } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user?.id);

      if (prefsError) throw prefsError;

      // Créer un objet de préférences indexé par type_id
      const prefsMap: Record<string, NotificationPreference> = {};
      prefsData?.forEach(pref => {
        prefsMap[pref.type_id] = pref;
      });
      
      setPreferences(prefsMap);
    } catch (error) {
      console.error('Erreur lors du chargement des préférences:', error);
      setMessage({
        text: 'Erreur lors du chargement des préférences. Veuillez réessayer.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = async (typeId: string, field: keyof NotificationPreference, value: boolean) => {
    if (!user) return;

    // Mettre à jour l'état local immédiatement pour une UI réactive
    setPreferences(prev => {
      const currentPref = prev[typeId] || {
        user_id: user.id,
        type_id: typeId,
        email_enabled: true,
        push_enabled: true,
        in_app_enabled: true
      };
      
      return {
        ...prev,
        [typeId]: {
          ...currentPref,
          [field]: value
        }
      };
    });

    // Pas besoin de sauvegarder immédiatement chaque changement
  };

  const saveAllPreferences = async () => {
    if (!user) return;
    
    setSaving(true);
    setMessage(null);
    
    try {
      // Convertir l'objet de préférences en tableau
      const prefsArray = Object.values(preferences);
      
      // Utiliser upsert pour créer ou mettre à jour les préférences
      const { error } = await supabase
        .from('notification_preferences')
        .upsert(prefsArray, { 
          onConflict: 'user_id,type_id',
          ignoreDuplicates: false 
        });

      if (error) throw error;
      
      setMessage({
        text: 'Préférences de notifications enregistrées avec succès',
        type: 'success'
      });
      
      // Recharger les données pour s'assurer que tout est à jour
      await loadData();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des préférences:', error);
      setMessage({
        text: 'Erreur lors de la sauvegarde des préférences. Veuillez réessayer.',
        type: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const getDefaultPreference = (typeId: string): NotificationPreference => {
    return {
      user_id: user?.id || '',
      type_id: typeId,
      email_enabled: true,
      push_enabled: true,
      in_app_enabled: true
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Préférences de notifications
        </h2>
        <button
          onClick={saveAllPreferences}
          disabled={saving}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-colors disabled:opacity-50 flex items-center"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Enregistrement...
            </>
          ) : (
            'Enregistrer'
          )}
        </button>
      </div>

      {message && (
        <div className={`p-4 mb-6 rounded-md ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-100' 
            : 'bg-red-50 text-red-800 dark:bg-red-900 dark:text-red-100'
        }`}>
          {message.text}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Type de notification
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                <div className="flex items-center justify-center">
                  <Mail className="w-4 h-4 mr-1" />
                  <span>Email</span>
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                <div className="flex items-center justify-center">
                  <Bell className="w-4 h-4 mr-1" />
                  <span>Push</span>
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                <div className="flex items-center justify-center">
                  <Globe className="w-4 h-4 mr-1" />
                  <span>Application</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {types.map((type) => {
              const pref = preferences[type.id] || getDefaultPreference(type.id);
              return (
                <tr key={type.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full mr-3 ${
                        type.color === 'blue' ? 'bg-blue-100 text-blue-500 dark:bg-blue-900 dark:text-blue-300' :
                        type.color === 'green' ? 'bg-green-100 text-green-500 dark:bg-green-900 dark:text-green-300' :
                        type.color === 'orange' ? 'bg-orange-100 text-orange-500 dark:bg-orange-900 dark:text-orange-300' :
                        type.color === 'red' ? 'bg-red-100 text-red-500 dark:bg-red-900 dark:text-red-300' :
                        'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {type.icon === 'file-text' ? <FileText className="w-5 h-5" /> :
                         type.icon === 'calendar' ? <Calendar className="w-5 h-5" /> :
                         type.icon === 'message-circle' ? <MessageCircle className="w-5 h-5" /> :
                         type.icon === 'alert-circle' ? <AlertCircle className="w-5 h-5" /> :
                         type.icon === 'info' ? <Info className="w-5 h-5" /> :
                         type.icon === 'check-circle' ? <Check className="w-5 h-5" /> :
                         <Bell className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {type.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {type.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={pref.email_enabled}
                        onChange={(e) => updatePreference(type.id, 'email_enabled', e.target.checked)}
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={pref.push_enabled}
                        onChange={(e) => updatePreference(type.id, 'push_enabled', e.target.checked)}
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={pref.in_app_enabled}
                        onChange={(e) => updatePreference(type.id, 'in_app_enabled', e.target.checked)}
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NotificationPreferences;