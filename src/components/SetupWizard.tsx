
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { SetupScript, SetupConfig } from '@/utils/setupScript';
import { Eye, EyeOff, Settings, User, Shield } from 'lucide-react';

interface SetupWizardProps {
  onSetupComplete: () => void;
}

export const SetupWizard: React.FC<SetupWizardProps> = ({ onSetupComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const [config, setConfig] = useState<SetupConfig>({
    adminEmail: '',
    adminPassword: '',
    organizationName: '',
    systemSettings: {
      defaultClassificationLevel: 'unclassified',
      enableEmailVerification: false,
      sessionTimeout: 480
    }
  });

  const handleRunSetup = async () => {
    if (!config.adminEmail || !config.adminPassword) {
      toast({
        title: "Missing Information",
        description: "Please provide both email and password for the admin account.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    const setupScript = new SetupScript(toast);
    const success = await setupScript.runSetup(config);
    
    if (success) {
      onSetupComplete();
    }
    setIsLoading(false);
  };

  const canProceedToNextStep = () => {
    if (currentStep === 1) {
      return config.adminEmail.trim() !== '' && config.adminPassword.trim() !== '';
    }
    return true;
  };

  const steps = [
    {
      id: 1,
      title: "Administrator Account",
      description: "Create the primary administrator account",
      icon: <User className="w-5 h-5" />
    },
    {
      id: 2,
      title: "System Settings",
      description: "Configure default system parameters",
      icon: <Settings className="w-5 h-5" />
    },
    {
      id: 3,
      title: "Security Configuration",
      description: "Set up classification and access controls",
      icon: <Shield className="w-5 h-5" />
    }
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="adminEmail" className="text-sm font-medium">
                Administrator Email *
              </Label>
              <Input
                id="adminEmail"
                type="email"
                value={config.adminEmail}
                onChange={(e) => setConfig({ ...config, adminEmail: e.target.value })}
                placeholder="admin@organization.com"
                className="font-mono bg-background border-input"
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminPassword" className="text-sm font-medium">
                Administrator Password *
              </Label>
              <div className="relative">
                <Input
                  id="adminPassword"
                  type={showPassword ? "text" : "password"}
                  value={config.adminPassword}
                  onChange={(e) => setConfig({ ...config, adminPassword: e.target.value })}
                  placeholder="Enter secure password"
                  className="font-mono pr-10 bg-background border-input"
                  required
                  autoComplete="new-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="orgName" className="text-sm font-medium">
                Organization Name (Optional)
              </Label>
              <Input
                id="orgName"
                type="text"
                value={config.organizationName || ''}
                onChange={(e) => setConfig({ ...config, organizationName: e.target.value })}
                placeholder="Your Organization"
                className="bg-background border-input"
                autoComplete="organization"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Email Verification</Label>
                <p className="text-sm text-muted-foreground">Require email verification for new users</p>
              </div>
              <Switch
                checked={config.systemSettings?.enableEmailVerification || false}
                onCheckedChange={(checked) => 
                  setConfig({
                    ...config,
                    systemSettings: { ...config.systemSettings!, enableEmailVerification: checked }
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout" className="text-sm font-medium">
                Session Timeout (minutes)
              </Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={config.systemSettings?.sessionTimeout || 480}
                onChange={(e) => setConfig({
                  ...config,
                  systemSettings: { ...config.systemSettings!, sessionTimeout: parseInt(e.target.value) || 480 }
                })}
                min="30"
                max="1440"
                className="bg-background border-input"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="defaultClearance" className="text-sm font-medium">
                Default Classification Level
              </Label>
              <Select
                value={config.systemSettings?.defaultClassificationLevel || 'unclassified'}
                onValueChange={(value: any) => setConfig({
                  ...config,
                  systemSettings: { 
                    ...config.systemSettings!, 
                    defaultClassificationLevel: value 
                  }
                })}
              >
                <SelectTrigger className="bg-background border-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background border-input z-50">
                  <SelectItem value="unclassified">Unclassified</SelectItem>
                  <SelectItem value="confidential">Confidential</SelectItem>
                  <SelectItem value="secret">Secret</SelectItem>
                  <SelectItem value="top_secret">Top Secret</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">⚠️ Security Notice</h4>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                The administrator account will have TOP SECRET clearance and full system access. 
                Ensure this account is properly secured with a strong password.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl cyber-border bg-muted/5">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-mono text-cyber">
            Project Looking Glass Setup
          </CardTitle>
          <CardDescription>
            Initialize your predictive intelligence system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Progress Steps */}
          <div className="flex justify-between mb-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2
                  ${currentStep >= step.id 
                    ? 'bg-cyber border-cyber text-black' 
                    : 'border-muted-foreground text-muted-foreground'
                  }
                `}>
                  {step.icon}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 ml-2 ${
                    currentStep > step.id ? 'bg-cyber' : 'bg-muted-foreground'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Current Step Content */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">
              {steps[currentStep - 1].title}
            </h3>
            <p className="text-muted-foreground mb-6">
              {steps[currentStep - 1].description}
            </p>
            {renderStep()}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            {currentStep < steps.length ? (
              <Button
                onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
                className="bg-cyber hover:bg-cyber/80 text-black"
                disabled={!canProceedToNextStep()}
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleRunSetup}
                disabled={isLoading || !canProceedToNextStep()}
                className="bg-cyber hover:bg-cyber/80 text-black"
              >
                {isLoading ? 'Setting up...' : 'Complete Setup'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
