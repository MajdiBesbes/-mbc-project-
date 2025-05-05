import React from 'react';
import { BookOpen, Users, Award } from 'lucide-react';
import CallToAction from '../components/CallToAction';
import DirectoryLinks from '../components/DirectoryLinks';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            À propos de MBC
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Cabinet d'expertise comptable spécialisé dans l'accompagnement des entrepreneurs franco-maghrébins en Île-de-France
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <img 
              src="/images/founder.jpg" 
              alt="Majdi Besbes - Expert-Comptable" 
              className="rounded-lg shadow-xl w-full"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg";
                target.onerror = null;
              }}
            />
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900">Majdi Besbes</h3>
              <p className="text-gray-600">Expert-Comptable & Fondateur</p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Notre Vision</h2>
            <p className="text-lg text-gray-600">
              Fondé par Majdi Besbes, MBC est un cabinet d'expertise comptable moderne qui allie expertise technique et approche personnalisée. Notre mission est d'accompagner les entrepreneurs, particulièrement ceux issus de la diaspora franco-maghrébine, dans leur réussite en leur fournissant des solutions adaptées à leurs besoins spécifiques.
            </p>
            <p className="text-lg text-gray-600">
              Notre équipe multiculturelle comprend les enjeux spécifiques des entrepreneurs issus de la diversité et propose un accompagnement sur-mesure, que ce soit pour la création d'entreprise, la gestion comptable ou le développement international.
            </p>
          </div>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            <div className="text-center">
              <div className="flex justify-center">
                <BookOpen className="h-12 w-12 text-primary" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">Notre Expertise</h3>
              <p className="mt-2 text-gray-600">
                Une équipe qualifiée offrant des services complets en comptabilité, fiscalité et conseil d'entreprise, avec une expertise particulière pour les entrepreneurs franco-maghrébins.
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center">
                <Users className="h-12 w-12 text-primary" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">Notre Équipe</h3>
              <p className="mt-2 text-gray-600">
                Des professionnels multiculturels et expérimentés, comprenant les enjeux spécifiques de votre activité.
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center">
                <Award className="h-12 w-12 text-primary" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">Nos Valeurs</h3>
              <p className="mt-2 text-gray-600">
                Excellence, intégrité et innovation au service de votre réussite, avec une approche inclusive et multiculturelle.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <DirectoryLinks />
        </div>

        <div className="mt-20">
          <CallToAction />
        </div>
      </div>
    </div>
  );
};

export default About;