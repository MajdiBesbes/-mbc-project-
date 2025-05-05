import React, { useState } from 'react';
import TVACalculator from '../components/Calculators/TVACalculator';
import ChargesSocialesCalculator from '../components/Calculators/ChargesSocialesCalculator';
import DividendesCalculator from '../components/Calculators/DividendesCalculator';
import PERCalculator from '../components/Calculators/PERCalculator';
import CAFCalculator from '../components/Calculators/CAFCalculator';
import MicroEntrepriseCalculator from '../components/Calculators/MicroEntrepriseCalculator';
import ISCalculator from '../components/Calculators/ISCalculator';
import CallToAction from '../components/CallToAction';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import SimulationHistory from '../components/Calculators/SimulationHistory';
import { SimulationData } from '../hooks/useSimulationStorage';
import { Helmet } from 'react-helmet-async';

const Simulators: React.FC = () => {
  const [activeSimulator, setActiveSimulator] = useState<string | null>(null);
  
  const handleLoadSimulation = (simulation: SimulationData) => {
    // Activer l'onglet correspondant au type de simulation
    switch (simulation.type) {
      case 'tva':
      case 'dividendes':
      case 'micro-entreprise':
      case 'impot-societes':
        setActiveSimulator('fiscal');
        break;
      case 'charges-sociales':
        setActiveSimulator('social');
        break;
      case 'per':
        setActiveSimulator('epargne');
        break;
      case 'caf':
        setActiveSimulator('aides');
        break;
      default:
        setActiveSimulator('fiscal');
    }
    
    // Faire défiler jusqu'au simulateur correspondant
    setTimeout(() => {
      const element = document.getElementById(simulation.type);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <>
      <Helmet>
        <title>Simulateurs financiers gratuits - MBC Consulting</title>
        <meta name="description" content="Utilisez nos simulateurs en ligne gratuits pour calculer TVA, charges sociales, impôts et plus. Outils pratiques pour entrepreneurs et particuliers." />
      </Helmet>
      
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Simulateurs en ligne
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Utilisez nos outils de simulation pour estimer rapidement vos charges, impôts et aides
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
            <div className="lg:col-span-3">
              <Tabs defaultValue={activeSimulator || "fiscal"} value={activeSimulator || "fiscal"} className="max-w-5xl mx-auto">
                <TabsList className="mb-8 flex flex-wrap justify-center">
                  <TabsTrigger value="fiscal" onClick={() => setActiveSimulator("fiscal")}>Fiscalité</TabsTrigger>
                  <TabsTrigger value="social" onClick={() => setActiveSimulator("social")}>Charges sociales</TabsTrigger>
                  <TabsTrigger value="epargne" onClick={() => setActiveSimulator("epargne")}>Épargne & Retraite</TabsTrigger>
                  <TabsTrigger value="aides" onClick={() => setActiveSimulator("aides")}>Aides</TabsTrigger>
                </TabsList>
                
                <TabsContent value="fiscal" className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div id="tva">
                      <TVACalculator />
                    </div>
                    <div id="dividendes">
                      <DividendesCalculator />
                    </div>
                    <div id="micro-entreprise">
                      <MicroEntrepriseCalculator />
                    </div>
                    <div id="impot-societes">
                      <ISCalculator />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="social" className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div id="charges-sociales">
                      <ChargesSocialesCalculator />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="epargne" className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div id="per">
                      <PERCalculator />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="aides" className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div id="caf">
                      <CAFCalculator />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            <div className="lg:col-span-1">
              <SimulationHistory onLoad={handleLoadSimulation} />
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md mb-16 mt-16 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Besoin d'un calcul plus précis ?
            </h2>
            <p className="text-gray-600 mb-8">
              Ces simulateurs donnent des estimations. Pour des calculs précis adaptés à votre situation, 
              prenez rendez-vous avec l'un de nos experts-comptables.
            </p>
            <CallToAction />
          </div>
        </div>
      </div>
    </>
  );
};

export default Simulators;