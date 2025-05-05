import { useCallback } from 'react';
import { analytics } from '../services/analytics';
import { useLocation } from 'react-router-dom';

export const useAnalytics = () => {
  const location = useLocation();

  const trackEvent = useCallback((eventName: string, properties?: Record<string, any>) => {
    analytics.trackEvent(eventName, {
      ...properties,
      path: location.pathname,
      language: navigator.language,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    });
  }, [location]);

  const trackCulturalEngagement = useCallback((type: string, value: string) => {
    analytics.trackEvent('cultural_engagement', {
      type,
      value,
      path: location.pathname,
      timestamp: new Date().toISOString()
    });
  }, [location]);

  const trackBusinessInteraction = useCallback((action: string, businessType: string) => {
    analytics.trackEvent('business_interaction', {
      action,
      businessType,
      path: location.pathname,
      timestamp: new Date().toISOString()
    });
  }, [location]);

  const trackLanguagePreference = useCallback((language: string) => {
    analytics.trackEvent('language_preference', {
      language,
      path: location.pathname,
      timestamp: new Date().toISOString()
    });
  }, [location]);

  const trackRegionalInterest = useCallback((region: string) => {
    analytics.trackEvent('regional_interest', {
      region,
      path: location.pathname,
      timestamp: new Date().toISOString()
    });
  }, [location]);

  return {
    trackEvent,
    trackCulturalEngagement,
    trackBusinessInteraction,
    trackLanguagePreference,
    trackRegionalInterest
  };
};