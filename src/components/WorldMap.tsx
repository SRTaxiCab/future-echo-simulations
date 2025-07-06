
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMapboxMap } from './world-map/hooks/useMapboxMap';
import { LoadingPanel } from './world-map/LoadingPanel';
import { MapContainer } from './world-map/MapContainer';
import { RegionalRiskPanel } from './world-map/RegionalRiskPanel';
import { EventDetailsPanel } from './world-map/EventDetailsPanel';
import { ActiveEventsPanel } from './world-map/ActiveEventsPanel';
import { Globe, AlertCircle } from 'lucide-react';
import { type GlobalEvent } from './world-map/data';

interface WorldMapProps {
  className?: string;
}

export const WorldMap: React.FC<WorldMapProps> = ({ className }) => {
  const [selectedEvent, setSelectedEvent] = useState<GlobalEvent | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');

  // Load token from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('mapbox-token');
    if (savedToken && savedToken.trim()) {
      setMapboxToken(savedToken);
    }
  }, []);

  const {
    mapContainer,
    mapInitialized,
    isInitializing,
    initError: mapInitError
  } = useMapboxMap(mapboxToken, setSelectedEvent);

  // Show setup message if no token
  if (!mapboxToken) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="font-mono flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            Global Events Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Globe className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Setup Required</h3>
              <p className="text-muted-foreground mb-4">
                Please configure your Mapbox access token in Settings to view the global map.
              </p>
              <Button asChild>
                <Link to="/settings">
                  Go to Settings
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show loading panel
  if (isInitializing) {
    return <LoadingPanel className={className} />;
  }

  // Show error if map failed to initialize
  if (mapInitError) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="font-mono flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            Global Events Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <h3 className="text-lg font-medium mb-2">Map Error</h3>
              <p className="text-muted-foreground mb-4">{mapInitError}</p>
              <Button asChild variant="outline">
                <Link to="/settings">
                  Check Settings
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render main map interface
  return (
    <div className={className}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map */}
        <div className="lg:col-span-2">
          <MapContainer 
            mapContainer={mapContainer}
            onTokenReset={() => {
              localStorage.removeItem('mapbox-token');
              setMapboxToken('');
            }}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <RegionalRiskPanel />
          <EventDetailsPanel selectedEvent={selectedEvent} />
          <ActiveEventsPanel 
            selectedEvent={selectedEvent}
            onEventSelect={setSelectedEvent}
          />
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.7;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
