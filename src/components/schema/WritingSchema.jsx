// src/components/schema/WritingSchema.jsx
export default function WritingSchema({ writing }) {
  // Skip the schema entirely if writing is not available
  if (!writing) {
    return null;
  }

  // Create a simplified schema object with absolutely safe date handling
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: writing.title || '',
    description: writing.subtitle || (writing.body ? writing.body.substring(0, 160) : ''),
    image: writing.images?.medium || 'https://www.ajithkumarr.com/og-image.jpg',
    
    // Remove date fields completely - this is just to test if they're the issue
    // We'll add them back with proper handling if this works
    
    author: {
      '@type': 'Person',
      url: 'https://www.ajithkumarr.com/'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Ajithkumar',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.ajithkumarr.com/images/logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.ajithkumarr.com/quill/${writing._id || ''}`
    }
  };

  // Return script with stringified schema
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}