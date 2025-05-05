import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';
import NotificationsManager from './NotificationsManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/Tabs';
import NotificationPreferences from './NotificationPreferences';

interface UserPreferences {
  email_frequency: 'daily' | 'weekly' | 'monthly' | 'never';
  notifications_enabled: boolean;
}

const UserPreferences: React.FC = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>({
    email_frequency: 'weekly',
    notifications_enabled: false
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      loadPreferences();
    }
  }, [user]);

  const loadPreferences = async () => {
    try {
      const { data } = await supabase
        .from('user_preferences')
        .select('email_frequency, notifications_enabled')
        .eq('user_id', user?.id)
        .single();

      if (data) {
        setPreferences(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des préférences:', error);
    }
  };

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          ...preferences,
          ...updates
        });

      if (error) throw error;

      setPreferences(prev => ({ ...prev, ...updates }));
      setMessage('Préférences mises à jour avec succès');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Erreur lors de la mise à jour des préférences:', error);
      setMessage('Erreur lors de la mise à jour des préférences');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Tabs defaultValue="general">
        <TabsList className="mb-6">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Thème</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Personnalisez l'apparence de l'interface
            </p>
            <ThemeToggle />
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Notifications</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Gérez vos préférences de notifications
            </p>
            <NotificationsManager />
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Fréquence des emails</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Choisissez la fréquence de réception des emails récapitulatifs
            </p>
            <select
              value={preferences.email_frequency}
              onChange={(e) => updatePreferences({ 
                email_frequency: e.target.value as UserPreferences['email_frequency'] 
              })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              disabled={loading}
            >
              <option value="daily">Quotidien</option>
              <option value="weekly">Hebdomadaire</option>
              <option value="monthly">Mensuel</option>
              <option value="never">Jamais</option>
            </select>
          </div>

          {message && (
            <div className={`p-4 rounded-md ${
              message.includes('Erreur') 
                ? 'bg-red-50 text-red-800 dark:bg-red-900 dark:text-red-100' 
                : 'bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-100'
            }`}>
              {message}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="notifications">
          <NotificationPreferences />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserPreferences;