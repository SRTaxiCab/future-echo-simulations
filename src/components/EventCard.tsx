
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface Event {
  id: string;
  title: string;
  date: string;
  trend: string;
  keywords: string[];
  probability?: number;
  impact?: 'low' | 'medium' | 'high';
}

interface EventCardProps {
  event: Event;
  className?: string;
}

export const EventCard = ({ event, className }: EventCardProps) => {
  const getImpactColor = (impact?: 'low' | 'medium' | 'high') => {
    switch (impact) {
      case 'low': return 'bg-blue-600/20 text-blue-400';
      case 'medium': return 'bg-yellow-600/20 text-yellow-400';
      case 'high': return 'bg-destructive/20 text-destructive';
      default: return 'bg-muted/20 text-muted-foreground';
    }
  };
  
  return (
    <Card className={cn("cyber-border card-glow overflow-hidden", className)}>
      <CardHeader className="bg-card/50 py-2 px-4 space-y-0">
        <div className="flex justify-between items-center">
          <h3 className="font-mono text-sm font-medium">{event.title}</h3>
          <span className="text-xs text-muted-foreground">{event.date}</span>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <div>
          <div className="text-xs uppercase text-muted-foreground mb-1">Trend</div>
          <p className="text-sm">{event.trend}</p>
        </div>
        
        <div>
          <div className="text-xs uppercase text-muted-foreground mb-1">Keywords</div>
          <div className="flex flex-wrap gap-1.5">
            {event.keywords.map((keyword, i) => (
              <Badge key={i} variant="outline" className="bg-card/50 text-xs">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
        
        {(event.probability !== undefined || event.impact !== undefined) && (
          <div className="flex justify-between text-xs mt-2">
            {event.probability !== undefined && (
              <div>
                <span className="text-muted-foreground">Probability:</span>{' '}
                <span className="font-mono">{event.probability}%</span>
              </div>
            )}
            
            {event.impact && (
              <Badge className={cn("text-[10px]", getImpactColor(event.impact))}>
                {event.impact.toUpperCase()} IMPACT
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
