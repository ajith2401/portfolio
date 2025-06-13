// src/components/providers/ReduxProvider.jsx
'use client';

import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

// Create a basic store configuration
// You can customize this based on your existing Redux setup
const store = configureStore({
  reducer: {
    // Add your reducers here
    // Example:
    // auth: authReducer,
    // ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export default function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}

// Export types for TypeScript (if you're using TypeScript)
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;