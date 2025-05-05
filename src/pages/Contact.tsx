import React, { useState } from 'react';
import ContactForm from '../components/ContactForm';
import GoogleMap from '../components/GoogleMap';
import NewsletterForm from '../components/NewsletterForm';
import CalendlyWidget from '../components/CalendlyWidget';
import DiagnosticForm from '../components/DiagnosticForm';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Contact: React.FC = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const handleFormSubmit = () => {
    setFormSubmitted(true);
  };
  
  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contactez-nous</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Notre équipe est à votre disposition pour répondre à toutes vos questions
          </p>
        </div>

        <div className="max-w-7xl mx-auto mb-16">
          {/* Calendly Widget */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Prendre rendez-vous en ligne</h2>
            <CalendlyWidget />
          </div>

          {/* Diagnostic Form */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Diagnostic rapide de vos besoins</h2>
            <DiagnosticForm />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Formulaire de contact</h2>
                {formSubmitted ? (
                  <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-green-700">
                          Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <ContactForm onSubmitSuccess={handleFormSubmit} />
                )}
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Nos coordonnées</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <MapPin className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <div className="ml-4">
                      <h3 className="font-semibold text-gray-900">Adresse</h3>
                      <p className="text-gray-600">39 Avenue des Sablons Brouillants</p>
                      <p className="text-gray-600">77100 Meaux</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Phone className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <div className="ml-4">
                      <h3 className="font-semibold text-gray-900">Téléphone</h3>
                      <p className="text-gray-600">Mobile : <a href="tel:+33676570097" className="hover:text-primary">06 76 57 00 97</a></p>
                      <p className="text-gray-600">Fixe : <a href="tel:+33422138447" className="hover:text-primary">04 22 13 84 47</a></p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Mail className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <div className="ml-4">
                      <h3 className="font-semibold text-gray-900">Email</h3>
                      <p className="text-gray-600">
                        <a href="mailto:majdi.besbes@gmail.com" className="hover:text-primary">
                          majdi.besbes@gmail.com
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Clock className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <div className="ml-4">
                      <h3 className="font-semibold text-gray-900">Horaires d'ouverture</h3>
                      <p className="text-gray-600">Du lundi au vendredi</p>
                      <p className="text-gray-600">9h00 - 18h00</p>
                    </div>
                  </div>
                </div>
              </div>

              <NewsletterForm />
            </div>
          </div>
        </div>

        {/* Google Maps */}
        <div className="rounded-lg overflow-hidden shadow-lg">
          <GoogleMap />
        </div>
      </div>
    </div>
  );
};

export default Contact;