import React from 'react';

const Legal: React.FC = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mentions Légales</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Informations légales</h2>
            <p className="text-gray-600">
              Raison sociale : MBC – Majdi Besbes Conseil<br />
              39 Avenue des Sablons Brouillants<br />
              77100 Meaux<br />
              France<br />
              SIRET : 94307437700012
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Responsable de publication</h2>
            <p className="text-gray-600">
              Majdi BESBES<br />
              Expert-comptable inscrit à l'Ordre des Experts-Comptables d'Île-de-France<br />
              N° d'inscription : 140002898701
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact</h2>
            <p className="text-gray-600">
              Email : majdi.besbes@gmail.com
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Hébergement</h2>
            <p className="text-gray-600">
              Ce site est hébergé par Netlify Inc.<br />
              44 Montgomery Street, Suite 300<br />
              San Francisco, California 94104<br />
              United States
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Protection des données</h2>
            <p className="text-gray-600">
              Les données collectées via les formulaires sont utilisées exclusivement pour la gestion client et le traitement de vos demandes, conformément au RGPD.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Legal;