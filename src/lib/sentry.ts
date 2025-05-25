import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { Replay } from '@sentry/replay';

export const initSentry = () => {
  if (import.meta.env.PROD) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [
        new BrowserTracing({
          tracePropagationTargets: ['localhost', /^https:\/\/yourdomain\.com/],
        }),
        new Replay(),
      ],
      // Performance Monitoring
      tracesSampleRate: 1.0, // Capture 100% of transactions
      // Session Replay
      replaysSessionSampleRate: 0.1, // Sample 10% of sessions
      replaysOnErrorSampleRate: 1.0, // Sample 100% of sessions with errors
    });
  }
};

export const captureException = (error: Error, context?: Record<string, unknown>) => {
  if (import.meta.env.PROD) {
    Sentry.captureException(error, {
      extra: context,
    });
  } else {
    console.error('Error:', error, 'Context:', context);
  }
};

export const captureMessage = (message: string, level: Sentry.SeverityLevel = 'info') => {
  if (import.meta.env.PROD) {
    Sentry.captureMessage(message, {
      level,
    });
  } else {
    console.log(`[${level.toUpperCase()}] ${message}`);
  }
}; 