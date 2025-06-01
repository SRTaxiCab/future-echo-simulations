
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });

    // In production, you might want to log this to an error reporting service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
          <Card className="cyber-border max-w-md w-full">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <AlertTriangle className="h-12 w-12 text-red-400" />
              </div>
              <CardTitle className="font-mono text-red-300">System Error Detected</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center text-sm text-muted-foreground">
                <p>An unexpected error has occurred in the Looking Glass system.</p>
                <p className="mt-2">Error Reference: <span className="font-mono text-red-400">LG-{Date.now().toString(36).toUpperCase()}</span></p>
              </div>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-4 p-3 bg-red-950/20 border border-red-900/50 rounded text-xs">
                  <summary className="cursor-pointer text-red-300 font-mono">Debug Information</summary>
                  <div className="mt-2 text-red-200 font-mono">
                    <p><strong>Error:</strong> {this.state.error.message}</p>
                    <p><strong>Stack:</strong></p>
                    <pre className="mt-1 overflow-auto text-xs">{this.state.error.stack}</pre>
                  </div>
                </details>
              )}

              <div className="flex gap-2 justify-center">
                <Button
                  onClick={this.handleResetError}
                  variant="outline"
                  size="sm"
                  className="font-mono"
                >
                  Try Again
                </Button>
                <Button
                  onClick={this.handleReload}
                  size="sm"
                  className="font-mono"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reload System
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
