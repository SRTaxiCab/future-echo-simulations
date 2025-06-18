import React, { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useSettings } from '@/context/SettingsContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Bell, 
  Globe, 
  Lock, 
  User, 
  Sliders, 
  Database,
  Save,
  Trash,
  CloudOff,
  AlertTriangle,
  Shield,
  Check,
  FileText,
  TestTube,
  Loader2,
  BookOpen,
  Eye,
  EyeOff,
  Copy,
  Key
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Settings = () => {
  const { user } = useAuth();
  const { settings, isLoading, updateSettings, resetSettings } = useSettings();
  const { toast } = useToast();
  const [testingModel, setTestingModel] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showSecurityGuide, setShowSecurityGuide] = useState(false);
  
  const handleSaveSettings = async () => {
    if (!settings) return;
    
    setSaving(true);
    try {
      // Settings are automatically saved through the context
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully"
      });
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const testNLPModel = async () => {
    if (!settings) return;
    
    setTestingModel(true);
    try {
      const { data, error } = await supabase.functions.invoke('test-nlp-model', {
        body: { 
          model: settings.nlp_model,
          testMessage: "Test connection to verify NLP model is working correctly."
        }
      });

      if (error) {
        toast({
          title: "Model test failed",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      if (data.success) {
        toast({
          title: "Model test successful",
          description: `${settings.nlp_model} is working correctly`,
        });
      } else {
        toast({
          title: "Model test failed",
          description: data.error || "Unknown error",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Test failed",
        description: "Could not connect to test service",
        variant: "destructive"
      });
    } finally {
      setTestingModel(false);
    }
  };

  const updateSetting = (key: string, value: any) => {
    if (!settings) return;
    
    if (key.includes('.')) {
      const [parent, child] = key.split('.');
      updateSettings({
        [parent]: {
          ...(settings[parent as keyof typeof settings] as any),
          [child]: value
        }
      });
    } else {
      updateSettings({ [key]: value });
    }
  };

  if (isLoading || !settings) {
    return (
      <AppLayout>
        <div className="p-6 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading settings...</p>
          </div>
        </div>
      </AppLayout>
    );
  }
  
  return (
    <AppLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Settings</h1>
          <div className="flex gap-2">
            <Button 
              onClick={handleSaveSettings} 
              className="bg-cyber hover:bg-cyber-dark"
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Changes
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="profile" className="space-y-6">
          <div className="border-b border-border">
            <TabsList className="h-10">
              <TabsTrigger value="profile" className="data-[state=active]:border-b-2 data-[state=active]:border-cyber rounded-none">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:border-b-2 data-[state=active]:border-cyber rounded-none">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="api" className="data-[state=active]:border-b-2 data-[state=active]:border-cyber rounded-none">
                <Database className="h-4 w-4 mr-2" />
                Data Sources
              </TabsTrigger>
              <TabsTrigger value="preferences" className="data-[state=active]:border-b-2 data-[state=active]:border-cyber rounded-none">
                <Sliders className="h-4 w-4 mr-2" />
                Preferences
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:border-b-2 data-[state=active]:border-cyber rounded-none">
                <Lock className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="profile">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your account information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" defaultValue={user?.username || 'analyst'} />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">First Name</Label>
                        <Input id="first-name" defaultValue="Project" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Last Name</Label>
                        <Input id="last-name" defaultValue="Analyst" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="analyst@projectlookingglass.com" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="role">Role / Department</Label>
                      <Input id="role" defaultValue={user?.role || 'Intelligence Analyst'} />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Workspace Settings</CardTitle>
                    <CardDescription>Configure your workspace environment</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <select 
                        id="timezone" 
                        value={settings.timezone}
                        onChange={(e) => updateSetting('timezone', e.target.value)}
                        className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="utc">UTC (Coordinated Universal Time)</option>
                        <option value="est">EST (Eastern Standard Time)</option>
                        <option value="pst">PST (Pacific Standard Time)</option>
                        <option value="cet">CET (Central European Time)</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <select 
                        id="language" 
                        value={settings.language}
                        onChange={(e) => updateSetting('language', e.target.value)}
                        className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="en">English</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="es">Spanish</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="dark-mode" className="block mb-1">Enable Dark Mode</Label>
                        <p className="text-sm text-muted-foreground">
                          Enable or disable dark mode for the interface
                        </p>
                      </div>
                      <Switch 
                        id="dark-mode" 
                        checked={settings.dark_mode}
                        onCheckedChange={(checked) => updateSetting('dark_mode', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col items-center">
                      <div className="h-24 w-24 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-foreground mb-4">
                        <User className="h-12 w-12" />
                      </div>
                      <h3 className="text-lg font-medium">{user?.username || 'analyst'}</h3>
                      <p className="text-sm text-muted-foreground">{user?.role || 'Intelligence Analyst'}</p>
                      
                      <Button variant="outline" className="mt-4 w-full">
                        Change Avatar
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Account Status</h4>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="h-2 w-2 rounded-full bg-neural"></div>
                        <span className="text-sm">Active</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Account in good standing</p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Subscription</h4>
                      <p className="text-sm">Enterprise Plan</p>
                      <p className="text-xs text-muted-foreground mb-2">Renews on Jan 1, 2026</p>
                      <Button variant="outline" size="sm" className="w-full text-xs">
                        Manage Subscription
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-destructive/20">
                  <CardHeader>
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="mb-1 block">Reset Settings</Label>
                      <p className="text-sm text-muted-foreground mb-3">
                        This will reset all your preferences to default values.
                      </p>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="w-full"
                        onClick={resetSettings}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Reset All Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose when and how to be notified</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Timeline Alerts</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="timeline-anomalies" className="block mb-1">Anomaly Detection</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive alerts when significant timeline anomalies are detected
                        </p>
                      </div>
                      <Switch 
                        id="timeline-anomalies" 
                        checked={settings.notifications.timeline_anomalies}
                        onCheckedChange={(checked) => updateSetting('notifications.timeline_anomalies', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="timeline-updates" className="block mb-1">Timeline Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          Notifications when predictive timelines are significantly updated
                        </p>
                      </div>
                      <Switch 
                        id="timeline-updates" 
                        checked={settings.notifications.timeline_updates}
                        onCheckedChange={(checked) => updateSetting('notifications.timeline_updates', checked)}
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-3">Data Feed Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="feed-highpriority" className="block mb-1">High Priority Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Critical updates from monitored data sources
                        </p>
                      </div>
                      <Switch 
                        id="feed-highpriority" 
                        checked={settings.notifications.feed_highpriority}
                        onCheckedChange={(checked) => updateSetting('notifications.feed_highpriority', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="feed-trending" className="block mb-1">Trending Topics</Label>
                        <p className="text-sm text-muted-foreground">
                          Alerts when topics in your focus areas are trending
                        </p>
                      </div>
                      <Switch 
                        id="feed-trending" 
                        checked={settings.notifications.feed_trending}
                        onCheckedChange={(checked) => updateSetting('notifications.feed_trending', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="feed-daily" className="block mb-1">Daily Summaries</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive a daily digest of key events and developments
                        </p>
                      </div>
                      <Switch 
                        id="feed-daily" 
                        checked={settings.notifications.feed_daily}
                        onCheckedChange={(checked) => updateSetting('notifications.feed_daily', checked)}
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-3">System Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="system-updates" className="block mb-1">System Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          Notifications about system maintenance and updates
                        </p>
                      </div>
                      <Switch 
                        id="system-updates" 
                        checked={settings.notifications.system_updates}
                        onCheckedChange={(checked) => updateSetting('notifications.system_updates', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="system-security" className="block mb-1">Security Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Important security-related notifications
                        </p>
                      </div>
                      <Switch 
                        id="system-security" 
                        checked={settings.notifications.system_security}
                        onCheckedChange={(checked) => updateSetting('notifications.system_security', checked)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="api">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Data Source Configuration</CardTitle>
                  <CardDescription>Manage your external data source connections</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="border rounded-md">
                      <div className="p-4 flex justify-between items-center border-b">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-md bg-blue-950/50 flex items-center justify-center">
                            <Globe className="h-5 w-5 text-blue-400" />
                          </div>
                          <div>
                            <h3 className="font-medium">News APIs</h3>
                            <p className="text-sm text-muted-foreground">Configure news data sources</p>
                          </div>
                        </div>
                        <Badge className="bg-green-600/20 text-green-400">Connected</Badge>
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">Reuters</Badge>
                          <Badge variant="outline">Associated Press</Badge>
                          <Badge variant="outline">Bloomberg</Badge>
                          <Badge variant="outline">Wall Street Journal</Badge>
                          <Badge variant="outline" className="bg-muted/20">+ 3 more</Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm">Configure Sources</Button>
                          <Button size="sm" variant="outline">
                            <Sliders className="h-4 w-4 mr-2" />
                            API Settings
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-md">
                      <div className="p-4 flex justify-between items-center border-b">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-md bg-cyan-950/50 flex items-center justify-center">
                            <Bell className="h-5 w-5 text-cyan-400" />
                          </div>
                          <div>
                            <h3 className="font-medium">Social Media APIs</h3>
                            <p className="text-sm text-muted-foreground">Social media monitoring configuration</p>
                          </div>
                        </div>
                        <Badge className="bg-yellow-600/20 text-yellow-400">Partial</Badge>
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="border-green-500/30 text-green-400">Twitter/X Connected</Badge>
                          <Badge variant="outline" className="border-green-500/30 text-green-400">Reddit Connected</Badge>
                          <Badge variant="outline" className="border-red-500/30 text-red-400">YouTube Disconnected</Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm">Configure Sources</Button>
                          <Button size="sm" variant="outline">
                            <Sliders className="h-4 w-4 mr-2" />
                            API Settings
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-md">
                      <div className="p-4 flex justify-between items-center border-b">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-md bg-green-950/50 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-green-400" />
                          </div>
                          <div>
                            <h3 className="font-medium">Academic & Research APIs</h3>
                            <p className="text-sm text-muted-foreground">Scientific and research publication sources</p>
                          </div>
                        </div>
                        <Badge className="bg-green-600/20 text-green-400">Connected</Badge>
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">arXiv</Badge>
                          <Badge variant="outline">SSRN</Badge>
                          <Badge variant="outline" className="bg-muted/20">+ 1 more</Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm">Configure Sources</Button>
                          <Button size="sm" variant="outline">
                            <Sliders className="h-4 w-4 mr-2" />
                            API Settings
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border border-dashed rounded-md p-6">
                      <div className="text-center">
                        <div className="mx-auto h-12 w-12 rounded-full bg-muted/20 flex items-center justify-center mb-4">
                          <CloudOff className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="font-medium mb-1">Add Custom Data Source</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Connect additional APIs or data sources to expand your intelligence capabilities
                        </p>
                        <Button>
                          Connect New Source
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>API Access Keys</CardTitle>
                  <CardDescription>Manage the API keys used for your data sources</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-md p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">OpenAI API Key</h3>
                        <Button variant="ghost" size="sm">Regenerate</Button>
                      </div>
                      <div className="bg-muted/20 p-3 rounded-md font-mono text-sm overflow-x-auto">
                        ●●●●●●●●●●●●●●●●●●●●●●●●●●<span className="text-cyber">4f8a</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Last used: 2 minutes ago • Created: May 1, 2025
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Social Media API Keys</h3>
                        <Button variant="ghost" size="sm">Manage</Button>
                      </div>
                      <div className="text-sm">
                        3 active keys • Last updated May 3, 2025
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-muted/10 rounded-md">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                        <span className="text-sm">Remember to secure your API keys</span>
                      </div>
                      <Dialog open={showSecurityGuide} onOpenChange={setShowSecurityGuide}>
                        <DialogTrigger asChild>
                          <Button variant="link" size="sm">
                            <BookOpen className="h-4 w-4 mr-2" />
                            API Security Guide
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <Shield className="h-5 w-5 text-cyber" />
                              API Security Guide
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6 mt-4">
                            <div className="space-y-4">
                              <div className="bg-red-950/20 border border-red-500/30 rounded-md p-4">
                                <h3 className="font-semibold text-red-400 mb-2 flex items-center gap-2">
                                  <AlertTriangle className="h-4 w-4" />
                                  Critical Security Practices
                                </h3>
                                <ul className="text-sm space-y-1 text-red-200">
                                  <li>• Never share API keys in public repositories</li>
                                  <li>• Rotate keys regularly (every 90 days recommended)</li>
                                  <li>• Use environment variables, never hardcode keys</li>
                                  <li>• Monitor API usage for unusual activity</li>
                                </ul>
                              </div>

                              <div>
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                  <Key className="h-4 w-4" />
                                  API Key Management
                                </h3>
                                <div className="space-y-3 text-sm">
                                  <div className="border rounded-md p-3">
                                    <h4 className="font-medium mb-2">✓ Secure Storage</h4>
                                    <p className="text-muted-foreground">Store keys in Supabase secrets or secure environment variables. Never commit them to version control.</p>
                                  </div>
                                  <div className="border rounded-md p-3">
                                    <h4 className="font-medium mb-2">✓ Access Control</h4>
                                    <p className="text-muted-foreground">Limit API key permissions to minimum required scope. Use separate keys for different services.</p>
                                  </div>
                                  <div className="border rounded-md p-3">
                                    <h4 className="font-medium mb-2">✓ Monitoring</h4>
                                    <p className="text-muted-foreground">Regularly review API usage logs and set up alerts for unusual activity patterns.</p>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h3 className="font-semibold mb-3">Best Practices Checklist</h3>
                                <div className="space-y-2 text-sm">
                                  <div className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-green-500" />
                                    <span>Use HTTPS for all API requests</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-green-500" />
                                    <span>Implement rate limiting on your endpoints</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-green-500" />
                                    <span>Validate and sanitize all input data</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-green-500" />
                                    <span>Log security events and failed attempts</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-green-500" />
                                    <span>Use API key rotation schedules</span>
                                  </div>
                                </div>
                              </div>

                              <div className="bg-blue-950/20 border border-blue-500/30 rounded-md p-4">
                                <h3 className="font-semibold text-blue-400 mb-2">Emergency Procedures</h3>
                                <p className="text-sm text-blue-200 mb-2">If you suspect a key has been compromised:</p>
                                <ol className="text-sm space-y-1 text-blue-200 list-decimal list-inside">
                                  <li>Immediately revoke the compromised key</li>
                                  <li>Generate a new key with updated permissions</li>
                                  <li>Review access logs for unauthorized usage</li>
                                  <li>Update all applications using the old key</li>
                                  <li>Monitor for continued suspicious activity</li>
                                </ol>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>System Preferences</CardTitle>
                <CardDescription>Customize your analysis and simulation preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Simulation Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="auto-simulation" className="block mb-1">Automatic Simulations</Label>
                        <p className="text-sm text-muted-foreground">
                          Run timeline simulations automatically when data changes
                        </p>
                      </div>
                      <Switch 
                        id="auto-simulation" 
                        checked={settings.auto_simulation}
                        onCheckedChange={(checked) => updateSetting('auto_simulation', checked)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="simulation-complexity">Simulation Complexity</Label>
                      <select 
                        id="simulation-complexity" 
                        value={settings.simulation_complexity}
                        onChange={(e) => updateSetting('simulation_complexity', e.target.value)}
                        className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="low">Low (Faster performance, lower accuracy)</option>
                        <option value="standard">Standard (Balanced accuracy/performance)</option>
                        <option value="high">High (Maximum accuracy, slower)</option>
                      </select>
                      <p className="text-xs text-muted-foreground">
                        Higher complexity increases prediction accuracy but requires more processing time
                      </p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-3">Display Preferences</h3>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="default-view">Default Dashboard View</Label>
                      <select 
                        id="default-view" 
                        value={settings.default_view}
                        onChange={(e) => updateSetting('default_view', e.target.value)}
                        className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="timeline">Timeline Focus</option>
                        <option value="feed">Data Feed Focus</option>
                        <option value="analytics">Analytics Focus</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="compact-view" className="block mb-1">Compact View Mode</Label>
                        <p className="text-sm text-muted-foreground">
                          Use condensed layouts to display more information
                        </p>
                      </div>
                      <Switch 
                        id="compact-view" 
                        checked={settings.compact_view}
                        onCheckedChange={(checked) => updateSetting('compact_view', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="animations" className="block mb-1">UI Animations</Label>
                        <p className="text-sm text-muted-foreground">
                          Enable or disable interface animations
                        </p>
                      </div>
                      <Switch 
                        id="animations" 
                        checked={settings.animations_enabled}
                        onCheckedChange={(checked) => updateSetting('animations_enabled', checked)}
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-3">Analysis Preferences</h3>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="nlp-model">NLP Model Preference</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={testNLPModel}
                          disabled={testingModel}
                          className="flex items-center gap-2"
                        >
                          {testingModel ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <TestTube className="h-4 w-4" />
                          )}
                          Test Model
                        </Button>
                      </div>
                      <select 
                        id="nlp-model" 
                        value={settings.nlp_model}
                        onChange={(e) => updateSetting('nlp_model', e.target.value)}
                        className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="gpt-4o-mini">GPT-4o-mini (Default)</option>
                        <option value="gpt-4o">GPT-4o (Higher accuracy)</option>
                        <option value="gpt-4.1-2025-04-14">GPT-4.1 (Latest model)</option>
                      </select>
                      <p className="text-xs text-muted-foreground">
                        Select which NLP model to use for text analysis and summarization
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confidence-threshold">Confidence Threshold: {settings.confidence_threshold}%</Label>
                      <Input 
                        id="confidence-threshold" 
                        type="range"
                        min="0" 
                        max="100" 
                        value={settings.confidence_threshold}
                        onChange={(e) => updateSetting('confidence_threshold', parseInt(e.target.value))}
                        className="w-full"
                      />
                      <p className="text-xs text-muted-foreground">
                        Minimum confidence score required for including predictions (0-100)
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Security</CardTitle>
                  <CardDescription>Manage your account security settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  
                  <Button>Update Password</Button>
                </CardContent>
              </Card>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Two-Factor Authentication</CardTitle>
                    <CardDescription>Add an extra layer of security to your account</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="tfa" className="block mb-1">Enable 2FA</Label>
                        <p className="text-sm text-muted-foreground">
                          Protect your account with two-factor authentication
                        </p>
                      </div>
                      <Switch id="tfa" />
                    </div>
                    
                    <Button variant="outline" className="w-full" disabled>
                      <Shield className="h-4 w-4 mr-2" />
                      Configure 2FA
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Security Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">No active security alerts</span>
                      </div>
                    </div>
                    
                    <div className="bg-muted/20 rounded-md p-4 text-sm">
                      <p>
                        Last login: <span className="font-mono">2025-06-17 13:35:32 UTC</span><br />
                        IP Address: <span className="font-mono">192.168.1.XXX</span><br />
                        Location: <span className="font-mono">San Francisco, CA, USA</span>
                      </p>
                    </div>
                    
                    <Button variant="outline" size="sm">
                      View Login History
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Settings;
