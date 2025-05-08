
import React from 'react';
import { AppLayout } from '@/components/AppLayout';
import { AlertCard } from '@/components/AlertCard';
import { EventCard, Event } from '@/components/EventCard';
import { StatusCard } from '@/components/StatusCard';
import { TimelineChart } from '@/components/TimelineChart';
import { 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  Users,
  Globe,
} from 'lucide-react';

// Sample event data
const events: Event[] = [
  {
    id: '1',
    title: 'AI Regulation Framework',
    date: 'Sep 21, 2025, 11:30 AM',
    trend: 'Global AI oversight committees forming in response to recent algorithmic anomalies in financial markets',
    keywords: ['AI', 'Regulation', 'Global', 'Finance'],
    probability: 78,
    impact: 'high'
  },
  {
    id: '2',
    title: 'Energy Grid Innovation',
    date: 'Oct 15, 2025, 09:15 AM',
    trend: 'Decentralized energy networks gaining traction as traditional grids face resilience challenges',
    keywords: ['Energy', 'Decentralized', 'Infrastructure'],
    probability: 65,
    impact: 'medium'
  },
  {
    id: '3',
    title: 'Social Media Paradigm Shift',
    date: 'Nov 03, 2025, 04:45 PM',
    trend: 'User migration towards privacy-focused platforms accelerating following data breach revelations',
    keywords: ['Social Media', 'Privacy', 'Data'],
    probability: 82,
    impact: 'medium'
  }
];

const Dashboard = () => {
  return (
    <AppLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold mb-2 md:mb-0">Intelligence Dashboard</h1>
          <div className="text-sm text-muted-foreground font-mono">
            Last updated: <span className="text-cyber">05-08-2025 14:32:18 UTC</span>
          </div>
        </div>
        
        {/* Stats overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatusCard 
            title="Analyzed Data Points" 
            value="1.4M" 
            icon={<Activity />}
            trending="up"
            trendValue="+12.5% from last week" 
          />
          <StatusCard 
            title="Forecast Accuracy" 
            value="87.3%" 
            icon={<TrendingUp />}
            trending="up"
            trendValue="+2.1% improvement" 
          />
          <StatusCard 
            title="Risk Index" 
            value="Medium" 
            icon={<AlertTriangle />}
            trending="stable"
            trendValue="No change" 
          />
          <StatusCard 
            title="Active Scenarios" 
            value="7" 
            icon={<Globe />}
            trending="up"
            trendValue="+2 new scenarios" 
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Timeline */}
          <div className="lg:col-span-2 space-y-6">
            {/* Timeline chart */}
            <TimelineChart className="cyber-border" />
            
            {/* Events feed */}
            <div>
              <h2 className="text-lg font-mono mb-4">Real-Time Feed</h2>
              <div className="grid gap-4">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          </div>
          
          {/* Right column - Alerts and stats */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-mono mb-4">Alert Zone</h2>
              <AlertCard
                title="Timeline Divergence Detected"
                message="Significant deviation observed in Scenario A. Probability threshold exceeded for AI regulatory framework implementation. Recommend immediate analysis of potential market impacts."
                severity="warning"
                className="mb-4"
              />
              <AlertCard
                title="Critical Threshold"
                message="Anomalous data pattern detected in social sentiment analysis. <span class='redacted'>Classified information</span> suggests coordination of <span class='redacted'>redacted</span> activity. Priority escalation recommended."
                severity="critical"
              />
            </div>
            
            {/* Additional content can be added here */}
            <div className="relative">
              <div className="absolute -top-1 -right-1 z-10">
                <span className="secret-stamp">Classified</span>
              </div>
              <Card className="neural-border bg-muted/20 p-4">
                <h3 className="font-mono text-neural mb-2">Analyst Notes</h3>
                <div className="text-sm space-y-2">
                  <p>Timeline simulations suggest <span className="redacted">energy crisis</span> likelihood increasing by Q3 2026. Recommend preparing countermeasures.</p>
                  <p>Data anomaly in <span className="redacted">social patterns</span> requires further investigation. Possible connection to <span className="redacted">Project Delta</span>.</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
