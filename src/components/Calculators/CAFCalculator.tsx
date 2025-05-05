import React, { useState } from 'react';

const CAFCalculator: React.FC = () => {
  const [revenusFiscaux, setRevenusFiscaux] = useState('');
  const [loyer, setLoyer] = useState('');
  const [situation, setSituation] = useState('seul');
  const [enfants, setEnfants] = useState('0');
  const [zone, setZone] = useState('1');
  
  const calculerAides = () => {
    const revenus = parseFloat(revenusFiscaux) || 0;
    const loyerMensuel = parseFloat(loyer) || 0;
    let aideEstimee = 0;

    // Calcul simplifié des aides au logement
    if (revenus > 0 && loyerMensuel > 0) {
      const coefficientZone = zone === '1' ? 1 : zone === '2' ? 0.85 : 0.75;
      const coefficientFamilial = 
        situation === 'seul' ? 1 :
        situation === 'couple' ? 1.5 : 1.3;
      
      const plafondRevenus = 
        situation === 'seul' ? 25000 :
        situation === 'couple' ? 35000 : 30000;
      
      if (revenus <= plafondRevenus) {
        const tauxEffort = loyerMensuel / (revenus / 12);
        if (tauxEffort > 0.3) { // Si le loyer représente plus de 30% des revenus
          aideEstimee = (loyerMensuel - (revenus / 12) * 0.3) * coefficientZone * coefficientFamilial;
          aideEstimee *= (1 + parseInt(enfants) * 0.1); // Majoration par enfant
          aideEstimee = Math.min(aideEstimee, loyerMensuel * 0.8); // Plafonnement à 80% du loyer
        }
      }
    }

    return {
      aideEstimee: Math.round(aideEstimee)
    };
  };

  const resultats = calculerAides();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        Simulateur d'aides au logement
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Revenus fiscaux annuels
          </label>
          <input
            type="number"
            value={revenusFiscaux}
            onChange={(e) => setRevenusFiscaux(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Loyer mensuel (charges comprises)
          </label>
          <input
            type="number"
            value={loyer}
            onChange={(e) => setLoyer(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Situation familiale
          </label>
          <select
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="seul">Personne seule</option>
            <option value="couple">Couple</option>
            <option value="monoparental">Famille monoparentale</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre d'enfants à charge
          </label>
          <select
            value={enfants}
            onChange={(e) => setEnfants(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {[0, 1, 2, 3, 4, 5].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Zone géographique
          </label>
          <select
            value={zone}
            onChange={(e) => setZone(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="1">Zone 1 (Paris et grandes villes)</option>
            <option value="2">Zone 2 (Villes moyennes)</option>
            <option value="3">Zone 3 (Autres communes)</option>
          </select>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Aide mensuelle estimée :</span>
            <span className="font-semibold text-lg text-primary">{resultats.aideEstimee} €</span>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            * Cette estimation est donnée à titre indicatif. Le montant réel de votre aide peut varier en fonction de votre situation précise.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CAFCalculator;