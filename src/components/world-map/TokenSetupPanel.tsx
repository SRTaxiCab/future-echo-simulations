import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Globe, Eye, EyeOff } from 'lucide-react';

interface TokenSetupPanelProps {
  mapboxToken: string;
  setMapboxToken: (token: string) => void;
  showToken: boolean;
  setShowToken: (show: boolean) => void;
  initError: string;
  isInitializing: boolean;
  onTokenSubmit: () => void;
  onTokenReset: () => void;
  className?: string;
}

export const TokenSetupPanel: React.FC<TokenSetupPanelProps> = ({
  mapboxToken,
  setMapboxToken,
  showToken,
  setShowToken,
  initError,
  isInitializing,
  onTokenSubmit,
  onTokenReset,
  className
}) => {
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
            To display the interactive world map, please enter your Mapbox access token.
            You can get one for free at{' '}
            <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-cyber underline">
              mapbox.com
            </a>
          </p>
          
          {initError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
              {initError}
            </div>
          )}
          
          <div className="space-y-2">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  placeholder="Enter Mapbox access token (pk.ey...)"
                  value={mapboxToken}
                  onChange={(e) => setMapboxToken(e.target.value)}
                  type={showToken ? "text" : "password"}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      onTokenSubmit();
                    }
                  }}
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
              <Button 
                onClick={onTokenSubmit} 
                disabled={!mapboxToken.trim() || isInitializing}
              >
                {isInitializing ? 'Initializing...' : 'Initialize Map'}
              </Button>
            </div>
            {mapboxToken && localStorage.getItem('mapbox-token') && (
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>Token saved locally</span>
                <Button variant="ghost" size="sm" onClick={onTokenReset}>
                  Reset Token
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};