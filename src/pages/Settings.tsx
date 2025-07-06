
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Key, 
  Users, 
  Database,
  Globe
} from 'lucide-react';
import { UserProfileForm } from '@/components/UserProfileForm';
import { ApiKeyForm } from '@/components/ApiKeyForm';
import { DataSourcesProvider } from '@/context/DataSourcesContext';
import { DataSourcesPanel } from '@/components/DataSourcesPanel';
import { MapboxTokenSettings } from '@/components/MapboxTokenSettings';
import { AppLayout } from '@/components/AppLayout';

interface SettingsProps {
  
}

const Settings: React.FC<SettingsProps> = ({  }) => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <AppLayout>
      <div className="container py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your profile, API keys, and data sources.
          </p>
        </div>

        <Tabs defaultValue="profile" className="mt-6">
          <TabsList>
            <TabsTrigger value="profile" onClick={() => setActiveTab('profile')}>
              <Users className="mr-2 h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="api-keys" onClick={() => setActiveTab('api-keys')}>
              <Key className="mr-2 h-4 w-4" />
              API Keys
            </TabsTrigger>
            <TabsTrigger value="mapbox" onClick={() => setActiveTab('mapbox')}>
              <Globe className="mr-2 h-4 w-4" />
              Mapbox
            </TabsTrigger>
            <TabsTrigger value="data-sources" onClick={() => setActiveTab('data-sources')}>
              <Database className="mr-2 h-4 w-4" />
              Data Sources
            </TabsTrigger>
          </TabsList>
          <TabsContent value="profile" className="space-y-4 mt-4">
            <UserProfileForm />
          </TabsContent>
          <TabsContent value="api-keys" className="space-y-4 mt-4">
            <ApiKeyForm />
          </TabsContent>
          <TabsContent value="mapbox" className="space-y-4 mt-4">
            <MapboxTokenSettings />
          </TabsContent>
          <TabsContent value="data-sources" className="space-y-4 mt-4">
            <DataSourcesProvider>
              <DataSourcesPanel />
            </DataSourcesProvider>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Settings;
