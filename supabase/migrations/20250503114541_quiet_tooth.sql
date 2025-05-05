/*
  # Ajout du support des pièces jointes pour les messages

  1. Modifications
    - Ajout d'une colonne `attachments` à la table `historique_messages`
    - Ajout d'une colonne `role` pour distinguer les messages des clients et des experts

  2. Sécurité
    - Maintien des politiques RLS existantes
*/

-- Ajout de la colonne pour les pièces jointes
ALTER TABLE historique_messages 
ADD COLUMN IF NOT EXISTS attachments text[];

-- Ajout de la colonne pour le rôle (client ou expert)
ALTER TABLE historique_messages 
ADD COLUMN IF NOT EXISTS role text DEFAULT 'client' 
CHECK (role IN ('client', 'expert'));