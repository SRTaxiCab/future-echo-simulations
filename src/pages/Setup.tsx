
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SetupWizard } from '@/components/SetupWizard';
import { ProductionSetupScript } from '@/utils/productionSetupScript';

const Setup = () => {
  const navigate = useNavigate();
  const [isSetupNeeded, setIsSetupNeeded] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSetupStatus = async () => {
      try {
        // Check if setup is already completed using production method
        const setupComplete = await ProductionSetupScript.isSetupComplete();
        
        if (setupComplete) {
          setIsSetupNeeded(false);
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
  }, [navigate]);

  const handleSetupComplete = () => {
    setIsSetupNeeded(false);
    setIsLoading(false);
    navigate('/dashboard', { replace: true });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-cyber text-lg font-mono mb-4">Initializing Production Environment...</div>
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
