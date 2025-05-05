import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: string;
  keywords?: string;
  author?: string;
  language?: string;
  structuredData?: Record<string, any>;
}

const SEO: React.FC<SEOProps> = ({
  title = 'MBC High Value Business Consulting - Expert-Comptable à Paris et Île-de-France',
  description = 'Cabinet d\'expertise comptable à Paris spécialisé dans l\'accompagnement des entrepreneurs franco-maghrébins. Services de comptabilité, fiscalité, conseil et gestion de paie adaptés aux TPE/PME.',
  canonical = 'https://mbc-consulting.fr',
  image = '/images/logo.png',
  type = 'website',
  keywords = 'expert-comptable Paris, expert-comptable Île-de-France, comptabilité Tunisiens Paris, expert-comptable franco-maghrébin, création entreprise Paris, Majdi BESBES',
  author = 'Majdi BESBES',
  language = 'fr',
  structuredData
}) => {
  // Données structurées par défaut pour un cabinet d'expertise comptable
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "AccountingService",
    "name": "MBC High Value Business Consulting",
    "image": image,
    "description": description,
    "@id": canonical,
    "url": canonical,
    "telephone": "+33676570097",
    "priceRange": "€€",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "39 Avenue des Sablons Brouillants",
      "addressLocality": "Meaux",
      "postalCode": "77100",
      "addressRegion": "Île-de-France",
      "addressCountry": "FR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 48.960175,
      "longitude": 2.878192
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    },
    "sameAs": [
      "https://www.linkedin.com/company/mbc-consulting",
      "https://www.facebook.com/mbcconsulting",
      "https://www.instagram.com/mbc.consulting",
      "https://www.tiktok.com/@mbc.consulting",
      "https://annuaire.experts-comptables.org/expert-comptable/majdi-besbes",
      "https://www.pagesjaunes.fr/mbc-consulting"
    ],
    "founder": {
      "@type": "Person",
      "name": "Majdi BESBES",
      "jobTitle": "Expert-Comptable",
      "description": "Expert-comptable spécialisé dans l'accompagnement des entrepreneurs franco-maghrébins"
    }
  };

  const finalStructuredData = structuredData || defaultStructuredData;

  return (
    <Helmet>
      <html lang={language} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={canonical} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#0055A4" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content="MBC High Value Business Consulting" />
      <meta property="og:locale" content="fr_FR" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Géolocalisation */}
      <meta name="geo.region" content="FR-IDF" />
      <meta name="geo.placename" content="Meaux" />
      <meta name="geo.position" content="48.960175;2.878192" />
      <meta name="ICBM" content="48.960175, 2.878192" />

      {/* Préchargement des polices */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" />

      {/* Schema.org - Local Business */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>
    </Helmet>
  );
};

export default SEO;