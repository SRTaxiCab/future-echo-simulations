
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
      
      // Step 1: Check if user already exists and sign in, or create new user
      const user = await this.createOrSignInAdminUser(config.adminEmail, config.adminPassword);
      if (!user) {
        throw new Error('Failed to create or sign in admin user');
      }

      // Step 2: Initialize system settings
      await this.initializeSystemSettings(config.systemSettings);

      // Step 3: Create sample data (optional)
      await this.createSampleData();

      // Step 4: Mark setup as complete
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

  private async createOrSignInAdminUser(email: string, password: string) {
    // First try to sign in with existing credentials
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (signInData.user) {
      console.log('Signed in with existing admin user');
      return signInData.user;
    }

    // If sign in failed, try to create new user
    if (signInError && signInError.message !== 'Invalid login credentials') {
      console.log('Attempting to create new admin user...');
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
        // If user already exists, try signing in again
        if (signUpError.message.includes('User already registered')) {
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
    }

    throw new Error('Failed to authenticate admin user');
  }

  private async initializeSystemSettings(settings?: SetupConfig['systemSettings']) {
    // Create system settings
    const defaultSettings = {
      defaultClassificationLevel: settings?.defaultClassificationLevel || 'unclassified',
      enableEmailVerification: settings?.enableEmailVerification ?? false,
      sessionTimeout: settings?.sessionTimeout || 480, // 8 hours
      setupCompleted: true,
      setupDate: new Date().toISOString()
    };

    // Store in localStorage for now
    localStorage.setItem('lookingGlassSettings', JSON.stringify(defaultSettings));
    
    console.log('System settings initialized:', defaultSettings);
  }

  private async createSampleData() {
    // Create sample templates
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
      // Check if user is signed in
      const { data: session } = await supabase.auth.getSession();
      
      return session.session !== null && SetupScript.isSetupComplete();
    } catch (error) {
      console.error('Setup validation failed:', error);
      return false;
    }
  }
}
