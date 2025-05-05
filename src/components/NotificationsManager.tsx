import React, { useEffect, useState } from 'react';
import { Bell, BellOff } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { pushService } from '../services/pushNotifications';

const NotificationsManager: React.FC = () => {
  const [permission, setPermission] = useState(Notification.permission);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const handleSubscription = async () => {
    if (!('Notification' in window)) {
      alert('Votre navigateur ne supporte pas les notifications.');
      return;
    }

    setLoading(true);
    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === 'granted') {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY
        });

        await pushService.subscribe(subscription);
      }
    } catch (error) {
      console.error('Erreur lors de l\'activation des notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!('Notification' in window)) return null;

  return (
    <button
      onClick={handleSubscription}
      disabled={loading || permission === 'denied'}
      className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
        permission === 'granted'
          ? 'bg-green-100 text-green-800'
          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
      }`}
    >
      {permission === 'granted' ? (
        <>
          <Bell className="w-5 h-5" />
          <span>Notifications activées</span>
        </>
      ) : (
        <>
          <BellOff className="w-5 h-5" />
          <span>Activer les notifications</span>
        </>
      )}
    </button>
  );
};

export default NotificationsManager;