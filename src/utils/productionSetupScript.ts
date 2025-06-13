
import { supabase } from '@/integrations/supabase/client';

export class ProductionSetupScript {
  public static async isSetupComplete(): Promise<boolean> {
    try {
      // First check if we can connect to Supabase and if the table exists
      const { data, error } = await supabase
        .from('system_settings')
        .select('setting_value')
        .eq('setting_key', 'setup_complete')
        .limit(1);

      // If table doesn't exist or there's a connection error, fall back to localStorage
      if (error) {
        console.log('Database not available, checking localStorage fallback:', error.message);
        return localStorage.getItem('setupCompleted') === 'true';
      }

      // If no data found in database, check localStorage as fallback
      if (!data || data.length === 0) {
        const localSetup = localStorage.getItem('setupCompleted') === 'true';
        if (localSetup) {
          // Migrate to database if possible
          try {
            await this.markSetupComplete();
            return true;
          } catch (migrationError) {
            console.error('Failed to migrate setup status to database:', migrationError);
            return true; // Still return true since localStorage shows setup is complete
          }
        }
        return false;
      }

      return data[0]?.setting_value === 'true';
    } catch (error) {
      console.error('Error checking setup status, falling back to localStorage:', error);
      return localStorage.getItem('setupCompleted') === 'true';
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
        console.error('Failed to mark setup complete in database:', error);
        // Fall back to localStorage
        localStorage.setItem('setupCompleted', 'true');
        localStorage.setItem('setupDate', new Date().toISOString());
        throw error;
      }

      // Also set in localStorage for consistency
      localStorage.setItem('setupCompleted', 'true');
      localStorage.setItem('setupDate', new Date().toISOString());
    } catch (error) {
      console.error('Error marking setup as complete:', error);
      // Ensure localStorage fallback works
      localStorage.setItem('setupCompleted', 'true');
      localStorage.setItem('setupDate', new Date().toISOString());
      throw error;
    }
  }

  public static async setupProductionEnvironment(sessionTimeout: number = 480): Promise<void> {
    try {
      await this.initializeSystemSettings(sessionTimeout);
      await this.markSetupComplete();
    } catch (error) {
      console.error('Production environment setup failed, using localStorage fallback:', error);
      // Fallback to localStorage for offline/connection issues
      localStorage.setItem('setupCompleted', 'true');
      localStorage.setItem('setupDate', new Date().toISOString());
      throw error;
    }
  }

  private static async initializeSystemSettings(sessionTimeout: number): Promise<void> {
    const defaultSettings = [
      {
        setting_key: 'default_classification_level',
        setting_value: 'unclassified',
        description: 'Default classification level for new content'
      },
      {
        setting_key: 'enable_email_verification',
        setting_value: 'false',
        description: 'Whether to require email verification for new users'
      },
      {
        setting_key: 'session_timeout',
        setting_value: sessionTimeout.toString(),
        description: 'Session timeout in minutes'
      },
      {
        setting_key: 'max_scenario_variables',
        setting_value: '20',
        description: 'Maximum number of variables per scenario'
      },
      {
        setting_key: 'enable_audit_logging',
        setting_value: 'true',
        description: 'Whether to log user actions for security auditing'
      }
    ];

    for (const setting of defaultSettings) {
      try {
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
          // Don't throw here, continue with other settings
        }
      } catch (error) {
        console.error(`Failed to insert setting ${setting.setting_key}:`, error);
        // Continue with other settings
      }
    }
  }
}
