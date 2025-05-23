
import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  RechartsTooltip, 
  ResponsiveContainer,
} from 'recharts';
import { TimelineData } from '../types';

interface TimelineChartProps {
  data: TimelineData[];
}

export const TimelineChart: React.FC<TimelineChartProps> = ({ data }) => {
  return (
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
            data={data}
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
  );
};
