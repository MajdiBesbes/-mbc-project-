import { supabase } from '../lib/supabase';

interface Lead {
  id: string;
  email: string;
  nom: string;
  telephone?: string;
  societe?: string;
  source: string;
  type_contact: string;
  statut: string;
  score: number;
  gdpr_consent: boolean;
  metadata?: Record<string, any>;
}

interface LeadInteraction {
  lead_id: string;
  type: string;
  canal: string;
  contenu?: string;
  resultat?: string;
}

export const crmService = {
  // Create new lead
  async createLead(leadData: Omit<Lead, 'id' | 'statut' | 'score'>): Promise<Lead | null> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .insert([{
          ...leadData,
          statut: 'nouveau',
          gdpr_timestamp: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating lead:', error);
      return null;
    }
  },

  // Track lead interaction
  async trackInteraction(interaction: Omit<LeadInteraction, 'id'>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('lead_interactions')
        .insert([interaction]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error tracking interaction:', error);
      return false;
    }
  },

  // Update lead status
  async updateLeadStatus(leadId: string, status: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ statut: status })
        .eq('id', leadId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating lead status:', error);
      return false;
    }
  },

  // Calculate lead score
  async calculateLeadScore(leadId: string): Promise<number> {
    try {
      // Fetch lead interactions
      const { data: interactions } = await supabase
        .from('lead_interactions')
        .select('type, canal')
        .eq('lead_id', leadId);

      if (!interactions) return 0;

      // Scoring rules
      const scores = {
        formulaire: 10,
        téléchargement: 5,
        rdv: 20,
        chat: 3,
        email: 2,
        'devis-en-ligne': 15
      };

      // Calculate total score
      const totalScore = interactions.reduce((score, interaction) => {
        return score + (scores[interaction.type as keyof typeof scores] || 0);
      }, 0);

      // Update lead score
      await supabase
        .from('leads')
        .update({ score: totalScore })
        .eq('id', leadId);

      return totalScore;
    } catch (error) {
      console.error('Error calculating lead score:', error);
      return 0;
    }
  },

  // Get lead details with interactions
  async getLeadDetails(leadId: string): Promise<any> {
    try {
      const { data: lead, error: leadError } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single();

      if (leadError) throw leadError;

      const { data: interactions, error: interactionsError } = await supabase
        .from('lead_interactions')
        .select('*')
        .eq('lead_id', leadId)
        .order('date_interaction', { ascending: false });

      if (interactionsError) throw interactionsError;

      return {
        ...lead,
        interactions: interactions || []
      };
    } catch (error) {
      console.error('Error fetching lead details:', error);
      return null;
    }
  }
};