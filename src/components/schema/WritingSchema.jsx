// src/components/schema/WritingSchema.jsx
import React from 'react';

export default function WritingSchema({ writing }) {
  // Skip the schema entirely if writing is not available
  if (!writing) {
    return null;
  }

  // Format dates safely
  const formatDate = (dateValue) => {
    if (!dateValue) return undefined;
    try {
      return new Date(dateValue).toISOString();
    } catch (error) {
      console.error("Date formatting error:", error);
      return undefined;
    }
  };

  // Create a comprehensive schema object with absolutely safe date handling
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `https://ajithkumarr.com/quill/${writing._id}#article`,
    'headline': writing.title || '',
    'name': writing.title || '',
    'description': writing.subtitle || (writing.body ? writing.body.substring(0, 160).replace(/[\r\n]+/g, ' ') : ''),
    'inLanguage': 'ta',
    'datePublished': formatDate(writing.publishedAt || writing.createdAt),
    'dateModified': formatDate(writing.updatedAt || writing.createdAt),
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `https://ajithkumarr.com/quill/${writing._id}`
    },
    'isPartOf': {
      '@type': 'CreativeWork',
      'name': 'Ajithkumar\'s Tamil Poetry Collection',
      'description': 'Collection of Tamil poetry, essays and creative writings by Ajithkumar, published author of 5 Tamil poetry books.',
      'publisher': {
        '@type': 'Person',
        '@id': 'https://ajithkumarr.com/#ajithkumar'
      }
    },
    'image': writing.images?.medium || 'https://ajithkumarr.com/opengraph-image.jpg',
    'author': {
      '@type': 'Person',
      '@id': 'https://ajithkumarr.com/#ajithkumar',
      'name': 'Ajithkumar',
      'url': 'https://ajithkumarr.com',
      'description': 'Tamil writer and poet with 5 published books, exploring themes of feminism, social justice, and human emotions through captivating poetry.',
      'jobTitle': 'Writer and Poet',
      'sameAs': [
        'https://github.com/ajith2401',
        'https://www.linkedin.com/in/ajithkumar-r-a6531a232/',
        'https://www.instagram.com/ajithkumarr'
      ]
    },
    'publisher': {
      '@type': 'Person',
      '@id': 'https://ajithkumarr.com/#ajithkumar',
      'name': 'Ajithkumar',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://ajithkumarr.com/images/logo.png'
      }
    },
    'articleBody': writing.body ? writing.body.substring(0, 500).replace(/[\r\n]+/g, ' ') + '...' : '',
    'articleSection': writing.category?.charAt(0)?.toUpperCase() + writing.category?.slice(1) || 'Poetry',
    'keywords': [`Tamil ${writing.category || 'poetry'}`, 'Ajithkumar writer', 'Tamil literature', 'published Tamil poet', 'feminist poetry', 'social justice writing'].join(', '),
    'wordCount': writing.body ? writing.body.split(/\s+/).length : 0,
    'comment': (writing.comments || []).map(comment => ({
      '@type': 'Comment',
      'author': {
        '@type': 'Person',
        'name': comment.name || 'Reader'
      },
      'text': comment.comment || '',
      'dateCreated': formatDate(comment.createdAt)
    })),
    'aggregateRating': writing.averageRating > 0 ? {
      '@type': 'AggregateRating',
      'ratingValue': writing.averageRating,
      'ratingCount': writing.totalRatings || 0,
      'bestRating': 5,
      'worstRating': 1
    } : undefined,
    'potentialAction': [
      {
        '@type': 'ReadAction',
        'target': {
          '@type': 'EntryPoint',
          'urlTemplate': `https://ajithkumarr.com/quill/${writing._id}`
        }
      }
    ]
  };

  // Clean up undefined values
  const cleanSchema = JSON.parse(JSON.stringify(schema));

  // Return script with stringified schema
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanSchema) }}
    />
  );
}