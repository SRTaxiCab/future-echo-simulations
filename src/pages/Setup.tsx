
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SetupWizard } from '@/components/SetupWizard';
import { SetupScript } from '@/utils/setupScript';
import { useAuth } from '@/context/AuthContext';

const Setup = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isSetupNeeded, setIsSetupNeeded] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSetupStatus = () => {
      console.log('Checking setup status...');
      
      // Check if setup is already completed
      const setupComplete = SetupScript.isSetupComplete();
      console.log('Setup complete:', setupComplete);
      
      if (setupComplete) {
        console.log('Setup already complete, redirecting to dashboard');
        setIsSetupNeeded(false);
        navigate('/dashboard', { replace: true });
        return;
      }

      // If user is already authenticated and setup is complete, redirect
      if (isAuthenticated && setupComplete) {
        console.log('User authenticated and setup complete, redirecting to dashboard');
        navigate('/dashboard', { replace: true });
        return;
      }

      setIsLoading(false);
    };

    checkSetupStatus();
  }, []); // Remove isAuthenticated and navigate from dependencies to prevent infinite loop

  const handleSetupComplete = () => {
    console.log('Setup completed, redirecting to dashboard');
    setIsSetupNeeded(false);
    navigate('/dashboard', { replace: true });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-cyber text-lg font-mono">Initializing...</div>
      </div>
    );
  }

  if (!isSetupNeeded) {
    return null;
  }

  return <SetupWizard onSetupComplete={handleSetupComplete} />;
};

export default Setup;
