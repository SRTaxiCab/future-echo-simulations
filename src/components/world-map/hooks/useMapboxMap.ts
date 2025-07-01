import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { globalEvents, type GlobalEvent } from '../data';

export const useMapboxMap = (mapboxToken: string, onEventSelect: (event: GlobalEvent) => void) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [initError, setInitError] = useState<string>('');

  // Initialize map when token is available and container is ready
  useEffect(() => {
    console.log('Map init effect triggered:', {
      hasToken: !!mapboxToken,
      tokenLength: mapboxToken?.length,
      hasContainer: !!mapContainer.current,
      isInitialized: mapInitialized,
      isInitializing: isInitializing
    });
    
    if (mapboxToken && mapboxToken.trim() && !mapInitialized && !isInitializing) {
      console.log('All conditions met, checking for container...');
      // Use multiple attempts to find the container
      let attempts = 0;
      const maxAttempts = 10;
      
      const tryInitialize = () => {
        attempts++;
        console.log(`Attempt ${attempts}: Container available:`, !!mapContainer.current);
        
        if (mapContainer.current) {
          console.log('Container found, initializing map');
          initializeMap();
        } else if (attempts < maxAttempts) {
          console.log(`Container not ready, retrying in 100ms (attempt ${attempts})`);
          setTimeout(tryInitialize, 100);
        } else {
          console.log('Max attempts reached, container still not available');
        }
      };
      
      // Start trying immediately
      tryInitialize();
    }
  }, [mapboxToken, mapInitialized, isInitializing]);

  const initializeMap = async () => {
    if (!mapContainer.current || !mapboxToken || mapInitialized || isInitializing) {
      console.log('Map initialization blocked:', {
        hasContainer: !!mapContainer.current,
        hasToken: !!mapboxToken,
        isInitialized: mapInitialized,
        isInitializing: isInitializing
      });
      return;
    }

    setIsInitializing(true);
    setInitError('');

    try {
      console.log('Setting Mapbox access token');
      mapboxgl.accessToken = mapboxToken.trim();
      
      console.log('Creating new Mapbox map');
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        projection: 'globe' as any,
        zoom: 1.5,
        center: [0, 20],
        pitch: 0,
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );

      // Handle successful load
      map.current.on('load', () => {
        console.log('Map loaded successfully');
        setMapInitialized(true);
        setIsInitializing(false);
        setInitError('');

        if (!map.current) return;

        // Add atmosphere effects
        map.current.setFog({
          color: 'rgb(30, 30, 50)',
          'high-color': 'rgb(50, 50, 80)',
          'horizon-blend': 0.3,
        });

        // Add event markers
        globalEvents.forEach((event) => {
          const el = document.createElement('div');
          el.className = 'marker';
          el.style.cssText = `
            width: 20px;
            height: 20px;
            border-radius: 50%;
            cursor: pointer;
            border: 2px solid white;
            background-color: ${
              event.impact === 'high' ? '#ef4444' :
              event.impact === 'medium' ? '#f59e0b' : '#10b981'
            };
            animation: pulse 2s infinite;
          `;

          // Add click event
          el.addEventListener('click', () => {
            onEventSelect(event);
          });

          // Create popup
          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div style="color: black; font-size: 12px;">
              <h4 style="margin: 0 0 5px 0; font-weight: bold;">${event.title}</h4>
              <p style="margin: 0 0 3px 0;"><strong>Country:</strong> ${event.country}</p>
              <p style="margin: 0 0 3px 0;"><strong>Probability:</strong> ${event.probability}%</p>
              <p style="margin: 0 0 3px 0;"><strong>Impact:</strong> ${event.impact}</p>
              <p style="margin: 0;">${event.description}</p>
            </div>
          `);

          new mapboxgl.Marker(el)
            .setLngLat(event.coordinates)
            .setPopup(popup)
            .addTo(map.current!);
        });
      });

      // Handle errors
      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        setInitError(`Map error: ${e.error?.message || 'Unknown error'}`);
        setMapInitialized(false);
        setIsInitializing(false);
      });

    } catch (error) {
      console.error('Failed to initialize Mapbox:', error);
      setInitError(`Initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setMapInitialized(false);
      setIsInitializing(false);
    }
  };

  const resetMap = () => {
    if (map.current) {
      map.current.remove();
      map.current = null;
    }
    setMapInitialized(false);
    setIsInitializing(false);
    setInitError('');
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (map.current) {
        console.log('Cleaning up map');
        map.current.remove();
      }
    };
  }, []);

  return {
    mapContainer,
    mapInitialized,
    isInitializing,
    initError,
    initializeMap,
    resetMap
  };
};