import { supabase } from '@/integrations/supabase/client';
import { ProductionSetupScript } from './productionSetupScript';

export interface SetupConfig {
  adminEmail: string;
  adminPassword: string;
  organizationName?: string;
  systemSettings?: {
    defaultClassificationLevel: 'unclassified' | 'confidential' | 'secret' | 'top_secret';
    enableEmailVerification: boolean;
    sessionTimeout: number;
  };
}

export class SetupScript {
  private toast: any;

  constructor(toast: any) {
    this.toast = toast;
  }

  async runSetup(config: SetupConfig): Promise<boolean> {
    try {
      console.log('Starting Project Looking Glass setup...');
      
      // Step 1: Create admin user
      const user = await this.createAdminUser(config.adminEmail, config.adminPassword);
      if (!user) {
        throw new Error('Failed to create admin user');
      }

      console.log('Admin user created successfully');

      // Step 2: Create admin profile and role with master control
      await this.setupMasterAdminRole(user.id, config.adminEmail);

      // Step 3: Mark setup as complete
      await this.markSetupComplete();

      this.toast({
        title: "Master Control Established",
        description: "Project Looking Glass has been initialized. You now have Master Administrator privileges with Top Secret clearance and full system control.",
      });

      console.log('Setup completed successfully with master admin privileges!');
      return true;

    } catch (error) {
      console.error('Setup failed:', error);
      this.toast({
        title: "Setup Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred during setup.",
        variant: "destructive"
      });
      return false;
    }
  }

  private async createAdminUser(email: string, password: string) {
    try {
      console.log('Creating master admin user...');
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: 'Master Administrator',
            role: 'Master Administrator'
          }
        }
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          // Try to sign in instead
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          
          if (signInError) {
            throw new Error(`Failed to sign in: ${signInError.message}`);
          }
          
          return signInData.user;
        }
        throw new Error(`Failed to create master admin user: ${error.message}`);
      }

      return data.user;
    } catch (error) {
      console.error('Error in createAdminUser:', error);
      throw error;
    }
  }

  private async setupMasterAdminRole(userId: string, email: string) {
    try {
      console.log('Setting up master administrator role...');
      
      // Create profile with master admin designation
      await supabase
        .from('profiles')
        .upsert({
          id: userId,
          username: 'Master Administrator',
          role: 'Master Administrator'
        });

      // Create admin role with top secret clearance and full control
      await supabase
        .from('user_roles')
        .upsert({
          user_id: userId,
          role: 'admin',
          classification_clearance: 'top_secret',
          granted_by: userId
        });

      // Create audit log for master control establishment
      await supabase
        .from('audit_logs')
        .insert({
          user_id: userId,
          action: 'establish_master_control',
          resource_type: 'system',
          resource_id: userId,
          details: {
            email: email,
            role: 'Master Administrator',
            clearance: 'top_secret',
            control_level: 'master'
          }
        });

      console.log('Master administrator role setup completed');
      
      this.toast({
        title: "Master Control Established",
        description: `You (${email}) have been granted Master Administrator privileges with Top Secret clearance and full system control.`,
      });
      
    } catch (error) {
      console.error('Error setting master admin role:', error);
      throw new Error('Failed to establish master administrator privileges');
    }
  }

  private async markSetupComplete() {
    // Mark in both places for reliability
    localStorage.setItem('setupCompleted', 'true');
    localStorage.setItem('setupDate', new Date().toISOString());
    
    try {
      await ProductionSetupScript.markSetupComplete();
    } catch (error) {
      console.warn('Failed to mark setup complete in database, using localStorage fallback');
    }
    
    console.log('Setup marked as complete');
  }

  static isSetupComplete(): boolean {
    return localStorage.getItem('setupCompleted') === 'true';
  }

  static getSetupDate(): string | null {
    return localStorage.getItem('setupDate');
  }

  async validateSetup(): Promise<boolean> {
    try {
      const { data: session } = await supabase.auth.getSession();
      return session.session !== null && SetupScript.isSetupComplete();
    } catch (error) {
      console.error('Setup validation failed:', error);
      return SetupScript.isSetupComplete();
    }
  }
}
