import React from 'react';
import { Calculator, FileText, Users, BarChart3, Building2, Code, Store, ChefHat, Heart, Truck, Smartphone, Globe, Shield, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import ServiceCard from '../components/ServiceCard';
import ServiceCreationCTA from '../components/ServiceCreationCTA';

const Services: React.FC = () => {
  const sectors = [
    {
      icon: <Building2 className="w-12 h-12" />,
      title: "Bâtiment & Immobilier",
      description: "Expertise comptable spécialisée pour les professionnels du BTP et de l'immobilier"
    },
    {
      icon: <Code className="w-12 h-12" />,
      title: "Technologie & Informatique",
      description: "Accompagnement des startups et entreprises du numérique"
    },
    {
      icon: <Store className="w-12 h-12" />,
      title: "Commerce & Industrie",
      description: "Solutions adaptées aux commerçants et industriels"
    },
    {
      icon: <ChefHat className="w-12 h-12" />,
      title: "Restauration & Hôtellerie",
      description: "Expertise dédiée aux métiers de la restauration et de l'hôtellerie"
    },
    {
      icon: <Heart className="w-12 h-12" />,
      title: "Santé & Éducation",
      description: "Accompagnement des professionnels de santé et établissements d'enseignement"
    },
    {
      icon: <Truck className="w-12 h-12" />,
      title: "Transport",
      description: "Solutions comptables pour les entreprises de transport et logistique"
    }
  ];

  const digitalAdvantages = [
    {
      icon: <Smartphone className="w-10 h-10 text-primary" />,
      title: "Accessibilité 24/7",
      description: "Accédez à vos documents et échangez avec votre expert-comptable à tout moment, où que vous soyez"
    },
    {
      icon: <Clock className="w-10 h-10 text-primary" />,
      title: "Gain de temps",
      description: "Automatisation des tâches répétitives et transmission instantanée des documents"
    },
    {
      icon: <Shield className="w-10 h-10 text-primary" />,
      title: "Sécurité maximale",
      description: "Stockage sécurisé de vos données avec chiffrement et authentification à deux facteurs"
    },
    {
      icon: <Globe className="w-10 h-10 text-primary" />,
      title: "Collaboration sans frontières",
      description: "Travaillez avec votre expert-comptable où que vous soyez, idéal pour les entrepreneurs franco-maghrébins"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[60vh]">
        <div className="absolute inset-0">
          <img 
            src="https://images.pexels.com/photos/4475523/pexels-photo-4475523.jpeg"
            alt="Services MBC Consulting"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
        </div>
        <div className="relative h-full container mx-auto px-4 flex items-center">
          <div className="max-w-3xl text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Libérez-vous des contraintes administratives
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Nous prenons en charge vos obligations comptables et fiscales pour vous permettre de vous concentrer sur votre activité
            </p>
            <Link 
              to="/devis" 
              className="inline-block px-8 py-4 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
            >
              Obtenir un devis
            </Link>
          </div>
        </div>
      </section>

      {/* Digital Cabinet Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              100% DIGITAL
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Un cabinet d'expertise comptable moderne et connecté
            </h2>
            <p className="text-xl text-gray-600">
              MBC est un cabinet 100% digitalisé qui utilise les dernières technologies pour vous offrir un service comptable efficace, sécurisé et accessible à tout moment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {digitalAdvantages.map((advantage, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mb-6 mx-auto">
                  {advantage.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                  {advantage.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {advantage.description}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 rounded-lg p-8 shadow-md">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Notre écosystème digital
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 text-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="ml-2 text-gray-700">Espace client sécurisé avec authentification à deux facteurs</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 text-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="ml-2 text-gray-700">Logiciels comptables connectés à votre banque et à vos outils de facturation</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 text-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="ml-2 text-gray-700">Signature électronique pour tous vos documents officiels</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 text-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="ml-2 text-gray-700">Tableaux de bord personnalisés avec indicateurs clés de performance</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 text-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="ml-2 text-gray-700">Assistance multicanal : chat, visioconférence, téléphone, email</span>
                  </li>
                </ul>
              </div>
              <div className="md:w-1/2">
                <img 
                  src="https://images.pexels.com/photos/7567434/pexels-photo-7567434.jpeg" 
                  alt="Écosystème digital MBC" 
                  className="rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Nos Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <ServiceCard
              id="comptabilite"
              title="Expertise Comptable"
              description="Sortez du chaos administratif avec une gestion comptable claire et organisée"
              icon={<Calculator className="h-12 w-12" />}
              illustration="https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg"
              isDigital={true}
            />
            <ServiceCard
              id="fiscalite"
              title="Fiscalité"
              description="Naviguez sereinement dans le labyrinthe fiscal"
              icon={<FileText className="h-12 w-12" />}
              illustration="https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg"
              isDigital={true}
            />
            <ServiceCard
              id="social"
              title="Social & Paie"
              description="Simplifiez la gestion de vos obligations sociales et salariales"
              icon={<Users className="h-12 w-12" />}
              illustration="https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg"
              isDigital={true}
            />
            <ServiceCard
              id="conseil"
              title="Conseil"
              description="Construisez votre succès avec un accompagnement stratégique personnalisé"
              icon={<BarChart3 className="h-12 w-12" />}
              illustration="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg"
              isDigital={true}
            />
            <ServiceCard
              id="previsionnel"
              title="Prévisionnel financier"
              description="Business plan complet sur 3 ans avec hypothèses solides et simulations fiscales. Idéal pour les demandes de financement."
              icon={<BarChart3 className="h-12 w-12" />}
              illustration="https://images.pexels.com/photos/7681091/pexels-photo-7681091.jpeg"
              isDigital={true}
            />
          </div>

          {/* Creation Entreprise CTA */}
          <div className="mb-16">
            <ServiceCreationCTA />
          </div>

          {/* Sectors Section */}
          <div className="mt-24">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
              Nos Secteurs d'Expertise
            </h2>
            <p className="text-xl text-center text-gray-600 mb-12">
              Une expertise adaptée à votre secteur d'activité
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sectors.map((sector, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="text-primary mb-6">
                    {sector.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {sector.title}
                  </h3>
                  <p className="text-gray-600">
                    {sector.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center space-y-4 mt-16">
            <Link 
              to="/devis" 
              className="inline-block px-8 py-4 bg-primary text-white rounded-md shadow-lg hover:bg-primary-dark transition-colors mr-4"
            >
              Obtenir un devis personnalisé
            </Link>
            <Link 
              to="/contact" 
              className="inline-block px-8 py-4 bg-white text-primary border-2 border-primary rounded-md shadow-lg hover:bg-gray-50 transition-colors"
            >
              Prendre rendez-vous avec un expert
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;