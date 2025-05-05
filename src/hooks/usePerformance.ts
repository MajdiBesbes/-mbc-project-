import { useEffect } from 'react';
import { getCLS, getFID, getLCP, getTTFB, getFCP } from 'web-vitals';
import { analytics } from '../services/analytics';

export const usePerformance = () => {
  useEffect(() => {
    // Mesure des Core Web Vitals
    getCLS((metric) => {
      analytics.trackEvent('web_vitals', {
        name: 'CLS',
        value: metric.value,
        id: metric.id
      });
    });

    getFID((metric) => {
      analytics.trackEvent('web_vitals', {
        name: 'FID',
        value: metric.value,
        id: metric.id
      });
    });

    getLCP((metric) => {
      analytics.trackEvent('web_vitals', {
        name: 'LCP',
        value: metric.value,
        id: metric.id
      });
    });

    getTTFB((metric) => {
      analytics.trackEvent('web_vitals', {
        name: 'TTFB',
        value: metric.value,
        id: metric.id
      });
    });

    getFCP((metric) => {
      analytics.trackEvent('web_vitals', {
        name: 'FCP',
        value: metric.value,
        id: metric.id
      });
    });

    // Préchargement des ressources critiques
    const preloadResources = () => {
      const links = [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
        { rel: 'preload', href: '/images/logo.png', as: 'image' },
        { rel: 'preload', href: '/images/founder.jpg', as: 'image' },
        // Préchargement des images fréquemment utilisées
        { rel: 'preload', href: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg', as: 'image' },
        { rel: 'preload', href: 'https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg', as: 'image' }
      ];

      links.forEach(link => {
        const linkElement = document.createElement('link');
        Object.entries(link).forEach(([key, value]) => {
          if (value !== undefined) {
            linkElement.setAttribute(key, value);
          }
        });
        document.head.appendChild(linkElement);
      });
    };

    // Préchargement des routes principales
    const prefetchRoutes = () => {
      const routes = ['/about', '/services', '/contact', '/simulators', '/blog'];
      routes.forEach(route => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = route;
        document.head.appendChild(link);
      });
    };

    // Optimisation des polices
    const optimizeFonts = () => {
      const fontDisplay = document.createElement('style');
      fontDisplay.textContent = `
        @font-face {
          font-family: 'Inter';
          font-style: normal;
          font-weight: 400;
          font-display: swap;
          src: url(https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2) format('woff2');
        }
      `;
      document.head.appendChild(fontDisplay);
    };

    preloadResources();
    prefetchRoutes();
    optimizeFonts();
  }, []);
};