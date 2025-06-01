
import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProductionSetupScript } from "@/utils/productionSetupScript";
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

  useEffect(() => {
    const checkSetupStatus = async () => {
      try {
        const setupComplete = await ProductionSetupScript.isSetupComplete();
        setIsSetupComplete(setupComplete);
      } catch (error) {
        console.error('Error checking setup status:', error);
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
