
import React, { useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMapboxToken } from './world-map/hooks/useMapboxToken';
import { useMapboxMap } from './world-map/hooks/useMapboxMap';
import { TokenSetupPanel } from './world-map/TokenSetupPanel';
import { LoadingPanel } from './world-map/LoadingPanel';
import { MapContainer } from './world-map/MapContainer';
import { RegionalRiskPanel } from './world-map/RegionalRiskPanel';
import { EventDetailsPanel } from './world-map/EventDetailsPanel';
import { ActiveEventsPanel } from './world-map/ActiveEventsPanel';
import { type GlobalEvent } from './world-map/data';

interface WorldMapProps {
  className?: string;
}

export const WorldMap: React.FC<WorldMapProps> = ({ className }) => {
  const [selectedEvent, setSelectedEvent] = useState<GlobalEvent | null>(null);
  
  const {
    mapboxToken,
    setMapboxToken,
    showTokenInput,
    showToken,
    setShowToken,
    initError,
    handleTokenSubmit,
    handleTokenReset
  } = useMapboxToken();

  const {
    mapContainer,
    mapInitialized,
    isInitializing,
    initError: mapInitError,
    resetMap
  } = useMapboxMap(mapboxToken, setSelectedEvent);

  const handleTokenSubmitWithReset = () => {
    resetMap();
    handleTokenSubmit(() => {
      // Token was saved successfully, map will auto-initialize via useEffect
    });
  };

  const handleTokenResetWithMap = () => {
    resetMap();
    handleTokenReset();
  };

  const displayError = initError || mapInitError;

  // Render token setup panel
  if (showTokenInput || (!mapInitialized && !isInitializing && mapboxToken && !displayError)) {
    return (
      <TokenSetupPanel
        className={className}
        mapboxToken={mapboxToken}
        setMapboxToken={setMapboxToken}
        showToken={showToken}
        setShowToken={setShowToken}
        initError={displayError}
        isInitializing={isInitializing}
        onTokenSubmit={handleTokenSubmitWithReset}
        onTokenReset={handleTokenResetWithMap}
      />
    );
  }

  // Render loading panel
  if (isInitializing) {
    return <LoadingPanel className={className} />;
  }

  // Render main map interface
  return (
    <div className={className}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map */}
        <div className="lg:col-span-2">
          <MapContainer 
            mapContainer={mapContainer}
            onTokenReset={handleTokenResetWithMap}
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
