/*
  # Ajout de la table des préférences utilisateur

  1. Nouvelle Table
    - `user_preferences`
      - Stockage des préférences de notification
      - Paramètres personnalisés par utilisateur

  2. Sécurité
    - Activation de RLS
    - Politiques d'accès utilisateur
*/

CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) UNIQUE,
  notifications_enabled boolean DEFAULT false,
  email_frequency text DEFAULT 'weekly',
  theme text DEFAULT 'light',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_email_frequency CHECK (email_frequency IN ('daily', 'weekly', 'monthly', 'never')),
  CONSTRAINT valid_theme CHECK (theme IN ('light', 'dark', 'system'))
);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Les utilisateurs peuvent gérer leurs préférences"
  ON user_preferences
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Index pour améliorer les performances
CREATE INDEX user_preferences_user_id_idx ON user_preferences(user_id);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();