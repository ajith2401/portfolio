// src/components/ui/OfflineNotice.jsx
'use client';

import { useEffect, useState } from 'react';

export default function OfflineNotice() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Set up listeners for online/offline events
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);
    
    // Check initial state
    setIsOffline(!navigator.onLine);
    
    // Add event listeners
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    
    // Clean up
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (!isOffline) return null;
  
  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
    <h1 className="text-3xl font-bold mb-4">You&apos;re currently offline</h1>
    <p className="mb-6">It seems you&apos;ve lost your internet connection. Some content might not be available.</p>
    <p>You can still browse previously visited pages while we wait for your connection to return.</p>
    </div>
  );
}