
import React from 'react';
import { useUserRole } from '@/hooks/useUserRole';
import { cn } from '@/lib/utils';

interface ClassifiedContentProps {
  children: React.ReactNode;
  classificationLevel: 'unclassified' | 'confidential' | 'secret' | 'top_secret';
  className?: string;
}

export const ClassifiedContent: React.FC<ClassifiedContentProps> = ({
  children,
  classificationLevel,
  className
}) => {
  const { hasClassificationLevel, isLoading } = useUserRole();

  if (isLoading) {
    return (
      <div className={cn("animate-pulse bg-muted/50 rounded", className)}>
        <span className="text-muted-foreground">Loading clearance...</span>
      </div>
    );
  }

  const hasAccess = hasClassificationLevel(classificationLevel);

  if (!hasAccess) {
    return (
      <div className={cn("relative", className)}>
        <div className="blur-sm select-none pointer-events-none">
          {children}
        </div>
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div className="bg-red-900/90 text-red-200 px-3 py-1 rounded text-xs font-mono border border-red-700">
            CLASSIFIED - {classificationLevel.toUpperCase()} CLEARANCE REQUIRED
          </div>
        </div>
      </div>
    );
  }

  return <div className={className}>{children}</div>;
};
