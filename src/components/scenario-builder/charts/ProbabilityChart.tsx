
import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import { ProbabilityData } from '../types';

interface ProbabilityChartProps {
  data: ProbabilityData[];
  colors: string[];
}

export const ProbabilityChart: React.FC<ProbabilityChartProps> = ({ data, colors }) => {
  // Calculate total for percentage display
  const total = data.reduce((sum, entry) => sum + entry.value, 0);
  
  // Custom label renderer
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="#fff"
        textAnchor="middle" 
        dominantBaseline="central"
        className="text-xs font-mono"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const renderLegendText = (value, entry) => {
    const { color } = entry;
    return <span style={{ color: '#e2e8f0', fontSize: '0.75rem' }}>{value}</span>;
  };

  return (
    <div className="h-[300px] flex flex-col items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={90}
            innerRadius={45}
            fill="#8884d8"
            dataKey="value"
            label={renderCustomizedLabel}
            animationDuration={800}
            animationBegin={100}
            animationEasing="ease"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={colors[index % colors.length]} 
                stroke="rgba(15, 23, 42, 0.3)"
                strokeWidth={1}
              />
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
              padding: '8px',
            }}
          />
          <Legend 
            formatter={renderLegendText} 
            layout="horizontal" 
            verticalAlign="bottom"
            align="center"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
