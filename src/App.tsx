
import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProductionSetupScript } from "@/utils/productionSetupScript";
import { SetupScript } from "@/utils/setupScript";
import { useEffect, useState } from "react";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { LoadingFallback } from "./components/LoadingFallback";
import {
  LazyDashboard,
  LazyTimelineViewer,
  LazyScenarioBuilder,
  LazyDataFeeds,
  LazySettings,
  LazyLogin,
  LazyAuth,
  LazySetup,
  LazyNotFound
} from "./components/LazyComponents";
import Index from "./pages/Index";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Optimize QueryClient for production
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

const App = () => {
  const [isSetupComplete, setIsSetupComplete] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    const checkSetupStatus = async () => {
      try {
        console.log('App: Checking setup status...');
        
        // Try production method first
        let setupComplete = false;
        try {
          setupComplete = await ProductionSetupScript.isSetupComplete();
          console.log('App: Production setup check result:', setupComplete);
          setConnectionError(null);
        } catch (error) {
          console.log('App: Production setup check failed, trying legacy method:', error);
          setConnectionError('Database connection issues - using offline mode');
          // Fall back to legacy method
          setupComplete = SetupScript.isSetupComplete();
          console.log('App: Legacy setup check result:', setupComplete);
        }
        
        setIsSetupComplete(setupComplete);
      } catch (error) {
        console.error('App: Error checking setup status:', error);
        setConnectionError('Connection error - using offline mode');
        // Fall back to localStorage check
        setIsSetupComplete(SetupScript.isSetupComplete());
      } finally {
        setIsLoading(false);
      }
    };

    checkSetupStatus();
  }, []);

  if (isLoading) {
    return (
      <div>
        <LoadingFallback message="Initializing Looking Glass..." />
        {connectionError && (
          <div className="fixed bottom-4 right-4 bg-amber-950/90 border border-amber-800 text-amber-200 px-4 py-2 rounded text-sm font-mono">
            ⚠️ {connectionError}
          </div>
        )}
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {connectionError && (
            <div className="fixed top-0 left-0 right-0 bg-amber-950/20 border-b border-amber-800 text-amber-200 px-4 py-2 text-sm font-mono z-50">
              ⚠️ {connectionError}
            </div>
          )}
          <BrowserRouter>
            <AuthProvider>
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  {/* Setup route - only accessible if setup is not complete */}
                  {!isSetupComplete && (
                    <Route path="/setup" element={<LazySetup />} />
                  )}
                  
                  {/* Redirect to setup if not completed */}
                  {!isSetupComplete && (
                    <Route path="*" element={<Navigate to="/setup" replace />} />
                  )}
                  
                  {/* Normal routes - only accessible if setup is complete */}
                  {isSetupComplete && (
                    <>
                      <Route path="/" element={<Index />} />
                      <Route path="/login" element={<LazyLogin />} />
                      <Route path="/auth" element={<LazyAuth />} />
                      <Route path="/dashboard" element={
                        <ProtectedRoute>
                          <LazyDashboard />
                        </ProtectedRoute>
                      } />
                      <Route path="/timeline" element={
                        <ProtectedRoute>
                          <LazyTimelineViewer />
                        </ProtectedRoute>
                      } />
                      <Route path="/scenarios" element={
                        <ProtectedRoute>
                          <LazyScenarioBuilder />
                        </ProtectedRoute>
                      } />
                      <Route path="/data-feeds" element={
                        <ProtectedRoute>
                          <LazyDataFeeds />
                        </ProtectedRoute>
                      } />
                      <Route path="/settings" element={
                        <ProtectedRoute>
                          <LazySettings />
                        </ProtectedRoute>
                      } />
                      <Route path="*" element={<LazyNotFound />} />
                    </>
                  )}
                </Routes>
              </Suspense>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
