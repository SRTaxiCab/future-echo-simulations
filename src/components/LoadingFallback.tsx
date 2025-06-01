
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingFallbackProps {
  message?: string;
  minimal?: boolean;
}

export const LoadingFallback: React.FC<LoadingFallbackProps> = ({ 
  message = "Loading...", 
  minimal = false 
}) => {
  if (minimal) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-cyber" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="h-16 w-16 mx-auto relative">
            <div className="absolute inset-0 border-2 border-transparent border-t-cyber rounded-full animate-spin"></div>
            <div 
              className="absolute inset-2 border border-transparent border-r-cyber/50 rounded-full animate-spin" 
              style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}
            ></div>
          </div>
        </div>
        <div className="text-cyber text-lg font-mono">{message}</div>
        <div className="text-cyber/60 text-sm font-mono">
          Initializing secure connection...
        </div>
      </div>
    </div>
  );
};
