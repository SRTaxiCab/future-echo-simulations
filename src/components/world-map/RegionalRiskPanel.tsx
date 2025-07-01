import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { regionalData } from './data';

export const RegionalRiskPanel: React.FC = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-mono">Regional Risk Assessment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {regionalData.map((region, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-sm">{region.region}</span>
              <div className="flex items-center gap-2">
                <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full"
                    style={{ 
                      width: `${region.probability}%`,
                      backgroundColor: region.color 
                    }}
                  />
                </div>
                <span className="text-xs font-mono">{region.probability}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};