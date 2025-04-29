// src/components/schema/BlogSchema.jsx
import React from 'react';

export default function BlogSchema({ blog }) {
  // Skip the schema entirely if blog is not available
  if (!blog) return null;
  
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
  
  // Get safe ISO dates
  const publishedDate = formatDate(blog.publishedAt || blog.createdAt);
  const modifiedDate = formatDate(blog.updatedAt);
  
  // Extract tags or categories as keywords
  const keywordArray = [
    'Ajithkumar writer',
    'Tamil writer',
    'MERN stack',
    'Full stack developer',
    blog.category,
    ...(blog.tags || [])
  ].filter(Boolean);
  
  // Create schema object
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `https://ajithkumarr.com/blog/${blog._id}#blogpost`,
    'headline': blog.title,
    'name': blog.title,
    'description': blog.subtitle || (blog.content ? blog.content.substring(0, 160).replace(/[\r\n]+/g, ' ') : ''),
    'image': blog.images?.medium || blog.images?.large || 'https://ajithkumarr.com/opengraph-image.jpg',
    'inLanguage': 'en',
    'datePublished': publishedDate,
    'dateModified': modifiedDate,
    'author': {
      '@type': 'Person',
      '@id': 'https://ajithkumarr.com/#ajithkumar',
      'name': blog.author?.name || 'Ajithkumar',
      'url': 'https://ajithkumarr.com/',
      'description': 'Tamil writer with 5 published poetry books and Full Stack MERN Developer, creating compelling literature that explores themes of feminism, social justice, and human emotions.',
      'jobTitle': ['Writer and Poet', 'Full Stack Developer'],
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
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `https://ajithkumarr.com/blog/${blog._id}`
    },
    'keywords': keywordArray.join(', '),
    'articleSection': blog.category || 'Technology',
    'wordCount': blog.content ? blog.content.split(/\s+/).length : 0,
    'articleBody': blog.content ? blog.content.substring(0, 500).replace(/[\r\n]+/g, ' ') + '...' : '',
    'speakable': {
      '@type': 'SpeakableSpecification',
      'cssSelector': ['.blog-content', 'h1', 'h2', 'h3']
    },
    'isPartOf': {
      '@type': 'Blog',
      'name': 'Ajithkumar Tech Blog',
      'description': 'Technical blog by Ajithkumar - Tamil writer and Full Stack MERN Developer',
      'url': 'https://ajithkumarr.com/blog/'
    }
  };
  
  // Add ratings if available
  if (blog.averageRating && blog.averageRating > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      'ratingValue': blog.averageRating,
      'ratingCount': blog.totalRatings || 0,
      'bestRating': 5,
      'worstRating': 1
    };
  }
  
  // Add comments if available
  if (blog.ratings && blog.ratings.length > 0) {
    schema.comment = blog.ratings
      .filter(rating => rating.comment)
      .map(rating => ({
        '@type': 'Comment',
        'author': {
          '@type': 'Person',
          'name': rating.name || 'Reader'
        },
        'text': rating.comment || '',
        'dateCreated': formatDate(rating.createdAt)
      }));
  }
  
  // Add breadcrumb
  schema.breadcrumb = {
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://ajithkumarr.com'
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Tech Blog',
        'item': 'https://ajithkumarr.com/blog'
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': blog.category || 'Article',
        'item': `https://ajithkumarr.com/blog/category/${blog.category?.toLowerCase().replace(/\s+/g, '-') || 'article'}`
      },
      {
        '@type': 'ListItem',
        'position': 4,
        'name': blog.title,
        'item': `https://ajithkumarr.com/blog/${blog._id}`
      }
    ]
  };
  
  // Clean up undefined properties
  const cleanSchema = JSON.parse(JSON.stringify(schema));
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanSchema) }}
    />
  );
}