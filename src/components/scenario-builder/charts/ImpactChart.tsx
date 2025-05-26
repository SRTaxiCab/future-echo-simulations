
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  LabelList
} from 'recharts';
import { ImpactData } from '../types';

interface ImpactChartProps {
  data: ImpactData[];
}

export const ImpactChart: React.FC<ImpactChartProps> = ({ data }) => {
  // Calculate percentage differences for display
  const enhancedData = data.map(item => ({
    ...item,
    percentChange: item.scenario > item.baseline 
      ? `+${Math.round((item.scenario - item.baseline) / item.baseline * 100)}%`
      : `${Math.round((item.scenario - item.baseline) / item.baseline * 100)}%`
  }));
  
  // Determine the maximum absolute value for axis scaling
  const maxAbsValue = Math.max(
    ...data.flatMap(d => [Math.abs(d.baseline), Math.abs(d.scenario)])
  );
  
  // Custom tooltip formatter
  const customTooltipFormatter = (value: any, name: any) => {
    const formattedName = name === 'baseline' ? 'Baseline' : 'Your Scenario';
    return [value, formattedName];
  };
  
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
            data={enhancedData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
            barGap={0}
            barCategoryGap="15%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2f3a" horizontal={false} />
            <XAxis 
              type="number" 
              stroke="#6b7280" 
              fontSize={11}
              domain={[-maxAbsValue * 1.1, maxAbsValue * 1.1]}
              tickFormatter={(value) => Math.abs(value).toString()}
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              stroke="#6b7280" 
              fontSize={11} 
              width={130}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                borderColor: '#0ea5e9',
                borderRadius: '0.25rem',
                fontSize: '12px',
                fontFamily: 'JetBrains Mono, monospace',
              }}
              formatter={customTooltipFormatter}
            />
            <ReferenceLine x={0} stroke="#374151" strokeWidth={2} />
            <Bar 
              dataKey="baseline" 
              name="Baseline" 
              fill="#6b7280" 
              radius={[0, 0, 0, 0]} 
              maxBarSize={25}
            />
            <Bar 
              dataKey="scenario" 
              name="Your Scenario" 
              fill="#10b981" 
              radius={[0, 4, 4, 0]} 
              maxBarSize={25}
            >
              <LabelList 
                dataKey="percentChange" 
                position="right" 
                style={{ 
                  fill: "#e2e8f0", 
                  fontSize: 10, 
                  fontFamily: "JetBrains Mono, monospace" 
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend with color indicators */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 bg-[#6b7280]"></span>
            <span>Baseline</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 bg-[#10b981]"></span>
            <span>Your Scenario</span>
          </div>
        </div>
        <div className="text-xs italic">
          Percentages show change from baseline
        </div>
      </div>
    </div>
  );
};
