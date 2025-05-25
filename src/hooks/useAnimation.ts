import { useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';

interface AnimationOptions {
  threshold?: number;
  triggerOnce?: boolean;
  delay?: number;
  duration?: number;
  easing?: string;
}

interface AnimationState {
  isVisible: boolean;
  isAnimating: boolean;
  ref: (node?: Element | null) => void;
}

export const useAnimation = (options: AnimationOptions = {}): AnimationState => {
  const {
    threshold = 0.1,
    triggerOnce = true,
    delay = 0,
    duration = 300,
    easing = 'ease-in-out',
  } = options;

  const [isAnimating, setIsAnimating] = useState(false);
  const { ref, inView } = useInView({
    threshold,
    triggerOnce,
  });

  const startAnimation = useCallback(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, duration + delay);

    return () => clearTimeout(timer);
  }, [delay, duration]);

  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => {
        startAnimation();
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [inView, delay, startAnimation]);

  return {
    isVisible: inView,
    isAnimating,
    ref,
  };
};

// Helper function to generate CSS animation properties
export const getAnimationStyles = (
  isVisible: boolean,
  isAnimating: boolean,
  options: {
    duration?: number;
    easing?: string;
    transform?: string;
    opacity?: number;
  } = {}
) => {
  const {
    duration = 300,
    easing = 'ease-in-out',
    transform = 'translateY(20px)',
    opacity = 0,
  } = options;

  return {
    opacity: isVisible ? 1 : opacity,
    transform: isVisible ? 'none' : transform,
    transition: isAnimating
      ? `all ${duration}ms ${easing}`
      : 'none',
    visibility: isVisible ? 'visible' : 'hidden',
  };
}; 