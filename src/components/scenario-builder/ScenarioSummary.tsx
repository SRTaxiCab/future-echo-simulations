
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';

interface ScenarioSummaryProps {
  scenarioName: string;
}

export const ScenarioSummary: React.FC<ScenarioSummaryProps> = ({ 
  scenarioName 
}) => {
  return (
    <div className="bg-card p-4 rounded-md border border-border">
      <h3 className="font-mono text-lg mb-4">Summary Report</h3>
      <div className="space-y-3 text-sm">
        <p>
          Based on the simulation, your scenario "<strong>{scenarioName}</strong>" is projected 
          to have a <span className="text-neural font-medium">positive impact</span> compared 
          to the baseline.
        </p>
        <Separator />
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-muted-foreground text-xs">Confidence Level</p>
            <p className="font-medium">High (74%)</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Expected Deviation</p>
            <p className="font-medium">+42% from baseline</p>
          </div>
        </div>
        <Separator />
        <div>
          <p className="text-muted-foreground text-xs mb-1">Key Influencing Factors:</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Technology Adoption</Badge>
            <Badge variant="outline">Regulatory Changes</Badge>
            <Badge variant="outline">Market Sentiment</Badge>
          </div>
        </div>
        <Button className="w-full mt-2" variant="outline" size="sm">
          <FileText className="h-4 w-4 mr-2" />
          Generate Full Report
        </Button>
      </div>
    </div>
  );
};
