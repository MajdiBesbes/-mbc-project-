import React, { useState } from 'react';
import { X, Save, Trash2 } from 'lucide-react';
import { SimulationData } from '../../hooks/useSimulationStorage';

interface SaveSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  type: string;
  savedSimulations: SimulationData[];
  onLoad: (simulation: SimulationData) => void;
  onDelete: (id: string) => void;
}

const SaveSimulationModal: React.FC<SaveSimulationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  type,
  savedSimulations,
  onLoad,
  onDelete
}) => {
  const [simulationName, setSimulationName] = useState('');
  const [activeTab, setActiveTab] = useState<'save' | 'load'>('save');
  
  if (!isOpen) return null;
  
  const handleSave = () => {
    if (simulationName.trim()) {
      onSave(simulationName);
      setSimulationName('');
      onClose();
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getSimulationTypeLabel = (type: string) => {
    switch (type) {
      case 'tva': return 'TVA';
      case 'charges-sociales': return 'Charges sociales';
      case 'dividendes': return 'Dividendes';
      case 'per': return 'PER';
      case 'caf': return 'CAF';
      case 'micro-entreprise': return 'Micro-entreprise';
      case 'impot-societes': return 'Impôt sur les sociétés';
      default: return type;
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {activeTab === 'save' ? 'Sauvegarder la simulation' : 'Charger une simulation'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white transition-colors"
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'save'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
              onClick={() => setActiveTab('save')}
            >
              Sauvegarder
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'load'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
              onClick={() => setActiveTab('load')}
            >
              Charger
            </button>
          </div>
          
          {activeTab === 'save' ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="simulation-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nom de la simulation
                </label>
                <input
                  id="simulation-name"
                  type="text"
                  value={simulationName}
                  onChange={(e) => setSimulationName(e.target.value)}
                  placeholder="Ex: Ma simulation TVA mai 2025"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <p className="text-sm text-gray-500 dark:text-gray-400">
                La simulation sera sauvegardée localement sur votre appareil.
              </p>
              
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={!simulationName.trim()}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-colors disabled:opacity-50 flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder
                </button>
              </div>
            </div>
          ) : (
            <div>
              {savedSimulations.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    Aucune simulation sauvegardée pour ce type de calcul.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {savedSimulations.map((simulation) => (
                    <div
                      key={simulation.id}
                      className="p-3 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {simulation.name}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {getSimulationTypeLabel(simulation.type)} • {formatDate(simulation.date)}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => onDelete(simulation.id)}
                            className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors"
                            aria-label="Supprimer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => onLoad(simulation)}
                        className="mt-2 w-full px-3 py-1 text-sm text-primary border border-primary rounded-md hover:bg-primary hover:text-white transition-colors"
                      >
                        Charger cette simulation
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SaveSimulationModal;