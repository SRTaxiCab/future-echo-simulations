import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe } from 'lucide-react';

interface LoadingPanelProps {
  className?: string;
}

export const LoadingPanel: React.FC<LoadingPanelProps> = ({ className }) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="font-mono flex items-center">
          <Globe className="h-5 w-5 mr-2" />
          Global Events Map
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyber mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Initializing map...</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};