// src/components/schema/PersonSchema.jsx
import React from 'react';

export default function PersonSchema({ includeFullBio = false }) {
  // Base schema for Ajithkumar as a writer and developer
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': 'https://www.ajithkumarr.com/#ajithkumar',
    'name': 'Ajithkumar',
    'alternateName': 'Ajith Kumar',
    'description': 'Tamil writer with 5 published poetry books and Full Stack MERN Developer, creating compelling literature that explores themes of feminism, social justice, and human emotions.',
    'image': 'https://res.cloudinary.com/dk5p5vrwa/image/upload/v1741809430/techblog/ujikvc0er4tebs8mps0d.jpg',
    'url': 'https://www.ajithkumarr.com',
    'sameAs': [
      'https://github.com/ajith2401',
      'https://www.linkedin.com/in/ajithkumar-r-a6531a232/',
      'https://www.instagram.com/ajithkumarr'
    ],
    'knowsLanguage': ['Tamil', 'English'],
    'jobTitle': ['Full Stack Developer', 'Writer and Poet'],
    'publishingPrinciples': 'https://www.ajithkumarr.com/about',
    'workLocation': {
      '@type': 'Place',
      'address': {
        '@type': 'PostalAddress',
        'addressCountry': 'India'
      }
    },
    'hasOccupation': [
      {
        '@type': 'Occupation',
        'name': 'Full Stack Developer',
        'occupationCategory': 'Software Developer',
        'skills': 'MERN Stack, JavaScript, React, Node.js, MongoDB, Express'
      },
      {
        '@type': 'Occupation',
        'name': 'Writer',
        'occupationCategory': 'Author',
        'skills': 'Tamil Poetry, Essays, Lyrics'
      }
    ],
    'hasCredential': {
      '@type': 'EducationalOccupationalCredential',
      'name': 'Published Author',
      'description': 'Author of 5 published Tamil poetry books'
    }
  };
  
  // Enhanced biography information for full bio version
  if (includeFullBio) {
    schema.mainEntityOfPage = {
      '@type': 'WebPage',
      '@id': 'https://www.ajithkumarr.com/about'
    };
    
    // Add published works
    schema.author = {
      '@type': 'Person',
      '@id': 'https://www.ajithkumarr.com/#ajithkumar'
    };
    
    // Add technical skills
    schema.knowsAbout = [
      'Tamil Literature',
      'Feminist Poetry',
      'Social Justice Writing',
      'MERN Stack Development',
      'JavaScript',
      'React.js',
      'Node.js',
      'MongoDB',
      'Express.js',
      'Full Stack Development'
    ];
    
    // Add content creation specifics
    schema.makesOffer = [
      {
        '@type': 'Offer',
        'itemOffered': {
          '@type': 'Service',
          'name': 'Tamil Poetry Writing',
          'description': 'Original Tamil poetry exploring themes of feminism, social justice, and human emotions'
        }
      },
      {
        '@type': 'Offer',
        'itemOffered': {
          '@type': 'Service',
          'name': 'Web Development',
          'description': 'Full Stack MERN development services for creating modern, responsive web applications'
        }
      }
    ];
  }
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}