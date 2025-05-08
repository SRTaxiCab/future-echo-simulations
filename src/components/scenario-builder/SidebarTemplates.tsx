
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Globe, Calendar, User } from 'lucide-react';

interface SidebarTemplatesProps {
  isResultReady: boolean;
  sector: string;
}

export const SidebarTemplates: React.FC<SidebarTemplatesProps> = ({ isResultReady, sector }) => {
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
              <Button 
                variant="outline" 
                className="w-full justify-start text-left h-auto py-3 flex items-start"
              >
                <div className="mr-3 mt-1">
                  <Globe className="h-5 w-5 text-cyber" />
                </div>
                <div>
                  <p className="font-medium">AI Regulation Impact</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Analysis of AI regulatory changes on global markets and technology sectors
                  </p>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start text-left h-auto py-3 flex items-start"
              >
                <div className="mr-3 mt-1">
                  <Calendar className="h-5 w-5 text-neural" />
                </div>
                <div>
                  <p className="font-medium">Climate Policy Projection</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Forecast how climate policies will affect energy, transportation and manufacturing
                  </p>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start text-left h-auto py-3 flex items-start"
              >
                <div className="mr-3 mt-1">
                  <User className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="font-medium">Demographic Shift Analysis</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Project impacts of demographic changes on labor markets and consumer trends
                  </p>
                </div>
              </Button>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <p className="text-xs text-muted-foreground mb-2">RECENT SCENARIOS</p>
            <div className="text-center py-6 text-muted-foreground">
              <p className="text-sm">No recent scenarios</p>
              <p className="text-xs mt-1">Run your first simulation to save it here</p>
            </div>
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
