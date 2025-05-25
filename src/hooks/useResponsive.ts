import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ResponsiveState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  currentBreakpoint: Breakpoint;
  isLandscape: boolean;
  isPortrait: boolean;
}

export const useResponsive = (): ResponsiveState => {
  const theme = useTheme();
  const [state, setState] = useState<ResponsiveState>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    currentBreakpoint: 'xs',
    isLandscape: false,
    isPortrait: false,
  });

  // Check if screen is in landscape mode
  const isLandscape = useMediaQuery('(orientation: landscape)');

  // Check breakpoints
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const isSm = useMediaQuery(theme.breakpoints.only('sm'));
  const isMd = useMediaQuery(theme.breakpoints.only('md'));
  const isLg = useMediaQuery(theme.breakpoints.only('lg'));
  const isXl = useMediaQuery(theme.breakpoints.only('xl'));

  useEffect(() => {
    const currentBreakpoint = isXs
      ? 'xs'
      : isSm
      ? 'sm'
      : isMd
      ? 'md'
      : isLg
      ? 'lg'
      : 'xl';

    setState({
      isMobile: isXs || isSm,
      isTablet: isMd,
      isDesktop: isLg || isXl,
      currentBreakpoint,
      isLandscape,
      isPortrait: !isLandscape,
    });
  }, [isXs, isSm, isMd, isLg, isXl, isLandscape]);

  return state;
};

// Helper function to get responsive values based on breakpoint
export const getResponsiveValue = <T>(
  values: Partial<Record<Breakpoint, T>>,
  currentBreakpoint: Breakpoint,
  defaultValue: T
): T => {
  const breakpoints: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl'];
  const currentIndex = breakpoints.indexOf(currentBreakpoint);

  // Find the closest breakpoint that has a value
  for (let i = currentIndex; i >= 0; i--) {
    const breakpoint = breakpoints[i];
    if (values[breakpoint] !== undefined) {
      return values[breakpoint]!;
    }
  }

  return defaultValue;
}; 