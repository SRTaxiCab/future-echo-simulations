
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  LayoutDashboard, 
  Clock, 
  Layers, 
  Database, 
  Settings,
  AlertTriangle,
  Users,
  Key,
  Eye,
  Target,
  TrendingUp,
  Shield,
  Zap
} from 'lucide-react';

export const OperationsManual: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-cyber flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-background" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-mono">PROJECT LOOKING GLASS</h1>
            <p className="text-lg text-muted-foreground">Operations Manual v1.0</p>
          </div>
        </div>
        <Badge variant="outline" className="bg-cyber/10 text-cyber border-cyber">
          <Shield className="h-3 w-3 mr-1" />
          CLASSIFIED - AUTHORIZED PERSONNEL ONLY
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
          <TabsTrigger value="data-feeds">Data Feeds</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="neural-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-cyber" />
                System Overview
              </CardTitle>
              <CardDescription>
                Understanding Project Looking Glass capabilities and core functions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-cyber">Mission Statement</h4>
                  <p className="text-sm text-muted-foreground">
                    Project Looking Glass is a predictive intelligence system designed to simulate and forecast future events by analyzing real-time data from multiple sources including news, social media, academic publications, and fringe data channels.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-cyber">Core Capabilities</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Real-time data aggregation and analysis</li>
                    <li>• Predictive timeline generation</li>
                    <li>• Causal scenario modeling</li>
                    <li>• Risk assessment and probability calculation</li>
                    <li>• Anomaly detection and alert generation</li>
                  </ul>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-semibold text-cyber mb-3">Security Classification</h4>
                <div className="grid sm:grid-cols-3 gap-3">
                  <Badge variant="destructive">TOP SECRET</Badge>
                  <Badge variant="outline" className="border-yellow-500 text-yellow-600">CONFIDENTIAL</Badge>
                  <Badge variant="outline" className="border-blue-500 text-blue-600">RESTRICTED</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dashboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LayoutDashboard className="h-5 w-5 text-cyber" />
                Intelligence Dashboard Operations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Step 1: System Status Assessment</h4>
                <div className="pl-4 space-y-2 text-sm">
                  <p>• Monitor the status indicator in the sidebar (Stable/Simulating/Anomaly)</p>
                  <p>• Review the four key metrics in the status cards:</p>
                  <div className="pl-4 space-y-1 text-muted-foreground">
                    <p>- Analyzed Data Points: Current volume of processed information</p>
                    <p>- Forecast Accuracy: System prediction reliability percentage</p>
                    <p>- Risk Index: Current threat assessment level</p>
                    <p>- Active Scenarios: Number of running simulations</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Step 2: Timeline Analysis</h4>
                <div className="pl-4 space-y-2 text-sm">
                  <p>• Examine the interactive timeline chart for trend patterns</p>
                  <p>• Look for probability spikes or unusual convergence points</p>
                  <p>• Note any divergence patterns that may indicate timeline shifts</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Step 3: Event Feed Monitoring</h4>
                <div className="pl-4 space-y-2 text-sm">
                  <p>• Review real-time events in order of probability and impact</p>
                  <p>• Pay attention to keyword patterns and emerging themes</p>
                  <p>• Track probability percentages for significant events</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Step 4: Alert Management</h4>
                <div className="pl-4 space-y-2 text-sm">
                  <p>• Critical alerts require immediate attention and escalation</p>
                  <p>• Warning alerts should be documented and monitored</p>
                  <p>• Review classified analyst notes for additional context</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-cyber" />
                Timeline Viewer Operations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Navigation Controls</h4>
                <div className="pl-4 space-y-2 text-sm">
                  <p>• Use zoom controls to focus on specific time periods</p>
                  <p>• Click and drag to pan across different timeline sections</p>
                  <p>• Use the timeline scrubber for quick navigation</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Event Analysis</h4>
                <div className="pl-4 space-y-2 text-sm">
                  <p>• Hover over timeline nodes to view event details</p>
                  <p>• Click events to expand full analysis and context</p>
                  <p>• Look for clustering patterns that indicate causal relationships</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Branch Preview</h4>
                <div className="pl-4 space-y-2 text-sm">
                  <p>• Timeline branches represent alternative probability paths</p>
                  <p>• Thicker branches indicate higher probability outcomes</p>
                  <p>• Divergence points show critical decision moments</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-cyber" />
                Scenario Builder Operations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Creating New Scenarios</h4>
                <div className="pl-4 space-y-2 text-sm">
                  <p>• Define initial parameters and starting conditions</p>
                  <p>• Set probability thresholds and confidence intervals</p>
                  <p>• Input key variables and constraint factors</p>
                  <p>• Select data sources for scenario modeling</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Causal Tree Analysis</h4>
                <div className="pl-4 space-y-2 text-sm">
                  <p>• Nodes represent events or decision points</p>
                  <p>• Links show causal relationships and dependencies</p>
                  <p>• Node size indicates impact magnitude</p>
                  <p>• Color coding represents probability levels</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Variable Adjustment</h4>
                <div className="pl-4 space-y-2 text-sm">
                  <p>• Modify input parameters to test different outcomes</p>
                  <p>• Observe real-time changes in probability calculations</p>
                  <p>• Save multiple scenario versions for comparison</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Simulation Execution</h4>
                <div className="pl-4 space-y-2 text-sm">
                  <p>• Run Monte Carlo simulations for statistical validation</p>
                  <p>• Generate confidence intervals and error margins</p>
                  <p>• Export results for further analysis and reporting</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data-feeds" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-cyber" />
                Data Feeds Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Source Configuration</h4>
                <div className="pl-4 space-y-2 text-sm">
                  <p>• Add new data sources through the configuration panel</p>
                  <p>• Configure refresh rates and data collection parameters</p>
                  <p>• Set quality filters and relevance thresholds</p>
                  <p>• Test connections before activating feeds</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Data Quality Monitoring</h4>
                <div className="pl-4 space-y-2 text-sm">
                  <p>• Monitor feed health and connection status</p>
                  <p>• Review data quality metrics and error rates</p>
                  <p>• Track update frequencies and lag times</p>
                  <p>• Identify and resolve feed anomalies</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Integration Management</h4>
                <div className="pl-4 space-y-2 text-sm">
                  <p>• Prioritize sources based on reliability and relevance</p>
                  <p>• Configure data fusion and correlation algorithms</p>
                  <p>• Manage API rate limits and usage quotas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-cyber" />
                System Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold">User Profile Management</h4>
                <div className="pl-4 space-y-2 text-sm">
                  <p>• Update personal information and contact details</p>
                  <p>• Configure notification preferences and alert thresholds</p>
                  <p>• Set security preferences and access controls</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">API Key Configuration</h4>
                <div className="pl-4 space-y-2 text-sm">
                  <p>• Manage external service API keys securely</p>
                  <p>• Configure rate limits and usage monitoring</p>
                  <p>• Test API connections and validate credentials</p>
                  <p>• Set up backup keys for redundancy</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Data Source Configuration</h4>
                <div className="pl-4 space-y-2 text-sm">
                  <p>• Add, edit, and remove data source connections</p>
                  <p>• Configure authentication and access parameters</p>
                  <p>• Set data collection schedules and filters</p>
                  <p>• Monitor connection health and performance</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-amber-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-800">
                <AlertTriangle className="h-5 w-5" />
                Security Protocols
              </CardTitle>
            </CardHeader>
            <CardContent className="text-amber-800 space-y-3">
              <div className="space-y-2 text-sm">
                <p>• Always log out when leaving workstation unattended</p>
                <p>• Report any anomalous system behavior immediately</p>
                <p>• Verify all critical predictions through multiple sources</p>
                <p>• Follow classified information handling procedures</p>
                <p>• Maintain operational security at all times</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
