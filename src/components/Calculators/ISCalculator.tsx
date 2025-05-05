import React, { useState } from 'react';
import ExportPDFButton from '../ExportPDFButton';

const ISCalculator: React.FC = () => {
  const [resultatFiscal, setResultatFiscal] = useState('');
  const [chiffreAffaires, setChiffreAffaires] = useState('');
  const [pme, setPme] = useState(true);
  const [contributionSociale, setContributionSociale] = useState(true);
  
  const calculerIS = () => {
    const resultat = parseFloat(resultatFiscal) || 0;
    const ca = parseFloat(chiffreAffaires) || 0;
    
    // Vérifier si l'entreprise est éligible au taux réduit PME
    const eligibleTauxReduit = pme && ca <= 10000000;
    
    let montantIS = 0;
    
    if (resultat <= 0) {
      return {
        montantIS: 0,
        tauxMoyen: 0,
        detailTranches: []
      };
    }
    
    const detailTranches = [];
    
    // Calcul de l'IS selon les tranches 2025
    if (eligibleTauxReduit && resultat <= 42500) {
      montantIS = resultat * 0.15;
      detailTranches.push({
        tranche: '0 € - 42 500 €',
        taux: '15%',
        montant: montantIS
      });
    } else {
      if (eligibleTauxReduit && resultat > 42500) {
        const tranche1 = 42500 * 0.15;
        montantIS += tranche1;
        detailTranches.push({
          tranche: '0 € - 42 500 €',
          taux: '15%',
          montant: tranche1
        });
        
        const tranche2 = (resultat - 42500) * 0.25;
        montantIS += tranche2;
        detailTranches.push({
          tranche: '> 42 500 €',
          taux: '25%',
          montant: tranche2
        });
      } else {
        // Taux normal pour toutes les entreprises non PME ou CA > 10M€
        montantIS = resultat * 0.25;
        detailTranches.push({
          tranche: 'Totalité du résultat',
          taux: '25%',
          montant: montantIS
        });
      }
    }
    
    // Contribution sociale sur les bénéfices (pour les entreprises avec CA > 7,63M€)
    let montantCSB = 0;
    if (contributionSociale && ca > 7630000 && resultat > 0) {
      montantCSB = resultat * 0.033;
      detailTranches.push({
        tranche: 'Contribution sociale',
        taux: '3,3%',
        montant: montantCSB
      });
      montantIS += montantCSB;
    }
    
    // Calcul du taux moyen d'imposition
    const tauxMoyen = (montantIS / resultat) * 100;
    
    return {
      montantIS,
      tauxMoyen,
      detailTranches
    };
  };

  const resultats = calculerIS();

  const exportData = {
    'Résultat fiscal': `${parseFloat(resultatFiscal || '0').toFixed(2)} €`,
    'Chiffre d\'affaires': `${parseFloat(chiffreAffaires || '0').toFixed(2)} €`,
    'PME': pme ? 'Oui' : 'Non',
    'Contribution sociale': contributionSociale ? 'Oui' : 'Non',
    'Montant IS': `${resultats.montantIS.toFixed(2)} €`,
    'Taux moyen d\'imposition': `${resultats.tauxMoyen.toFixed(2)} %`
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        Simulateur d'Impôt sur les Sociétés (IS)
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Résultat fiscal
          </label>
          <input
            type="number"
            value={resultatFiscal}
            onChange={(e) => setResultatFiscal(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Chiffre d'affaires
          </label>
          <input
            type="number"
            value={chiffreAffaires}
            onChange={(e) => setChiffreAffaires(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="0.00"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="pme"
            checked={pme}
            onChange={(e) => setPme(e.target.checked)}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label htmlFor="pme" className="ml-2 block text-sm text-gray-700">
            PME (capital détenu à 75% par des personnes physiques)
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="contributionSociale"
            checked={contributionSociale}
            onChange={(e) => setContributionSociale(e.target.checked)}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label htmlFor="contributionSociale" className="ml-2 block text-sm text-gray-700">
            Appliquer la contribution sociale (CA &gt; 7,63M€)
          </label>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <h4 className="font-medium text-gray-800 mb-3">Détail du calcul :</h4>
          
          {resultats.detailTranches.map((tranche, index) => (
            <div key={index} className="flex justify-between items-center mb-2">
              <span className="text-gray-600">{tranche.tranche} ({tranche.taux}) :</span>
              <span className="font-semibold">{tranche.montant.toFixed(2)} €</span>
            </div>
          ))}
          
          <div className="flex justify-between items-center pt-2 border-t border-gray-200 mt-2">
            <span className="text-gray-600">Montant total IS :</span>
            <span className="font-semibold text-lg text-primary">{resultats.montantIS.toFixed(2)} €</span>
          </div>
          
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-600">Taux moyen d'imposition :</span>
            <span className="font-semibold">{resultats.tauxMoyen.toFixed(2)} %</span>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <ExportPDFButton data={exportData} type="impot-societes" />
        </div>
      </div>
    </div>
  );
};

export default ISCalculator;