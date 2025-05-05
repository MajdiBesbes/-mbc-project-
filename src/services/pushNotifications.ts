import { supabase } from '../lib/supabase';

export const pushService = {
  async subscribe(subscription: PushSubscription) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          notifications_enabled: true,
          push_subscription: subscription
        });

      if (error) throw error;
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la souscription:', error);
      throw error;
    }
  },

  async unsubscribe() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('user_preferences')
        .update({
          notifications_enabled: false,
          push_subscription: null
        })
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Erreur lors de la désinscription:', error);
      throw error;
    }
  }
};