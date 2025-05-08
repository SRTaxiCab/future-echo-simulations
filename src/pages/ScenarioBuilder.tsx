
import React, { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  ReferenceLine,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Play, 
  Plus, 
  Trash, 
  Save,
  Download,
  BarChart3,
  FileText,
  PanelRight,
  Loader2,
  Globe,
  Calendar,
  User,
  Tags
} from 'lucide-react';

// Predefined regions for scenario builder
const regions = [
  { id: 'na', name: 'North America' },
  { id: 'eu', name: 'Europe' },
  { id: 'asia', name: 'Asia' },
  { id: 'sa', name: 'South America' },
  { id: 'africa', name: 'Africa' },
  { id: 'oceania', name: 'Oceania' },
  { id: 'global', name: 'Global' },
];

// Predefined sectors for scenario builder
const sectors = [
  { id: 'tech', name: 'Technology' },
  { id: 'energy', name: 'Energy' },
  { id: 'finance', name: 'Finance' },
  { id: 'healthcare', name: 'Healthcare' },
  { id: 'education', name: 'Education' },
  { id: 'manufacturing', name: 'Manufacturing' },
  { id: 'retail', name: 'Retail' },
  { id: 'government', name: 'Government' },
];

// Predefined time periods
const timePeriods = [
  { id: '6m', name: '6 Months' },
  { id: '1y', name: '1 Year' },
  { id: '2y', name: '2 Years' },
  { id: '5y', name: '5 Years' },
  { id: '10y', name: '10 Years' },
];

// Sample forecast data (simulation output)
const impactData = [
  { name: 'Economic Growth', baseline: 2.5, scenario: 3.8 },
  { name: 'Unemployment', baseline: 5.2, scenario: 4.1 },
  { name: 'Inflation', baseline: 3.1, scenario: 2.8 },
  { name: 'Market Index', baseline: 12500, scenario: 14200 },
  { name: 'Consumer Confidence', baseline: 105, scenario: 118 },
];

const timelineData = [
  { month: 'Month 1', baseline: 100, scenario: 102 },
  { month: 'Month 2', baseline: 102, scenario: 105 },
  { month: 'Month 3', baseline: 104, scenario: 110 },
  { month: 'Month 4', baseline: 105, scenario: 116 },
  { month: 'Month 5', baseline: 106, scenario: 122 },
  { month: 'Month 6', baseline: 107, scenario: 130 },
  { month: 'Month 7', baseline: 108, scenario: 135 },
  { month: 'Month 8', baseline: 110, scenario: 142 },
  { month: 'Month 9', baseline: 111, scenario: 148 },
  { month: 'Month 10', baseline: 112, scenario: 155 },
  { month: 'Month 11', baseline: 114, scenario: 163 },
  { month: 'Month 12', baseline: 115, scenario: 168 },
];

const probabilityData = [
  { name: '60-80%', value: 65 },
  { name: '40-60%', value: 25 },
  { name: '20-40%', value: 10 },
];

const COLORS = ['#10b981', '#3b82f6', '#ef4444'];

// Sample variables for dynamic scenario building
const variableOptions = [
  { value: 'ai_regulation', label: 'AI Regulation Strength' },
  { value: 'energy_transition', label: 'Energy Transition Speed' },
  { value: 'market_volatility', label: 'Market Volatility' },
  { value: 'geopolitical_stability', label: 'Geopolitical Stability' },
  { value: 'climate_policy', label: 'Climate Policy Implementation' },
];

const ScenarioBuilder = () => {
  const [scenarioName, setScenarioName] = useState('');
  const [hypothesis, setHypothesis] = useState('');
  const [region, setRegion] = useState('');
  const [sector, setSector] = useState('');
  const [timePeriod, setTimePeriod] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isResultReady, setIsResultReady] = useState(false);
  const [variables, setVariables] = useState<Array<{name: string, value: number}>>([]);
  const { toast } = useToast();
  
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
  
  const handleUpdateVariable = (index: number, field: 'name' | 'value', value: string | number) => {
    const updatedVariables = [...variables];
    updatedVariables[index][field] = value;
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
            {/* Scenario definition card */}
            <Card className="cyber-border">
              <CardHeader className="pb-2">
                <CardTitle className="font-mono text-lg">Define Your Scenario</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="scenario-name">Scenario Name</Label>
                      <Input 
                        id="scenario-name" 
                        placeholder="E.g., AI Regulation Impact 2026" 
                        value={scenarioName}
                        onChange={(e) => setScenarioName(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Time Horizon</Label>
                      <Select value={timePeriod} onValueChange={setTimePeriod}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent>
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
                    <Label htmlFor="hypothesis">Hypothesis / Scenario Description</Label>
                    <Textarea 
                      id="hypothesis" 
                      placeholder="Describe your hypothesis or scenario in detail..." 
                      className="min-h-20"
                      value={hypothesis}
                      onChange={(e) => setHypothesis(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Geographic Region</Label>
                      <Select value={region} onValueChange={setRegion}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                          {regions.map(region => (
                            <SelectItem key={region.id} value={region.id}>
                              {region.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Primary Sector</Label>
                      <Select value={sector} onValueChange={setSector}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select sector" />
                        </SelectTrigger>
                        <SelectContent>
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
            
            {/* Variable adjustment */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-mono text-lg">Variable Adjustments</CardTitle>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleAddVariable}
                    disabled={variables.length >= 5}
                    className="h-8"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Variable
                  </Button>
                </div>
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
                      onClick={handleAddVariable}
                    >
                      Add your first variable
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {variables.map((variable, index) => (
                      <div key={index} className="p-3 border border-border rounded-md">
                        <div className="flex justify-between items-start mb-3">
                          <div className="w-full mr-2">
                            <Select 
                              value={variable.name} 
                              onValueChange={(value) => handleUpdateVariable(index, 'name', value)}
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
                            onClick={() => handleRemoveVariable(index)}
                            className="h-8 text-muted-foreground hover:text-destructive"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Low</span>
                            <span>Medium</span>
                            <span>High</span>
                          </div>
                          <Slider
                            value={[variable.value]}
                            min={0}
                            max={100}
                            step={1}
                            onValueChange={(value) => handleUpdateVariable(index, 'value', value[0])}
                          />
                          <div className="flex justify-end text-sm font-mono">
                            <Badge variant="outline" className="bg-card">
                              {variable.value}%
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="mt-6 flex justify-center">
                  <Button 
                    className="bg-cyber hover:bg-cyber-dark w-full max-w-xs"
                    onClick={runSimulation}
                    disabled={isRunning}
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
              </CardContent>
            </Card>
            
            {/* Results section - only shown after simulation is complete */}
            {isResultReady && (
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
                      <div className="space-y-4">
                        <div className="bg-muted/20 rounded-md p-3 text-sm">
                          <p>
                            This analysis shows the projected impact of your scenario variables compared 
                            to the baseline forecast.
                          </p>
                        </div>
                        
                        <div className="h-[350px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={impactData}
                              layout="vertical"
                              margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke="#2a2f3a" />
                              <XAxis type="number" stroke="#6b7280" fontSize={11} />
                              <YAxis 
                                type="category" 
                                dataKey="name" 
                                stroke="#6b7280" 
                                fontSize={11} 
                                width={120} 
                              />
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                  borderColor: '#0ea5e9',
                                  borderRadius: '0.25rem',
                                  fontSize: '12px',
                                  fontFamily: 'JetBrains Mono, monospace',
                                }}
                              />
                              <Bar dataKey="baseline" name="Baseline" fill="#6b7280" radius={[0, 0, 0, 0]} />
                              <Bar dataKey="scenario" name="Your Scenario" fill="#10b981" radius={[0, 4, 4, 0]} />
                              <ReferenceLine x={0} stroke="#374151" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="timeline">
                      <div className="space-y-4">
                        <div className="bg-muted/20 rounded-md p-3 text-sm">
                          <p>
                            The timeline chart shows how your scenario is expected to evolve over time
                            compared to the baseline projection.
                          </p>
                        </div>
                        
                        <div className="h-[350px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={timelineData}
                              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke="#2a2f3a" />
                              <XAxis dataKey="month" stroke="#6b7280" fontSize={11} />
                              <YAxis stroke="#6b7280" fontSize={11} />
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                  borderColor: '#0ea5e9',
                                  borderRadius: '0.25rem',
                                  fontSize: '12px',
                                  fontFamily: 'JetBrains Mono, monospace',
                                }}
                              />
                              <Line 
                                type="monotone" 
                                dataKey="baseline" 
                                name="Baseline" 
                                stroke="#6b7280" 
                                strokeWidth={2}
                                dot={{ fill: '#1e293b', r: 4, stroke: '#6b7280', strokeWidth: 1 }}
                              />
                              <Line 
                                type="monotone" 
                                dataKey="scenario" 
                                name="Your Scenario" 
                                stroke="#10b981" 
                                strokeWidth={2}
                                dot={{ fill: '#1e293b', r: 4, stroke: '#10b981', strokeWidth: 1 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="probability">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="bg-muted/20 rounded-md p-3 text-sm">
                            <p>
                              Probability distribution shows the likelihood of different outcome ranges 
                              for your scenario.
                            </p>
                          </div>
                          
                          <div className="h-[300px] flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={probabilityData}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={false}
                                  outerRadius={100}
                                  fill="#8884d8"
                                  dataKey="value"
                                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                >
                                  {probabilityData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip 
                                  formatter={(value) => [`${value}%`, 'Probability']}
                                  contentStyle={{ 
                                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                    borderColor: '#0ea5e9',
                                    borderRadius: '0.25rem',
                                    fontSize: '12px',
                                    fontFamily: 'JetBrains Mono, monospace',
                                  }}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                        
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
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Right column - Templates and saved scenarios */}
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
        </div>
      </div>
    </AppLayout>
  );
};

export default ScenarioBuilder;
