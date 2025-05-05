import React, { useState } from 'react';
import ExportPDFButton from '../ExportPDFButton';

const MicroEntrepriseCalculator: React.FC = () => {
  const [chiffreAffaires, setChiffreAffaires] = useState('');
  const [regime, setRegime] = useState('bic-vente');
  const [accre, setAccre] = useState(false);
  const [annee, setAnnee] = useState('1');
  
  // Taux de cotisations sociales 2025 (à ajuster selon les taux réels)
  const tauxCotisations = {
    'bic-vente': {
      normal: 0.123,
      accre: {
        '1': 0.031, // 25% du taux normal pour la 1ère année
        '2': 0.062, // 50% du taux normal pour la 2ème année
        '3': 0.092  // 75% du taux normal pour la 3ème année
      }
    },
    'bic-service': {
      normal: 0.213,
      accre: {
        '1': 0.053, // 25% du taux normal
        '2': 0.107, // 50% du taux normal
        '3': 0.160  // 75% du taux normal
      }
    },
    'bnc': {
      normal: 0.223,
      accre: {
        '1': 0.056, // 25% du taux normal
        '2': 0.112, // 50% du taux normal
        '3': 0.167  // 75% du taux normal
      }
    }
  };

  // Taux d'imposition forfaitaire (versement libératoire)
  const tauxImpot = {
    'bic-vente': 0.01,
    'bic-service': 0.017,
    'bnc': 0.022
  };

  // Plafonds de chiffre d'affaires 2025
  const plafonds = {
    'bic-vente': 188700,
    'bic-service': 77700,
    'bnc': 77700
  };

  const calculerCotisations = () => {
    const ca = parseFloat(chiffreAffaires) || 0;
    
    // Vérifier si le CA dépasse le plafond
    const plafond = plafonds[regime as keyof typeof plafonds];
    if (ca > plafond) {
      return {
        depassement: true,
        cotisationsSociales: 0,
        impot: 0,
        revenuNet: 0,
        tauxPrelevement: 0
      };
    }
    
    // Calculer les cotisations sociales
    let tauxCotisation;
    if (accre) {
      tauxCotisation = tauxCotisations[regime as keyof typeof tauxCotisations].accre[annee as keyof typeof tauxCotisations['bic-vente']['accre']];
    } else {
      tauxCotisation = tauxCotisations[regime as keyof typeof tauxCotisations].normal;
    }
    
    const cotisationsSociales = ca * tauxCotisation;
    
    // Calculer l'impôt (versement libératoire)
    const tauxImposition = tauxImpot[regime as keyof typeof tauxImpot];
    const impot = ca * tauxImposition;
    
    // Calculer le revenu net
    const revenuNet = ca - cotisationsSociales - impot;
    
    // Calculer le taux de prélèvement global
    const tauxPrelevement = (cotisationsSociales + impot) / ca * 100;
    
    return {
      depassement: false,
      cotisationsSociales,
      impot,
      revenuNet,
      tauxPrelevement
    };
  };

  const resultats = calculerCotisations();

  const exportData = {
    'Régime': regime === 'bic-vente' ? 'Micro-BIC (vente)' : 
              regime === 'bic-service' ? 'Micro-BIC (services)' : 'Micro-BNC',
    'Chiffre d\'affaires': `${parseFloat(chiffreAffaires || '0').toFixed(2)} €`,
    'ACCRE': accre ? 'Oui' : 'Non',
    'Année ACCRE': accre ? annee : 'N/A',
    'Cotisations sociales': `${resultats.cotisationsSociales.toFixed(2)} €`,
    'Impôt (versement libératoire)': `${resultats.impot.toFixed(2)} €`,
    'Revenu net': `${resultats.revenuNet.toFixed(2)} €`,
    'Taux de prélèvement global': `${resultats.tauxPrelevement.toFixed(2)} %`
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        Simulateur Micro-Entreprise
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Régime fiscal
          </label>
          <select
            value={regime}
            onChange={(e) => setRegime(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="bic-vente">Micro-BIC (vente de marchandises)</option>
            <option value="bic-service">Micro-BIC (prestation de services)</option>
            <option value="bnc">Micro-BNC (professions libérales)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Chiffre d'affaires annuel
          </label>
          <input
            type="number"
            value={chiffreAffaires}
            onChange={(e) => setChiffreAffaires(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="0.00"
          />
          <p className="mt-1 text-xs text-gray-500">
            Plafond : {plafonds[regime as keyof typeof plafonds].toLocaleString()} €
          </p>
        </div>

        <div>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="accre"
              checked={accre}
              onChange={(e) => setAccre(e.target.checked)}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="accre" className="ml-2 block text-sm text-gray-700">
              Bénéficiaire de l'ACRE
            </label>
          </div>
          
          {accre && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Année d'activité
              </label>
              <select
                value={annee}
                onChange={(e) => setAnnee(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="1">1ère année</option>
                <option value="2">2ème année</option>
                <option value="3">3ème année</option>
              </select>
            </div>
          )}
        </div>

        {resultats.depassement ? (
          <div className="p-4 bg-red-50 text-red-700 rounded-md mt-4">
            <p className="font-medium">Attention : dépassement de plafond</p>
            <p className="text-sm mt-1">
              Le chiffre d'affaires saisi dépasse le plafond autorisé pour le régime sélectionné.
              Veuillez ajuster votre saisie ou envisager un autre régime fiscal.
            </p>
          </div>
        ) : (
          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Cotisations sociales :</span>
              <span className="font-semibold">{resultats.cotisationsSociales.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Impôt (versement libératoire) :</span>
              <span className="font-semibold">{resultats.impot.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <span className="text-gray-600">Revenu net :</span>
              <span className="font-semibold text-lg text-primary">{resultats.revenuNet.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-600">Taux de prélèvement global :</span>
              <span className="font-semibold">{resultats.tauxPrelevement.toFixed(2)} %</span>
            </div>
          </div>
        )}

        <div className="pt-4 flex justify-end">
          <ExportPDFButton data={exportData} type="micro-entreprise" />
        </div>
      </div>
    </div>
  );
};

export default MicroEntrepriseCalculator;