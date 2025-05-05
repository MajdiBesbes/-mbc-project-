/*
  # Schéma initial de la base de données MBC

  1. Tables
    - clients : Informations des clients
    - dossiers : Documents déposés par les clients
    - historique_messages : Historique des échanges

  2. Sécurité
    - RLS activé sur toutes les tables
    - Politiques d'accès basées sur l'authentification
*/

-- Table clients
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  nom text NOT NULL,
  email text NOT NULL UNIQUE,
  telephone text,
  societe text,
  siret text,
  date_inscription timestamptz DEFAULT now(),
  statut text DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'actif', 'inactif')),
  derniere_connexion timestamptz
);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Politiques clients
CREATE POLICY "Les clients peuvent voir leurs propres données"
  ON clients
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Les admins peuvent tout voir"
  ON clients
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Table dossiers
CREATE TABLE IF NOT EXISTS dossiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id),
  nom text NOT NULL,
  type text NOT NULL,
  fichier_url text NOT NULL,
  date_depot timestamptz DEFAULT now(),
  statut text DEFAULT 'nouveau' CHECK (statut IN ('nouveau', 'en_traitement', 'traite')),
  notes text
);

ALTER TABLE dossiers ENABLE ROW LEVEL SECURITY;

-- Politiques dossiers
CREATE POLICY "Les clients peuvent voir leurs propres dossiers"
  ON dossiers
  FOR SELECT
  TO authenticated
  USING (client_id IN (SELECT id FROM clients WHERE user_id = auth.uid()));

CREATE POLICY "Les clients peuvent déposer des dossiers"
  ON dossiers
  FOR INSERT
  TO authenticated
  WITH CHECK (client_id IN (SELECT id FROM clients WHERE user_id = auth.uid()));

CREATE POLICY "Les admins peuvent tout gérer"
  ON dossiers
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Table historique_messages
CREATE TABLE IF NOT EXISTS historique_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id),
  contenu text NOT NULL,
  type text NOT NULL CHECK (type IN ('formulaire', 'chatbot', 'espace_client')),
  date_envoi timestamptz DEFAULT now(),
  lu boolean DEFAULT false
);

ALTER TABLE historique_messages ENABLE ROW LEVEL SECURITY;

-- Politiques historique_messages
CREATE POLICY "Les clients peuvent voir leurs propres messages"
  ON historique_messages
  FOR SELECT
  TO authenticated
  USING (client_id IN (SELECT id FROM clients WHERE user_id = auth.uid()));

CREATE POLICY "Les admins peuvent tout voir"
  ON historique_messages
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');