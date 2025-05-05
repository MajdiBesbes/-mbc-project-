import React, { useState, useEffect } from 'react';
import ExportPDFButton from '../ExportPDFButton';
import { Save, Loader2 } from 'lucide-react';
import { useSimulationStorage, SimulationData } from '../../hooks/useSimulationStorage';
import SaveSimulationModal from './SaveSimulationModal';

const TVACalculator: React.FC = () => {
  const [montantHT, setMontantHT] = useState('');
  const [tauxTVA, setTauxTVA] = useState('20');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { 
    saveSimulation, 
    getSimulationsByType, 
    deleteSimulation 
  } = useSimulationStorage();
  
  const montantTVA = montantHT ? parseFloat(montantHT) * (parseFloat(tauxTVA) / 100) : 0;
  const montantTTC = montantHT ? parseFloat(montantHT) + montantTVA : 0;

  const resultats = {
    'Montant HT': `${parseFloat(montantHT || '0').toFixed(2)} €`,
    'Taux TVA': `${tauxTVA}%`,
    'Montant TVA': `${montantTVA.toFixed(2)} €`,
    'Montant TTC': `${montantTTC.toFixed(2)} €`
  };

  const handleSaveSimulation = (name: string) => {
    setLoading(true);
    try {
      const simulationData = {
        montantHT,
        tauxTVA
      };
      
      saveSimulation('tva', name, simulationData);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la simulation:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleLoadSimulation = (simulation: SimulationData) => {
    setLoading(true);
    try {
      const { data } = simulation;
      setMontantHT(data.montantHT || '');
      setTauxTVA(data.tauxTVA || '20');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erreur lors du chargement de la simulation:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Calculateur de TVA</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Montant HT
          </label>
          <input
            type="number"
            value={montantHT}
            onChange={(e) => setMontantHT(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Taux de TVA
          </label>
          <select
            value={tauxTVA}
            onChange={(e) => setTauxTVA(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="20">20%</option>
            <option value="10">10%</option>
            <option value="5.5">5.5%</option>
            <option value="2.1">2.1%</option>
          </select>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Montant TVA :</span>
            <span className="font-semibold">{montantTVA.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Montant TTC :</span>
            <span className="font-semibold">{montantTTC.toFixed(2)} €</span>
          </div>
        </div>

        <div className="pt-4 flex justify-between">
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary hover:text-white transition-colors disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <Save className="w-5 h-5 mr-2" />
            )}
            Sauvegarder / Charger
          </button>
          
          <ExportPDFButton data={resultats} type="tva" />
        </div>
      </div>
      
      {isModalOpen && (
        <SaveSimulationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveSimulation}
          type="tva"
          savedSimulations={getSimulationsByType('tva')}
          onLoad={handleLoadSimulation}
          onDelete={deleteSimulation}
        />
      )}
    </div>
  );
};

export default TVACalculator;