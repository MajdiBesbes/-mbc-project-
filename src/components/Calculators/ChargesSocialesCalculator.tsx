import React, { useState } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { useSimulationStorage, SimulationData } from '../../hooks/useSimulationStorage';
import SaveSimulationModal from './SaveSimulationModal';
import ExportPDFButton from '../ExportPDFButton';

const ChargesSocialesCalculator: React.FC = () => {
  const [remuneration, setRemuneration] = useState('');
  const [statut, setStatut] = useState('sasu');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { 
    saveSimulation, 
    getSimulationsByType, 
    deleteSimulation 
  } = useSimulationStorage();
  
  const calculateCharges = () => {
    const remunerationNum = parseFloat(remuneration) || 0;
    let charges = 0;
    
    switch (statut) {
      case 'sasu':
        charges = remunerationNum * 0.45; // Approximation
        break;
      case 'eurl':
        charges = remunerationNum * 0.40; // Approximation
        break;
      case 'ae':
        charges = remunerationNum * 0.22; // Approximation
        break;
    }
    
    return charges;
  };

  const charges = calculateCharges();
  const netApresCharges = (parseFloat(remuneration) || 0) - charges;

  const handleSaveSimulation = (name: string) => {
    setLoading(true);
    try {
      const simulationData = {
        remuneration,
        statut
      };
      
      saveSimulation('charges-sociales', name, simulationData);
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
      setRemuneration(data.remuneration || '');
      setStatut(data.statut || 'sasu');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erreur lors du chargement de la simulation:', error);
    } finally {
      setLoading(false);
    }
  };

  const resultats = {
    'Statut': statut === 'sasu' ? 'Président de SASU' : 
              statut === 'eurl' ? 'Gérant d\'EURL' : 'Auto-entrepreneur',
    'Rémunération brute': `${parseFloat(remuneration || '0').toFixed(2)} €`,
    'Charges sociales': `${charges.toFixed(2)} €`,
    'Net après charges': `${netApresCharges.toFixed(2)} €`
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        Simulateur de charges sociales
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rémunération brute annuelle
          </label>
          <input
            type="number"
            value={remuneration}
            onChange={(e) => setRemuneration(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Statut juridique
          </label>
          <select
            value={statut}
            onChange={(e) => setStatut(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="sasu">Président de SASU</option>
            <option value="eurl">Gérant d'EURL</option>
            <option value="ae">Auto-entrepreneur</option>
          </select>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Total charges sociales :</span>
            <span className="font-semibold">{charges.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Net après charges :</span>
            <span className="font-semibold">{netApresCharges.toFixed(2)} €</span>
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-4">
          * Ces calculs sont des estimations. Consultez un expert-comptable pour des calculs précis.
        </p>
        
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
          
          <ExportPDFButton data={resultats} type="charges-sociales" />
        </div>
      </div>
      
      {isModalOpen && (
        <SaveSimulationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveSimulation}
          type="charges-sociales"
          savedSimulations={getSimulationsByType('charges-sociales')}
          onLoad={handleLoadSimulation}
          onDelete={deleteSimulation}
        />
      )}
    </div>
  );
};

export default ChargesSocialesCalculator;