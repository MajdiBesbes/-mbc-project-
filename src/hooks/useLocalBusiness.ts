import { useEffect } from 'react';
import { LocalBusiness } from 'schema-dts';

export const useLocalBusiness = () => {
  useEffect(() => {
    const localBusinessSchema: LocalBusiness = {
      "@context": "https://schema.org",
      "@type": "AccountingService",
      "name": "MBC High Value Business Consulting",
      "image": "https://mbc-consulting.fr/images/logo.png",
      "description": "Cabinet d'expertise comptable spécialisé dans l'accompagnement des entrepreneurs franco-maghrébins en Île-de-France",
      "@id": "https://mbc-consulting.fr",
      "url": "https://mbc-consulting.fr",
      "telephone": "+33676570097",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "39 Avenue des Sablons Brouillants",
        "addressLocality": "Paris",
        "postalCode": "75000",
        "addressRegion": "Île-de-France",
        "addressCountry": "FR"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 48.8566,
        "longitude": 2.3522
      },
      "areaServed": [
        {
          "@type": "GeoCircle",
          "geoMidpoint": {
            "@type": "GeoCoordinates",
            "latitude": 48.8566,
            "longitude": 2.3522
          },
          "geoRadius": "50000"
        }
      ],
      "knowsLanguage": ["fr", "ar", "en"],
      "priceRange": "€€",
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
      "specialty": [
        "Expertise comptable franco-maghrébine",
        "Comptabilité internationale",
        "Fiscalité France-Maghreb",
        "Création d'entreprise"
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(localBusinessSchema);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);
};