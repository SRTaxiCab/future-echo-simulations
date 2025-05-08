
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceDot
} from 'recharts';

const timelineData = [
  { date: 'Jan 2025', baseline: 50, scenario1: 51, scenario2: 49 },
  { date: 'Mar 2025', baseline: 52, scenario1: 54, scenario2: 48 },
  { date: 'May 2025', baseline: 53, scenario1: 58, scenario2: 47 },
  { date: 'Jul 2025', baseline: 55, scenario1: 62, scenario2: 45 },
  { date: 'Sep 2025', baseline: 58, scenario1: 67, scenario2: 42 },
  { date: 'Nov 2025', baseline: 60, scenario1: 72, scenario2: 38 },
  { date: 'Jan 2026', baseline: 63, scenario1: 78, scenario2: 35 },
  { date: 'Mar 2026', baseline: 65, scenario1: 85, scenario2: 31, anomaly: true },
];

// Define node events (key moments on the timeline)
const nodeEvents = [
  { 
    date: 'Jul 2025', 
    value: 55,
    label: 'Branching Point',
    description: 'Timeline divergence detected'
  },
  { 
    date: 'Mar 2026', 
    value: 85,
    label: 'Anomaly',
    description: 'Critical threshold exceeded'
  }
];

const timeRangeOptions = [
  { value: '1y', label: '1 Year' },
  { value: '2y', label: '2 Years' },
  { value: '5y', label: '5 Years' }
];

interface TimelineChartProps {
  className?: string;
}

export const TimelineChart = ({ className }: TimelineChartProps) => {
  const [timeRange, setTimeRange] = useState('1y');
  
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="font-mono text-lg">Probable Futures</CardTitle>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32 h-8 text-xs">
            <SelectValue placeholder="Select Range" />
          </SelectTrigger>
          <SelectContent>
            {timeRangeOptions.map(option => (
              <SelectItem key={option.value} value={option.value} className="text-xs">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={timelineData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
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
              itemStyle={{ padding: 0, margin: 0 }}
            />
            
            {/* Baseline Timeline */}
            <Line 
              type="monotone" 
              dataKey="baseline" 
              name="Baseline" 
              stroke="#6b7280" 
              strokeWidth={2}
              dot={{ r: 3, fill: '#1e293b', stroke: '#6b7280', strokeWidth: 1 }}
              activeDot={{ r: 5, stroke: '#6b7280', strokeWidth: 2 }}
            />
            
            {/* Scenario 1 - Positive Outcome */}
            <Line 
              type="monotone" 
              dataKey="scenario1" 
              name="Scenario A" 
              stroke="#10b981" 
              strokeWidth={2}
              dot={{ r: 3, fill: '#1e293b', stroke: '#10b981', strokeWidth: 1 }}
              activeDot={{ r: 5, stroke: '#10b981', strokeWidth: 2 }}
            />
            
            {/* Scenario 2 - Negative Outcome */}
            <Line 
              type="monotone" 
              dataKey="scenario2" 
              name="Scenario B" 
              stroke="#ef4444" 
              strokeWidth={2}
              dot={{ r: 3, fill: '#1e293b', stroke: '#ef4444', strokeWidth: 1 }}
              activeDot={{ r: 5, stroke: '#ef4444', strokeWidth: 2 }}
            />
            
            {/* Reference dots for key timeline events */}
            {nodeEvents.map((event, index) => (
              <ReferenceDot
                key={index}
                x={event.date}
                y={event.value}
                r={6}
                fill="#0ea5e9"
                stroke="#0ea5e9"
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
        
        {/* Legend for nodes */}
        <div className="flex flex-col gap-1 text-xs text-muted-foreground mt-2">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#6b7280]"></span>
            <span>Baseline Timeline</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#10b981]"></span>
            <span>Scenario A (Positive Outcome)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#ef4444]"></span>
            <span>Scenario B (Negative Outcome)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#0ea5e9]"></span>
            <span>Key Timeline Events</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
