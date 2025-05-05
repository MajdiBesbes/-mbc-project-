import React from 'react';

const Privacy: React.FC = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Politique de Confidentialité</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Protection de vos données</h2>
            <p className="text-gray-600">
              MBC respecte votre vie privée et s'engage à protéger les données personnelles que vous nous confiez.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Données collectées</h2>
            <p className="text-gray-600">
              Les données collectées via nos formulaires (nom, email, téléphone) sont utilisées uniquement pour :
            </p>
            <ul className="list-disc list-inside text-gray-600 mt-2">
              <li>Le traitement de vos demandes</li>
              <li>La gestion de la relation client</li>
              <li>L'amélioration de nos services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Cookies</h2>
            <p className="text-gray-600">
              Notre site utilise uniquement des cookies de mesure d'audience pour améliorer votre expérience de navigation.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Vos droits</h2>
            <p className="text-gray-600">
              Conformément au RGPD, vous pouvez à tout moment :
            </p>
            <ul className="list-disc list-inside text-gray-600 mt-2">
              <li>Accéder à vos données personnelles</li>
              <li>Les modifier ou les supprimer</li>
              <li>Vous opposer à leur traitement</li>
            </ul>
            <p className="text-gray-600 mt-4">
              Pour exercer ces droits, contactez-nous à l'adresse : majdi.besbes@gmail.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;