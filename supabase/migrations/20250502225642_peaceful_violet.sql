/*
  # Tables de tracking utilisateur

  1. New Tables
    - `user_interactions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `page` (text)
      - `action` (text)
      - `details` (jsonb)
      - `timestamp` (timestamptz)
    - `user_scores`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `engagement_score` (integer)
      - `last_calculated` (timestamptz)
      
  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Table des interactions utilisateur
CREATE TABLE IF NOT EXISTS user_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  page text NOT NULL,
  action text NOT NULL,
  details jsonb DEFAULT '{}'::jsonb,
  timestamp timestamptz DEFAULT now(),
  CONSTRAINT valid_action CHECK (action IN ('page_view', 'scroll', 'click', 'form_submission', 'video_interaction'))
);

-- Table des scores d'engagement
CREATE TABLE IF NOT EXISTS user_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) UNIQUE,
  engagement_score integer DEFAULT 0,
  last_calculated timestamptz DEFAULT now()
);

-- Activation RLS
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_scores ENABLE ROW LEVEL SECURITY;

-- Policies pour user_interactions
CREATE POLICY "Les admins peuvent tout voir sur user_interactions"
  ON user_interactions
  FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'role'::text) = 'admin'::text);

CREATE POLICY "Les utilisateurs peuvent voir leurs propres interactions"
  ON user_interactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent créer leurs propres interactions"
  ON user_interactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policies pour user_scores
CREATE POLICY "Les admins peuvent tout voir sur user_scores"
  ON user_scores
  FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'role'::text) = 'admin'::text);

CREATE POLICY "Les utilisateurs peuvent voir leur propre score"
  ON user_scores
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Index pour améliorer les performances
CREATE INDEX user_interactions_user_id_idx ON user_interactions(user_id);
CREATE INDEX user_interactions_timestamp_idx ON user_interactions(timestamp);
CREATE INDEX user_scores_user_id_idx ON user_scores(user_id);