
import { useEffect, useRef } from 'react';

export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  bundleSize?: number;
}

export const usePerformanceMonitor = (componentName: string) => {
  const startTimeRef = useRef<number>(performance.now());
  const metricsRef = useRef<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0
  });

  useEffect(() => {
    const endTime = performance.now();
    const renderTime = endTime - startTimeRef.current;
    
    metricsRef.current = {
      ...metricsRef.current,
      renderTime,
      loadTime: endTime
    };

    // Log performance metrics in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 Performance [${componentName}]:`, {
        renderTime: `${renderTime.toFixed(2)}ms`,
        loadTime: `${endTime.toFixed(2)}ms`
      });
    }

    // Report to analytics in production (if needed)
    if (process.env.NODE_ENV === 'production' && renderTime > 100) {
      console.warn(`⚠️ Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
    }
  }, [componentName]);

  const logCustomMetric = (name: string, value: number) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 Custom Metric [${componentName}] ${name}:`, `${value.toFixed(2)}ms`);
    }
  };

  return {
    metrics: metricsRef.current,
    logCustomMetric
  };
};
