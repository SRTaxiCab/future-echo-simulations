import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { globalEvents, type GlobalEvent } from './data';

interface ActiveEventsPanelProps {
  selectedEvent: GlobalEvent | null;
  onEventSelect: (event: GlobalEvent) => void;
}

export const ActiveEventsPanel: React.FC<ActiveEventsPanelProps> = ({ 
  selectedEvent, 
  onEventSelect 
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-mono flex items-center">
          <AlertTriangle className="h-4 w-4 mr-2" />
          Active Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {globalEvents.map((event) => (
            <div 
              key={event.id}
              className={`p-2 rounded border cursor-pointer transition-colors ${
                selectedEvent?.id === event.id ? 'border-cyber bg-cyber/10' : 'border-border hover:border-cyber/50'
              }`}
              onClick={() => onEventSelect(event)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h5 className="text-sm font-medium">{event.title}</h5>
                  <p className="text-xs text-muted-foreground">{event.country}</p>
                </div>
                <div className="text-xs font-mono">{event.probability}%</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};