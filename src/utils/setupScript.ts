
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface SetupConfig {
  adminEmail: string;
  adminPassword: string;
  organizationName?: string;
  systemSettings?: {
    defaultClassificationLevel: 'unclassified' | 'confidential' | 'secret' | 'top_secret';
    enableEmailVerification: boolean;
    sessionTimeout: number; // in minutes
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
      const adminUser = await this.createAdminUser(config.adminEmail, config.adminPassword);
      if (!adminUser) {
        throw new Error('Failed to create admin user');
      }

      // Step 2: Grant admin privileges
      await this.grantAdminPrivileges(adminUser.id);

      // Step 3: Initialize system settings
      await this.initializeSystemSettings(config.systemSettings);

      // Step 4: Create sample data (optional)
      await this.createSampleData();

      // Step 5: Mark setup as complete
      await this.markSetupComplete();

      this.toast({
        title: "Setup Complete",
        description: "Project Looking Glass has been successfully initialized.",
      });

      console.log('Setup completed successfully!');
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
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: 'Administrator',
          role: 'Administrator'
        }
      }
    });

    if (error) {
      throw new Error(`Failed to create admin user: ${error.message}`);
    }

    return data.user;
  }

  private async grantAdminPrivileges(userId: string) {
    const { error } = await supabase
      .from('user_roles')
      .upsert({
        user_id: userId,
        role: 'admin',
        classification_clearance: 'top_secret',
        granted_by: userId // Self-granted for initial admin
      });

    if (error) {
      throw new Error(`Failed to grant admin privileges: ${error.message}`);
    }

    console.log('Admin privileges granted successfully');
  }

  private async initializeSystemSettings(settings?: SetupConfig['systemSettings']) {
    // Create system settings table entry (if needed)
    const defaultSettings = {
      defaultClassificationLevel: settings?.defaultClassificationLevel || 'unclassified',
      enableEmailVerification: settings?.enableEmailVerification ?? false,
      sessionTimeout: settings?.sessionTimeout || 480, // 8 hours
      setupCompleted: true,
      setupDate: new Date().toISOString()
    };

    // Store in localStorage for now (could be moved to database later)
    localStorage.setItem('lookingGlassSettings', JSON.stringify(defaultSettings));
    
    console.log('System settings initialized:', defaultSettings);
  }

  private async createSampleData() {
    // This could create sample scenarios, templates, etc.
    const sampleTemplates = [
      {
        name: 'Technology Disruption Analysis',
        description: 'Analyze potential disruption in technology sector',
        variables: ['Technology Adoption', 'Market Sentiment', 'Regulatory Changes']
      },
      {
        name: 'Economic Impact Assessment',
        description: 'Assess economic impacts of policy changes',
        variables: ['Economic Conditions', 'Consumer Behavior', 'Geopolitical Events']
      }
    ];

    localStorage.setItem('scenarioTemplates', JSON.stringify(sampleTemplates));
    console.log('Sample data created');
  }

  private async markSetupComplete() {
    localStorage.setItem('setupCompleted', 'true');
    localStorage.setItem('setupDate', new Date().toISOString());
  }

  static isSetupComplete(): boolean {
    return localStorage.getItem('setupCompleted') === 'true';
  }

  static getSetupDate(): string | null {
    return localStorage.getItem('setupDate');
  }

  async validateSetup(): Promise<boolean> {
    try {
      // Check if admin user exists
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        return false;
      }

      // Check if user has admin role
      const { data: userRole } = await supabase
        .from('user_roles')
        .select('role, classification_clearance')
        .eq('user_id', session.session.user.id)
        .maybeSingle();

      return userRole?.role === 'admin' && SetupScript.isSetupComplete();
    } catch (error) {
      console.error('Setup validation failed:', error);
      return false;
    }
  }
}
