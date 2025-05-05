import React, { useState } from 'react';

const DividendesCalculator: React.FC = () => {
  const [montantBrut, setMontantBrut] = useState('');
  const [optionImposition, setOptionImposition] = useState('pfu');
  const [trancheImpot, setTrancheImpot] = useState('30');
  
  const calculerMontantNet = () => {
    const montant = parseFloat(montantBrut) || 0;
    let prelevementsSociaux = montant * 0.175; // 17.5% de prélèvements sociaux
    let impot = 0;

    if (optionImposition === 'pfu') {
      impot = montant * 0.125; // 12.5% d'impôt forfaitaire (PFU)
    } else {
      impot = montant * (parseFloat(trancheImpot) / 100);
    }

    return {
      prelevementsSociaux,
      impot,
      montantNet: montant - prelevementsSociaux - impot
    };
  };

  const resultats = calculerMontantNet();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        Simulateur de fiscalité des dividendes
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Montant brut des dividendes
          </label>
          <input
            type="number"
            value={montantBrut}
            onChange={(e) => setMontantBrut(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Option d'imposition
          </label>
          <select
            value={optionImposition}
            onChange={(e) => setOptionImposition(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="pfu">Prélèvement Forfaitaire Unique (PFU)</option>
            <option value="bareme">Barème progressif</option>
          </select>
        </div>

        {optionImposition === 'bareme' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tranche marginale d'imposition
            </label>
            <select
              value={trancheImpot}
              onChange={(e) => setTrancheImpot(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="11">11%</option>
              <option value="30">30%</option>
              <option value="41">41%</option>
              <option value="45">45%</option>
            </select>
          </div>
        )}

        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Prélèvements sociaux :</span>
            <span className="font-semibold">{resultats.prelevementsSociaux.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Impôt sur le revenu :</span>
            <span className="font-semibold">{resultats.impot.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-200">
            <span className="text-gray-600">Net après impôt :</span>
            <span className="font-semibold text-lg text-primary">{resultats.montantNet.toFixed(2)} €</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DividendesCalculator;