// src/components/SEO/CanonicalLink.jsx
'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function CanonicalLink({ customPath = null }) {
  const pathname = usePathname();
  
  useEffect(() => {
    // Remove any existing canonical links to avoid duplicates
    const existingCanonicals = document.querySelectorAll('link[rel="canonical"]');
    existingCanonicals.forEach(link => link.remove());
    
    // Create and add the canonical link
    const link = document.createElement('link');
    link.rel = 'canonical';
    link.href = `https://www.ajithkumarr.com${customPath || pathname}`;
    document.head.appendChild(link);
    
    return () => {
      // Clean up when component unmounts
      link.remove();
    };
  }, [pathname, customPath]);
  
  return null;
}