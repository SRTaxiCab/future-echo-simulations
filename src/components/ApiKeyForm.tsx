
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Key, 
  Plus, 
  Eye, 
  EyeOff, 
  Trash2, 
  Copy,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface ApiKey {
  id: string;
  name: string;
  service: string;
  key: string;
  status: 'active' | 'inactive' | 'expired';
  lastUsed: string;
  createdAt: string;
}

export const ApiKeyForm: React.FC = () => {
  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: '1',
      name: 'OpenAI GPT-4',
      service: 'OpenAI',
      key: 'sk-proj-***hidden***',
      status: 'active',
      lastUsed: '2025-01-20T10:30:00Z',
      createdAt: '2025-01-15T09:00:00Z'
    },
    {
      id: '2',
      name: 'NewsAPI Key',
      service: 'NewsAPI',
      key: 'a1b2c3d4***hidden***',
      status: 'active',
      lastUsed: '2025-01-20T09:15:00Z',
      createdAt: '2025-01-16T14:20:00Z'
    },
    {
      id: '3',
      name: 'Twitter API',
      service: 'X/Twitter',
      key: 'AAAA***hidden***',
      status: 'expired',
      lastUsed: '2025-01-18T16:45:00Z',
      createdAt: '2025-01-10T11:30:00Z'
    }
  ]);

  const [newKey, setNewKey] = useState({
    name: '',
    service: '',
    key: ''
  });

  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const copyToClipboard = (key: string, name: string) => {
    navigator.clipboard.writeText(key);
    toast({
      title: "API key copied",
      description: `${name} API key copied to clipboard`
    });
  };

  const addApiKey = () => {
    if (!newKey.name || !newKey.service || !newKey.key) {
      toast({
        title: "Validation error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const apiKey: ApiKey = {
      id: Math.random().toString(36).substr(2, 9),
      name: newKey.name,
      service: newKey.service,
      key: newKey.key,
      status: 'active',
      lastUsed: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    setApiKeys(prev => [...prev, apiKey]);
    setNewKey({ name: '', service: '', key: '' });
    toast({
      title: "API key added",
      description: `${newKey.name} has been added successfully`
    });
  };

  const deleteApiKey = (id: string) => {
    const key = apiKeys.find(k => k.id === id);
    if (key) {
      setApiKeys(prev => prev.filter(k => k.id !== id));
      toast({
        title: "API key deleted",
        description: `${key.name} has been removed`
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-300';
      case 'expired':
        return 'bg-red-500/20 text-red-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4" />;
      case 'expired':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-cyber" />
            Add New API Key
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="keyName">API Key Name</Label>
              <Input
                id="keyName"
                value={newKey.name}
                onChange={(e) => setNewKey(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., OpenAI Production"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="service">Service</Label>
              <Input
                id="service"
                value={newKey.service}
                onChange={(e) => setNewKey(prev => ({ ...prev, service: e.target.value }))}
                placeholder="e.g., OpenAI, NewsAPI"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              value={newKey.key}
              onChange={(e) => setNewKey(prev => ({ ...prev, key: e.target.value }))}
              placeholder="Enter your API key"
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={addApiKey} className="bg-cyber hover:bg-cyber-dark">
              <Plus className="h-4 w-4 mr-2" />
              Add API Key
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Stored API Keys</CardTitle>
        </CardHeader>
        <CardContent>
          {apiKeys.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No API keys stored yet. Add your first API key above.
            </div>
          ) : (
            <div className="space-y-4">
              {apiKeys.map((key) => (
                <div key={key.id} className="flex items-center justify-between p-4 border border-muted rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium">{key.name}</h3>
                      <Badge className={getStatusColor(key.status)}>
                        {getStatusIcon(key.status)}
                        <span className="ml-1 capitalize">{key.status}</span>
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>Service: {key.service}</p>
                      <p>Last used: {formatDate(key.lastUsed)}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-mono text-sm">
                        {visibleKeys.has(key.id) ? key.key : '***hidden***'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleKeyVisibility(key.id)}
                    >
                      {visibleKeys.has(key.id) ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(key.key, key.name)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteApiKey(key.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-950/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
