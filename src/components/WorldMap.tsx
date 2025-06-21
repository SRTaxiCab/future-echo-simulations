import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Globe, MapPin, AlertTriangle, TrendingUp, Eye, EyeOff } from 'lucide-react';

// Sample global events data with geographical coordinates
const globalEvents = [
  {
    id: 'event-1',
    title: 'AI Regulation Framework',
    coordinates: [-74.006, 40.7128], // New York
    country: 'United States',
    impact: 'high',
    probability: 78,
    sector: 'Technology',
    description: 'Major AI oversight legislation expected to pass',
    predictedEffects: ['Global tech market volatility', 'Regulatory compliance costs']
  },
  {
    id: 'event-2',
    title: 'Energy Grid Innovation',
    coordinates: [2.3522, 48.8566], // Paris
    country: 'France',
    impact: 'medium',
    probability: 65,
    sector: 'Energy',
    description: 'Decentralized energy network pilot program',
    predictedEffects: ['Regional energy independence', 'Grid resilience improvement']
  },
  {
    id: 'event-3',
    title: 'Supply Chain Disruption',
    coordinates: [139.6917, 35.6895], // Tokyo
    country: 'Japan',
    impact: 'high',
    probability: 82,
    sector: 'Manufacturing',
    description: 'Semiconductor shortage affecting global production',
    predictedEffects: ['Electronics price increase', 'Production delays']
  },
  {
    id: 'event-4',
    title: 'Climate Adaptation Measures',
    coordinates: [151.2093, -33.8688], // Sydney
    country: 'Australia',
    impact: 'medium',
    probability: 71,
    sector: 'Environment',
    description: 'Large-scale renewable energy infrastructure',
    predictedEffects: ['Carbon emission reduction', 'Energy cost stabilization']
  },
  {
    id: 'event-5',
    title: 'Financial Market Reform',
    coordinates: [8.5417, 47.3769], // Zurich
    country: 'Switzerland',
    impact: 'high',
    probability: 69,
    sector: 'Finance',
    description: 'New cryptocurrency regulation framework',
    predictedEffects: ['Market stabilization', 'Institutional adoption']
  }
];

// Regional probability data for heat map
const regionalData = [
  { region: 'North America', probability: 75, color: '#ef4444' },
  { region: 'Europe', probability: 68, color: '#f59e0b' },
  { region: 'Asia-Pacific', probability: 82, color: '#ef4444' },
  { region: 'Latin America', probability: 45, color: '#10b981' },
  { region: 'Africa', probability: 52, color: '#6b7280' },
  { region: 'Middle East', probability: 63, color: '#f59e0b' }
];

interface WorldMapProps {
  className?: string;
}

export const WorldMap: React.FC<WorldMapProps> = ({ className }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<typeof globalEvents[0] | null>(null);
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [showToken, setShowToken] = useState(false);

  // Load token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('mapbox-token');
    if (savedToken) {
      setMapboxToken(savedToken);
    } else {
      setShowTokenInput(true);
    }
  }, []);

  // Initialize map when token is available
  useEffect(() => {
    if (mapboxToken && !mapInitialized) {
      initializeMap();
    }
  }, [mapboxToken, mapInitialized]);

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken || mapInitialized) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
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

      // Add atmosphere effects
      map.current.on('style.load', () => {
        if (!map.current) return;
        
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
            setSelectedEvent(event);
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
            .setLngLat(event.coordinates as [number, number])
            .setPopup(popup)
            .addTo(map.current!);
        });
      });

      map.current.on('load', () => {
        setMapInitialized(true);
        setShowTokenInput(false);
        console.log('Mapbox map initialized successfully');
      });

      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        setMapInitialized(false);
        setShowTokenInput(true);
      });

    } catch (error) {
      console.error('Failed to initialize Mapbox:', error);
      setMapInitialized(false);
      setShowTokenInput(true);
    }
  };

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      // Save token to localStorage
      localStorage.setItem('mapbox-token', mapboxToken.trim());
      initializeMap();
    }
  };

  const handleTokenReset = () => {
    localStorage.removeItem('mapbox-token');
    setMapboxToken('');
    setShowTokenInput(true);
    setMapInitialized(false);
    if (map.current) {
      map.current.remove();
      map.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  if (showTokenInput || !mapInitialized) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="font-mono flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            Global Events Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {mapInitialized ? 'Map is loading...' : 'To display the interactive world map, please enter your Mapbox access token.'}
              You can get one for free at{' '}
              <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-cyber underline">
                mapbox.com
              </a>
            </p>
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    placeholder="Enter Mapbox access token (pk.ey...)"
                    value={mapboxToken}
                    onChange={(e) => setMapboxToken(e.target.value)}
                    type={showToken ? "text" : "password"}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-6 w-6 p-0"
                    onClick={() => setShowToken(!showToken)}
                  >
                    {showToken ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  </Button>
                </div>
                <Button onClick={handleTokenSubmit} disabled={!mapboxToken.trim()}>
                  Initialize Map
                </Button>
              </div>
              {mapboxToken && localStorage.getItem('mapbox-token') && (
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>Token saved locally</span>
                  <Button variant="ghost" size="sm" onClick={handleTokenReset}>
                    Reset Token
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="font-mono text-lg flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  Global Impact Visualization
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={handleTokenReset}>
                  Reset Token
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div 
                ref={mapContainer} 
                className="w-full h-[500px] rounded-lg border"
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
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Regional Probability Heat Map */}
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

          {/* Event Details */}
          {selectedEvent && (
            <Card className="border-cyber">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-mono flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Event Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-medium">{selectedEvent.title}</h4>
                  <p className="text-sm text-muted-foreground">{selectedEvent.country}</p>
                </div>
                
                <div className="flex gap-2">
                  <Badge variant={selectedEvent.impact === 'high' ? 'destructive' : 'secondary'}>
                    {selectedEvent.impact} impact
                  </Badge>
                  <Badge variant="outline">
                    {selectedEvent.probability}% probability
                  </Badge>
                </div>

                <p className="text-sm">{selectedEvent.description}</p>

                <div>
                  <h5 className="text-sm font-medium mb-2 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Predicted Effects
                  </h5>
                  <ul className="text-xs space-y-1">
                    {selectedEvent.predictedEffects.map((effect, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-cyber mr-1">•</span>
                        {effect}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Global Events List */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-mono flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Active Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {globalEvents.map((event) => (
                  <div 
                    key={event.id}
                    className={`p-2 rounded border cursor-pointer transition-colors ${
                      selectedEvent?.id === event.id ? 'border-cyber bg-cyber/10' : 'border-border hover:border-cyber/50'
                    }`}
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h5 className="text-sm font-medium">{event.title}</h5>
                        <p className="text-xs text-muted-foreground">{event.country}</p>
                      </div>
                      <div className="text-xs font-mono">{event.probability}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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
