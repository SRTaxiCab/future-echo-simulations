
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SetupWizard } from '@/components/SetupWizard';
import { SetupScript } from '@/utils/setupScript';
import { useAuth } from '@/context/AuthContext';

const Setup = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isSetupNeeded, setIsSetupNeeded] = useState(true);

  useEffect(() => {
    // Check if setup is already completed
    if (SetupScript.isSetupComplete()) {
      navigate('/dashboard');
      return;
    }

    // If user is already authenticated, check if they're admin
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSetupComplete = () => {
    setIsSetupNeeded(false);
    navigate('/dashboard');
  };

  if (!isSetupNeeded) {
    return null;
  }

  return <SetupWizard onSetupComplete={handleSetupComplete} />;
};

export default Setup;
