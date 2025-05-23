
import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { ProbabilityData } from '../types';

interface ProbabilityChartProps {
  data: ProbabilityData[];
  colors: string[];
}

export const ProbabilityChart: React.FC<ProbabilityChartProps> = ({ data, colors }) => {
  return (
    <div className="h-[300px] flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
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
  );
};
