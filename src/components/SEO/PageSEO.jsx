// src/components/SEO/PageSEO.jsx
'use client';

import Head from 'next/head';
import { usePathname } from 'next/navigation';

export default function PageSEO({ 
  title, 
  description, 
  ogImage = '/opengraph-image.jpg',
  ogType = 'website',
  noindex = false,
  canonicalPath = null,
  publishedAt = null,
  updatedAt = null,
  author = 'Ajithkumar',
  keywords = [],
  category = null,
  tags = [],
  readTime = null,
  wordCount = null
}) {
  const pathname = usePathname();
  const baseUrl = 'https://www.ajithkumarr.com';
  const canonicalUrl = `${baseUrl}${canonicalPath || pathname}`;
  
  // Ensure description is within optimal length
  const optimizedDescription = description && description.length > 160 
    ? description.substring(0, 157) + '...' 
    : description;

  // Generate keywords string
  const keywordsString = [
    ...keywords,
    'Ajithkumar',
    'Tamil writer',
    'Full stack developer',
    'React.js',
    'Next.js',
    'Tamil poetry',
    'MERN stack'
  ].filter(Boolean).join(', ');

  // Enhanced Schema.org structured data
  const getSchemaData = () => {
    const baseSchema = {
      "@context": "https://schema.org",
      "@id": canonicalUrl,
      "url": canonicalUrl,
      "name": title,
      "headline": title,
      "description": optimizedDescription,
      "inLanguage": "en-US",
      "author": {
        "@type": "Person",
        "@id": `${baseUrl}/#ajithkumar`,
        "name": author,
        "url": `${baseUrl}/about`,
        "image": `${baseUrl}/images/ajithkumar-portrait.jpg`,
        "sameAs": [
          "https://twitter.com/ajithkumarr",
          "https://github.com/ajith2401",
          "https://www.goodreads.com/author/show/ajithkumarr"
        ],
        "jobTitle": ["Writer", "Poet", "Full Stack Developer"],
        "knowsLanguage": ["Tamil", "English"],
        "nationality": "Indian"
      },
      "publisher": {
        "@type": "Person",
        "@id": `${baseUrl}/#ajithkumar`,
        "name": "Ajithkumar",
        "logo": {
          "@type": "ImageObject",
          "url": `${baseUrl}/images/logo.png`,
          "width": 200,
          "height": 60
        }
      },
      "isPartOf": {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        "url": baseUrl,
        "name": "Ajithkumar - Tamil Writer & Full Stack Developer",
        "description": "Award-winning Tamil writer, poet, and full stack developer sharing technical insights and creative writings.",
        "publisher": {
          "@type": "Person",
          "@id": `${baseUrl}/#ajithkumar`
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${baseUrl}/search?q={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        }
      }
    };

    // Article-specific schema
    if (ogType === 'article') {
      return {
        ...baseSchema,
        "@type": "Article",
        "articleSection": category || "Blog",
        "datePublished": publishedAt,
        "dateModified": updatedAt || publishedAt,
        "wordCount": wordCount,
        "timeRequired": readTime ? `PT${readTime}M` : undefined,
        "keywords": tags.join(', '),
        "articleBody": description,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": canonicalUrl
        },
        "image": {
          "@type": "ImageObject",
          "url": `${baseUrl}${ogImage}`,
          "width": 1200,
          "height": 630
        }
      };
    }

    // CreativeWork schema for poetry/writings
    if (ogType === 'creative-work') {
      return {
        ...baseSchema,
        "@type": "CreativeWork",
        "creativeWorkStatus": "Published",
        "genre": category || "Poetry",
        "inLanguage": pathname.includes('/quill') ? ["ta", "en"] : "en",
        "dateCreated": publishedAt,
        "dateModified": updatedAt || publishedAt,
        "text": description,
        "keywords": tags.join(', ')
      };
    }

    // SoftwareApplication schema for projects
    if (ogType === 'software') {
      return {
        ...baseSchema,
        "@type": "SoftwareApplication",
        "applicationCategory": "WebApplication",
        "operatingSystem": "Web Browser",
        "programmingLanguage": tags.filter(tag => 
          ['JavaScript', 'React', 'Node.js', 'Python', 'MongoDB'].includes(tag)
        ),
        "dateCreated": publishedAt,
        "dateModified": updatedAt || publishedAt
      };
    }

    // Default WebPage schema
    return {
      ...baseSchema,
      "@type": "WebPage",
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": baseUrl
          },
          {
            "@type": "ListItem", 
            "position": 2,
            "name": category || "Page",
            "item": canonicalUrl
          }
        ]
      }
    };
  };

  const schemaData = getSchemaData();

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={optimizedDescription} />
      <meta name="keywords" content={keywordsString} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Robots Meta */}
      <meta 
        name="robots" 
        content={noindex 
          ? "noindex,nofollow" 
          : "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
        } 
      />
      
      {/* Author and Content Info */}
      <meta name="author" content={author} />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Article specific meta tags */}
      {publishedAt && (
        <>
          <meta name="article:published_time" content={publishedAt} />
          <meta name="article:author" content={author} />
          {category && <meta name="article:section" content={category} />}
          {tags.map((tag, index) => (
            <meta key={index} name="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* OpenGraph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={optimizedDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={`${baseUrl}${ogImage}`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="Ajithkumar" />
      <meta property="og:locale" content="en_US" />
      
      {/* OpenGraph Article Tags */}
      {ogType === 'article' && publishedAt && (
        <>
          <meta property="article:published_time" content={publishedAt} />
          <meta property="article:modified_time" content={updatedAt || publishedAt} />
          <meta property="article:author" content={`${baseUrl}/about`} />
          {category && <meta property="article:section" content={category} />}
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@ajithkumarr" />
      <meta name="twitter:creator" content="@ajithkumarr" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={optimizedDescription} />
      <meta name="twitter:image" content={`${baseUrl}${ogImage}`} />
      <meta name="twitter:image:alt" content={title} />

      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#1e40af" />
      <meta name="msapplication-TileColor" content="#1e40af" />
      <meta name="application-name" content="Ajithkumar" />
      
      {/* Structured Data */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(schemaData) 
        }}
      />

      {/* Additional Performance Hints */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
      
      {/* Mobile Optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      <meta name="format-detection" content="telephone=no" />
      
      {/* Security Headers via Meta Tags */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="SAMEORIGIN" />
      
      {/* Favicon and Icons */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
    </Head>
  );
}