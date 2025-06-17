
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { toast } from '@/components/ui/use-toast';

export interface UserSettings {
  id?: string;
  user_id: string;
  nlp_model: string;
  confidence_threshold: number;
  simulation_complexity: string;
  default_view: string;
  compact_view: boolean;
  animations_enabled: boolean;
  auto_simulation: boolean;
  timezone: string;
  language: string;
  dark_mode: boolean;
  notifications: {
    timeline_anomalies: boolean;
    timeline_updates: boolean;
    feed_highpriority: boolean;
    feed_trending: boolean;
    feed_daily: boolean;
    system_updates: boolean;
    system_security: boolean;
  };
  created_at?: string;
  updated_at?: string;
}

interface SettingsContextType {
  settings: UserSettings | null;
  isLoading: boolean;
  updateSettings: (updates: Partial<UserSettings>) => Promise<void>;
  resetSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

const defaultSettings: Omit<UserSettings, 'user_id'> = {
  nlp_model: 'gpt-4o-mini',
  confidence_threshold: 75,
  simulation_complexity: 'standard',
  default_view: 'timeline',
  compact_view: false,
  animations_enabled: true,
  auto_simulation: true,
  timezone: 'utc',
  language: 'en',
  dark_mode: true,
  notifications: {
    timeline_anomalies: true,
    timeline_updates: true,
    feed_highpriority: true,
    feed_trending: false,
    feed_daily: true,
    system_updates: true,
    system_security: true,
  },
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSettings();
    }
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading settings:', error);
        // Create default settings if none exist
        await createDefaultSettings();
        return;
      }

      if (data) {
        setSettings(data);
      } else {
        // No settings found, create default
        await createDefaultSettings();
      }
    } catch (error) {
      console.error('Error in loadSettings:', error);
      toast({
        title: "Error loading settings",
        description: "Using default settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createDefaultSettings = async () => {
    if (!user) return;

    try {
      const newSettings = {
        ...defaultSettings,
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from('user_settings')
        .insert([newSettings])
        .select()
        .single();

      if (error) {
        console.error('Error creating default settings:', error);
        return;
      }

      setSettings(data);
    } catch (error) {
      console.error('Error in createDefaultSettings:', error);
    }
  };

  const updateSettings = async (updates: Partial<UserSettings>) => {
    if (!user || !settings) return;

    try {
      const updatedSettings = { ...settings, ...updates };

      const { data, error } = await supabase
        .from('user_settings')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating settings:', error);
        toast({
          title: "Error updating settings",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setSettings(data);
      toast({
        title: "Settings updated",
        description: "Your preferences have been saved",
      });
    } catch (error) {
      console.error('Error in updateSettings:', error);
      toast({
        title: "Error updating settings",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const resetSettings = async () => {
    if (!user) return;

    try {
      const resetData = {
        ...defaultSettings,
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from('user_settings')
        .update(resetData)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error resetting settings:', error);
        toast({
          title: "Error resetting settings",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setSettings(data);
      toast({
        title: "Settings reset",
        description: "All preferences have been reset to defaults",
      });
    } catch (error) {
      console.error('Error in resetSettings:', error);
    }
  };

  return (
    <SettingsContext.Provider value={{
      settings,
      isLoading,
      updateSettings,
      resetSettings,
    }}>
      {children}
    </SettingsContext.Provider>
  );
};
