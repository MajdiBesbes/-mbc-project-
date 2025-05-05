import { createClient } from 'npm:@supabase/supabase-js@2.39.7';
import webPush from 'npm:web-push@3.6.7';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

const VAPID_PUBLIC_KEY = Deno.env.get('VAPID_PUBLIC_KEY')!;
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY')!;

webPush.setVapidDetails(
  'mailto:majdi.besbes@gmail.com',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationPayload {
  userId: string;
  typeId: string;
  title?: string;
  message?: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
  expiresAt?: string;
}

Deno.serve(async (req) => {
  // Gérer les requêtes CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    // Vérifier l'authentification
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const payload: NotificationPayload = await req.json();
    const { userId, typeId, title, message, actionUrl, metadata, expiresAt } = payload;

    if (!userId || !typeId) {
      return new Response(
        JSON.stringify({ error: 'userId et typeId sont requis' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Vérifier si l'utilisateur a activé les notifications pour ce type
    const { data: preferences, error: prefError } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .eq('type_id', typeId)
      .single();

    // Si aucune préférence n'est trouvée, on utilise les valeurs par défaut (tout activé)
    const shouldSendInApp = !preferences || preferences.in_app_enabled !== false;
    const shouldSendPush = !preferences || preferences.push_enabled !== false;

    // Récupérer le modèle de notification
    const { data: template, error: templateError } = await supabase
      .from('notification_templates')
      .select('*')
      .eq('type_id', typeId)
      .single();

    if (templateError && templateError.code !== 'PGRST116') {
      throw templateError;
    }

    // Préparer le contenu de la notification
    let notificationTitle = title;
    let notificationMessage = message;
    let notificationActionUrl = actionUrl;

    // Si un modèle existe, l'utiliser pour formater le contenu
    if (template) {
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
      if (metadata) {
        Object.entries(metadata).forEach(([key, value]) => {
          const regex = new RegExp(`{{${key}}}`, 'g');
          if (notificationTitle) notificationTitle = notificationTitle.replace(regex, String(value));
          if (notificationMessage) notificationMessage = notificationMessage.replace(regex, String(value));
          if (notificationActionUrl) notificationActionUrl = notificationActionUrl.replace(regex, String(value));
        });
      }
    }

    // Créer la notification dans la base de données si in_app est activé
    if (shouldSendInApp) {
      const { data: notificationType, error: typeError } = await supabase
        .from('notification_types')
        .select('*')
        .eq('id', typeId)
        .single();

      if (typeError) throw typeError;

      const { data: notification, error: notifError } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          title: notificationTitle,
          message: notificationMessage,
          type: notificationType?.color === 'green' ? 'success' : 
                notificationType?.color === 'red' ? 'error' :
                notificationType?.color === 'orange' ? 'warning' : 'info',
          type_id: typeId,
          action_url: notificationActionUrl,
          metadata: metadata || {},
          expires_at: expiresAt
        })
        .select()
        .single();

      if (notifError) throw notifError;
    }

    // Envoyer une notification push si activé
    if (shouldSendPush) {
      try {
        const { data: userPrefs, error: userPrefsError } = await supabase
          .from('user_preferences')
          .select('push_subscription')
          .eq('user_id', userId)
          .single();

        if (userPrefsError) {
          console.error('Erreur lors de la récupération des préférences push:', userPrefsError);
        } else if (userPrefs?.push_subscription) {
          await webPush.sendNotification(
            userPrefs.push_subscription,
            JSON.stringify({
              title: notificationTitle,
              body: notificationMessage,
              icon: '/images/logo.png',
              badge: '/images/logo.png',
              data: {
                url: notificationActionUrl
              }
            })
          );
        }
      } catch (pushError) {
        console.error('Erreur lors de l\'envoi de la notification push:', pushError);
        // On continue même si l'envoi de la notification push échoue
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la notification:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Une erreur est survenue' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});