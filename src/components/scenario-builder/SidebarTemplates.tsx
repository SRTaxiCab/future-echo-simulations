
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Globe, Calendar, User, Download, Save } from 'lucide-react';
import { getSavedScenarios } from '@/utils/offlineSupport';
import { useToast } from '@/hooks/use-toast';
import { ScenarioData } from './types';

interface SidebarTemplatesProps {
  isResultReady: boolean;
  sector: string;
  onLoadTemplate?: (template: Partial<ScenarioData>) => void;
}

export const SidebarTemplates: React.FC<SidebarTemplatesProps> = ({ 
  isResultReady, 
  sector,
  onLoadTemplate 
}) => {
  const { toast } = useToast();
  const [savedScenarios, setSavedScenarios] = React.useState<ScenarioData[]>([]);
  
  React.useEffect(() => {
    // Load saved scenarios from local storage
    setSavedScenarios(getSavedScenarios());
  }, []);
  
  const handleLoadTemplate = (template: any) => {
    if (onLoadTemplate) {
      onLoadTemplate(template);
      
      toast({
        title: "Template Loaded",
        description: `"${template.name}" template has been loaded`
      });
    }
  };
  
  // Templates based on sectors
  const templates = [
    {
      name: "AI Regulation Impact",
      icon: <Globe className="h-5 w-5 text-cyber" />,
      description: "Analysis of AI regulatory changes on global markets and technology sectors",
      data: {
        name: "AI Regulation Impact",
        hypothesis: "Increasing AI regulation will slow innovation but improve safety and ethics in the sector.",
        region: "global",
        sector: "tech",
        timePeriod: "medium",
        variables: [
          { name: "regulatoryStrength", value: 75 },
          { name: "techInnovation", value: 60 }
        ]
      }
    },
    {
      name: "Climate Policy Projection",
      icon: <Calendar className="h-5 w-5 text-neural" />,
      description: "Forecast how climate policies will affect energy, transportation and manufacturing",
      data: {
        name: "Climate Policy Projection",
        hypothesis: "Stringent climate policies will accelerate renewable energy adoption and transform transportation.",
        region: "us",
        sector: "energy",
        timePeriod: "long",
        variables: [
          { name: "policyStrength", value: 85 },
          { name: "renewableInvestment", value: 70 }
        ]
      }
    },
    {
      name: "Demographic Shift Analysis",
      icon: <User className="h-5 w-5 text-destructive" />,
      description: "Project impacts of demographic changes on labor markets and consumer trends",
      data: {
        name: "Demographic Shift Analysis",
        hypothesis: "Aging population will transform healthcare demands and retirement systems.",
        region: "europe",
        sector: "healthcare",
        timePeriod: "long",
        variables: [
          { name: "agingRate", value: 65 },
          { name: "healthcareSpending", value: 80 }
        ]
      }
    }
  ];
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="font-mono text-lg">Templates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-2">RECOMMENDED FOR YOU</p>
            <div className="space-y-2">
              {templates.map((template) => (
                <Button 
                  key={template.name}
                  variant="outline" 
                  className="w-full justify-start text-left h-auto py-3 flex items-start"
                  onClick={() => handleLoadTemplate(template.data)}
                >
                  <div className="mr-3 mt-1">
                    {template.icon}
                  </div>
                  <div>
                    <p className="font-medium">{template.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {template.description}
                    </p>
                  </div>
                </Button>
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div>
            <p className="text-xs text-muted-foreground mb-2">RECENT SCENARIOS</p>
            {savedScenarios.length > 0 ? (
              <div className="space-y-2">
                {savedScenarios.map((scenario) => (
                  <Button 
                    key={scenario.id}
                    variant="ghost" 
                    className="w-full justify-start text-left py-2"
                    onClick={() => handleLoadTemplate(scenario)}
                  >
                    <div className="flex justify-between w-full">
                      <span className="truncate">{scenario.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(scenario.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </Button>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <p className="text-sm">No recent scenarios</p>
                <p className="text-xs mt-1">Run your first simulation to save it here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-muted/20 border-dashed">
        <CardContent className="p-4">
          <h3 className="font-mono text-sm font-medium mb-2">Did You Know?</h3>
          <p className="text-xs text-muted-foreground">
            You can combine up to 5 variables in a single scenario to model complex interactions and emergent effects.
          </p>
          <div className={cn("mt-3 text-xs text-cyber", isResultReady ? "block" : "hidden")}>
            <p className="font-mono">AI INSIGHT:</p>
            <p className="mt-1">
              Try adjusting the "{sector === 'tech' ? 'AI Regulation Strength' : 'Geopolitical Stability'}" 
              variable to see more dramatic shifts in your timeline projection.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
