import { supabase } from '@/integrations/supabase/client';

export class ProductionSetupScript {
  public static async isSetupComplete(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('setting_value')
        .eq('setting_key', 'setup_complete')
        .single();

      if (error) {
        console.error('Error checking setup status:', error);
        return false;
      }

      if (!data) {
        return false;
      }

      return data.setting_value === 'true';
    } catch (error) {
      console.error('Error checking setup status:', error);
      return false;
    }
  }

  public static async markSetupComplete(): Promise<void> {
    try {
      const { error } = await supabase
        .from('system_settings')
        .upsert({
          setting_key: 'setup_complete',
          setting_value: 'true',
          description: 'Indicates if the initial setup has been completed'
        }, {
          onConflict: 'setting_key'
        });

      if (error) {
        console.error('Error marking setup as complete:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error marking setup as complete:', error);
      throw error;
    }
  }

  private static async initializeSystemSettings(): Promise<void> {
    const defaultSettings = [
      {
        setting_key: 'default_classification_level',
        setting_value: 'unclassified',
        description: 'Default classification level for new content'
      },
      {
        setting_key: 'enable_email_verification',
        setting_value: false,
        description: 'Whether to require email verification for new users'
      },
      {
        setting_key: 'session_timeout',
        setting_value: 480,
        description: 'Session timeout in minutes'
      },
      {
        setting_key: 'max_scenario_variables',
        setting_value: 20,
        description: 'Maximum number of variables per scenario'
      },
      {
        setting_key: 'enable_audit_logging',
        setting_value: true,
        description: 'Whether to log user actions for security auditing'
      }
    ];

    for (const setting of defaultSettings) {
      const { error } = await supabase
        .from('system_settings')
        .upsert({
          setting_key: setting.setting_key,
          setting_value: setting.setting_value,
          description: setting.description
        }, {
          onConflict: 'setting_key'
        });

      if (error) {
        console.error(`Error inserting setting ${setting.setting_key}:`, error);
        throw error;
      }
    }
  }

  private static async createSystemSettings(sessionTimeout: number): Promise<void> {
    const settings = [
      {
        setting_key: 'session_timeout',
        setting_value: sessionTimeout.toString(),
        description: 'Session timeout in minutes'
      },
      {
        setting_key: 'enable_audit_logging',
        setting_value: 'true',
        description: 'Enable audit logging for security'
      }
    ];

    for (const setting of settings) {
      const { error } = await supabase
        .from('system_settings')
        .upsert(setting, {
          onConflict: 'setting_key'
        });

      if (error) {
        console.error(`Error creating system setting ${setting.setting_key}:`, error);
        throw error;
      }
    }
  }

  public static async setupProductionEnvironment(sessionTimeout: number): Promise<void> {
    try {
      await this.initializeSystemSettings();
      await this.createSystemSettings(sessionTimeout);
      await this.markSetupComplete();
    } catch (error) {
      console.error('Production environment setup failed:', error);
      throw error;
    }
  }
}
