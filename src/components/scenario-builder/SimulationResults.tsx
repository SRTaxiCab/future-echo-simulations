
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3,
  Calendar,
  PieChart,
} from 'lucide-react';
import { ImpactData, TimelineData, ProbabilityData } from './types';
import { ImpactChart } from './charts/ImpactChart';
import { TimelineChart } from './charts/TimelineChart';
import { ProbabilityAnalysis } from './ProbabilityAnalysis';

interface SimulationResultsProps {
  isResultReady: boolean;
  scenarioName: string;
  sector: string;
  impactData: ImpactData[];
  timelineData: TimelineData[];
  probabilityData: ProbabilityData[];
  colors: string[];
}

export const SimulationResults: React.FC<SimulationResultsProps> = ({
  isResultReady,
  scenarioName,
  sector,
  impactData,
  timelineData,
  probabilityData,
  colors
}) => {
  if (!isResultReady) return null;
  
  return (
    <Card className="neural-border relative overflow-visible">
      <div className="absolute -top-3 left-4 px-2 py-0.5 bg-neural text-white text-xs font-mono rounded">
        PREDICTION ENGINE
      </div>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="font-mono text-lg flex items-center">
          Simulation Results
          <div className="ml-2 h-5 w-5 p-1 border border-border rounded flex items-center justify-center">
            <span className="animate-pulse h-full w-full rounded-full bg-green-500/50 flex items-center justify-center">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
            </span>
          </div>
        </CardTitle>
        <div className="text-xs text-muted-foreground font-mono">
          Confidence: 74% • Last updated: {new Date().toLocaleTimeString()}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="impact" className="w-full">
          <TabsList className="mb-4 w-full justify-start">
            <TabsTrigger value="impact" className="flex items-center gap-1 min-w-24">
              <BarChart3 className="h-4 w-4" />
              <span>Impact Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-1 min-w-24">
              <Calendar className="h-4 w-4" />
              <span>Timeline</span>
            </TabsTrigger>
            <TabsTrigger value="probability" className="flex items-center gap-1 min-w-24">
              <PieChart className="h-4 w-4" />
              <span>Probability</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="impact">
            <ImpactChart data={impactData} />
          </TabsContent>
          
          <TabsContent value="timeline">
            <TimelineChart data={timelineData} />
          </TabsContent>
          
          <TabsContent value="probability">
            <ProbabilityAnalysis 
              probabilityData={probabilityData} 
              colors={colors} 
              scenarioName={scenarioName}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
