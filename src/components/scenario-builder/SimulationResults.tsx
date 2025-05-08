
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3,
  Calendar,
  PanelRight,
  FileText,
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  ReferenceLine,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { ImpactData, TimelineData, ProbabilityData } from './types';

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
                    <RechartsTooltip 
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
                    <RechartsTooltip 
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
                          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
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
  );
};
