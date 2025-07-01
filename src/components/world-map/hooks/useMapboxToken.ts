import { useState, useEffect } from 'react';

export const useMapboxToken = () => {
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [initError, setInitError] = useState<string>('');

  // Load token from localStorage on mount and set the provided token
  useEffect(() => {
    // First check for the provided token
    const providedToken = 'pk.eyJ1Ijoic2FudGFyb3NhdGF4aSIsImEiOiJjbWM1aGtvZGUwY2xsMmlwdzljMTBuYXlvIn0.On1bfH_VMOiv1SzvJThOVQ';
    const savedToken = localStorage.getItem('mapbox-token');
    
    console.log('Checking tokens on mount:', {
      hasProvidedToken: !!providedToken,
      hasSavedToken: !!savedToken,
      savedTokenMatches: savedToken === providedToken
    });

    if (providedToken && savedToken !== providedToken) {
      console.log('Using provided token and saving it');
      localStorage.setItem('mapbox-token', providedToken);
      setMapboxToken(providedToken);
      setShowTokenInput(false);
    } else if (savedToken && savedToken.trim()) {
      console.log('Using saved token');
      setMapboxToken(savedToken);
      setShowTokenInput(false);
    } else {
      console.log('No valid token found, showing input');
      setShowTokenInput(true);
    }
  }, []);

  const handleTokenSubmit = (onSuccess?: () => void) => {
    const trimmedToken = mapboxToken.trim();
    console.log('Submitting token:', trimmedToken ? 'Token provided' : 'No token');
    
    if (trimmedToken) {
      // Validate token format
      if (!trimmedToken.startsWith('pk.')) {
        setInitError('Invalid token format. Mapbox tokens should start with "pk."');
        return;
      }
      
      // Save token to localStorage
      localStorage.setItem('mapbox-token', trimmedToken);
      console.log('Token saved to localStorage');
      setInitError('');
      setShowTokenInput(false);
      
      if (onSuccess) {
        onSuccess();
      }
    } else {
      setInitError('Please enter a valid Mapbox token');
    }
  };

  const handleTokenReset = () => {
    console.log('Resetting token');
    localStorage.removeItem('mapbox-token');
    setMapboxToken('');
    setShowTokenInput(true);
    setInitError('');
  };

  return {
    mapboxToken,
    setMapboxToken,
    showTokenInput,
    setShowTokenInput,
    showToken,
    setShowToken,
    initError,
    setInitError,
    handleTokenSubmit,
    handleTokenReset
  };
};