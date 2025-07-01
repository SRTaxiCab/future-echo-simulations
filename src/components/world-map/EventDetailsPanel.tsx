import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, TrendingUp } from 'lucide-react';
import { type GlobalEvent } from './data';

interface EventDetailsPanelProps {
  selectedEvent: GlobalEvent | null;
}

export const EventDetailsPanel: React.FC<EventDetailsPanelProps> = ({ selectedEvent }) => {
  if (!selectedEvent) return null;

  return (
    <Card className="border-cyber">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-mono flex items-center">
          <MapPin className="h-4 w-4 mr-2" />
          Event Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <h4 className="font-medium">{selectedEvent.title}</h4>
          <p className="text-sm text-muted-foreground">{selectedEvent.country}</p>
        </div>
        
        <div className="flex gap-2">
          <Badge variant={selectedEvent.impact === 'high' ? 'destructive' : 'secondary'}>
            {selectedEvent.impact} impact
          </Badge>
          <Badge variant="outline">
            {selectedEvent.probability}% probability
          </Badge>
        </div>

        <p className="text-sm">{selectedEvent.description}</p>

        <div>
          <h5 className="text-sm font-medium mb-2 flex items-center">
            <TrendingUp className="h-4 w-4 mr-1" />
            Predicted Effects
          </h5>
          <ul className="text-xs space-y-1">
            {selectedEvent.predictedEffects.map((effect, index) => (
              <li key={index} className="flex items-start">
                <span className="text-cyber mr-1">•</span>
                {effect}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};