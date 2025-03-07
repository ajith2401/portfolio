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
      <p className="font-bold">You&apos;re offline</p>
      <p>Some content may not be available. Please check your connection.</p>
    </div>
  );
}