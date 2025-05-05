/*
  # Add insert policy for user interactions

  1. Changes
    - Add new RLS policy to allow authenticated users to insert their interactions
    - Policy ensures users can only insert rows with their own user_id
  
  2. Security
    - Maintains data integrity by ensuring users can only create records for themselves
    - Preserves existing SELECT and ALL policies
*/

-- Add policy for inserting user interactions
CREATE POLICY "Enable insert for authenticated users only"
ON public.user_interactions
FOR INSERT
TO authenticated
WITH CHECK (
  -- Allow insert only if the user_id matches the authenticated user's ID
  -- OR if user_id is null (for anonymous tracking)
  user_id IS NULL OR user_id = auth.uid()
);