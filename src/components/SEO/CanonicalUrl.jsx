// components/SEO/CanonicalUrl.jsx
'use client';

import { usePathname } from 'next/navigation';
import Head from 'next/head';

export default function CanonicalUrl({ path }) {
  const pathname = usePathname();
  const baseUrl = 'https://www.ajithkumarr.com';
  
  // Use provided path or current pathname
  const canonicalPath = path || pathname;
  const canonicalUrl = `${baseUrl}${canonicalPath}`;
  
  return (
    <Head>
      <link rel="canonical" href={canonicalUrl} />
    </Head>
  );
}