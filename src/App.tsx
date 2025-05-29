
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { SetupScript } from "@/utils/setupScript";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Auth from "./pages/Auth";
import Setup from "./pages/Setup";
import TimelineViewer from "./pages/TimelineViewer";
import ScenarioBuilder from "./pages/ScenarioBuilder";
import DataFeeds from "./pages/DataFeeds";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => {
  // Check if setup is completed
  const isSetupComplete = SetupScript.isSetupComplete();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Setup route - only accessible if setup is not complete */}
              {!isSetupComplete && (
                <Route path="/setup" element={<Setup />} />
              )}
              
              {/* Redirect to setup if not completed */}
              {!isSetupComplete && (
                <Route path="*" element={<Navigate to="/setup" replace />} />
              )}
              
              {/* Normal routes - only accessible if setup is complete */}
              {isSetupComplete && (
                <>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/timeline" element={
                    <ProtectedRoute>
                      <TimelineViewer />
                    </ProtectedRoute>
                  } />
                  <Route path="/scenarios" element={
                    <ProtectedRoute>
                      <ScenarioBuilder />
                    </ProtectedRoute>
                  } />
                  <Route path="/data-feeds" element={
                    <ProtectedRoute>
                      <DataFeeds />
                    </ProtectedRoute>
                  } />
                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  } />
                  <Route path="*" element={<NotFound />} />
                </>
              )}
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
