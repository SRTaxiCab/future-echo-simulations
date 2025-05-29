
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SetupWizard } from '@/components/SetupWizard';
import { SetupScript } from '@/utils/setupScript';

const Setup = () => {
  const navigate = useNavigate();
  const [isSetupNeeded, setIsSetupNeeded] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSetupStatus = async () => {
      try {
        console.log('Checking setup status...');
        
        // Check if setup is already completed
        const setupComplete = SetupScript.isSetupComplete();
        console.log('Setup complete:', setupComplete);
        
        if (setupComplete) {
          console.log('Setup already complete, redirecting to dashboard');
          setIsSetupNeeded(false);
          // Use setTimeout to ensure state updates before navigation
          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 100);
          return;
        }

        setIsSetupNeeded(true);
      } catch (error) {
        console.error('Error checking setup status:', error);
        setIsSetupNeeded(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkSetupStatus();
  }, []); // Empty dependency array to run only once

  const handleSetupComplete = () => {
    console.log('Setup completed, redirecting to dashboard');
    setIsSetupNeeded(false);
    setIsLoading(false);
    navigate('/dashboard', { replace: true });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-cyber text-lg font-mono mb-4">Initializing...</div>
          <div className="w-8 h-8 border-2 border-cyber border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!isSetupNeeded) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-cyber text-lg font-mono">Redirecting to dashboard...</div>
      </div>
    );
  }

  return <SetupWizard onSetupComplete={handleSetupComplete} />;
};

export default Setup;
