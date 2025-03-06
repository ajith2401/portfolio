// src/components/schema/BlogSchema.jsx
export default function BlogSchema({ blog }) {
    if (!blog) {
      return null;
    }
  
    // Safe date formatter to handle any date format
    const safeISODate = (dateValue) => {
      if (!dateValue) return undefined;
      
      try {
        // If it's already a string, return it
        if (typeof dateValue === 'string') {
          return dateValue;
        }
        
        // Try to create a Date and get ISO string
        const date = new Date(dateValue);
        return !isNaN(date.getTime()) ? date.toISOString() : undefined;
      } catch (error) {
        console.error("Date conversion error:", error);
        return undefined;
      }
    };
  
    // Get safe ISO dates
    const publishedDate = safeISODate(blog.publishedAt) || safeISODate(blog.createdAt);
    const modifiedDate = safeISODate(blog.updatedAt);
  
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: blog.title,
      description: blog.subtitle || (blog.content ? blog.content.substring(0, 160) : ''),
      image: blog.images?.medium || 'https://www.ajithkumarr.com/og-image.jpg',
      // Use the safe date values
      ...(publishedDate && { datePublished: publishedDate }),
      ...(modifiedDate && { dateModified: modifiedDate }),
      author: {
        '@type': 'Person',
        name: blog.author?.name || 'Ajithkumar',
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
        '@id': `https://www.ajithkumarr.com/techblog/${blog._id || ''}`
      },
      keywords: blog.tags?.join(', ') || 'Tamil poetry, Tamil literature',
      articleSection: blog.category,
      wordCount: blog.content ? blog.content.split(/\s+/).length : 0
    };
  
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    );
  }