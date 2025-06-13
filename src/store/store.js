// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import { api } from '../services/api';

// Create a default reducer to prevent empty reducer object
const defaultReducer = (state = {}, action) => {
  return state;
};

// Create the store
export const store = configureStore({
  reducer: {
    // Always include at least one reducer to prevent combineReducers errors
    app: defaultReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          // Ignore these action types for serialization checks
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/REGISTER',
        ],
      },
    }).concat(api.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

// Export types for TypeScript (uncomment if using TypeScript)
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;