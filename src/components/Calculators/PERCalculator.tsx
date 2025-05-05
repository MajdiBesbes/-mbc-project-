import React, { useState } from 'react';

const PERCalculator: React.FC = () => {
  const [age, setAge] = useState('');
  const [montantRachat, setMontantRachat] = useState('');
  const [typeRachat, setTypeRachat] = useState('capital');
  const [situation, setSituation] = useState('retraite');
  
  const calculerImposition = () => {
    const montant = parseFloat(montantRachat) || 0;
    let impositionCapital = 0;
    let impositionRente = 0;

    if (typeRachat === 'capital') {
      // Imposition du capital selon l'âge
      const tauxAbattement = parseInt(age) >= 70 ? 0.7 : 0.5;
      impositionCapital = montant * (1 - tauxAbattement) * 0.3; // 30% sur la part imposable
    } else {
      // Imposition de la rente selon l'âge
      const tauxImposable = 
        parseInt(age) < 50 ? 0.7 :
        parseInt(age) < 60 ? 0.5 :
        parseInt(age) < 70 ? 0.4 : 0.3;
      impositionRente = montant * tauxImposable * 0.3;
    }

    return {
      impositionCapital,
      impositionRente,
      montantNet: montant - (typeRachat === 'capital' ? impositionCapital : impositionRente)
    };
  };

  const resultats = calculerImposition();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        Simulateur de sortie du PER
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Âge
          </label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Votre âge"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Montant du rachat
          </label>
          <input
            type="number"
            value={montantRachat}
            onChange={(e) => setMontantRachat(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type de sortie
          </label>
          <select
            value={typeRachat}
            onChange={(e) => setTypeRachat(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="capital">Capital</option>
            <option value="rente">Rente viagère</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Situation
          </label>
          <select
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="retraite">Retraite</option>
            <option value="accident">Accident de la vie</option>
            <option value="surendettement">Surendettement</option>
          </select>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Imposition estimée :</span>
            <span className="font-semibold">
              {typeRachat === 'capital' 
                ? resultats.impositionCapital.toFixed(2)
                : resultats.impositionRente.toFixed(2)} €
            </span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-200">
            <span className="text-gray-600">Montant net estimé :</span>
            <span className="font-semibold text-lg text-primary">{resultats.montantNet.toFixed(2)} €</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PERCalculator;