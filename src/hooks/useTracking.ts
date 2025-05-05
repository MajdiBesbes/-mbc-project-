import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '../services/analytics';
import { throttle } from 'lodash';

export const useTracking = () => {
  const location = useLocation();
  const scrollRef = useRef<number>(0);
  const lastTrackRef = useRef<number>(0);

  // Optimisation du suivi du scroll avec throttle
  const handleScroll = useCallback(
    throttle(() => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPosition = window.scrollY;
      const scrollPercentage = (scrollPosition / scrollHeight) * 100;

      const currentQuarter = Math.floor(scrollPercentage / 25);
      if (currentQuarter > scrollRef.current) {
        analytics.trackScroll(currentQuarter * 25, location.pathname);
        scrollRef.current = currentQuarter;
      }
    }, 500),
    [location]
  );

  useEffect(() => {
    analytics.trackPageView(location.pathname);
    
    // Réinitialisation des refs lors du changement de page
    scrollRef.current = 0;
    lastTrackRef.current = Date.now();
  }, [location]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      handleScroll.cancel();
    };
  }, [handleScroll]);

  return {
    trackClick: (element: string) => analytics.trackClick(element, location.pathname),
    trackFormSubmission: (formName: string, success: boolean) => 
      analytics.trackFormSubmission(formName, success),
    trackVideoInteraction: (videoId: string, action: 'play' | 'pause' | 'complete') =>
      analytics.trackVideoInteraction(videoId, action),
    trackTestimonialInteraction: (author: string, action: 'view' | 'click') =>
      analytics.trackTestimonialInteraction(author, action),
    trackCulturalInteraction: (type: 'language' | 'region' | 'content', value: string) =>
      analytics.trackCulturalInteraction(type, value)
  };
};