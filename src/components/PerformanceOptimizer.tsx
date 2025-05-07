import React, { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

interface PerformanceOptimizerProps {
  children: React.ReactNode;
}

const PerformanceOptimizer: React.FC<PerformanceOptimizerProps> = ({ children }) => {
  const location = useLocation();

  // Optimisation des images
  const optimizeImages = useCallback(() => {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
      if ('loading' in HTMLImageElement.prototype) {
        img.setAttribute('loading', 'lazy');
      } else {
        // Fallback pour les navigateurs qui ne supportent pas le lazy loading
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              img.src = img.dataset.src || '';
              observer.unobserve(img);
            }
          });
        });
        observer.observe(img);
      }
    });
  }, []);

  // Nettoyage des ressources
  const cleanupResources = useCallback(() => {
    // Nettoyage des event listeners
    const cleanup = () => {
      window.removeEventListener('scroll', () => {});
      window.removeEventListener('resize', () => {});
    };
    return cleanup;
  }, []);

  // Préchargement des routes
  const preloadRoutes = useCallback(() => {
    const routes = ['/services', '/about', '/contact'];
    routes.forEach(route => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = route;
      document.head.appendChild(link);
    });
  }, []);

  useEffect(() => {
    optimizeImages();
    preloadRoutes();
    return cleanupResources();
  }, [location.pathname, optimizeImages, preloadRoutes, cleanupResources]);

  // Optimisation du rendu
  return (
    <div className="performance-optimizer">
      {children}
    </div>
  );
};

export default React.memo(PerformanceOptimizer); 