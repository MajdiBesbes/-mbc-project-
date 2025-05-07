import React, { Suspense } from 'react';

interface LazyRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const defaultFallback = (
  <div className="loading-container">
    <div className="loading-spinner"></div>
  </div>
);

const LazyRoute: React.FC<LazyRouteProps> = ({ 
  children, 
  fallback = defaultFallback 
}) => {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
};

export default LazyRoute; 