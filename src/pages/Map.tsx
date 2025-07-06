import React from 'react';
import { AppLayout } from '@/components/AppLayout';
import { WorldMap } from '@/components/WorldMap';

const Map = () => {
  return (
    <AppLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold font-mono">Global Events Map</h1>
          <p className="text-muted-foreground mt-1">
            Interactive visualization of global events and their impact zones
          </p>
        </div>
        <WorldMap className="w-full" />
      </div>
    </AppLayout>
  );
};

export default Map;