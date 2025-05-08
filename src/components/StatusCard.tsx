
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatusCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trending?: 'up' | 'down' | 'stable';
  trendValue?: string;
  className?: string;
  cardClassName?: string;
}

export const StatusCard = ({
  title,
  value,
  icon,
  trending,
  trendValue,
  className,
  cardClassName,
}: StatusCardProps) => {
  return (
    <Card className={cn("cyber-border overflow-hidden", cardClassName)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="h-5 w-5 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent className={className}>
        <div className="text-2xl font-mono">{value}</div>
        
        {trending && (
          <p className="text-xs flex items-center mt-1">
            <span className={cn(
              "mr-1",
              trending === 'up' && "text-neural",
              trending === 'down' && "text-destructive",
              trending === 'stable' && "text-muted-foreground"
            )}>
              {trending === 'up' && '↑'}
              {trending === 'down' && '↓'}
              {trending === 'stable' && '→'}
            </span>
            <span className="text-muted-foreground">{trendValue}</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
};
