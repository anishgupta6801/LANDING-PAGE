import { useEffect, useRef } from 'react';
import * as Sentry from '@sentry/react';

interface PerformanceMetrics {
  componentName: string;
  renderTime: number;
  mountTime: number;
  [key: string]: string | number;
}

export const usePerformanceMonitor = (componentName: string) => {
  const startTime = useRef(performance.now());
  const mountTime = useRef(0);

  useEffect(() => {
    const endTime = performance.now();
    const renderTime = endTime - startTime.current;

    // Record initial mount time
    if (mountTime.current === 0) {
      mountTime.current = renderTime;
    }

    // Only report if render time is significant (> 16ms = 1 frame)
    if (renderTime > 16) {
      const metrics: PerformanceMetrics = {
        componentName,
        renderTime,
        mountTime: mountTime.current,
      };

      Sentry.addBreadcrumb({
        category: 'performance',
        message: `Component ${componentName} render time`,
        level: 'info',
        data: metrics,
      });

      // If render time is very high (> 100ms), capture as a performance issue
      if (renderTime > 100) {
        Sentry.captureMessage(`Slow component render: ${componentName}`, {
          level: 'warning',
          extra: metrics,
        });
      }
    }
  });
};

export const trackUserInteraction = (
  action: string,
  details?: Record<string, unknown>
) => {
  Sentry.addBreadcrumb({
    category: 'user',
    message: `User action: ${action}`,
    level: 'info',
    data: details,
  });
}; 