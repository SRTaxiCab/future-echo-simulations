
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { FileText, AlertTriangle, TrendingUp, Share2 } from 'lucide-react';

interface ScenarioSummaryProps {
  scenarioName: string;
}

export const ScenarioSummary: React.FC<ScenarioSummaryProps> = ({ 
  scenarioName 
}) => {
  return (
    <div className="bg-card p-4 rounded-md border border-border">
      <h3 className="font-mono text-lg mb-4 flex items-center">
        <span className="text-neural font-medium flex-1">Summary Report</span>
        <Badge variant="outline" className="font-mono text-xs ml-2">ALPHA</Badge>
      </h3>
      <div className="space-y-3 text-sm">
        <div className="bg-muted/10 p-3 rounded-md">
          <p>
            Based on the simulation, your scenario "<strong>{scenarioName}</strong>" is projected 
            to have a <span className="text-neural font-medium">positive impact</span> compared 
            to the baseline.
          </p>
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-muted-foreground text-xs">Confidence Level</p>
            <p className="font-medium">High (74%)</p>
            <div className="w-full bg-muted/30 rounded-full h-1 mt-1">
              <div className="bg-green-500 h-1 rounded-full" style={{ width: '74%' }}></div>
            </div>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Expected Deviation</p>
            <p className="font-medium flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              <span>+42% from baseline</span>
            </p>
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
        <div className="rounded-md bg-amber-500/10 border border-amber-500/20 p-2 flex items-start">
          <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
          <p className="text-xs text-amber-500">Prediction confidence diminishes beyond Q3 2025 due to increasing uncertainty factors.</p>
        </div>
        <div className="flex gap-2">
          <Button className="w-full" variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Generate Full Report
          </Button>
          <Button className="min-w-10" variant="outline" size="sm">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
