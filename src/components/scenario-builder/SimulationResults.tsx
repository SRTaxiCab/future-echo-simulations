
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3,
  Calendar,
  PanelRight,
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
    <Card className="neural-border">
      <CardHeader className="pb-2">
        <CardTitle className="font-mono text-lg">Simulation Results</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="impact">
          <TabsList className="mb-4">
            <TabsTrigger value="impact" className="flex items-center gap-1">
              <BarChart3 className="h-4 w-4" />
              <span>Impact Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Timeline</span>
            </TabsTrigger>
            <TabsTrigger value="probability" className="flex items-center gap-1">
              <PanelRight className="h-4 w-4" />
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
