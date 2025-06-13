
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SetupWizard } from '@/components/SetupWizard';
import { ProductionSetupScript } from '@/utils/productionSetupScript';
import { SetupScript } from '@/utils/setupScript';

const Setup = () => {
  const navigate = useNavigate();
  const [isSetupNeeded, setIsSetupNeeded] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    const checkSetupStatus = async () => {
      try {
        console.log('Checking setup status...');
        
        // Try production method first
        let setupComplete = false;
        try {
          setupComplete = await ProductionSetupScript.isSetupComplete();
          console.log('Production setup check result:', setupComplete);
        } catch (error) {
          console.log('Production setup check failed, trying legacy method:', error);
          // Fall back to legacy method
          setupComplete = SetupScript.isSetupComplete();
          console.log('Legacy setup check result:', setupComplete);
        }
        
        if (setupComplete) {
          setIsSetupNeeded(false);
          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 100);
          return;
        }

        setIsSetupNeeded(true);
        setConnectionError(null);
      } catch (error) {
        console.error('Error checking setup status:', error);
        setConnectionError('Unable to connect to database. Setup will use local storage.');
        setIsSetupNeeded(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkSetupStatus();
  }, [navigate]);

  const handleSetupComplete = () => {
    console.log('Setup completed successfully');
    setIsSetupNeeded(false);
    setIsLoading(false);
    navigate('/dashboard', { replace: true });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-cyber text-lg font-mono mb-4">
            Initializing Production Environment...
          </div>
          <div className="w-8 h-8 border-2 border-cyber border-t-transparent rounded-full animate-spin mx-auto"></div>
          {connectionError && (
            <div className="text-amber-400 text-sm font-mono mt-4 max-w-md">
              {connectionError}
            </div>
          )}
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

  return (
    <div>
      {connectionError && (
        <div className="bg-amber-950/20 border border-amber-800 text-amber-200 px-4 py-2 text-sm font-mono">
          ⚠️ {connectionError}
        </div>
      )}
      <SetupWizard onSetupComplete={handleSetupComplete} />
    </div>
  );
};

export default Setup;
