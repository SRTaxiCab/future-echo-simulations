
import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Save, Download, AlertCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

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
import { saveScenarioOffline } from '@/utils/offlineSupport';
import { ScenarioData } from '@/components/scenario-builder/types';

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
  const [currentScenarioId, setCurrentScenarioId] = useState<string>(uuidv4());
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const { toast } = useToast();
  
  // Track online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Update causal tree data when sector or variables change
  useEffect(() => {
    if (sector || variables.length > 0) {
      setCausalTreeData(getCausalTreeData(sector, variables));
    }
  }, [sector, variables]);

  // Validation function
  const validateScenario = (): string[] => {
    const errors: string[] = [];
    
    if (!scenarioName.trim()) {
      errors.push('Scenario name is required');
    }
    if (!hypothesis.trim()) {
      errors.push('Hypothesis description is required');
    }
    if (!region) {
      errors.push('Geographic region must be selected');
    }
    if (!sector) {
      errors.push('Primary sector must be selected');
    }
    if (!timePeriod) {
      errors.push('Time horizon must be selected');
    }
    if (variables.length === 0) {
      errors.push('At least one variable must be added');
    }
    
    // Validate variables
    variables.forEach((variable, index) => {
      if (!variable.name) {
        errors.push(`Variable ${index + 1} must have a type selected`);
      }
    });
    
    return errors;
  };
  
  // Event handlers
  const handleAddVariable = () => {
    if (variables.length < 5) {
      setVariables([...variables, { name: '', value: 50 }]);
      setValidationErrors([]);
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
    setValidationErrors([]);
  };
  
  const handleRemoveVariable = (index: number) => {
    const updatedVariables = [...variables];
    updatedVariables.splice(index, 1);
    setVariables(updatedVariables);
  };
  
  const runSimulation = () => {
    const errors = validateScenario();
    
    if (errors.length > 0) {
      setValidationErrors(errors);
      toast({
        title: "Validation Failed",
        description: `Please fix ${errors.length} error(s) before running simulation`,
        variant: "destructive"
      });
      return;
    }
    
    setValidationErrors([]);
    setIsRunning(true);
    setSimulationProgress(0);
    
    // Simulate progressive loading
    const interval = setInterval(() => {
      setSimulationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          setIsResultReady(true);
          toast({
            title: "Simulation Complete",
            description: "Scenario projections are ready for analysis"
          });
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
  };
  
  const handleSaveScenario = () => {
    if (!isResultReady) {
      toast({
        title: "Cannot save scenario",
        description: "Please run a simulation before saving",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const scenarioData: ScenarioData = {
        id: currentScenarioId,
        name: scenarioName,
        hypothesis,
        region,
        sector,
        timePeriod,
        variables,
        isResultReady,
        timestamp: new Date()
      };
      
      saveScenarioOffline(scenarioData);
      setCurrentScenarioId(uuidv4());
      
      toast({
        title: "Scenario Saved",
        description: `"${scenarioName}" has been added to your scenarios library`
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Unable to save scenario. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleExportScenario = () => {
    if (!isResultReady) {
      toast({
        title: "Cannot export scenario",
        description: "Please run a simulation before exporting",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const exportData = {
        scenarioName,
        hypothesis,
        region,
        sector,
        timePeriod,
        variables,
        results: {
          impactData,
          timelineData,
          probabilityData,
          causalTreeData
        },
        exportDate: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${scenarioName.replace(/\s+/g, '-').toLowerCase()}-scenario.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Scenario Exported",
        description: `"${scenarioName}" has been exported as JSON`
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Unable to export scenario. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleLoadTemplate = (template: Partial<ScenarioData>) => {
    if (isResultReady || variables.length > 0) {
      if (!confirm("Loading a template will replace your current scenario. Continue?")) {
        return;
      }
    }
    
    setCurrentScenarioId(uuidv4());
    setIsResultReady(false);
    setValidationErrors([]);
    
    if (template.name) setScenarioName(template.name);
    if (template.hypothesis) setHypothesis(template.hypothesis);
    if (template.region) setRegion(template.region);
    if (template.sector) setSector(template.sector);
    if (template.timePeriod) setTimePeriod(template.timePeriod);
    if (template.variables) setVariables([...template.variables]);
  };
  
  return (
    <AppLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Scenario Builder</h1>
            {!isOnline && (
              <div className="mt-1 flex items-center">
                <span className="h-2 w-2 rounded-full bg-amber-500 mr-2"></span>
                <span className="text-sm text-amber-500">Offline Mode - Changes will sync when you reconnect</span>
              </div>
            )}
            {validationErrors.length > 0 && (
              <div className="mt-2 flex items-start">
                <AlertCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                <div className="text-sm text-red-500">
                  <div className="font-medium">Please fix the following issues:</div>
                  <ul className="list-disc list-inside mt-1">
                    {validationErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
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
              onClick={handleExportScenario}
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
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
            
            <VariableAdjustment 
              variables={variables}
              isRunning={isRunning}
              variableOptions={variableOptions}
              onAddVariable={handleAddVariable}
              onUpdateVariable={handleUpdateVariable}
              onRemoveVariable={handleRemoveVariable}
              onRunSimulation={runSimulation}
              simulationProgress={simulationProgress}
            />
            
            <CausalTree 
              data={causalTreeData} 
              width={600} 
              height={400} 
            />
            
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
          
          <div>
            <SidebarTemplates 
              isResultReady={isResultReady}
              sector={sector}
              onLoadTemplate={handleLoadTemplate}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ScenarioBuilder;
