import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useCRM } from './useCRM';

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  created_at: string;
}

export const useDocuments = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { trackDownload } = useCRM();

  const uploadDocument = useCallback(async (file: File, type: string) => {
    if (!user) return null;
    setLoading(true);
    setError(null);

    try {
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      const { data: document, error: dbError } = await supabase
        .from('documents')
        .insert({
          name: file.name,
          type,
          size: file.size,
          url: publicUrl,
          user_id: user.id
        })
        .select()
        .single();

      if (dbError) throw dbError;

      return document;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error uploading document');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const downloadDocument = useCallback(async (documentId: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data: document, error: dbError } = await supabase
        .from('documents')
        .select('*')
        .eq('id', documentId)
        .single();

      if (dbError) throw dbError;

      // Track download in CRM
      await trackDownload(user?.id || '', document.name);

      window.open(document.url, '_blank');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error downloading document');
    } finally {
      setLoading(false);
    }
  }, [user, trackDownload]);

  const deleteDocument = useCallback(async (documentId: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data: document, error: fetchError } = await supabase
        .from('documents')
        .select('url')
        .eq('id', documentId)
        .single();

      if (fetchError) throw fetchError;

      const { error: deleteError } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);

      if (deleteError) throw deleteError;

      // Delete file from storage
      const filePath = document.url.split('/').pop();
      if (filePath) {
        const { error: storageError } = await supabase.storage
          .from('documents')
          .remove([filePath]);

        if (storageError) throw storageError;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting document');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    uploadDocument,
    downloadDocument,
    deleteDocument,
    loading,
    error
  };
};