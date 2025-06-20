
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  Globe, 
  Settings, 
  Trash2, 
  TestTube,
  Clock,
  Shield,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import type { DataSource } from '@/context/DataSourcesContext';

interface DataSourceCardProps {
  dataSource: DataSource;
  onEdit: (dataSource: DataSource) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onTest: (id: string) => Promise<boolean>;
}

export const DataSourceCard: React.FC<DataSourceCardProps> = ({
  dataSource,
  onEdit,
  onDelete,
  onToggle,
  onTest
}) => {
  const { toast } = useToast();
  const [isTesting, setIsTesting] = useState(false);

  const getStatusIcon = () => {
    switch (dataSource.status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      case 'testing':
        return <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />;
      default:
        return <Globe className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (dataSource.status) {
      case 'active':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      case 'testing':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  const getTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      'rest_api': 'REST API',
      'rss_feed': 'RSS Feed',
      'news_api': 'News API',
      'social_media': 'Social Media',
      'academic': 'Academic',
      'government': 'Government',
      'custom': 'Custom'
    };
    return typeMap[type] || type;
  };

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'unclassified':
        return 'bg-gray-500/20 text-gray-300';
      case 'confidential':
        return 'bg-yellow-500/20 text-yellow-300';
      case 'secret':
        return 'bg-orange-500/20 text-orange-300';
      case 'top_secret':
        return 'bg-red-500/20 text-red-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  const handleTest = async () => {
    setIsTesting(true);
    try {
      const success = await onTest(dataSource.id);
      toast({
        title: success ? "Connection successful" : "Connection failed",
        description: success 
          ? "Data source is responding correctly" 
          : "Unable to connect to the data source",
        variant: success ? "default" : "destructive"
      });
    } catch (error) {
      toast({
        title: "Test failed",
        description: "An error occurred while testing the connection",
        variant: "destructive"
      });
    } finally {
      setIsTesting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card className="bg-card/50 border-muted">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <div>
              <CardTitle className="text-base">{dataSource.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {getTypeLabel(dataSource.type)}
                </Badge>
                <Badge className={`text-xs ${getClassificationColor(dataSource.classification)}`}>
                  <Shield className="h-3 w-3 mr-1" />
                  {dataSource.classification.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={dataSource.enabled}
              onCheckedChange={() => onToggle(dataSource.id)}
              size="sm"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            {dataSource.description}
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="font-mono">{dataSource.url}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-muted-foreground">Status:</span>
            <span className={`ml-2 font-medium ${getStatusColor()}`}>
              {dataSource.status.charAt(0).toUpperCase() + dataSource.status.slice(1)}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Rate Limit:</span>
            <span className="ml-2">{dataSource.rateLimitPerHour}/hour</span>
          </div>
          <div className="col-span-2 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span className="text-muted-foreground">Last sync:</span>
            <span className="ml-1">{formatDate(dataSource.lastSync)}</span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-muted/30">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(dataSource)}
              className="h-8"
            >
              <Settings className="h-3 w-3 mr-1" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleTest}
              disabled={isTesting || dataSource.status === 'testing'}
              className="h-8"
            >
              <TestTube className="h-3 w-3 mr-1" />
              Test
            </Button>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(dataSource.id)}
            className="h-8 text-red-400 hover:text-red-300 hover:bg-red-950/20"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
