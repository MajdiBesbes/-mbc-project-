import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface Question {
  id: string;
  text: string;
  options: string[];
}

const questions: Question[] = [
  {
    id: 'hasAccountant',
    text: 'Avez-vous actuellement un expert-comptable ?',
    options: ['Oui', 'Non']
  },
  {
    id: 'companyType',
    text: 'Quel est le statut juridique de votre entreprise ?',
    options: ['Auto-entrepreneur', 'EURL/SARL', 'SAS/SASU', 'Autre/Je ne sais pas']
  },
  {
    id: 'employees',
    text: 'Combien de salariés avez-vous ?',
    options: ['0', '1-5', '6-20', 'Plus de 20']
  },
  {
    id: 'needs',
    text: 'Quels sont vos besoins principaux ?',
    options: ['Comptabilité', 'Fiscalité', 'Paie', 'Conseil/Création']
  }
];

const DiagnosticForm: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestion].id]: answer
    }));

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const resetForm = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
  };

  if (showResult) {
    return (
      <div className="bg-white rounded-lg shadow-md">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Notre recommandation</h3>
        <div className="space-y-4 mb-8">
          <p className="text-gray-600">
            Selon vos réponses, nous vous recommandons nos services de :
            <span className="font-semibold text-primary block mt-2">
              {answers.needs === 'Comptabilité' && "Expertise comptable complète"}
              {answers.needs === 'Fiscalité' && "Conseil fiscal et optimisation"}
              {answers.needs === 'Paie' && "Gestion de la paie externalisée"}
              {answers.needs === 'Conseil/Création' && "Accompagnement création d'entreprise"}
            </span>
          </p>
          <p className="text-gray-600">
            {answers.hasAccountant === 'Oui' 
              ? "Nous pouvons vous proposer une étude comparative de nos services."
              : "Nous pouvons vous accompagner dans la mise en place de votre comptabilité."}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/contact"
            className="px-6 py-3 bg-primary text-white rounded-md text-center hover:bg-primary-dark transition-colors"
          >
            Prendre rendez-vous
          </Link>
          <button
            onClick={resetForm}
            className="px-6 py-3 border-2 border-primary text-primary rounded-md hover:bg-gray-50 transition-colors"
          >
            Recommencer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-500">
            Question {currentQuestion + 1} sur {questions.length}
          </span>
          <span className="text-sm font-medium text-primary">
            {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary rounded-full h-2 transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        {questions[currentQuestion].text}
      </h3>

      <div className="space-y-3">
        {questions[currentQuestion].options.map((option) => (
          <button
            key={option}
            onClick={() => handleAnswer(option)}
            className="w-full p-4 text-left border-2 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DiagnosticForm;