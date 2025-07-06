
import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { SettingsProvider } from "@/context/SettingsContext";
import { ProductionSetupScript } from "@/utils/productionSetupScript";
import { SetupScript } from "@/utils/setupScript";
import { useEffect, useState } from "react";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { LoadingFallback } from "./components/LoadingFallback";
import {
  LazyDashboard,
  LazyTimelineViewer,
  LazyMap,
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: (failureCount, error: any) => {
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

  useEffect(() => {
    const checkSetupStatus = async () => {
      try {
        console.log('App: Checking setup status...');
        
        // Check localStorage first for immediate response
        const localSetup = SetupScript.isSetupComplete();
        console.log('Local setup status:', localSetup);
        
        // If locally complete, set state immediately
        if (localSetup) {
          setIsSetupComplete(true);
          setIsLoading(false);
          return;
        }
        
        // If not locally complete, check production
        try {
          const prodSetup = await ProductionSetupScript.isSetupComplete();
          console.log('Production setup check result:', prodSetup);
          setIsSetupComplete(prodSetup);
        } catch (error) {
          console.log('Production setup check failed, using local result:', error);
          setIsSetupComplete(localSetup);
        }
      } catch (error) {
        console.error('App: Error checking setup status:', error);
        setIsSetupComplete(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSetupStatus();
  }, []);

  if (isLoading) {
    return <LoadingFallback message="Initializing Looking Glass..." />;
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <SettingsProvider>
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    {/* Setup route - only if setup not complete */}
                    <Route path="/setup" element={
                      isSetupComplete ? <Navigate to="/dashboard" replace /> : <LazySetup />
                    } />
                    
                    {/* Root route - redirect based on setup status */}
                    <Route path="/" element={
                      isSetupComplete ? <Navigate to="/dashboard" replace /> : <Navigate to="/setup" replace />
                    } />
                    
                    {/* Auth routes - only if setup complete */}
                    <Route path="/login" element={
                      isSetupComplete ? <Navigate to="/auth" replace /> : <Navigate to="/setup" replace />
                    } />
                    
                    <Route path="/auth" element={
                      isSetupComplete ? <LazyAuth /> : <Navigate to="/setup" replace />
                    } />
                    
                    {/* Protected application routes */}
                    <Route path="/dashboard" element={
                      isSetupComplete ? (
                        <ProtectedRoute>
                          <LazyDashboard />
                        </ProtectedRoute>
                      ) : <Navigate to="/setup" replace />
                    } />
                    
                    <Route path="/timeline" element={
                      isSetupComplete ? (
                        <ProtectedRoute>
                          <LazyTimelineViewer />
                        </ProtectedRoute>
                      ) : <Navigate to="/setup" replace />
                    } />
                    
                    <Route path="/map" element={
                      isSetupComplete ? (
                        <ProtectedRoute>
                          <LazyMap />
                        </ProtectedRoute>
                      ) : <Navigate to="/setup" replace />
                    } />
                    
                    {/* Handle both /scenario and /scenarios routes */}
                    <Route path="/scenario" element={
                      isSetupComplete ? (
                        <ProtectedRoute>
                          <LazyScenarioBuilder />
                        </ProtectedRoute>
                      ) : <Navigate to="/setup" replace />
                    } />
                    
                    <Route path="/scenarios" element={
                      isSetupComplete ? (
                        <ProtectedRoute>
                          <LazyScenarioBuilder />
                        </ProtectedRoute>
                      ) : <Navigate to="/setup" replace />
                    } />
                    
                    {/* Data feeds routes - handle both /data-feeds and /feeds */}
                    <Route path="/data-feeds" element={
                      isSetupComplete ? (
                        <ProtectedRoute>
                          <LazyDataFeeds />
                        </ProtectedRoute>
                      ) : <Navigate to="/setup" replace />
                    } />
                    
                    <Route path="/feeds" element={
                      isSetupComplete ? (
                        <ProtectedRoute>
                          <LazyDataFeeds />
                        </ProtectedRoute>
                      ) : <Navigate to="/setup" replace />
                    } />
                    
                    <Route path="/settings" element={
                      isSetupComplete ? (
                        <ProtectedRoute>
                          <LazySettings />
                        </ProtectedRoute>
                      ) : <Navigate to="/setup" replace />
                    } />
                    
                    <Route path="*" element={<LazyNotFound />} />
                  </Routes>
                </Suspense>
              </SettingsProvider>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
