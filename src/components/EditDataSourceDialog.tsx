
import React, { useState, useEffect } from 'react';
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
  Settings, 
  Plus, 
  Trash2, 
  Key
} from 'lucide-react';
import type { DataSource } from '@/context/DataSourcesContext';

interface EditDataSourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dataSource: DataSource | null;
  onSave: (id: string, updates: Partial<DataSource>) => void;
}

export const EditDataSourceDialog: React.FC<EditDataSourceDialogProps> = ({
  open,
  onOpenChange,
  dataSource,
  onSave
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<DataSource>>({});
  const [newHeaderKey, setNewHeaderKey] = useState('');
  const [newHeaderValue, setNewHeaderValue] = useState('');

  useEffect(() => {
    if (dataSource) {
      setFormData(dataSource);
    }
  }, [dataSource]);

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
    if (newHeaderKey && newHeaderValue && formData.headers) {
      setFormData(prev => ({
        ...prev,
        headers: { ...prev.headers, [newHeaderKey]: newHeaderValue }
      }));
      setNewHeaderKey('');
      setNewHeaderValue('');
    }
  };

  const removeHeader = (key: string) => {
    if (formData.headers) {
      setFormData(prev => ({
        ...prev,
        headers: Object.fromEntries(Object.entries(prev.headers!).filter(([k]) => k !== key))
      }));
    }
  };

  const handleSave = () => {
    if (!dataSource || !formData.name || !formData.url) {
      toast({
        title: "Validation error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    onSave(dataSource.id, formData);
    toast({
      title: "Data source updated",
      description: `${formData.name} has been successfully updated`
    });
    onOpenChange(false);
  };

  if (!dataSource) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-cyber" />
            Edit Data Source
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Data Source Name *</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Custom News API"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Source Type *</Label>
              <Select 
                value={formData.type || ''} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
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
              value={formData.url || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
              placeholder="https://api.example.com/v1/data"
              type="url"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of what this data source provides..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="classification">Classification Level</Label>
              <Select 
                value={formData.classification || ''} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, classification: value }))}
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
                value={formData.rateLimitPerHour || 1000}
                onChange={(e) => setFormData(prev => ({ ...prev, rateLimitPerHour: parseInt(e.target.value) || 1000 }))}
                min="1"
                max="10000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiKey" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              API Key
            </Label>
            <Input
              id="apiKey"
              type="password"
              value={formData.apiKey || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, apiKey: e.target.value }))}
              placeholder="Enter your API key (optional)"
            />
          </div>

          <div className="space-y-3">
            <Label>Custom Headers</Label>
            
            {formData.headers && Object.entries(formData.headers).length > 0 && (
              <div className="space-y-2">
                {Object.entries(formData.headers).map(([key, value]) => (
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

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enabled" className="flex items-center gap-2">
                Enable this data source
              </Label>
              <p className="text-xs text-muted-foreground">
                Toggle to enable/disable data collection from this source
              </p>
            </div>
            <Switch 
              id="enabled"
              checked={formData.enabled || false}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enabled: checked }))}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-cyber hover:bg-cyber-dark">
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
