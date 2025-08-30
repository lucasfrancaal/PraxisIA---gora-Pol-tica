import React from 'react';
import { AgoraIcon, LightBulbIcon } from './icons/ContentIcons';

interface WelcomeScreenProps {
  onPromptClick: (prompt: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onPromptClick }) => {
  const examplePrompts = [
    "Analisar o impacto de ciclovias no comércio local de São Paulo.",
    "Quais as consequências de um programa de renda básica em Maricá-RJ?",
    "Sugerir meios para reduzir o tempo de espera em postos de saúde de Curitiba.",
    "Avaliar os custos de oportunidade da construção de um novo estádio em Belo Horizonte.",
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="bg-indigo-600 p-4 rounded-full mb-4">
        <AgoraIcon className="w-12 h-12 text-white" />
      </div>
      <h1 className="text-4xl font-bold mb-2">Práxis IA Assistente</h1>
      <p className="text-xl text-indigo-300">Ágora Política</p>
      <p className="text-lg text-gray-400 max-w-2xl mt-4">
        Seu assistente praxeológico para a gestão pública. Analise ações com base na lógica humana para tomar decisões mais eficazes.
      </p>

      <div className="mt-12 w-full max-w-3xl">
        <h2 className="text-xl font-semibold mb-4 flex items-center justify-center gap-2">
            <LightBulbIcon />
            Exemplos de Perguntas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {examplePrompts.map((prompt, index) => (
                <button
                    key={index}
                    onClick={() => onPromptClick(prompt)}
                    className="bg-gray-800 p-4 rounded-lg text-left hover:bg-gray-700 transition-colors"
                >
                    <p className="text-gray-300">{prompt}</p>
                </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;