import { Suspense, lazy, ComponentType } from 'react';
import { Box, CircularProgress } from '@mui/material';

interface LazyLoadOptions {
  fallback?: React.ReactNode;
  timeout?: number;
}

const defaultFallback = (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '200px',
    }}
  >
    <CircularProgress />
  </Box>
);

export const useLazyLoad = <T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: LazyLoadOptions = {}
) => {
  const {
    fallback = defaultFallback,
    timeout = 3000, // Default timeout of 3 seconds
  } = options;

  const LazyComponent = lazy(() => {
    return Promise.race([
      importFn(),
      new Promise<{ default: T }>((_, reject) =>
        setTimeout(
          () => reject(new Error(`Component load timeout after ${timeout}ms`)),
          timeout
        )
      ),
    ]);
  });

  return (props: React.ComponentProps<T>) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
}; 