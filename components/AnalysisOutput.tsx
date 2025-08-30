
import React from 'react';
import { AnalysisSection } from '../types';
import { TargetIcon, WrenchIcon, EyeIcon, CheckCircleIcon } from './icons/ContentIcons';

interface AnalysisOutputProps {
  section: AnalysisSection;
}

const getIconForTitle = (title: string): React.ReactNode => {
    if (title.includes('Análise do Fim')) return <TargetIcon />;
    if (title.includes('Meios e Custos')) return <WrenchIcon />;
    if (title.includes('Consequências')) return <EyeIcon />;
    if (title.includes('Sugestão de Avaliação')) return <CheckCircleIcon />;
    return null;
}

const AnalysisOutput: React.FC<AnalysisOutputProps> = ({ section }) => {
  const icon = getIconForTitle(section.title);

  return (
    <div className="bg-gray-800 p-5 rounded-lg shadow-md border border-gray-700">
      <div className="flex items-center mb-3">
        <div className="text-indigo-400 mr-3">{icon}</div>
        <h3 className="text-lg font-bold text-indigo-300">{section.title}</h3>
      </div>
      <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{section.content}</p>
    </div>
  );
};

export default AnalysisOutput;
