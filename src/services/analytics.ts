import mixpanel from 'mixpanel-browser';
import { supabase } from '../lib/supabase';

// Initialisation de Mixpanel avec configuration avancée
mixpanel.init('YOUR_MIXPANEL_TOKEN', {
  debug: import.meta.env.DEV,
  track_pageview: true,
  persistence: 'localStorage',
  ignore_dnt: true,
  batch_requests: true,
  batch_size: 50
});

interface UserInteraction {
  page: string;
  action: string;
  details?: Record<string, any>;
  timestamp: string;
}

// Valid actions according to the database constraint
type ValidAction = 'page_view' | 'scroll' | 'click' | 'form_submission' | 'video_interaction';

const isValidAction = (action: string): action is ValidAction => {
  return ['page_view', 'scroll', 'click', 'form_submission', 'video_interaction'].includes(action);
};

export const analytics = {
  // Generic event tracking function
  trackEvent: async (eventName: string, properties: Record<string, any>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      mixpanel.track(eventName, properties);
      
      // Map web vitals to page_view with additional details
      const action = eventName.startsWith('web_vitals') ? 'page_view' : 
        isValidAction(eventName) ? eventName : 'page_view';
      
      // Store in Supabase
      const { error } = await supabase.from('user_interactions').insert({
        page: window.location.pathname,
        action,
        details: {
          event: eventName,
          ...properties
        },
        timestamp: new Date().toISOString(),
        user_id: user?.id || null
      });

      if (error && import.meta.env.DEV) {
        console.error(`Error tracking ${eventName}:`, error);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error(`Error in trackEvent (${eventName}):`, error);
      }
    }
  },

  // Track page views
  trackPageView: async (path: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      mixpanel.track('Page View', { path });
      
      // Store in Supabase
      const { error } = await supabase.from('user_interactions').insert({
        page: path,
        action: 'page_view',
        details: { path },
        timestamp: new Date().toISOString(),
        user_id: user?.id || null // Add user ID if authenticated, null if not
      });

      if (error && import.meta.env.DEV) {
        console.error('Error tracking page view:', error);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error in trackPageView:', error);
      }
    }
  },

  // Track scroll events
  trackScroll: async (percentage: number, path: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      mixpanel.track('Scroll', { percentage, path });
      
      // Store in Supabase
      const { error } = await supabase.from('user_interactions').insert({
        page: path,
        action: 'scroll',
        details: { percentage },
        timestamp: new Date().toISOString(),
        user_id: user?.id || null
      });

      if (error && import.meta.env.DEV) {
        console.error('Error tracking scroll:', error);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error in trackScroll:', error);
      }
    }
  },

  // Track click events
  trackClick: async (element: string, path: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      mixpanel.track('Click', { element, path });
      
      // Store in Supabase
      const { error } = await supabase.from('user_interactions').insert({
        page: path,
        action: 'click',
        details: { element },
        timestamp: new Date().toISOString(),
        user_id: user?.id || null
      });

      if (error && import.meta.env.DEV) {
        console.error('Error tracking click:', error);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error in trackClick:', error);
      }
    }
  },

  // Track form submissions
  trackFormSubmission: async (formName: string, success: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      mixpanel.track('Form Submission', { formName, success });
      
      // Store in Supabase
      const { error } = await supabase.from('user_interactions').insert({
        page: window.location.pathname,
        action: 'form_submission',
        details: { formName, success },
        timestamp: new Date().toISOString(),
        user_id: user?.id || null
      });

      if (error && import.meta.env.DEV) {
        console.error('Error tracking form submission:', error);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error in trackFormSubmission:', error);
      }
    }
  },

  // Track video interactions
  trackVideoInteraction: async (videoId: string, action: 'play' | 'pause' | 'complete') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      mixpanel.track('Video Interaction', { videoId, action });
      
      // Store in Supabase
      const { error } = await supabase.from('user_interactions').insert({
        page: window.location.pathname,
        action: 'video_interaction',
        details: { videoId, action },
        timestamp: new Date().toISOString(),
        user_id: user?.id || null
      });

      if (error && import.meta.env.DEV) {
        console.error('Error tracking video interaction:', error);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error in trackVideoInteraction:', error);
      }
    }
  },

  // Track testimonial interactions - mapped to click events
  trackTestimonialInteraction: async (testimonialAuthor: string, action: 'view' | 'click') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      mixpanel.track('Testimonial Interaction', { testimonialAuthor, action });
      
      // Store in Supabase
      const { error } = await supabase.from('user_interactions').insert({
        page: window.location.pathname,
        action: 'click',
        details: { type: 'testimonial', testimonialAuthor, action },
        timestamp: new Date().toISOString(),
        user_id: user?.id || null
      });

      if (error && import.meta.env.DEV) {
        console.error('Error tracking testimonial interaction:', error);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error in trackTestimonialInteraction:', error);
      }
    }
  },

  // Track cultural interactions - mapped to click events
  trackCulturalInteraction: async (type: 'language' | 'region' | 'content', value: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      mixpanel.track('Cultural Interaction', { type, value });
      
      // Store in Supabase
      const { error } = await supabase.from('user_interactions').insert({
        page: window.location.pathname,
        action: 'click',
        details: { type: 'cultural', interactionType: type, value },
        timestamp: new Date().toISOString(),
        user_id: user?.id || null
      });

      if (error && import.meta.env.DEV) {
        console.error('Error tracking cultural interaction:', error);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error in trackCulturalInteraction:', error);
      }
    }
  },

  // Calculate engagement score
  calculateEngagementScore: async (userId: string): Promise<number> => {
    const { data: interactions } = await supabase
      .from('user_interactions')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(100);

    if (!interactions) return 0;

    // Système de points amélioré
    const points = {
      page_view: 1,
      scroll_75: 2,
      form_submission: 5,
      video_complete: 3,
      click: 1,
      testimonial_interaction: 2,
      cultural_interaction: 3
    };

    // Facteurs de pondération
    const weights = {
      recency: 1.5, // Interactions récentes
      frequency: 1.2, // Fréquence des visites
      engagement: 1.3 // Niveau d'engagement
    };

    let score = interactions.reduce((total, interaction) => {
      const basePoints = points[interaction.action as keyof typeof points] || 0;
      const daysSinceInteraction = Math.floor((Date.now() - new Date(interaction.timestamp).getTime()) / (1000 * 60 * 60 * 24));
      
      // Application des facteurs de pondération
      return total + (basePoints * Math.max(0.5, weights.recency - (daysSinceInteraction * 0.1)));
    }, 0);

    // Ajustement pour la fréquence
    const uniqueDays = new Set(interactions.map(i => new Date(i.timestamp).toDateString())).size;
    score *= Math.min(weights.frequency, 1 + (uniqueDays * 0.1));

    return Math.round(score);
  }
};