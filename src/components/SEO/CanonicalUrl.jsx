// components/SEO/CanonicalUrl.jsx
'use client';

import { usePathname } from 'next/navigation';
import Head from 'next/head';

export default function CanonicalUrl({ path, domain = 'https://www.ajithkumarr.com' }) {
  const pathname = usePathname();
  
  // Use provided path or current pathname
  const canonicalPath = path || pathname;
  
  // Ensure path starts with a slash
  const formattedPath = canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`;
  
  // Construct full canonical URL
  const canonicalUrl = `${domain}${formattedPath}`;
  
  return (
    <Head>
      <link rel="canonical" href={canonicalUrl} />
    </Head>
  );
}