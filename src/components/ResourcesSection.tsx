import React from 'react';
import { FileDown, FileText } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  fileType: string;
  fileSize: string;
}

const resources: Resource[] = [
  {
    id: '1',
    title: 'Guide de la création d\'entreprise 2025',
    description: 'Toutes les étapes pour créer votre entreprise avec succès',
    fileUrl: '/resources/guide-creation-entreprise-2025.pdf',
    fileType: 'PDF',
    fileSize: '2.4 MB'
  },
  {
    id: '2',
    title: 'Les régimes fiscaux expliqués',
    description: 'Comprendre et choisir le régime fiscal adapté à votre activité',
    fileUrl: '/resources/regimes-fiscaux-2025.pdf',
    fileType: 'PDF',
    fileSize: '1.8 MB'
  },
  {
    id: '3',
    title: 'Infographie : Calendrier fiscal 2025',
    description: 'Toutes les échéances fiscales à ne pas manquer',
    fileUrl: '/resources/calendrier-fiscal-2025.pdf',
    fileType: 'PDF',
    fileSize: '856 KB'
  },
  {
    id: '4',
    title: 'Guide de la paie',
    description: 'Les fondamentaux de la gestion de la paie',
    fileUrl: '/resources/guide-paie-2025.pdf',
    fileType: 'PDF',
    fileSize: '3.2 MB'
  }
];

const ResourcesSection: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ressources et Documentation
          </h2>
          <p className="text-xl text-gray-600">
            Téléchargez nos guides et infographies pour approfondir vos connaissances
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="bg-gray-50 rounded-lg p-6 flex items-start space-x-4 hover:bg-gray-100 transition-colors"
            >
              <div className="bg-primary/10 rounded-lg p-3">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {resource.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {resource.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {resource.fileType} • {resource.fileSize}
                  </div>
                  <a
                    href={resource.fileUrl}
                    download
                    className="inline-flex items-center text-primary hover:text-primary-dark"
                  >
                    <FileDown className="w-5 h-5 mr-2" />
                    <span>Télécharger</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResourcesSection;