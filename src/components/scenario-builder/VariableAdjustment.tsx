
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trash, Plus, Play, Loader2, Tags } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { VariableOption } from './types';

interface VariableAdjustmentProps {
  variables: Array<{name: string, value: number}>;
  isRunning: boolean;
  variableOptions: VariableOption[];
  onAddVariable: () => void;
  onUpdateVariable: (index: number, field: 'name' | 'value', value: string | number) => void;
  onRemoveVariable: (index: number) => void;
  onRunSimulation: () => void;
  simulationProgress?: number;
}

export const VariableAdjustment: React.FC<VariableAdjustmentProps> = ({
  variables,
  isRunning,
  variableOptions,
  onAddVariable,
  onUpdateVariable,
  onRemoveVariable,
  onRunSimulation,
  simulationProgress = 0
}) => {
  const { toast } = useToast();

  const getVariableImpactLevel = (value: number) => {
    if (value < 30) return { label: 'Low', color: 'bg-blue-500' };
    if (value < 70) return { label: 'Medium', color: 'bg-yellow-500' };
    return { label: 'High', color: 'bg-red-500' };
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="font-mono text-lg">Variable Adjustments</CardTitle>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={onAddVariable}
            disabled={variables.length >= 5 || isRunning}
            className="h-8"
          >
            <Plus className="h-4 w-4 mr-1" /> Add Variable
          </Button>
        </div>
        {variables.length > 0 && (
          <div className="text-xs text-muted-foreground">
            {variables.length}/5 variables configured
          </div>
        )}
      </CardHeader>
      <CardContent>
        {variables.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <div className="mb-2">
              <Tags className="h-8 w-8 mx-auto opacity-50" />
            </div>
            <p>Add variables to your scenario to adjust simulation parameters</p>
            <Button 
              variant="link" 
              className="mt-2"
              onClick={onAddVariable}
              disabled={isRunning}
            >
              Add your first variable
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {variables.map((variable, index) => {
              const impact = getVariableImpactLevel(variable.value);
              return (
                <div key={index} className="p-3 border border-border rounded-md">
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-full mr-2">
                      <Select 
                        value={variable.name} 
                        onValueChange={(value) => onUpdateVariable(index, 'name', value)}
                        disabled={isRunning}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select variable" />
                        </SelectTrigger>
                        <SelectContent>
                          {variableOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => onRemoveVariable(index)}
                      className="h-8 text-muted-foreground hover:text-destructive"
                      disabled={isRunning}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Low Impact</span>
                      <span>Medium Impact</span>
                      <span>High Impact</span>
                    </div>
                    <Slider
                      value={[variable.value]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(value) => onUpdateVariable(index, 'value', value[0])}
                      disabled={isRunning}
                    />
                    <div className="flex justify-between items-center text-sm">
                      <Badge variant="outline" className={`${impact.color} text-white border-none`}>
                        {impact.label} Impact
                      </Badge>
                      <Badge variant="outline" className="bg-card font-mono">
                        {variable.value}%
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        <div className="mt-6 space-y-3">
          {isRunning && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Running simulation...</span>
                <span>{Math.round(simulationProgress)}%</span>
              </div>
              <Progress value={simulationProgress} className="h-2" />
            </div>
          )}
          
          <div className="flex justify-center">
            <Button 
              className="bg-cyber hover:bg-cyber-dark w-full max-w-xs"
              onClick={onRunSimulation}
              disabled={isRunning || variables.length === 0}
            >
              {isRunning ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Running Simulation...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run Simulation
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
