
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SystemHealth {
  database: 'healthy' | 'degraded' | 'offline';
  auth: 'healthy' | 'degraded' | 'offline';
  lastChecked: Date;
}

export const useSystemHealth = () => {
  const [health, setHealth] = useState<SystemHealth>({
    database: 'healthy',
    auth: 'healthy',
    lastChecked: new Date()
  });

  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    const checkSystemHealth = async () => {
      try {
        // Test database connectivity
        const { error: dbError } = await supabase
          .from('system_settings')
          .select('id')
          .limit(1);

        // Test auth service
        const { error: authError } = await supabase.auth.getSession();

        setHealth({
          database: dbError ? 'offline' : 'healthy',
          auth: authError ? 'offline' : 'healthy',
          lastChecked: new Date()
        });
      } catch (error) {
        console.error('System health check failed:', error);
        setHealth({
          database: 'offline',
          auth: 'offline',
          lastChecked: new Date()
        });
      }
    };

    if (isMonitoring) {
      checkSystemHealth();
      const interval = setInterval(checkSystemHealth, 30000); // Check every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isMonitoring]);

  const startMonitoring = () => setIsMonitoring(true);
  const stopMonitoring = () => setIsMonitoring(false);

  const isHealthy = health.database === 'healthy' && health.auth === 'healthy';

  return {
    health,
    isHealthy,
    isMonitoring,
    startMonitoring,
    stopMonitoring
  };
};
