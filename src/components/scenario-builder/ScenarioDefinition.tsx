
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Region, Sector, TimePeriod } from './types';

interface ScenarioDefinitionProps {
  scenarioName: string;
  hypothesis: string;
  region: string;
  sector: string;
  timePeriod: string;
  regions: Region[];
  sectors: Sector[];
  timePeriods: TimePeriod[];
  onScenarioNameChange: (value: string) => void;
  onHypothesisChange: (value: string) => void;
  onRegionChange: (value: string) => void;
  onSectorChange: (value: string) => void;
  onTimePeriodChange: (value: string) => void;
}

export const ScenarioDefinition: React.FC<ScenarioDefinitionProps> = ({
  scenarioName,
  hypothesis,
  region,
  sector,
  timePeriod,
  regions,
  sectors,
  timePeriods,
  onScenarioNameChange,
  onHypothesisChange,
  onRegionChange,
  onSectorChange,
  onTimePeriodChange
}) => {
  return (
    <Card className="cyber-border">
      <CardHeader className="pb-2">
        <CardTitle className="font-mono text-lg">Define Your Scenario</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scenario-name" className="pointer-events-none">Scenario Name</Label>
              <Input 
                id="scenario-name" 
                placeholder="E.g., AI Regulation Impact 2026" 
                value={scenarioName}
                onChange={(e) => onScenarioNameChange(e.target.value)}
                className="relative z-10"
                autoComplete="off"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="pointer-events-none">Time Horizon</Label>
              <Select value={timePeriod} onValueChange={onTimePeriodChange}>
                <SelectTrigger className="relative z-10">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-background border border-border">
                  {timePeriods.map(period => (
                    <SelectItem key={period.id} value={period.id}>
                      {period.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="hypothesis" className="pointer-events-none">Hypothesis / Scenario Description</Label>
            <Textarea 
              id="hypothesis" 
              placeholder="Describe your hypothesis or scenario in detail..." 
              className="min-h-20 relative z-10"
              value={hypothesis}
              onChange={(e) => onHypothesisChange(e.target.value)}
              autoComplete="off"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="pointer-events-none">Geographic Region</Label>
              <Select value={region} onValueChange={onRegionChange}>
                <SelectTrigger className="relative z-10">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-background border border-border">
                  {regions.map(region => (
                    <SelectItem key={region.id} value={region.id}>
                      {region.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="pointer-events-none">Primary Sector</Label>
              <Select value={sector} onValueChange={onSectorChange}>
                <SelectTrigger className="relative z-10">
                  <SelectValue placeholder="Select sector" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-background border border-border">
                  {sectors.map(sector => (
                    <SelectItem key={sector.id} value={sector.id}>
                      {sector.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
