// src/app/providers.jsx
'use client';

import { Provider } from 'react-redux';
import { store } from '../store/store';
import { useEffect, useState } from 'react';
import ErrorBoundary from '../components/ErrorBoundary';

export function Providers({ children }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Prevent hydration mismatch by not rendering Redux provider on server
  if (!isClient) {
    return <ErrorBoundary>{children}</ErrorBoundary>;
  }

  return (
    <ErrorBoundary>
      <Provider store={store}>
        {children}
      </Provider>
    </ErrorBoundary>
  );
}