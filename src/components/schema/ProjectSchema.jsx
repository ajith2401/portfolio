// src/components/schema/ProjectSchema.jsx
export default function ProjectSchema({ project }) {
    // Skip the schema entirely if project is not available
    if (!project) {
      return null;
    }
  
    // Create a simplified schema object with safe handling
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: project.title || '',
      description: project.shortDescription || '',
      image: project.images?.medium || 'https://www.ajithkumarr.com/og-image.jpg',
      applicationCategory: project.category || 'SoftwareApplication',
      
      // Add technologies as keywords
      keywords: project.stack?.join(', ') || '',
      
      // Add creator info
      author: {
        '@type': 'Person',
        url: 'https://www.ajithkumarr.com/'
      },
      
      // Add organization info
      creator: {
        '@type': 'Organization',
        name: 'Ajithkumar',
        logo: {
          '@type': 'ImageObject',
          url: 'https://www.ajithkumarr.com/images/logo.png'
        }
      },
      
      // Add links if available
      offers: project.links?.live || project.links?.demo ? {
        '@type': 'Offer',
        url: project.links?.live || project.links?.demo,
        availability: 'https://schema.org/OnlineOnly'
      } : undefined,
      
      // Add code repository if available
      codeRepository: project.links?.github || undefined,
      
      // Add main entity reference
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://www.ajithkumarr.com/devfolio/${project._id || ''}`
      }
    };
  
    // Remove undefined properties
    Object.keys(schema).forEach(key => {
      if (schema[key] === undefined) {
        delete schema[key];
      }
    });
  
    // Return script with stringified schema
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    );
  }