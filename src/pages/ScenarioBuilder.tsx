
import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Save, Download } from 'lucide-react';

// Import components
import { ScenarioDefinition } from '@/components/scenario-builder/ScenarioDefinition';
import { VariableAdjustment } from '@/components/scenario-builder/VariableAdjustment';
import { SimulationResults } from '@/components/scenario-builder/SimulationResults';
import { SidebarTemplates } from '@/components/scenario-builder/SidebarTemplates';
import { CausalTree } from '@/components/scenario-builder/CausalTree';

// Import data and types
import {
  regions,
  sectors,
  timePeriods,
  variableOptions,
  impactData,
  timelineData,
  probabilityData,
  COLORS
} from '@/components/scenario-builder/data';
import { getCausalTreeData } from '@/components/scenario-builder/causal-tree-data';

const ScenarioBuilder = () => {
  // State management
  const [scenarioName, setScenarioName] = useState('');
  const [hypothesis, setHypothesis] = useState('');
  const [region, setRegion] = useState('');
  const [sector, setSector] = useState('');
  const [timePeriod, setTimePeriod] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isResultReady, setIsResultReady] = useState(false);
  const [variables, setVariables] = useState<Array<{name: string, value: number}>>([]);
  const [causalTreeData, setCausalTreeData] = useState(getCausalTreeData('', []));
  const { toast } = useToast();
  
  // Update causal tree data when sector or variables change
  useEffect(() => {
    if (sector || variables.length > 0) {
      setCausalTreeData(getCausalTreeData(sector, variables));
    }
  }, [sector, variables]);
  
  // Event handlers
  const handleAddVariable = () => {
    if (variables.length < 5) {
      setVariables([...variables, { name: '', value: 50 }]);
    } else {
      toast({
        title: "Maximum variables reached",
        description: "You can only add up to 5 variables per scenario",
        variant: "destructive"
      });
    }
  };
  
  const handleUpdateVariable = (index: number, field: 'name' | 'value', value: any) => {
    const updatedVariables = [...variables];
    updatedVariables[index] = {
      ...updatedVariables[index],
      [field]: field === 'value' ? Number(value) : value
    };
    setVariables(updatedVariables);
  };
  
  const handleRemoveVariable = (index: number) => {
    const updatedVariables = [...variables];
    updatedVariables.splice(index, 1);
    setVariables(updatedVariables);
  };
  
  const runSimulation = () => {
    if (!scenarioName || !hypothesis || !region || !sector || !timePeriod) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields before running the simulation",
        variant: "destructive"
      });
      return;
    }
    
    setIsRunning(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsRunning(false);
      setIsResultReady(true);
      toast({
        title: "Simulation Complete",
        description: "Scenario projections are ready for analysis"
      });
    }, 3000);
  };
  
  const handleSaveScenario = () => {
    toast({
      title: "Scenario Saved",
      description: `"${scenarioName}" has been added to your scenarios library`
    });
  };
  
  return (
    <AppLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold">Scenario Builder</h1>
          <div className="flex gap-2 mt-2 md:mt-0">
            <Button 
              variant="outline" 
              className="flex items-center gap-1"
              onClick={handleSaveScenario}
              disabled={!isResultReady}
            >
              <Save className="h-4 w-4" />
              <span>Save</span>
            </Button>
            <Button 
              disabled={!isResultReady}
              variant="outline" 
              className="flex items-center gap-1"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Scenario configuration */}
          <div className="lg:col-span-2 space-y-6">
            {/* Scenario definition */}
            <ScenarioDefinition 
              scenarioName={scenarioName}
              hypothesis={hypothesis}
              region={region}
              sector={sector}
              timePeriod={timePeriod}
              regions={regions}
              sectors={sectors}
              timePeriods={timePeriods}
              onScenarioNameChange={setScenarioName}
              onHypothesisChange={setHypothesis}
              onRegionChange={setRegion}
              onSectorChange={setSector}
              onTimePeriodChange={setTimePeriod}
            />
            
            {/* Variable adjustment */}
            <VariableAdjustment 
              variables={variables}
              isRunning={isRunning}
              variableOptions={variableOptions}
              onAddVariable={handleAddVariable}
              onUpdateVariable={handleUpdateVariable}
              onRemoveVariable={handleRemoveVariable}
              onRunSimulation={runSimulation}
            />
            
            {/* Causal Tree (New Component) */}
            <CausalTree 
              data={causalTreeData} 
              width={600} 
              height={400} 
            />
            
            {/* Simulation results */}
            <SimulationResults 
              isResultReady={isResultReady}
              scenarioName={scenarioName}
              sector={sector}
              impactData={impactData}
              timelineData={timelineData}
              probabilityData={probabilityData}
              colors={COLORS}
            />
          </div>
          
          {/* Right column - Templates and saved scenarios */}
          <div>
            <SidebarTemplates 
              isResultReady={isResultReady}
              sector={sector}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ScenarioBuilder;
