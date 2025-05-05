import { supabase } from '../lib/supabase';

interface NotificationPayload {
  userId: string;
  typeId: string;
  title?: string;
  message?: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
  expiresAt?: string;
}

export const notificationService = {
  /**
   * Envoie une notification à un utilisateur
   */
  async sendNotification(payload: NotificationPayload): Promise<boolean> {
    try {
      // Vérifier si l'utilisateur existe
      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(payload.userId);
      if (userError || !userData.user) {
        console.error('Utilisateur non trouvé:', userError);
        return false;
      }

      // Vérifier si le type de notification existe
      const { data: typeData, error: typeError } = await supabase
        .from('notification_types')
        .select('*')
        .eq('id', payload.typeId)
        .single();

      if (typeError) {
        console.error('Type de notification non trouvé:', typeError);
        return false;
      }

      // Récupérer le modèle de notification
      const { data: template, error: templateError } = await supabase
        .from('notification_templates')
        .select('*')
        .eq('type_id', payload.typeId)
        .single();

      // Préparer le contenu de la notification
      let notificationTitle = payload.title;
      let notificationMessage = payload.message;
      let notificationActionUrl = payload.actionUrl;

      // Si un modèle existe, l'utiliser pour formater le contenu
      if (!templateError && template) {
        if (!notificationTitle && template.title_template) {
          notificationTitle = template.title_template;
        }
        
        if (!notificationMessage && template.message_template) {
          notificationMessage = template.message_template;
        }
        
        if (!notificationActionUrl && template.action_url_template) {
          notificationActionUrl = template.action_url_template;
        }

        // Remplacer les variables dans les templates
        if (payload.metadata) {
          Object.entries(payload.metadata).forEach(([key, value]) => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            if (notificationTitle) notificationTitle = notificationTitle.replace(regex, String(value));
            if (notificationMessage) notificationMessage = notificationMessage.replace(regex, String(value));
            if (notificationActionUrl) notificationActionUrl = notificationActionUrl.replace(regex, String(value));
          });
        }
      }

      // Vérifier les préférences de notification de l'utilisateur
      const { data: preferences, error: prefError } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', payload.userId)
        .eq('type_id', payload.typeId)
        .single();

      // Si aucune préférence n'est trouvée, on utilise les valeurs par défaut (tout activé)
      const shouldSendInApp = !preferences || preferences.in_app_enabled !== false;

      if (!shouldSendInApp) {
        return true; // L'utilisateur a désactivé ce type de notification
      }

      // Créer la notification dans la base de données
      const { error: notifError } = await supabase
        .from('notifications')
        .insert({
          user_id: payload.userId,
          title: notificationTitle || typeData.name,
          message: notificationMessage || '',
          type: typeData.color === 'green' ? 'success' : 
                typeData.color === 'red' ? 'error' :
                typeData.color === 'orange' ? 'warning' : 'info',
          type_id: payload.typeId,
          action_url: notificationActionUrl,
          metadata: payload.metadata || {},
          expires_at: payload.expiresAt
        });

      if (notifError) {
        console.error('Erreur lors de la création de la notification:', notifError);
        return false;
      }

      // Essayer d'envoyer une notification push si configuré
      try {
        const { data: userPrefs } = await supabase
          .from('user_preferences')
          .select('push_subscription, notifications_enabled')
          .eq('user_id', payload.userId)
          .single();

        if (userPrefs?.notifications_enabled && userPrefs?.push_subscription) {
          // Ici, on pourrait appeler l'Edge Function pour envoyer la notification push
          // Mais on le simule pour l'instant
          console.log('Notification push envoyée à', payload.userId);
        }
      } catch (pushError) {
        console.error('Erreur lors de l\'envoi de la notification push:', pushError);
        // On continue même si l'envoi de la notification push échoue
      }

      return true;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la notification:', error);
      return false;
    }
  },

  /**
   * Récupère les notifications non lues d'un utilisateur
   */
  async getUnreadNotifications(userId: string, limit = 10): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .eq('read', false)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications non lues:', error);
      return [];
    }
  },

  /**
   * Marque une notification comme lue
   */
  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erreur lors du marquage de la notification comme lue:', error);
      return false;
    }
  },

  /**
   * Marque toutes les notifications d'un utilisateur comme lues
   */
  async markAllAsRead(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erreur lors du marquage de toutes les notifications comme lues:', error);
      return false;
    }
  },

  /**
   * Supprime une notification
   */
  async deleteNotification(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de la notification:', error);
      return false;
    }
  },

  /**
   * Supprime toutes les notifications lues d'un utilisateur
   */
  async deleteAllReadNotifications(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', userId)
        .eq('read', true);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression des notifications lues:', error);
      return false;
    }
  },

  /**
   * Supprime les notifications expirées
   */
  async cleanupExpiredNotifications(): Promise<boolean> {
    try {
      const now = new Date().toISOString();
      const { error } = await supabase
        .from('notifications')
        .delete()
        .lt('expires_at', now)
        .not('expires_at', 'is', null);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erreur lors du nettoyage des notifications expirées:', error);
      return false;
    }
  }
};