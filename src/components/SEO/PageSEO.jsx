// src/components/SEO/PageSEO.jsx
'use client';

import { useEffect } from 'react';
import Head from 'next/head';
import { usePathname } from 'next/navigation';

export default function PageSEO({ 
  title, 
  description, 
  ogImage = '/opengraph-image.jpg',
  ogType = 'website',
  noindex = false,
  canonicalPath = null
}) {
  const pathname = usePathname();
  const baseUrl = 'https://www.ajithkumarr.com';
  const canonicalUrl = `${baseUrl}${canonicalPath || pathname}`;
  
  // Add Schema.org structured data for better indexing
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": canonicalUrl,
    "url": canonicalUrl,
    "name": title,
    "description": description,
    "isPartOf": {
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
      "url": baseUrl,
      "name": "Ajithkumar - Full Stack Developer, Poet, Writer & Lyricist",
      "publisher": {
        "@type": "Person",
        "@id": `${baseUrl}/#ajithkumar`
      }
    }
  };

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Control indexing */}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      {!noindex && <meta name="robots" content="index,follow" />}
      
      {/* OpenGraph metadata */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={`${baseUrl}${ogImage}`} />
      
      {/* Twitter metadata */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${baseUrl}${ogImage}`} />
      
      {/* Schema.org structured data */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />
    </Head>
  );
}