// src/components/schema/ProjectSchema.jsx
import React from 'react';

export default function ProjectSchema({ project }) {
  // Skip the schema entirely if project is not available
  if (!project) {
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
  
  // Extract skills from stack array with fallback
  const getSkills = () => {
    if (!project.stack || !Array.isArray(project.stack) || project.stack.length === 0) {
      return "JavaScript, React, Node.js, MongoDB, Express.js";
    }
    return project.stack.join(', ');
  };
  
  // Create schema based on project type
  let schemaType = 'SoftwareApplication';
  if (project.category === 'web' || project.category === 'frontend' || project.category === 'fullstack') {
    schemaType = 'WebApplication';
  } else if (project.category === 'mobile') {
    schemaType = 'MobileApplication';
  }
  
  // Determine application sub-category
  const determineAppCategory = () => {
    switch (project.category) {
      case 'AI/ML':
        return 'ArtificialIntelligenceApplication';
      case 'web':
        return 'WebApplication';
      case 'mobile':
        return 'MobileApplication';
      case 'backend':
        return 'DeveloperApplication';
      case 'devops':
        return 'DeveloperApplication';
      default:
        return 'SoftwareApplication';
    }
  };
  
  // Create a comprehensive schema object
  const schema = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    '@id': `https://ajithkumarr.com/devfolio/${project._id}#project`,
    'name': project.title || '',
    'headline': project.title || '',
    'description': project.shortDescription || project.longDescription?.substring(0, 160) || '',
    'image': project.images?.medium || project.images?.large || 'https://ajithkumarr.com/opengraph-image.jpg',
    'datePublished': formatDate(project.createdAt),
    'dateModified': formatDate(project.updatedAt),
    'applicationCategory': determineAppCategory(),
    'operatingSystem': 'Web Browser, Cross-Platform',
    'keywords': getSkills(),
    'author': {
      '@type': 'Person',
      '@id': 'https://ajithkumarr.com/#ajithkumar',
      'name': 'Ajithkumar',
      'description': 'Tamil writer with 5 published poetry books and Full Stack MERN Developer, creating compelling literature and innovative web applications.',
      'url': 'https://ajithkumarr.com'
    },
    'creator': {
      '@type': 'Person',
      '@id': 'https://ajithkumarr.com/#ajithkumar'
    },
    'offers': (project.links?.live || project.links?.demo) ? {
      '@type': 'Offer',
      'url': project.links?.live || project.links?.demo,
      'availability': 'https://schema.org/OnlineOnly',
      'price': '0',
      'priceCurrency': 'USD'
    } : undefined,
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `https://ajithkumarr.com/devfolio/${project._id}`
    }
  };
  
  // Add code repository if available
  if (project.links?.github) {
    schema.codeRepository = project.links.github;
  }
  
  // Add features as featureList
  if (project.features && Array.isArray(project.features) && project.features.length > 0) {
    schema.featureList = project.features.join(', ');
  }
  
  // Add technologies/stack as skills
  if (project.stack && Array.isArray(project.stack) && project.stack.length > 0) {
    schema.applicationSubCategory = project.stack.join(', ');
  }
  
  // Add breadcrumb navigation
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
        'name': 'Projects',
        'item': 'https://ajithkumarr.com/devfolio'
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': project.category?.charAt(0).toUpperCase() + project.category?.slice(1) || 'Project',
        'item': `https://ajithkumarr.com/devfolio?category=${project.category || ''}`
      },
      {
        '@type': 'ListItem',
        'position': 4,
        'name': project.title,
        'item': `https://ajithkumarr.com/devfolio/${project._id}`
      }
    ]
  };
  
  // Add work status information
  schema.workStatus = project.status === 'published' ? 'https://schema.org/PublishedWork' : 'https://schema.org/InProgress';
  
  // Add about for SEO connection to author
  schema.about = {
    '@type': 'Thing',
    'name': project.category?.charAt(0).toUpperCase() + project.category?.slice(1) || 'Web Development',
    'description': `MERN Stack development by Ajithkumar, a published Tamil writer and Full Stack Developer with expertise in ${getSkills()}`
  };
  
  // Clean up undefined values
  const cleanSchema = JSON.parse(JSON.stringify(schema));
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanSchema) }}
    />
  );
}