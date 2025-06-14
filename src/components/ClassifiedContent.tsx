
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
  const { hasClassificationLevel, isLoading, userRole } = useUserRole();

  if (isLoading) {
    return (
      <div className={cn("animate-pulse bg-muted/20 rounded p-4 border border-cyber/30", className)}>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-cyber border-t-transparent rounded-full animate-spin"></div>
          <span className="text-cyber font-mono text-sm">Verifying clearance level...</span>
        </div>
      </div>
    );
  }

  const hasAccess = hasClassificationLevel(classificationLevel);

  if (!hasAccess) {
    return (
      <div className={cn("relative overflow-hidden rounded border border-red-700/50", className)}>
        <div className="blur-sm select-none pointer-events-none opacity-30">
          {children}
        </div>
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
          <div className="bg-red-900/90 text-red-200 px-4 py-2 rounded border border-red-700 font-mono text-xs text-center">
            <div className="font-bold">⚠️ CLASSIFIED</div>
            <div className="mt-1">{classificationLevel.toUpperCase().replace('_', ' ')} CLEARANCE REQUIRED</div>
            <div className="mt-2 text-red-300/80">
              Current: {userRole?.classification_clearance?.toUpperCase().replace('_', ' ') || 'NONE'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <div className={className}>{children}</div>;
};
