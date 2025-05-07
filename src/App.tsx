import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import LazyRoute from './components/LazyRoute';
import './styles/global.css';
import './styles/responsive.css';
import './styles/loading.css';

// Chargement différé des pages
const Services = lazy(() => import('./pages/Services'));
const APropos = lazy(() => import('./pages/APropos'));
const MentionsLegales = lazy(() => import('./pages/MentionsLegales'));

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          <Route 
            path="/services" 
            element={
              <LazyRoute>
                <Services />
              </LazyRoute>
            } 
          />
          <Route 
            path="/a-propos" 
            element={
              <LazyRoute>
                <APropos />
              </LazyRoute>
            } 
          />
          <Route 
            path="/mentions-legales" 
            element={
              <LazyRoute>
                <MentionsLegales />
              </LazyRoute>
            } 
          />
          {/* Ajoutez d'autres routes ici */}
        </Routes>
      </Router>
    </HelmetProvider>
  );
};

export default App; 