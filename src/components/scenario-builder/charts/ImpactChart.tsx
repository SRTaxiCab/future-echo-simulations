
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { ImpactData } from '../types';

interface ImpactChartProps {
  data: ImpactData[];
}

export const ImpactChart: React.FC<ImpactChartProps> = ({ data }) => {
  return (
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
            data={data}
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
  );
};
