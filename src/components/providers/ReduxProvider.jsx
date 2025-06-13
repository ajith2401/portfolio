// src/components/providers/ReduxProvider.jsx
'use client';

import { Provider } from 'react-redux';
import { store } from '../../store/store'; // Use the existing store configuration

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