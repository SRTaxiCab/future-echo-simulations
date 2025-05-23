
import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea
} from 'recharts';
import { TimelineData } from '../types';

interface TimelineChartProps {
  data: TimelineData[];
}

export const TimelineChart: React.FC<TimelineChartProps> = ({ data }) => {
  // Find the point where scenario significantly diverges from baseline
  const divergencePoint = data.findIndex((point, index, arr) => {
    if (index === 0) return false;
    const currentDiff = Math.abs(point.scenario - point.baseline);
    const prevDiff = Math.abs(arr[index-1].scenario - arr[index-1].baseline);
    return currentDiff > prevDiff * 1.5; // 50% increase in difference
  });
  
  // Find min and max values for better axis scaling
  const allValues = data.flatMap(d => [d.baseline, d.scenario]);
  const minValue = Math.floor(Math.min(...allValues) * 0.95);
  const maxValue = Math.ceil(Math.max(...allValues) * 1.05);
  
  return (
    <div className="space-y-4">
      <div className="bg-muted/20 rounded-md p-3 text-sm">
        <p>
          The timeline chart shows how your scenario is expected to evolve over time
          compared to the baseline projection.
          {divergencePoint > 0 && (
            <span className="block mt-2 text-amber-500">
              • Significant divergence detected at {data[divergencePoint]?.month || 'midpoint'}
            </span>
          )}
        </p>
      </div>
      
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2f3a" />
            <XAxis 
              dataKey="month" 
              stroke="#6b7280" 
              fontSize={11} 
              tickMargin={10}
            />
            <YAxis 
              stroke="#6b7280" 
              fontSize={11} 
              domain={[minValue, maxValue]} 
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                borderColor: '#0ea5e9',
                borderRadius: '0.25rem',
                fontSize: '12px',
                fontFamily: 'JetBrains Mono, monospace',
              }}
              formatter={(value) => [`${value}`, '']}
              labelFormatter={(label) => `Month: ${label}`}
            />
            
            {/* Show confidence area around the scenario line */}
            <ReferenceArea 
              y1={(dataPoint) => dataPoint.scenario * 0.9} 
              y2={(dataPoint) => dataPoint.scenario * 1.1} 
              strokeOpacity={0}
              fill="#10b981" 
              fillOpacity={0.1} 
            />
            
            {/* Add reference line for crossover point if exists */}
            {data.findIndex((d, i) => 
              i > 0 && ((data[i-1].baseline > data[i-1].scenario && d.baseline < d.scenario) || 
              (data[i-1].baseline < data[i-1].scenario && d.baseline > d.scenario))
            ) > 0 && (
              <ReferenceLine 
                x={data[
                  data.findIndex((d, i) => 
                    i > 0 && ((data[i-1].baseline > data[i-1].scenario && d.baseline < d.scenario) || 
                    (data[i-1].baseline < data[i-1].scenario && d.baseline > d.scenario))
                  )
                ]?.month} 
                stroke="#0ea5e9" 
                strokeDasharray="3 3" 
                label={{ 
                  value: "Crossover", 
                  fill: "#0ea5e9", 
                  fontSize: 10 
                }} 
              />
            )}
            
            <Line 
              type="monotone" 
              dataKey="baseline" 
              name="Baseline" 
              stroke="#6b7280" 
              strokeWidth={2}
              dot={{ fill: '#1e293b', r: 4, stroke: '#6b7280', strokeWidth: 1 }}
              activeDot={{ r: 6, stroke: '#6b7280', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="scenario" 
              name="Your Scenario" 
              stroke="#10b981" 
              strokeWidth={2}
              dot={{ fill: '#1e293b', r: 4, stroke: '#10b981', strokeWidth: 1 }}
              activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend with improved visualization */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#6b7280]"></span>
            <span>Baseline</span>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <span className="h-3 w-3 rounded-full bg-[#10b981]"></span>
            <span>Your Scenario</span>
          </div>
        </div>
        <div className="flex items-center">
          <span className="inline-block h-2 w-6 bg-[#10b981]/10 rounded mr-2"></span>
          <span>Confidence Interval (±10%)</span>
        </div>
      </div>
    </div>
  );
};
