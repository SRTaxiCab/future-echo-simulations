
import React from 'react';
import { ProbabilityChart } from './charts/ProbabilityChart';
import { ScenarioSummary } from './ScenarioSummary';
import { ProbabilityData } from './types';

interface ProbabilityAnalysisProps {
  probabilityData: ProbabilityData[];
  colors: string[];
  scenarioName: string;
}

export const ProbabilityAnalysis: React.FC<ProbabilityAnalysisProps> = ({
  probabilityData,
  colors,
  scenarioName
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="bg-muted/20 rounded-md p-3 text-sm">
          <p>
            Probability distribution shows the likelihood of different outcome ranges 
            for your scenario.
          </p>
        </div>
        
        <ProbabilityChart data={probabilityData} colors={colors} />
      </div>
      
      <ScenarioSummary scenarioName={scenarioName} />
    </div>
  );
};
