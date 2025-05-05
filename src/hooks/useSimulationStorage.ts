import { useState, useEffect } from 'react';

export interface SimulationData {
  id: string;
  type: string;
  name: string;
  data: Record<string, any>;
  date: string;
}

export const useSimulationStorage = () => {
  const [simulations, setSimulations] = useState<SimulationData[]>([]);
  
  // Charger les simulations depuis le localStorage au montage du composant
  useEffect(() => {
    const storedSimulations = localStorage.getItem('mbc_simulations');
    if (storedSimulations) {
      try {
        setSimulations(JSON.parse(storedSimulations));
      } catch (error) {
        console.error('Erreur lors du chargement des simulations:', error);
        // En cas d'erreur, réinitialiser le stockage
        localStorage.setItem('mbc_simulations', JSON.stringify([]));
      }
    }
  }, []);
  
  // Sauvegarder une simulation
  const saveSimulation = (type: string, name: string, data: Record<string, any>) => {
    const newSimulation: SimulationData = {
      id: `sim_${Date.now()}`,
      type,
      name,
      data,
      date: new Date().toISOString()
    };
    
    const updatedSimulations = [...simulations, newSimulation];
    setSimulations(updatedSimulations);
    localStorage.setItem('mbc_simulations', JSON.stringify(updatedSimulations));
    
    return newSimulation;
  };
  
  // Récupérer les simulations par type
  const getSimulationsByType = (type: string) => {
    return simulations.filter(sim => sim.type === type);
  };
  
  // Récupérer une simulation par ID
  const getSimulationById = (id: string) => {
    return simulations.find(sim => sim.id === id);
  };
  
  // Supprimer une simulation
  const deleteSimulation = (id: string) => {
    const updatedSimulations = simulations.filter(sim => sim.id !== id);
    setSimulations(updatedSimulations);
    localStorage.setItem('mbc_simulations', JSON.stringify(updatedSimulations));
  };
  
  // Mettre à jour une simulation existante
  const updateSimulation = (id: string, data: Partial<SimulationData>) => {
    const updatedSimulations = simulations.map(sim => 
      sim.id === id ? { ...sim, ...data, date: new Date().toISOString() } : sim
    );
    
    setSimulations(updatedSimulations);
    localStorage.setItem('mbc_simulations', JSON.stringify(updatedSimulations));
  };
  
  // Effacer toutes les simulations
  const clearAllSimulations = () => {
    setSimulations([]);
    localStorage.removeItem('mbc_simulations');
  };
  
  return {
    simulations,
    saveSimulation,
    getSimulationsByType,
    getSimulationById,
    deleteSimulation,
    updateSimulation,
    clearAllSimulations
  };
};