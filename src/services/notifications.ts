import { supabase } from '../lib/supabase';

export const notificationService = {
  async sendNotification(title: string, options: NotificationOptions = {}) {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    try {
      const notification = new Notification(title, {
        icon: '/images/logo.png',
        badge: '/images/logo.png',
        ...options
      });

      notification.onclick = function(event) {
        event.preventDefault();
        window.focus();
        notification.close();
      };

      // Enregistrer la notification dans Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('notifications').insert({
          user_id: user.id,
          title,
          message: options.body || '',
          type: 'info'
        });
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la notification:', error);
    }
  },

  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      throw new Error('Les notifications ne sont pas supportées');
    }

    return await Notification.requestPermission();
  }
};