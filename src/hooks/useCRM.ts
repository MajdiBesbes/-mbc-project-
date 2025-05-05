import { useState, useCallback } from 'react';
import { crmService } from '../services/crm';
import { useAuth } from '../contexts/AuthContext';

export const useCRM = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const handleLead = useCallback(async (formData: any, source: string) => {
    setLoading(true);
    setError(null);

    try {
      // Create lead
      const lead = await crmService.createLead({
        email: formData.email,
        nom: formData.name || formData.nom,
        telephone: formData.phone || formData.telephone,
        societe: formData.company || formData.societe || '',
        source,
        type_contact: formData.subject || formData.type_contact || 'autre',
        gdpr_consent: formData.gdprConsent || true,
        metadata: formData.metadata || {}
      });

      if (!lead) throw new Error('Failed to create lead');

      // Track initial interaction
      await crmService.trackInteraction({
        lead_id: lead.id,
        type: source,
        canal: 'web',
        contenu: formData.message || JSON.stringify(formData.services || [])
      });

      // Calculate initial score
      await crmService.calculateLeadScore(lead.id);

      return lead;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const trackDownload = useCallback(async (leadId: string, documentName: string) => {
    try {
      await crmService.trackInteraction({
        lead_id: leadId,
        type: 'téléchargement',
        canal: 'web',
        contenu: documentName
      });

      await crmService.calculateLeadScore(leadId);
    } catch (err) {
      console.error('Error tracking download:', err);
    }
  }, []);

  const trackAppointment = useCallback(async (leadId: string, appointmentDetails: any) => {
    try {
      await crmService.trackInteraction({
        lead_id: leadId,
        type: 'rdv',
        canal: 'calendly',
        contenu: JSON.stringify(appointmentDetails)
      });

      await crmService.updateLeadStatus(leadId, 'qualifié');
      await crmService.calculateLeadScore(leadId);
    } catch (err) {
      console.error('Error tracking appointment:', err);
    }
  }, []);

  return {
    handleLead,
    trackDownload,
    trackAppointment,
    loading,
    error
  };
};