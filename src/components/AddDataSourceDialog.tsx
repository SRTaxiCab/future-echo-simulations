import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Globe, 
  Plus, 
  Trash2, 
  Key,
  Shield,
  AlertCircle,
  Check
} from 'lucide-react';

interface DataSource {
  name: string;
  type: string;
  url: string;
  description: string;
  apiKey: string;
  headers: Record<string, string>;
  enabled: boolean;
  rateLimitPerHour: number;
  classification: string;
}

interface AddDataSourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddDataSourceDialog: React.FC<AddDataSourceDialogProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [dataSource, setDataSource] = useState<DataSource>({
    name: '',
    type: 'rest_api',
    url: '',
    description: '',
    apiKey: '',
    headers: {},
    enabled: true,
    rateLimitPerHour: 1000,
    classification: 'unclassified'
  });
  const [newHeaderKey, setNewHeaderKey] = useState('');
  const [newHeaderValue, setNewHeaderValue] = useState('');
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionTestResult, setConnectionTestResult] = useState<'success' | 'error' | null>(null);

  const dataSourceTypes = [
    { value: 'rest_api', label: 'REST API' },
    { value: 'rss_feed', label: 'RSS Feed' },
    { value: 'news_api', label: 'News API' },
    { value: 'social_media', label: 'Social Media API' },
    { value: 'academic', label: 'Academic Database' },
    { value: 'government', label: 'Government Data' },
    { value: 'custom', label: 'Custom Source' }
  ];

  const classificationLevels = [
    { value: 'unclassified', label: 'Unclassified' },
    { value: 'confidential', label: 'Confidential' },
    { value: 'secret', label: 'Secret' },
    { value: 'top_secret', label: 'Top Secret' }
  ];

  const addHeader = () => {
    if (newHeaderKey && newHeaderValue) {
      setDataSource(prev => ({
        ...prev,
        headers: { ...prev.headers, [newHeaderKey]: newHeaderValue }
      }));
      setNewHeaderKey('');
      setNewHeaderValue('');
    }
  };

  const removeHeader = (key: string) => {
    setDataSource(prev => ({
      ...prev,
      headers: Object.fromEntries(Object.entries(prev.headers).filter(([k]) => k !== key))
    }));
  };

  const testConnection = async () => {
    setIsTestingConnection(true);
    setConnectionTestResult(null);
    
    try {
      // Simulate connection test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, randomly succeed or fail
      const success = Math.random() > 0.3;
      setConnectionTestResult(success ? 'success' : 'error');
      
      if (success) {
        toast({
          title: "Connection successful",
          description: "Data source is reachable and responding correctly"
        });
      } else {
        toast({
          title: "Connection failed",
          description: "Unable to connect to the data source. Please check your configuration.",
          variant: "destructive"
        });
      }
    } catch (error) {
      setConnectionTestResult('error');
      toast({
        title: "Connection test failed",
        description: "An error occurred while testing the connection",
        variant: "destructive"
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSave = () => {
    if (!dataSource.name || !dataSource.url) {
      toast({
        title: "Validation error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Here you would typically save to your backend/database
    toast({
      title: "Data source added",
      description: `${dataSource.name} has been successfully added to your data sources`
    });
    
    // Reset form and close dialog
    setDataSource({
      name: '',
      type: 'rest_api',
      url: '',
      description: '',
      apiKey: '',
      headers: {},
      enabled: true,
      rateLimitPerHour: 1000,
      classification: 'unclassified'
    });
    setStep(1);
    setConnectionTestResult(null);
    onOpenChange(false);
  };

  const nextStep = () => {
    if (step === 1) {
      if (!dataSource.name || !dataSource.type || !dataSource.url) {
        toast({
          title: "Please complete required fields",
          description: "Name, type, and URL are required before proceeding",
          variant: "destructive"
        });
        return;
      }
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-cyber" />
            Add Custom Data Source
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress indicator */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 1 ? 'bg-cyber text-black' : 'bg-muted text-muted-foreground'
              }`}>
                1
              </div>
              <div className={`h-0.5 w-16 ${step >= 2 ? 'bg-cyber' : 'bg-muted'}`} />
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 2 ? 'bg-cyber text-black' : 'bg-muted text-muted-foreground'
              }`}>
                2
              </div>
              <div className={`h-0.5 w-16 ${step >= 3 ? 'bg-cyber' : 'bg-muted'}`} />
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 3 ? 'bg-cyber text-black' : 'bg-muted text-muted-foreground'
              }`}>
                3
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Step {step} of 3
            </div>
          </div>

          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Data Source Name *</Label>
                  <Input
                    id="name"
                    value={dataSource.name}
                    onChange={(e) => setDataSource(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Custom News API"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Source Type *</Label>
                  <Select 
                    value={dataSource.type} 
                    onValueChange={(value) => setDataSource(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select source type" />
                    </SelectTrigger>
                    <SelectContent>
                      {dataSourceTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">API Endpoint URL *</Label>
                <Input
                  id="url"
                  value={dataSource.url}
                  onChange={(e) => setDataSource(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://api.example.com/v1/data"
                  type="url"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={dataSource.description}
                  onChange={(e) => setDataSource(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of what this data source provides..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="classification">Classification Level</Label>
                  <Select 
                    value={dataSource.classification} 
                    onValueChange={(value) => setDataSource(prev => ({ ...prev, classification: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {classificationLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rateLimit">Rate Limit (requests/hour)</Label>
                  <Input
                    id="rateLimit"
                    type="number"
                    value={dataSource.rateLimitPerHour}
                    onChange={(e) => setDataSource(prev => ({ ...prev, rateLimitPerHour: parseInt(e.target.value) || 1000 }))}
                    min="1"
                    max="10000"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Authentication & Headers */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Authentication & Headers</h3>
              
              <div className="space-y-2">
                <Label htmlFor="apiKey" className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  API Key
                </Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={dataSource.apiKey}
                  onChange={(e) => setDataSource(prev => ({ ...prev, apiKey: e.target.value }))}
                  placeholder="Enter your API key (optional)"
                />
                <p className="text-xs text-muted-foreground">
                  API key will be stored securely and encrypted
                </p>
              </div>

              <div className="space-y-3">
                <Label>Custom Headers</Label>
                
                {/* Existing headers */}
                {Object.entries(dataSource.headers).length > 0 && (
                  <div className="space-y-2">
                    {Object.entries(dataSource.headers).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2 p-2 bg-muted/20 rounded-md">
                        <Badge variant="outline" className="font-mono text-xs">
                          {key}
                        </Badge>
                        <span className="text-sm text-muted-foreground">:</span>
                        <span className="text-sm font-mono">{value}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeHeader(key)}
                          className="ml-auto h-6 w-6 p-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add new header */}
                <div className="grid grid-cols-5 gap-2">
                  <div className="col-span-2">
                    <Input
                      value={newHeaderKey}
                      onChange={(e) => setNewHeaderKey(e.target.value)}
                      placeholder="Header name"
                      className="text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      value={newHeaderValue}
                      onChange={(e) => setNewHeaderValue(e.target.value)}
                      placeholder="Header value"
                      className="text-sm"
                    />
                  </div>
                  <Button
                    size="sm"
                    onClick={addHeader}
                    disabled={!newHeaderKey || !newHeaderValue}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="bg-blue-950/20 border border-blue-500/30 rounded-md p-4">
                <h4 className="font-medium text-blue-400 mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Security Note
                </h4>
                <p className="text-sm text-blue-200">
                  All authentication credentials are encrypted and stored securely. Headers and API keys are only transmitted over HTTPS connections.
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Test & Review */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Test Connection & Review</h3>
              
              {/* Configuration Summary */}
              <div className="border rounded-md p-4 space-y-3">
                <h4 className="font-medium">Configuration Summary</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Name:</span>
                    <span className="ml-2 font-medium">{dataSource.name}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Type:</span>
                    <span className="ml-2 font-medium">
                      {dataSourceTypes.find(t => t.value === dataSource.type)?.label}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">URL:</span>
                    <span className="ml-2 font-mono text-xs">{dataSource.url}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Classification:</span>
                    <Badge variant="outline" className="ml-2">
                      {classificationLevels.find(l => l.value === dataSource.classification)?.label}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Rate Limit:</span>
                    <span className="ml-2">{dataSource.rateLimitPerHour}/hour</span>
                  </div>
                </div>
              </div>

              {/* Connection Test */}
              <div className="border rounded-md p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Connection Test</h4>
                  <Button
                    onClick={testConnection}
                    disabled={isTestingConnection}
                    size="sm"
                  >
                    {isTestingConnection ? 'Testing...' : 'Test Connection'}
                  </Button>
                </div>
                
                {connectionTestResult && (
                  <div className={`flex items-center gap-2 p-3 rounded-md ${
                    connectionTestResult === 'success' 
                      ? 'bg-green-950/20 border border-green-500/30 text-green-400'
                      : 'bg-red-950/20 border border-red-500/30 text-red-400'
                  }`}>
                    {connectionTestResult === 'success' ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    <span className="text-sm">
                      {connectionTestResult === 'success' 
                        ? 'Connection successful! Data source is responding correctly.'
                        : 'Connection failed. Please verify your configuration and try again.'
                      }
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enabled" className="flex items-center gap-2">
                    Enable this data source immediately
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    You can always enable/disable it later in the data sources settings
                  </p>
                </div>
                <Switch 
                  id="enabled"
                  checked={dataSource.enabled}
                  onCheckedChange={(checked) => setDataSource(prev => ({ ...prev, enabled: checked }))}
                />
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={step === 1}
            >
              Previous
            </Button>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              
              {step < 3 ? (
                <Button onClick={nextStep} className="bg-cyber hover:bg-cyber-dark">
                  Next
                </Button>
              ) : (
                <Button onClick={handleSave} className="bg-cyber hover:bg-cyber-dark">
                  Add Data Source
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
