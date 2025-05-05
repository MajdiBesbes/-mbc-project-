import React from 'react';
import { ExternalLink } from 'lucide-react';

const DirectoryLinks: React.FC = () => {
  const directories = [
    {
      name: "Ordre des Experts-Comptables",
      logo: "https://www.experts-comptables.fr/themes/custom/oec/logo.svg",
      url: "https://annuaire.experts-comptables.org/expert-comptable/majdi-besbes",
      shortName: "OEC"
    },
    {
      name: "Pages Jaunes",
      logo: "https://www.pagesjaunes.fr/static/img/pj-logo.svg",
      url: "https://www.pagesjaunes.fr/pros/mbc-consulting",
      shortName: "Pages Jaunes"
    },
    {
      name: "Chambre Tunisienne de Commerce",
      logo: "https://www.ccitunis.org.tn/wp-content/uploads/2019/02/logo-ccit.png",
      url: "https://www.ccitunis.org.tn/annuaire",
      shortName: "CCIT"
    },
    {
      name: "CCIF - CCI Franco-Tunisienne",
      logo: "https://www.ccif-tunisie.com/logo.png",
      url: "https://www.ccif-tunisie.com/membres",
      shortName: "CCIF"
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Retrouvez-nous sur</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {directories.map((directory) => (
          <a
            key={directory.name}
            href={directory.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center p-4 border rounded-lg hover:shadow-md transition-shadow"
          >
            <img
              src={directory.logo}
              alt={directory.name}
              className="h-12 object-contain mb-2"
            />
            <span className="text-sm text-gray-600 flex items-center">
              {directory.shortName} <ExternalLink className="w-4 h-4 ml-1" />
            </span>
          </a>
        ))}
      </div>
      
      <div className="mt-8 text-center text-sm text-gray-600">
        <p>Cabinet d'expertise comptable inscrit à l'Ordre des Experts-Comptables d'Île-de-France</p>
        <p className="mt-1">Spécialisé dans l'accompagnement des entrepreneurs franco-maghrébins</p>
      </div>
    </div>
  );
};

export default DirectoryLinks;