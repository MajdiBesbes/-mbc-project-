/*
  # Amélioration du système de notifications
  
  1. Nouvelles Tables
    - `notification_types` : Types de notifications configurables
    - `notification_templates` : Modèles de messages pour chaque type
    - `notification_preferences` : Préférences utilisateur par type de notification
    
  2. Modifications
    - Ajout de champs à la table `notifications` existante
    
  3. Sécurité
    - Activation RLS sur toutes les tables
    - Politiques d'accès appropriées
*/

-- Table des types de notifications
CREATE TABLE IF NOT EXISTS notification_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  icon text,
  color text,
  priority smallint DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- Table des modèles de notifications
CREATE TABLE IF NOT EXISTS notification_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type_id uuid REFERENCES notification_types(id) ON DELETE CASCADE,
  title_template text NOT NULL,
  message_template text NOT NULL,
  action_url_template text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des préférences de notifications
CREATE TABLE IF NOT EXISTS notification_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  type_id uuid REFERENCES notification_types(id) ON DELETE CASCADE,
  email_enabled boolean DEFAULT true,
  push_enabled boolean DEFAULT true,
  in_app_enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, type_id)
);

-- Ajout de champs à la table notifications existante
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS type_id uuid REFERENCES notification_types(id);
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS action_url text;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS expires_at timestamptz;

-- Trigger pour mettre à jour le timestamp updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Ajout du trigger sur notification_templates
CREATE TRIGGER update_notification_templates_updated_at
  BEFORE UPDATE ON notification_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Ajout du trigger sur notification_preferences
CREATE TRIGGER update_notification_preferences_updated_at
  BEFORE UPDATE ON notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Activation RLS
ALTER TABLE notification_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour notification_types
CREATE POLICY "Les admins peuvent tout gérer sur notification_types"
  ON notification_types
  FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'role'::text) = 'admin'::text);

CREATE POLICY "Tous les utilisateurs peuvent voir les types de notifications"
  ON notification_types
  FOR SELECT
  TO authenticated
  USING (true);

-- Politiques RLS pour notification_templates
CREATE POLICY "Les admins peuvent tout gérer sur notification_templates"
  ON notification_templates
  FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'role'::text) = 'admin'::text);

CREATE POLICY "Tous les utilisateurs peuvent voir les modèles de notifications"
  ON notification_templates
  FOR SELECT
  TO authenticated
  USING (true);

-- Politiques RLS pour notification_preferences
CREATE POLICY "Les utilisateurs peuvent gérer leurs préférences de notifications"
  ON notification_preferences
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Insertion des types de notifications par défaut
INSERT INTO notification_types (code, name, description, icon, color, priority)
VALUES
  ('document_uploaded', 'Document téléchargé', 'Notification lorsqu''un document est téléchargé', 'file-text', 'blue', 2),
  ('document_processed', 'Document traité', 'Notification lorsqu''un document a été traité', 'check-circle', 'green', 2),
  ('appointment_reminder', 'Rappel de rendez-vous', 'Rappel pour un rendez-vous à venir', 'calendar', 'orange', 3),
  ('appointment_confirmed', 'Rendez-vous confirmé', 'Confirmation d''un rendez-vous', 'calendar-check', 'green', 2),
  ('message_received', 'Message reçu', 'Notification de réception d''un message', 'message-circle', 'blue', 3),
  ('deadline_reminder', 'Rappel d''échéance', 'Rappel pour une échéance fiscale ou administrative', 'alert-circle', 'red', 4),
  ('system_update', 'Mise à jour système', 'Information sur une mise à jour du système', 'info', 'gray', 1)
ON CONFLICT (code) DO NOTHING;

-- Insertion des modèles de notifications par défaut
INSERT INTO notification_templates (type_id, title_template, message_template, action_url_template)
SELECT 
  id,
  CASE 
    WHEN code = 'document_uploaded' THEN 'Nouveau document'
    WHEN code = 'document_processed' THEN 'Document traité'
    WHEN code = 'appointment_reminder' THEN 'Rappel de rendez-vous'
    WHEN code = 'appointment_confirmed' THEN 'Rendez-vous confirmé'
    WHEN code = 'message_received' THEN 'Nouveau message'
    WHEN code = 'deadline_reminder' THEN 'Échéance à venir'
    WHEN code = 'system_update' THEN 'Mise à jour système'
  END,
  CASE 
    WHEN code = 'document_uploaded' THEN 'Un nouveau document "{{document_name}}" a été téléchargé'
    WHEN code = 'document_processed' THEN 'Votre document "{{document_name}}" a été traité'
    WHEN code = 'appointment_reminder' THEN 'Rappel : vous avez un rendez-vous le {{appointment_date}}'
    WHEN code = 'appointment_confirmed' THEN 'Votre rendez-vous du {{appointment_date}} est confirmé'
    WHEN code = 'message_received' THEN 'Vous avez reçu un message de {{sender_name}}'
    WHEN code = 'deadline_reminder' THEN 'Rappel : {{deadline_name}} à effectuer avant le {{deadline_date}}'
    WHEN code = 'system_update' THEN '{{update_message}}'
  END,
  CASE 
    WHEN code = 'document_uploaded' THEN '/espace-client/documents/{{document_id}}'
    WHEN code = 'document_processed' THEN '/espace-client/documents/{{document_id}}'
    WHEN code = 'appointment_reminder' THEN '/espace-client/rendez-vous/{{appointment_id}}'
    WHEN code = 'appointment_confirmed' THEN '/espace-client/rendez-vous/{{appointment_id}}'
    WHEN code = 'message_received' THEN '/espace-client/messages/{{message_id}}'
    WHEN code = 'deadline_reminder' THEN '/espace-client/echeances/{{deadline_id}}'
    WHEN code = 'system_update' THEN '{{action_url}}'
  END
FROM notification_types
ON CONFLICT DO NOTHING;

-- Création d'index pour améliorer les performances
CREATE INDEX IF NOT EXISTS notifications_type_id_idx ON notifications(type_id);
CREATE INDEX IF NOT EXISTS notifications_created_at_idx ON notifications(created_at);
CREATE INDEX IF NOT EXISTS notification_preferences_user_id_idx ON notification_preferences(user_id);
CREATE INDEX IF NOT EXISTS notification_preferences_type_id_idx ON notification_preferences(type_id);