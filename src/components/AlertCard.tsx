
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { AlertTriangle, AlertCircle } from 'lucide-react';

interface AlertCardProps {
  title?: string;
  message: string;
  severity?: 'warning' | 'critical';
  className?: string;
}

export const AlertCard = ({ 
  title, 
  message, 
  severity = 'warning',
  className 
}: AlertCardProps) => {
  return (
    <Card className={cn(
      "overflow-hidden border", 
      severity === 'warning' ? "border-yellow-500/50" : "border-red-500/50",
      className
    )}>
      <CardHeader className={cn(
        "py-3 flex flex-row items-center space-y-0",
        severity === 'warning' ? "bg-yellow-950/30" : "bg-red-950/30"
      )}>
        <CardTitle className="text-base font-mono flex items-center gap-2">
          {severity === 'warning' ? (
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-500" />
          )}
          {title || (severity === 'warning' ? 'Warning Alert' : 'Critical Alert')}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className={cn(
          "text-sm data-feed",
          severity === 'warning' ? "text-yellow-200" : "text-red-200"
        )}>
          {message}
        </div>
      </CardContent>
    </Card>
  );
};
