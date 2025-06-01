
import { lazy } from 'react';
import { ComponentType } from 'react';

// Lazy load all main pages for code splitting
export const LazyDashboard = lazy(() => import('../pages/Dashboard'));
export const LazyTimelineViewer = lazy(() => import('../pages/TimelineViewer'));
export const LazyScenarioBuilder = lazy(() => import('../pages/ScenarioBuilder'));
export const LazyDataFeeds = lazy(() => import('../pages/DataFeeds'));
export const LazySettings = lazy(() => import('../pages/Settings'));
export const LazyLogin = lazy(() => import('../pages/Login'));
export const LazyAuth = lazy(() => import('../pages/Auth'));
export const LazySetup = lazy(() => import('../pages/Setup'));
export const LazyNotFound = lazy(() => import('../pages/NotFound'));

// Lazy load heavy components - fix for named exports
export const LazyAdminPanel = lazy(() => import('./AdminPanel').then(module => ({ default: module.AdminPanel })));
export const LazySetupWizard = lazy(() => import('./SetupWizard').then(module => ({ default: module.SetupWizard })));

// Performance-optimized lazy loading wrapper with retry logic
export const createLazyComponent = <T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  componentName: string
): ComponentType<any> => {
  return lazy(async () => {
    try {
      return await importFn();
    } catch (error) {
      console.error(`Failed to load ${componentName}:`, error);
      // Retry once after a short delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return await importFn();
    }
  });
};
