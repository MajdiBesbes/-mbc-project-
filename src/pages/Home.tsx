import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Calculator, FileText, Users } from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
import TestimonialSection from '../components/TestimonialSection';
import VideoSection from '../components/VideoSection';
import ResourcesSection from '../components/ResourcesSection';
import DevisPopup from '../components/DevisPopup';
import GoogleReviews from '../components/GoogleReviews';
import DigitalFeatures from '../components/DigitalFeatures';
import DigitalBadge from '../components/DigitalBadge';
import HomeCreationCTA from '../components/HomeCreationCTA';

const Home = () => {
  const [showDevisPopup, setShowDevisPopup] = useState(false);
  
  useEffect(() => {
    // Afficher le popup après 15 secondes
    const timer = setTimeout(() => {
      setShowDevisPopup(true);
    }, 15000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen">
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-10"></div>
        <img 
          src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg"
          alt="MBC High Value Business Consulting" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 h-full container mx-auto px-4 flex flex-col justify-center">
          <div className="max-w-3xl">
            <div className="mb-6">
              <DigitalBadge size="lg" />
            </div>
            <h1 className="mb-4">
              <span className="block text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-2">
                MBC
              </span>
              <span className="block text-3xl md:text-4xl lg:text-5xl font-semibold text-white/90">
                High Value Business Consulting
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-8">
              Votre expert-comptable qui comprend les défis des entrepreneurs franco-maghrébins
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link 
                to="/services" 
                className="px-8 py-4 bg-primary text-white rounded-md text-center transition-colors hover:bg-primary-dark text-lg"
              >
                Nos services
              </Link>
              <Link 
                to="/devis" 
                className="px-8 py-4 bg-white text-primary rounded-md text-center transition-colors hover:bg-gray-100 text-lg"
              >
                Obtenir un devis
              </Link>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-white bg-opacity-90 py-4">
          <div className="container mx-auto px-4">
            <p className="text-center text-gray-700 font-medium">
              Expert-comptable inscrit au tableau de l'OEC Île-de-France sous le n° 140002898701
            </p>
          </div>
        </div>
      </section>

      {/* Digital Features Section */}
      <DigitalFeatures />

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Nos Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ServiceCard
              id="comptabilite"
              title="Expertise Comptable"
              description="Sortez du chaos administratif avec une gestion comptable claire et organisée"
              icon={<Calculator className="w-12 h-12" />}
              illustration="https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg"
              isDigital={true}
            />
            <ServiceCard
              id="fiscalite"
              title="Fiscalité Internationale"
              description="Naviguez sereinement dans le labyrinthe fiscal franco-maghrébin"
              icon={<FileText className="w-12 h-12" />}
              illustration="https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg"
              isDigital={true}
            />
            <ServiceCard
              id="social"
              title="Social & Paie"
              description="Simplifiez la gestion de vos obligations sociales et salariales"
              icon={<Users className="w-12 h-12" />}
              illustration="https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg"
              isDigital={true}
            />
            <ServiceCard
              id="conseil"
              title="Conseil & Développement"
              description="Construisez votre succès avec un accompagnement stratégique personnalisé"
              icon={<BarChart3 className="w-12 h-12" />}
              illustration="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg"
              isDigital={true}
            />
          </div>
          <div className="mt-10 text-center">
            <Link 
              to="/devis" 
              className="inline-block px-6 py-3 bg-primary text-white rounded-md shadow-md hover:bg-primary-dark transition-colors"
            >
              Obtenir un devis personnalisé
            </Link>
          </div>
        </div>
      </section>

      {/* Creation Entreprise CTA */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <HomeCreationCTA />
        </div>
      </section>

      {/* Video Section */}
      <VideoSection />

      {/* Google Reviews Section */}
      <GoogleReviews />

      {/* Resources Section */}
      <ResourcesSection />

      {/* Bottom CTA */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
              Prêt à simplifier votre comptabilité ?
            </h2>
            <p className="text-center text-gray-600 mb-8">
              Obtenez un devis personnalisé en quelques clics et découvrez comment MBC peut vous accompagner dans votre réussite entrepreneuriale.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/devis" 
                className="px-8 py-4 bg-primary text-white rounded-md text-center transition-colors hover:bg-primary-dark"
              >
                Simuler mon devis
              </Link>
              <Link 
                to="/contact" 
                className="px-8 py-4 bg-white text-primary border-2 border-primary rounded-md text-center transition-colors hover:bg-gray-50"
              >
                Prendre rendez-vous
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Popup de devis */}
      {showDevisPopup && <DevisPopup />}
    </>
  );
};

export default Home;