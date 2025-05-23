
import React from 'react';
import { ProbabilityChart } from './charts/ProbabilityChart';
import { ScenarioSummary } from './ScenarioSummary';
import { ProbabilityData } from './types';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ChartPie } from 'lucide-react';

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
  // Calculate highest probability outcome for highlighting
  const highestProbability = [...probabilityData].sort((a, b) => b.value - a.value)[0];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="bg-muted/20 rounded-md p-3 text-sm">
          <div className="flex items-start">
            <ChartPie className="h-5 w-5 mr-2 text-neural shrink-0 mt-0.5" />
            <div>
              <p>
                Probability distribution shows the likelihood of different outcome ranges 
                for your scenario.
              </p>
              <p className="mt-2 text-neural font-medium">
                Most likely outcome: {highestProbability?.name} ({highestProbability?.value}%)
              </p>
            </div>
          </div>
        </div>
        
        <ProbabilityChart data={probabilityData} colors={colors} />
        
        <Card className="border border-border/50">
          <CardContent className="p-4 text-sm space-y-3">
            <h4 className="font-medium">Distribution Analysis</h4>
            <Separator />
            <div>
              <ul className="space-y-2">
                {probabilityData.map((item, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span 
                        className="h-3 w-3 rounded-sm mr-2" 
                        style={{ backgroundColor: colors[index % colors.length] }}
                      ></span>
                      <span>{item.name}</span>
                    </div>
                    <span className="font-mono">{item.value}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <ScenarioSummary scenarioName={scenarioName} />
    </div>
  );
};
