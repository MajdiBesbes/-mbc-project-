/*
  # Fix User Interactions RLS Policies

  1. Changes
    - Update RLS policies for user_interactions table to handle anonymous tracking
    - Add policy to allow inserting interactions for both authenticated and anonymous users
    - Keep existing policies for querying data

  2. Security
    - Maintain admin access to all records
    - Allow anonymous interactions to be recorded
    - Preserve user privacy by maintaining select restrictions
*/

-- First remove conflicting policies
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON user_interactions;
DROP POLICY IF EXISTS "Les utilisateurs peuvent créer leurs propres interactions" ON user_interactions;

-- Add new policy for inserting interactions (allows both authenticated and anonymous)
CREATE POLICY "Allow tracking all interactions" ON user_interactions
FOR INSERT
WITH CHECK (
  -- Allow if user_id is null (anonymous) OR matches the authenticated user
  (user_id IS NULL) OR (auth.uid() = user_id)
);