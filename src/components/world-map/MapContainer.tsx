import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, Sun, Moon } from 'lucide-react';

interface MapContainerProps {
  mapContainer: React.RefObject<HTMLDivElement>;
  mapTheme: 'light' | 'dark';
  onThemeToggle: () => void;
  onTokenReset: () => void;
}

export const MapContainer: React.FC<MapContainerProps> = ({ 
  mapContainer, 
  mapTheme, 
  onThemeToggle, 
  onTokenReset 
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="font-mono text-lg flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            Global Impact Visualization
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onThemeToggle}
              title={`Switch to ${mapTheme === 'light' ? 'dark' : 'light'} theme`}
            >
              {mapTheme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={onTokenReset}>
              Reset Token
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div 
          ref={mapContainer} 
          className="w-full h-[500px] md:h-[600px] rounded-lg border border-border bg-muted/20"
          style={{ minHeight: '500px' }}
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