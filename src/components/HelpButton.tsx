
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { OperationsManual } from './OperationsManual';
import { BookOpen } from 'lucide-react';

export const HelpButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="font-mono">
          <BookOpen className="h-4 w-4 mr-2" />
          Operations Manual
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="font-mono">Project Looking Glass - Operations Manual</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <OperationsManual />
        </div>
      </DialogContent>
    </Dialog>
  );
};
