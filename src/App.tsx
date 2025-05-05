import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Blog from './pages/Blog';
import ExpertAccess from './pages/ExpertAccess';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Legal from './pages/Legal';
import Privacy from './pages/Privacy';
import Simulators from './pages/Simulators';
import Devis from './pages/Devis';
import SearchResults from './pages/SearchResults';
import Chatbot from './components/Chatbot';
import WhatsAppButton from './components/WhatsAppButton';
import FloatingQuoteButton from './components/FloatingQuoteButton';
import CreationEntrepriseButton from './components/CreationEntrepriseButton';
import PushNotifications from './components/PushNotifications';
import ScrollToTop from './components/ScrollToTop';
import SEO from './components/SEO';
import ClientSpace from './pages/ClientSpace';
import Login from './pages/Login';
import ResetPassword from './components/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';
import { usePerformance } from './hooks/usePerformance';
import AuthCallback from './pages/AuthCallback';
import CookieConsent from './components/CookieConsent';
import CreationEntreprise from './pages/CreationEntreprise';

function App() {
  usePerformance();
  const [cookiesAccepted, setCookiesAccepted] = useState<boolean | null>(null);

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà fait un choix
    const consentChoice = localStorage.getItem('cookieConsent');
    if (consentChoice === 'accepted') {
      setCookiesAccepted(true);
      // Activer les scripts d'analyse
      enableAnalytics();
    } else if (consentChoice === 'declined') {
      setCookiesAccepted(false);
    }
  }, []);

  const handleCookieAccept = () => {
    setCookiesAccepted(true);
    localStorage.setItem('cookieConsent', 'accepted');
    enableAnalytics();
  };

  const handleCookieDecline = () => {
    setCookiesAccepted(false);
    localStorage.setItem('cookieConsent', 'declined');
    // Désactiver les scripts d'analyse si nécessaire
  };

  const enableAnalytics = () => {
    // Ici, vous pouvez initialiser vos outils d'analyse
    // Par exemple, Google Analytics, Mixpanel, etc.
    if (window.mixpanel && typeof window.mixpanel.opt_in_tracking === 'function') {
      window.mixpanel.opt_in_tracking();
    }
  };

  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <ScrollToTop />
          <SEO />
          <PushNotifications />
          <Chatbot />
          <WhatsAppButton />
          <FloatingQuoteButton />
          <CreationEntrepriseButton />
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="services" element={<Services />} />
              <Route path="blog" element={<Blog />} />
              <Route path="devis" element={<Devis />} />
              <Route path="creation-entreprise" element={<CreationEntreprise />} />
              <Route path="expert-access" element={<ExpertAccess />} />
              <Route path="contact" element={<Contact />} />
              <Route path="legal" element={<Legal />} />
              <Route path="privacy" element={<Privacy />} />
              <Route path="simulators" element={<Simulators />} />
              <Route path="search" element={<SearchResults />} />
              <Route path="login" element={<Login />} />
              <Route path="reset-password" element={<ResetPassword />} />
              <Route path="auth/callback" element={<AuthCallback />} />
              <Route 
                path="espace-client" 
                element={
                  <ProtectedRoute>
                    <ClientSpace />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
          
          {cookiesAccepted === null && (
            <CookieConsent 
              onAccept={handleCookieAccept} 
              onDecline={handleCookieDecline} 
            />
          )}
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

// Ajout de la déclaration pour TypeScript
declare global {
  interface Window {
    mixpanel?: {
      opt_in_tracking?: () => void;
      opt_out_tracking?: () => void;
    };
  }
}

export default App;