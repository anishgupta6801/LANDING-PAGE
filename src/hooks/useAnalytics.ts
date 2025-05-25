import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

interface AnalyticsEvent {
  name: string;
  category?: string;
  action?: string;
  label?: string;
  value?: number;
  properties?: Record<string, unknown>;
}

interface AnalyticsOptions {
  trackingId?: string;
  debug?: boolean;
  userId?: string;
  customDimensions?: Record<string, string>;
}

declare global {
  interface Window {
    gtag: (
      command: string,
      action: string,
      params?: Record<string, unknown>
    ) => void;
    dataLayer: unknown[];
  }
}

export const useAnalytics = (options: AnalyticsOptions = {}) => {
  const {
    trackingId = import.meta.env.VITE_GA_TRACKING_ID,
    debug = false,
    userId,
    customDimensions,
  } = options;

  const location = useLocation();

  // Initialize Google Analytics
  useEffect(() => {
    if (!trackingId) return;

    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.gtag = function (...args) {
      window.dataLayer.push(args);
    };

    window.gtag('js', new Date().toISOString());
    window.gtag('config', trackingId, {
      debug_mode: debug,
      ...(userId && { user_id: userId }),
      ...customDimensions,
    });

    return () => {
      document.head.removeChild(script);
    };
  }, [trackingId, debug, userId, customDimensions]);

  // Track page views
  useEffect(() => {
    if (!trackingId) return;

    window.gtag('event', 'page_view', {
      page_path: location.pathname + location.search,
      page_title: document.title,
    });
  }, [location, trackingId]);

  // Track custom events
  const trackEvent = useCallback(
    (event: AnalyticsEvent) => {
      if (!trackingId) return;

      const { name, category, action, label, value, properties } = event;

      window.gtag('event', name, {
        event_category: category,
        event_action: action,
        event_label: label,
        value,
        ...properties,
      });
    },
    [trackingId]
  );

  // Track user timing
  const trackTiming = useCallback(
    (category: string, variable: string, value: number, label?: string) => {
      if (!trackingId) return;

      window.gtag('event', 'timing_complete', {
        timing_category: category,
        timing_var: variable,
        timing_value: value,
        timing_label: label,
      });
    },
    [trackingId]
  );

  // Track exceptions
  const trackException = useCallback(
    (description: string, fatal = false) => {
      if (!trackingId) return;

      window.gtag('event', 'exception', {
        description,
        fatal,
      });
    },
    [trackingId]
  );

  // Track user engagement
  const trackEngagement = useCallback(
    (type: string, properties?: Record<string, unknown>) => {
      if (!trackingId) return;

      window.gtag('event', 'user_engagement', {
        engagement_type: type,
        ...properties,
      });
    },
    [trackingId]
  );

  return {
    trackEvent,
    trackTiming,
    trackException,
    trackEngagement,
  };
}; 