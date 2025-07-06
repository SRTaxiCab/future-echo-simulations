import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Globe, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const MapboxTokenSettings: React.FC = () => {
  const [mapboxToken, setMapboxToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const { toast } = useToast();

  // Load token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('mapbox-token');
    if (savedToken && savedToken.trim()) {
      setMapboxToken(savedToken);
      setIsValid(true);
    }
  }, []);

  const validateToken = (token: string) => {
    if (!token.trim()) {
      setIsValid(null);
      return false;
    }
    
    if (!token.startsWith('pk.')) {
      setIsValid(false);
      return false;
    }
    
    setIsValid(true);
    return true;
  };

  const handleTokenChange = (value: string) => {
    setMapboxToken(value);
    validateToken(value);
  };

  const handleSave = async () => {
    if (!validateToken(mapboxToken)) {
      toast({
        title: "Invalid Token",
        description: "Please enter a valid Mapbox access token starting with 'pk.'",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    try {
      // Save to localStorage
      localStorage.setItem('mapbox-token', mapboxToken.trim());
      
      toast({
        title: "Token Saved",
        description: "Mapbox access token has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save the Mapbox token. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    localStorage.removeItem('mapbox-token');
    setMapboxToken('');
    setIsValid(null);
    
    toast({
      title: "Token Reset",
      description: "Mapbox access token has been removed.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Mapbox Integration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="mapbox-token">Access Token</Label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                id="mapbox-token"
                placeholder="Enter Mapbox access token (pk.ey...)"
                value={mapboxToken}
                onChange={(e) => handleTokenChange(e.target.value)}
                type={showToken ? "text" : "password"}
                className={
                  isValid === false ? "border-red-500" : 
                  isValid === true ? "border-green-500" : ""
                }
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
            {isValid !== null && (
              <div className="flex items-center">
                {isValid ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
            )}
          </div>
          {isValid === false && (
            <p className="text-sm text-red-500">
              Invalid token format. Mapbox tokens should start with "pk."
            </p>
          )}
        </div>

        <div className="text-sm text-muted-foreground">
          <p>
            Get your Mapbox access token from{' '}
            <a 
              href="https://mapbox.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-cyber underline hover:no-underline"
            >
              mapbox.com
            </a>
            . A free account provides sufficient quota for development and testing.
          </p>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={handleSave} 
            disabled={!mapboxToken.trim() || isValid === false || isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Token'}
          </Button>
          
          {mapboxToken && (
            <Button 
              variant="outline" 
              onClick={handleReset}
              disabled={isSaving}
            >
              Reset
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};