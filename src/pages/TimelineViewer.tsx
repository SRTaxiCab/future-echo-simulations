
import React, { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceDot,
  ReferenceArea,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';
import { 
  Calendar, 
  Filter, 
  Layers, 
  RefreshCw,
  Download, 
  Maximize2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Simulated timeline data for different perspectives
const economicTimelineData = [
  { date: 'Jan 2025', baseline: 50, positive: 54, negative: 48, probability: 100 },
  { date: 'Mar 2025', baseline: 52, positive: 57, negative: 46, probability: 95 },
  { date: 'May 2025', baseline: 55, positive: 62, negative: 43, probability: 90 },
  { date: 'Jul 2025', baseline: 57, positive: 68, negative: 41, probability: 85 },
  { date: 'Sep 2025', baseline: 61, positive: 72, negative: 38, probability: 80 },
  { date: 'Nov 2025', baseline: 64, positive: 77, negative: 35, probability: 75 },
  { date: 'Jan 2026', baseline: 68, positive: 83, negative: 32, probability: 70 },
  { date: 'Mar 2026', baseline: 72, positive: 88, negative: 28, probability: 65 },
  { date: 'May 2026', baseline: 75, positive: 92, negative: 25, probability: 60 },
  { date: 'Jul 2026', baseline: 78, positive: 95, negative: 21, probability: 55 },
  { date: 'Sep 2026', baseline: 80, positive: 97, negative: 18, probability: 50 },
];

const socialTimelineData = [
  { date: 'Jan 2025', baseline: 60, positive: 62, negative: 58, probability: 100 },
  { date: 'Mar 2025', baseline: 58, positive: 64, negative: 55, probability: 95 },
  { date: 'May 2025', baseline: 56, positive: 66, negative: 51, probability: 90 },
  { date: 'Jul 2025', baseline: 53, positive: 68, negative: 48, probability: 85 },
  { date: 'Sep 2025', baseline: 51, positive: 72, negative: 45, probability: 80 },
  { date: 'Nov 2025', baseline: 48, positive: 74, negative: 42, probability: 75 },
  { date: 'Jan 2026', baseline: 46, positive: 78, negative: 38, probability: 70 },
  { date: 'Mar 2026', baseline: 44, positive: 80, negative: 34, probability: 65 },
  { date: 'May 2026', baseline: 42, positive: 83, negative: 30, probability: 60 },
  { date: 'Jul 2026', baseline: 40, positive: 86, negative: 26, probability: 55 },
  { date: 'Sep 2026', baseline: 38, positive: 90, negative: 22, probability: 50 },
];

const environmentalTimelineData = [
  { date: 'Jan 2025', baseline: 45, positive: 47, negative: 43, probability: 100 },
  { date: 'Mar 2025', baseline: 44, positive: 48, negative: 41, probability: 95 },
  { date: 'May 2025', baseline: 43, positive: 50, negative: 38, probability: 90 },
  { date: 'Jul 2025', baseline: 41, positive: 53, negative: 35, probability: 85 },
  { date: 'Sep 2025', baseline: 40, positive: 56, negative: 32, probability: 80 },
  { date: 'Nov 2025', baseline: 38, positive: 60, negative: 30, probability: 75 },
  { date: 'Jan 2026', baseline: 36, positive: 64, negative: 27, probability: 70 },
  { date: 'Mar 2026', baseline: 35, positive: 68, negative: 24, probability: 65 },
  { date: 'May 2026', baseline: 33, positive: 72, negative: 21, probability: 60 },
  { date: 'Jul 2026', baseline: 31, positive: 77, negative: 18, probability: 55 },
  { date: 'Sep 2026', baseline: 30, positive: 82, negative: 15, probability: 50 },
];

// Key events on the timeline
const keyEvents = [
  {
    date: 'May 2025',
    title: 'Branch Point Alpha',
    description: 'First major timeline divergence detected',
    type: 'branch',
    perspectives: ['economic', 'social', 'environmental']
  },
  {
    date: 'Nov 2025',
    title: 'Critical Threshold',
    description: 'Point of no return for baseline scenario',
    type: 'critical',
    perspectives: ['economic', 'environmental']
  },
  {
    date: 'Mar 2026',
    title: 'Convergence Event',
    description: 'Multiple scenarios temporarily align',
    type: 'convergence',
    perspectives: ['social']
  },
  {
    date: 'Jul 2026',
    title: 'Major Divergence',
    description: 'Maximum separation between positive and negative outcomes',
    type: 'anomaly',
    perspectives: ['economic', 'social', 'environmental']
  }
];

// Probability clusters (shows how different scenarios may cluster)
const probabilityClusters = [
  { x: 35, y: 60, z: 800, name: 'Cluster A' },
  { x: 65, y: 35, z: 600, name: 'Cluster B' },
  { x: 75, y: 80, z: 400, name: 'Cluster C' },
  { x: 45, y: 25, z: 300, name: 'Cluster D' },
  { x: 55, y: 70, z: 200, name: 'Cluster E' },
];

// Timeline controls and options
const timeRangeOptions = ['1 Year', '2 Years', '5 Years', '10 Years'];
const dataLayers = [
  { id: 'baseline', label: 'Baseline', color: '#6b7280' },
  { id: 'positive', label: 'Optimistic', color: '#10b981' },
  { id: 'negative', label: 'Pessimistic', color: '#ef4444' },
];

const TimelineViewer = () => {
  const [activePerspective, setActivePerspective] = useState('economic');
  const [timerange, setTimerange] = useState('2 Years');
  const [confidenceInterval, setConfidenceInterval] = useState([50, 95]);
  const [enabledLayers, setEnabledLayers] = useState(['baseline', 'positive', 'negative']);
  const [showProbability, setShowProbability] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  
  // Get the appropriate data based on selected perspective
  const getTimelineData = () => {
    switch (activePerspective) {
      case 'economic': return economicTimelineData;
      case 'social': return socialTimelineData;
      case 'environmental': return environmentalTimelineData;
      default: return economicTimelineData;
    }
  };
  
  // Filter events for the current perspective
  const filteredEvents = keyEvents.filter(event => 
    event.perspectives.includes(activePerspective)
  );
  
  // Toggle a data layer on/off
  const toggleLayer = (layerId: string) => {
    if (enabledLayers.includes(layerId)) {
      setEnabledLayers(enabledLayers.filter(id => id !== layerId));
    } else {
      setEnabledLayers([...enabledLayers, layerId]);
    }
  };
  
  return (
    <AppLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold">Timeline Viewer</h1>
          <div className="flex gap-2 mt-2 md:mt-0">
            <Button size="sm" variant="outline" className="flex items-center gap-1">
              <RefreshCw size={16} />
              <span>Refresh</span>
            </Button>
            <Button size="sm" variant="outline" className="flex items-center gap-1">
              <Download size={16} />
              <span>Export</span>
            </Button>
          </div>
        </div>
        
        {/* Main timeline view */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left sidebar - controls */}
          <div className="space-y-6">
            {/* Perspective selection */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-mono">Analysis Perspective</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Button 
                      variant={activePerspective === 'economic' ? 'default' : 'outline'}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setActivePerspective('economic')}
                    >
                      <span className="h-2 w-2 rounded-full bg-cyan-400 mr-2"></span>
                      Economic
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant={activePerspective === 'social' ? 'default' : 'outline'}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setActivePerspective('social')}
                    >
                      <span className="h-2 w-2 rounded-full bg-purple-400 mr-2"></span>
                      Social
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant={activePerspective === 'environmental' ? 'default' : 'outline'}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setActivePerspective('environmental')}
                    >
                      <span className="h-2 w-2 rounded-full bg-green-400 mr-2"></span>
                      Environmental
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Time range control */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-mono flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Time Range
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {timeRangeOptions.map(option => (
                    <Button 
                      key={option}
                      variant={timerange === option ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTimerange(option)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Display layers */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-mono flex items-center">
                  <Layers className="h-4 w-4 mr-2" />
                  Timeline Layers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dataLayers.map(layer => (
                    <div key={layer.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="h-3 w-3 rounded-full" 
                          style={{ backgroundColor: layer.color }}
                        ></div>
                        <span className="text-sm">{layer.label}</span>
                      </div>
                      <Switch 
                        checked={enabledLayers.includes(layer.id)}
                        onCheckedChange={() => toggleLayer(layer.id)}
                      />
                    </div>
                  ))}
                  <div className="pt-2 border-t border-border/50">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-probability" className="text-sm">
                        Show Probability
                      </Label>
                      <Switch 
                        id="show-probability"
                        checked={showProbability}
                        onCheckedChange={setShowProbability}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Confidence interval */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-mono">Confidence Range</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Slider
                    value={confidenceInterval}
                    min={0}
                    max={100}
                    step={5}
                    onValueChange={setConfidenceInterval}
                    className="py-3"
                  />
                  <div className="flex items-center justify-between text-xs">
                    <span>Min: {confidenceInterval[0]}%</span>
                    <span>Max: {confidenceInterval[1]}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content - timeline visualization */}
          <div className="lg:col-span-3 space-y-6">
            {/* Main timeline chart */}
            <Card className="cyber-border">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="font-mono text-lg">
                    {activePerspective.charAt(0).toUpperCase() + activePerspective.slice(1)} Forecast Timeline
                  </CardTitle>
                  <Button variant="ghost" size="icon">
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart 
                      data={getTimelineData()} 
                      margin={{ top: 20, right: 10, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#2a2f3a" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#6b7280" 
                        fontSize={11}
                        tickLine={false}
                        axisLine={{ stroke: '#374151' }}
                      />
                      <YAxis 
                        stroke="#6b7280" 
                        fontSize={11}
                        tickLine={false}
                        axisLine={{ stroke: '#374151' }}
                        domain={[0, 100]}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(15, 23, 42, 0.9)',
                          borderColor: '#0ea5e9',
                          borderRadius: '0.25rem',
                          fontSize: '12px',
                          fontFamily: 'JetBrains Mono, monospace',
                        }}
                        labelStyle={{ color: '#e2e8f0', marginBottom: '0.25rem' }}
                      />
                      
                      {/* Reference area for confidence interval */}
                      <ReferenceArea 
                        y1={confidenceInterval[0]} 
                        y2={confidenceInterval[1]} 
                        fill="#3b82f6" 
                        fillOpacity={0.1} 
                      />
                      
                      {/* Timeline lines */}
                      {enabledLayers.includes('baseline') && (
                        <Line 
                          type="monotone" 
                          dataKey="baseline" 
                          name="Baseline" 
                          stroke="#6b7280" 
                          strokeWidth={2}
                          dot={{ r: 3, fill: '#1e293b', stroke: '#6b7280', strokeWidth: 1 }}
                          activeDot={{ r: 5, stroke: '#6b7280', strokeWidth: 2 }}
                        />
                      )}
                      
                      {enabledLayers.includes('positive') && (
                        <Line 
                          type="monotone" 
                          dataKey="positive" 
                          name="Optimistic" 
                          stroke="#10b981" 
                          strokeWidth={2}
                          dot={{ r: 3, fill: '#1e293b', stroke: '#10b981', strokeWidth: 1 }}
                          activeDot={{ r: 5, stroke: '#10b981', strokeWidth: 2 }}
                        />
                      )}
                      
                      {enabledLayers.includes('negative') && (
                        <Line 
                          type="monotone" 
                          dataKey="negative" 
                          name="Pessimistic" 
                          stroke="#ef4444" 
                          strokeWidth={2}
                          dot={{ r: 3, fill: '#1e293b', stroke: '#ef4444', strokeWidth: 1 }}
                          activeDot={{ r: 5, stroke: '#ef4444', strokeWidth: 2 }}
                        />
                      )}
                      
                      {showProbability && (
                        <Line 
                          type="monotone" 
                          dataKey="probability" 
                          name="Probability" 
                          stroke="#f59e0b" 
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={{ r: 3, fill: '#1e293b', stroke: '#f59e0b', strokeWidth: 1 }}
                          activeDot={{ r: 5, stroke: '#f59e0b', strokeWidth: 2 }}
                        />
                      )}
                      
                      {/* Event markers */}
                      {filteredEvents.map((event, index) => (
                        <ReferenceDot
                          key={index}
                          x={event.date}
                          y={
                            activePerspective === 'economic' ? 
                              economicTimelineData.find(d => d.date === event.date)?.baseline : 
                            activePerspective === 'social' ? 
                              socialTimelineData.find(d => d.date === event.date)?.baseline :
                              environmentalTimelineData.find(d => d.date === event.date)?.baseline
                          }
                          r={6}
                          fill={
                            event.type === 'branch' ? '#3b82f6' :
                            event.type === 'critical' ? '#ef4444' :
                            event.type === 'convergence' ? '#10b981' : 
                            '#f59e0b' // anomaly
                          }
                          stroke="#ffffff"
                          strokeWidth={selectedEvent === event.title ? 2 : 0}
                          onClick={() => setSelectedEvent(
                            selectedEvent === event.title ? null : event.title
                          )}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Timeline controls */}
                <div className="flex justify-between items-center mt-4">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <ChevronLeft className="h-4 w-4" />
                    <span>Earlier</span>
                  </Button>
                  <div className="flex items-center space-x-1">
                    <Badge variant="outline" className="bg-card/50">2025</Badge>
                    <Badge className="bg-cyber text-white">2026</Badge>
                    <Badge variant="outline" className="bg-card/50">2027</Badge>
                  </div>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <span>Later</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Additional views */}
            <Tabs defaultValue="events" className="w-full">
              <div className="flex justify-between items-center mb-2">
                <TabsList>
                  <TabsTrigger value="events">Key Events</TabsTrigger>
                  <TabsTrigger value="clusters">Probability Clusters</TabsTrigger>
                </TabsList>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </Button>
              </div>
              
              <TabsContent value="events" className="mt-2">
                <Card>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredEvents.map((event, index) => (
                        <div 
                          key={index} 
                          className={cn(
                            "p-3 border rounded-md transition-all",
                            selectedEvent === event.title ? 
                              "border-cyber bg-cyber/10" : "border-border",
                            "cursor-pointer hover:border-cyber"
                          )}
                          onClick={() => setSelectedEvent(
                            selectedEvent === event.title ? null : event.title
                          )}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className={cn(
                              "h-3 w-3 rounded-full",
                              event.type === 'branch' ? "bg-blue-500" :
                              event.type === 'critical' ? "bg-red-500" :
                              event.type === 'convergence' ? "bg-green-500" : 
                              "bg-yellow-500" // anomaly
                            )}></span>
                            <h4 className="text-sm font-medium">{event.title}</h4>
                          </div>
                          <div className="text-xs text-muted-foreground mb-1">
                            {event.date}
                          </div>
                          <p className="text-xs">{event.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="clusters" className="mt-2">
                <Card>
                  <CardContent className="p-4">
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart
                          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#2a2f3a" />
                          <XAxis 
                            type="number" 
                            dataKey="x" 
                            name="probability" 
                            unit="%" 
                            domain={[0, 100]} 
                            stroke="#6b7280" 
                            fontSize={11}
                          />
                          <YAxis 
                            type="number" 
                            dataKey="y" 
                            name="impact" 
                            unit="%" 
                            domain={[0, 100]} 
                            stroke="#6b7280" 
                            fontSize={11}
                          />
                          <ZAxis 
                            type="number" 
                            dataKey="z" 
                            range={[50, 400]} 
                            name="confidence" 
                          />
                          <Tooltip 
                            cursor={{ strokeDasharray: '3 3' }} 
                            contentStyle={{ 
                              backgroundColor: 'rgba(15, 23, 42, 0.9)',
                              borderColor: '#0ea5e9',
                              borderRadius: '0.25rem',
                              fontSize: '12px',
                              fontFamily: 'JetBrains Mono, monospace',
                            }}
                          />
                          <Scatter 
                            name="Probability Clusters" 
                            data={probabilityClusters} 
                            fill="#0ea5e9" 
                          />
                        </ScatterChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      <div className="flex gap-4">
                        <div>X-Axis: Probability (%)</div>
                        <div>Y-Axis: Impact (%)</div>
                        <div>Size: Confidence Level</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default TimelineViewer;
