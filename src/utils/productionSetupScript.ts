
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface ProductionSetupConfig {
  adminEmail: string;
  adminPassword: string;
  organizationName?: string;
  systemSettings?: {
    defaultClassificationLevel: 'unclassified' | 'confidential' | 'secret' | 'top_secret';
    enableEmailVerification: boolean;
    sessionTimeout: number;
  };
}

export class ProductionSetupScript {
  private toast: any;

  constructor(toast: any) {
    this.toast = toast;
  }

  async runSetup(config: ProductionSetupConfig): Promise<boolean> {
    try {
      // Step 1: Create or sign in admin user
      const user = await this.createOrSignInAdminUser(config.adminEmail, config.adminPassword);
      if (!user) {
        throw new Error('Failed to create or sign in admin user');
      }

      // Step 2: Set admin role in database
      await this.setAdminRoleInDatabase(user.id);

      // Step 3: Initialize system settings in database
      await this.initializeSystemSettingsInDatabase(config.systemSettings);

      // Step 4: Create sample data
      await this.createSampleDataInDatabase(user.id);

      // Step 5: Mark setup as complete
      await this.markSetupCompleteInDatabase();

      // Step 6: Clean up any localStorage data
      this.cleanupLocalStorage();

      this.toast({
        title: "Production Setup Complete",
        description: "Project Looking Glass has been successfully initialized with database persistence.",
      });

      return true;

    } catch (error) {
      console.error('Production setup failed:', error);
      this.toast({
        title: "Setup Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred during setup.",
        variant: "destructive"
      });
      return false;
    }
  }

  private async createOrSignInAdminUser(email: string, password: string) {
    try {
      // Try to sign in first
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInData.user && signInData.session) {
        return signInData.user;
      }

      // If sign in failed, try to create new user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: 'Administrator',
            role: 'Administrator'
          }
        }
      });

      if (signUpError) {
        if (signUpError.message.includes('User already registered')) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          const { data: retrySignIn, error: retryError } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          
          if (retryError) {
            throw new Error(`Failed to sign in: ${retryError.message}`);
          }
          
          return retrySignIn.user;
        }
        throw new Error(`Failed to create admin user: ${signUpError.message}`);
      }

      return signUpData.user;
    } catch (error) {
      throw error;
    }
  }

  private async setAdminRoleInDatabase(userId: string) {
    try {
      const { error } = await supabase
        .from('user_roles')
        .upsert({
          user_id: userId,
          role: 'admin',
          classification_clearance: 'top_secret',
          granted_by: userId
        });

      if (error) {
        throw new Error(`Failed to set admin role: ${error.message}`);
      }

      // Log the admin role creation
      await supabase
        .from('audit_logs')
        .insert({
          user_id: userId,
          action: 'admin_role_granted',
          resource_type: 'user_role',
          resource_id: userId,
          details: { 
            role: 'admin', 
            clearance: 'top_secret',
            context: 'initial_setup'
          }
        });

      this.toast({
        title: "Administrator Privileges Granted",
        description: "You have been granted Administrator role with Top Secret clearance.",
      });
      
    } catch (error) {
      throw new Error('Failed to set administrator privileges in database');
    }
  }

  private async initializeSystemSettingsInDatabase(settings?: ProductionSetupConfig['systemSettings']) {
    try {
      const settingsToUpdate = [
        {
          setting_key: 'default_classification_level',
          setting_value: JSON.stringify(settings?.defaultClassificationLevel || 'unclassified'),
          description: 'Default classification level for new content'
        },
        {
          setting_key: 'enable_email_verification',
          setting_value: JSON.stringify(settings?.enableEmailVerification ?? false),
          description: 'Whether to require email verification for new users'
        },
        {
          setting_key: 'session_timeout',
          setting_value: JSON.stringify(settings?.sessionTimeout || 480),
          description: 'Session timeout in minutes'
        },
        {
          setting_key: 'setup_completed',
          setting_value: JSON.stringify(true),
          description: 'Whether initial setup has been completed'
        },
        {
          setting_key: 'setup_date',
          setting_value: JSON.stringify(new Date().toISOString()),
          description: 'Date when setup was completed'
        }
      ];

      for (const setting of settingsToUpdate) {
        await supabase
          .from('system_settings')
          .upsert(setting);
      }
      
    } catch (error) {
      throw new Error('Failed to initialize system settings');
    }
  }

  private async createSampleDataInDatabase(adminUserId: string) {
    try {
      // Sample templates are already inserted via SQL migration
      // Just log the sample data creation
      await supabase
        .from('audit_logs')
        .insert({
          user_id: adminUserId,
          action: 'sample_data_created',
          resource_type: 'scenario_template',
          details: { context: 'initial_setup' }
        });
      
    } catch (error) {
      // Non-critical error, just log it
      console.warn('Failed to log sample data creation:', error);
    }
  }

  private async markSetupCompleteInDatabase() {
    try {
      await supabase
        .from('system_settings')
        .upsert({
          setting_key: 'setup_completed',
          setting_value: JSON.stringify(true),
          description: 'Setup completion status'
        });
    } catch (error) {
      throw new Error('Failed to mark setup as complete');
    }
  }

  private cleanupLocalStorage() {
    // Clean up old localStorage-based setup data
    const keysToRemove = [
      'setupCompleted',
      'setupDate',
      'lookingGlassSettings',
      'scenarioTemplates',
      'adminRole',
      'userRole',
      'isAdmin',
      'classificationClearance'
    ];

    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
  }

  static async isSetupComplete(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('setting_value')
        .eq('setting_key', 'setup_completed')
        .maybeSingle();

      if (error || !data) {
        return false;
      }

      return JSON.parse(data.setting_value) === true;
    } catch (error) {
      return false;
    }
  }

  static async getSetupDate(): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('setting_value')
        .eq('setting_key', 'setup_date')
        .maybeSingle();

      if (error || !data) {
        return null;
      }

      return JSON.parse(data.setting_value);
    } catch (error) {
      return null;
    }
  }

  async validateSetup(): Promise<boolean> {
    try {
      const { data: session } = await supabase.auth.getSession();
      const setupComplete = await ProductionSetupScript.isSetupComplete();
      
      return session.session !== null && setupComplete;
    } catch (error) {
      console.error('Setup validation failed:', error);
      return false;
    }
  }
}
