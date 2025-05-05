/*
  # Create clients table

  1. New Tables
    - `clients`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `nom` (text, required)
      - `email` (text, required, unique)
      - `telephone` (text, optional)
      - `societe` (text, optional)
      - `siret` (text, optional)
      - `date_inscription` (timestamptz, default: now())
      - `statut` (text, default: 'en_attente')
      - `derniere_connexion` (timestamptz, optional)

  2. Security
    - Enable RLS on clients table
    - Add policy for clients to view their own data
    - Add policy for admins to manage all data
*/

-- Create clients table if it doesn't exist
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

-- Enable RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Create policies if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'clients' 
    AND policyname = 'Les clients peuvent voir leurs propres données'
  ) THEN
    CREATE POLICY "Les clients peuvent voir leurs propres données"
      ON clients
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'clients' 
    AND policyname = 'Les admins peuvent tout voir'
  ) THEN
    CREATE POLICY "Les admins peuvent tout voir"
      ON clients
      FOR ALL
      TO authenticated
      USING (auth.jwt() ->> 'role' = 'admin');
  END IF;
END $$;