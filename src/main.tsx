import React from 'react';
import ReactDOM from 'react-dom/client';
import { initSentry } from './lib/sentry';
import ErrorBoundary from './components/ErrorBoundary';
import App from './App';
import './index.css';

// Initialize Sentry in production
initSentry();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
