/*
  # Système CRM pour MBC Consulting

  1. Nouvelles Tables
    - `leads` : Stockage des prospects
    - `lead_interactions` : Suivi des interactions avec les prospects
    - `email_templates` : Modèles d'emails pour l'automatisation
    - `automated_sequences` : Séquences d'emails automatisées

  2. Sécurité
    - Activation de RLS sur toutes les tables
    - Politiques d'accès pour les administrateurs

  3. Performance
    - Index sur les colonnes fréquemment utilisées
    - Trigger pour la mise à jour automatique des timestamps
*/

-- Suppression des politiques existantes si elles existent
DROP POLICY IF EXISTS "Les admins peuvent tout voir sur leads" ON leads;
DROP POLICY IF EXISTS "Les admins peuvent tout voir sur lead_interactions" ON lead_interactions;
DROP POLICY IF EXISTS "Les admins peuvent tout voir sur email_templates" ON email_templates;
DROP POLICY IF EXISTS "Les admins peuvent tout voir sur automated_sequences" ON automated_sequences;

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  nom text NOT NULL,
  telephone text,
  societe text,
  source text NOT NULL,
  type_contact text NOT NULL,
  statut text NOT NULL DEFAULT 'nouveau',
  date_creation timestamptz DEFAULT now(),
  derniere_modification timestamptz DEFAULT now(),
  score integer DEFAULT 0,
  gdpr_consent boolean DEFAULT false,
  gdpr_timestamp timestamptz,
  assigned_to uuid REFERENCES auth.users(id),
  metadata jsonb DEFAULT '{}'::jsonb,
  CONSTRAINT valid_status CHECK (statut IN ('nouveau', 'contacté', 'qualifié', 'converti', 'perdu')),
  CONSTRAINT valid_source CHECK (source IN ('formulaire', 'téléchargement', 'calendly', 'chat', 'direct')),
  CONSTRAINT valid_type CHECK (type_contact IN ('comptabilité', 'fiscalité', 'paie', 'création', 'conseil', 'autre'))
);

-- Lead interactions tracking
CREATE TABLE IF NOT EXISTS lead_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES leads(id) ON DELETE CASCADE,
  type text NOT NULL,
  canal text NOT NULL,
  contenu text,
  date_interaction timestamptz DEFAULT now(),
  resultat text,
  metadata jsonb DEFAULT '{}'::jsonb,
  CONSTRAINT valid_type CHECK (type IN ('email', 'appel', 'rdv', 'chat', 'formulaire', 'téléchargement')),
  CONSTRAINT valid_canal CHECK (canal IN ('auto', 'manuel', 'web'))
);

-- Email templates
CREATE TABLE IF NOT EXISTS email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  sujet text NOT NULL,
  contenu text NOT NULL,
  type text NOT NULL,
  variables jsonb DEFAULT '[]'::jsonb,
  actif boolean DEFAULT true,
  date_creation timestamptz DEFAULT now(),
  derniere_modification timestamptz DEFAULT now(),
  CONSTRAINT valid_type CHECK (type IN ('bienvenue', 'relance', 'rdv', 'newsletter', 'autre'))
);

-- Automated sequences
CREATE TABLE IF NOT EXISTS automated_sequences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  description text,
  trigger_event text NOT NULL,
  delay_hours integer NOT NULL,
  template_id uuid REFERENCES email_templates(id),
  conditions jsonb DEFAULT '{}'::jsonb,
  actif boolean DEFAULT true,
  metadata jsonb DEFAULT '{}'::jsonb,
  CONSTRAINT valid_trigger CHECK (trigger_event IN ('nouveau_lead', 'téléchargement', 'rdv_non_confirmé', 'sans_réponse'))
);

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE automated_sequences ENABLE ROW LEVEL SECURITY;

-- Admin policies
CREATE POLICY "Les admins peuvent tout voir sur leads"
  ON leads FOR ALL TO authenticated
  USING ((auth.jwt() ->> 'role'::text) = 'admin'::text);

CREATE POLICY "Les admins peuvent tout voir sur lead_interactions"
  ON lead_interactions FOR ALL TO authenticated
  USING ((auth.jwt() ->> 'role'::text) = 'admin'::text);

CREATE POLICY "Les admins peuvent tout voir sur email_templates"
  ON email_templates FOR ALL TO authenticated
  USING ((auth.jwt() ->> 'role'::text) = 'admin'::text);

CREATE POLICY "Les admins peuvent tout voir sur automated_sequences"
  ON automated_sequences FOR ALL TO authenticated
  USING ((auth.jwt() ->> 'role'::text) = 'admin'::text);

-- Indexes for performance
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'leads_email_idx'
  ) THEN
    CREATE INDEX leads_email_idx ON leads(email);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'leads_date_creation_idx'
  ) THEN
    CREATE INDEX leads_date_creation_idx ON leads(date_creation);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'leads_statut_idx'
  ) THEN
    CREATE INDEX leads_statut_idx ON leads(statut);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'lead_interactions_lead_id_idx'
  ) THEN
    CREATE INDEX lead_interactions_lead_id_idx ON lead_interactions(lead_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'lead_interactions_date_idx'
  ) THEN
    CREATE INDEX lead_interactions_date_idx ON lead_interactions(date_interaction);
  END IF;
END $$;

-- Function to update lead modification timestamp
CREATE OR REPLACE FUNCTION update_lead_modification_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.derniere_modification = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update lead modification timestamp
DROP TRIGGER IF EXISTS update_lead_timestamp ON leads;
CREATE TRIGGER update_lead_timestamp
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_lead_modification_timestamp();