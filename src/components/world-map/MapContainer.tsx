import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

interface MapContainerProps {
  mapContainer: React.RefObject<HTMLDivElement>;
  onTokenReset: () => void;
}

export const MapContainer: React.FC<MapContainerProps> = ({ mapContainer, onTokenReset }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="font-mono text-lg flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            Global Impact Visualization
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onTokenReset}>
            Reset Token
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div 
          ref={mapContainer} 
          className="w-full h-[500px] md:h-[600px] rounded-lg border relative overflow-hidden"
          style={{
            background: 'linear-gradient(45deg, #0f172a, #1e293b)'
          }}
        />
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Impact Legend</h4>
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>High Impact</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>Medium Impact</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Low Impact</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};