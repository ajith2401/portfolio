// src/components/schema/DeveloperSchema.jsx
import React from 'react';

export default function DeveloperSchema({ includedSkills = [] }) {
  // Full set of development skills
  const allSkills = [
    'JavaScript',
    'React.js', 
    'Next.js',
    'Node.js', 
    'Express.js',
    'MongoDB',
    'MERN Stack',
    'Full Stack Development',
    'RESTful APIs',
    'GraphQL',
    'Redux',
    'Tailwind CSS',
    'Material UI',
    'Bootstrap',
    'Git',
    'GitHub',
    'CI/CD',
    'AWS',
    'Firebase',
    'TypeScript',
    'JWT Authentication',
    'Webpack',
    'Jest',
    'React Testing Library',
    'Responsive Web Design',
    'Progressive Web Apps',
    'Web Accessibility',
    'Web Performance Optimization',
    'Database Design',
    'Agile Methodologies'
  ];

  // Filter skills or use all if none specified
  const skills = includedSkills.length > 0 
    ? includedSkills 
    : allSkills;

  // Create schema for Ajithkumar R as a developer
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': 'https://www.ajithkumarr.com/#ajithkumar',
    'name': 'Ajithkumar R',
    'alternateName': ['Ajithkumar', 'Ajith Kumar'],
    'description': 'Full Stack MERN Developer and Anthropic-certified Claude Architect with expertise in React.js, Next.js, Node.js, Express, MongoDB, and TypeScript. Creator of responsive web applications, automated workflows, and published Tamil writer.',
    'image': 'https://res.cloudinary.com/dk5p5vrwa/image/upload/v1741809430/techblog/ujikvc0er4tebs8mps0d.jpg',
    'url': 'https://www.ajithkumarr.com/devfolio',
    'sameAs': [
      'https://github.com/ajith2401',
      'https://www.linkedin.com/in/ajithkumar-r-a6531a232/',
      'https://www.credly.com/users/ajithkumar-r',
      'https://claude.ajithkumarr.com',
      'https://www.instagram.com/ajithkumarr'
    ],
    'knowsLanguage': [
      { '@type': 'Language', 'name': 'English', 'alternateName': 'en' },
      { '@type': 'Language', 'name': 'Tamil', 'alternateName': 'ta' }
    ],
    'jobTitle': 'Full Stack Developer & AI Solutions Architect',
    'alumniOf': {
      '@type': 'CollegeOrUniversity',
      'name': 'Government College of Technology'
    },
    'hasOccupation': {
      '@type': 'Occupation',
      'name': 'Full Stack Developer',
      'occupationCategory': 'Software Developer',
      'skills': skills.join(', '),
      'description': 'MERN Stack developer creating modern web applications with JavaScript, React.js, Node.js, Express.js, and MongoDB'
    },
    'hasCredential': [
      {
        '@type': 'EducationalOccupationalCredential',
        'name': 'Claude Certified Architect – Foundations (CCA-F)',
        'credentialCategory': 'Certification',
        'recognizedBy': {
          '@type': 'Organization',
          'name': 'Anthropic'
        },
        'url': 'https://www.credly.com/users/ajithkumar-r'
      }
    ],
    'knowsAbout': [
      'MERN Stack Development',
      'Full Stack Web Development',
      'JavaScript',
      'TypeScript',
      'React.js Development',
      'Next.js',
      'Node.js Development',
      'MongoDB',
      'Express.js',
      'RESTful API Design',
      'AI Workflows & LLM Integration',
      'Claude Certified Architect'
    ],
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': 'https://www.ajithkumarr.com/devfolio'
    },
    'workExample': [
      {
        '@type': 'SoftwareApplication',
        'name': 'Claude Cert Prep',
        'applicationCategory': 'EducationalApplication',
        'operatingSystem': 'Web Browser',
        'url': 'https://claude.ajithkumarr.com',
        'author': {
          '@type': 'Person',
          '@id': 'https://www.ajithkumarr.com/#ajithkumar'
        }
      },
      {
        '@type': 'SoftwareApplication',
        'name': 'MERN Stack Applications',
        'applicationCategory': 'WebApplication',
        'operatingSystem': 'Web Browser',
        'author': {
          '@type': 'Person',
          '@id': 'https://www.ajithkumarr.com/#ajithkumar'
        }
      }
    ],
    'makesOffer': [
      {
        '@type': 'Offer',
        'itemOffered': {
          '@type': 'Service',
          'name': 'Full Stack Web Development',
          'description': 'End-to-end web application development using React.js, Next.js, Node.js, Express, and MongoDB'
        }
      },
      {
        '@type': 'Offer',
        'itemOffered': {
          '@type': 'Service',
          'name': 'AI Solutions & Architecture',
          'description': 'Claude AI integration, agentic workflows, and automated system development'
        }
      }
    ],
    'award': [
      'Claude Certified Architect – Foundations (CCA-F), Anthropic',
      'GovTechThon Winner — National Informatics Centre (NIC) & IEEE'
    ],
    'subjectOf': {
      '@type': 'CreativeWork',
      'name': 'Developer Portfolio',
      'url': 'https://www.ajithkumarr.com/devfolio'
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}