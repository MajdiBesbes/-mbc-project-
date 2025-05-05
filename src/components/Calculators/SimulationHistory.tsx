import React, { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Trash2, Clock, FileText } from 'lucide-react';
import { SimulationData, useSimulationStorage } from '../../hooks/useSimulationStorage';

interface SimulationHistoryProps {
  onLoad: (simulation: SimulationData) => void;
}

const SimulationHistory: React.FC<SimulationHistoryProps> = ({ onLoad }) => {
  const { simulations, deleteSimulation } = useSimulationStorage();
  const [filter, setFilter] = useState<string>('all');
  
  if (simulations.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Historique des simulations
        </h3>
        <div className="text-center py-8 text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>Vous n'avez pas encore de simulations sauvegardées.</p>
          <p className="text-sm mt-2">Utilisez le bouton "Sauvegarder" dans les simulateurs pour conserver vos calculs.</p>
        </div>
      </div>
    );
  }
  
  const getTypeLabel = (type: string) => {
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
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'tva': return 'bg-blue-100 text-blue-800';
      case 'charges-sociales': return 'bg-green-100 text-green-800';
      case 'dividendes': return 'bg-purple-100 text-purple-800';
      case 'per': return 'bg-yellow-100 text-yellow-800';
      case 'caf': return 'bg-pink-100 text-pink-800';
      case 'micro-entreprise': return 'bg-indigo-100 text-indigo-800';
      case 'impot-societes': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const filteredSimulations = filter === 'all' 
    ? simulations 
    : simulations.filter(sim => sim.type === filter);
  
  const uniqueTypes = Array.from(new Set(simulations.map(sim => sim.type)));
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Historique des simulations
      </h3>
      
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 text-sm rounded-full transition-colors ${
            filter === 'all'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Toutes
        </button>
        {uniqueTypes.map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              filter === type
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {getTypeLabel(type)}
          </button>
        ))}
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {filteredSimulations.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            <p>Aucune simulation ne correspond à ce filtre.</p>
          </div>
        ) : (
          filteredSimulations
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map(simulation => (
              <div 
                key={simulation.id} 
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">{simulation.name}</h4>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>
                        {format(new Date(simulation.date), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(simulation.type)}`}>
                      {getTypeLabel(simulation.type)}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-3">
                  <button
                    onClick={() => onLoad(simulation)}
                    className="px-3 py-1 text-sm bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                  >
                    Charger
                  </button>
                  <button
                    onClick={() => deleteSimulation(simulation.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Supprimer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default SimulationHistory;