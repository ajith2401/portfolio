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

  // Create schema for Ajithkumar as a developer
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': 'https://ajithkumarr.com/#ajithkumar-developer',
    'name': 'Ajithkumar',
    'alternateName': 'Ajith Kumar',
    'description': 'Full Stack MERN Developer with expertise in JavaScript, React.js, Node.js, Express, and MongoDB. Creator of responsive, scalable web applications while maintaining a unique perspective as a published Tamil writer.',
    'image': 'https://res.cloudinary.com/dk5p5vrwa/image/upload/v1741809430/techblog/ujikvc0er4tebs8mps0d.jpg',
    'url': 'https://ajithkumarr.com/devfolio',
    'sameAs': [
      'https://github.com/ajith2401',
      'https://www.linkedin.com/in/ajithkumar-r-a6531a232/',
      'https://www.instagram.com/ajithkumarr'
    ],
    'knowsLanguage': ['JavaScript', 'HTML', 'CSS', 'SQL', 'TypeScript', 'English', 'Tamil'],
    'jobTitle': 'Full Stack Developer',
    'alumniOf': {
      '@type': 'CollegeOrUniversity',
      'name': 'Government College of Technology'
    },
    'worksFor': {
      '@type': 'OneVarsity',
      'name': 'Current Employer'
    },
    'hasOccupation': {
      '@type': 'Occupation',
      'name': 'Full Stack Developer',
      'occupationCategory': 'Software Developer',
      'skills': skills.join(', '),
      'description': 'MERN Stack developer creating modern web applications with JavaScript, React.js, Node.js, Express.js, and MongoDB',
      'estimatedSalary': {
        '@type': 'MonetaryAmountDistribution',
        'currency': 'INR',
        'percentile10': '800000',
        'percentile50': '1200000',
        'percentile90': '2000000'
      }
    },
    'knowsAbout': [
      'MERN Stack Development',
      'Full Stack Web Development',
      'JavaScript',
      'React.js Development',
      'Node.js Development',
      'MongoDB',
      'Express.js',
      'Front-end Development',
      'Back-end Development',
      'RESTful API Design',
      'Database Management',
      'Web Application Architecture'
    ],
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': 'https://ajithkumarr.com/devfolio'
    },
    'workExample': [
      {
        '@type': 'SoftwareApplication',
        'name': 'MERN Stack Project',
        'applicationCategory': 'WebApplication',
        'operatingSystem': 'Web Browser',
        'author': {
          '@type': 'Person',
          '@id': 'https://ajithkumarr.com/#ajithkumar-developer'
        }
      },
      {
        '@type': 'SoftwareApplication',
        'name': 'React.js Frontend',
        'applicationCategory': 'WebApplication',
        'operatingSystem': 'Web Browser',
        'author': {
          '@type': 'Person',
          '@id': 'https://ajithkumarr.com/#ajithkumar-developer'
        }
      },
      {
        '@type': 'SoftwareApplication',
        'name': 'Node.js Backend API',
        'applicationCategory': 'DeveloperApplication',
        'author': {
          '@type': 'Person',
          '@id': 'https://ajithkumarr.com/#ajithkumar-developer'
        }
      }
    ],
    'makesOffer': [
      {
        '@type': 'Offer',
        'itemOffered': {
          '@type': 'Service',
          'name': 'Full Stack MERN Development',
          'description': 'End-to-end web application development using MongoDB, Express.js, React.js, and Node.js'
        }
      },
      {
        '@type': 'Offer',
        'itemOffered': {
          '@type': 'Service',
          'name': 'Frontend Development',
          'description': 'Responsive, interactive user interfaces built with React.js and modern JavaScript'
        }
      },
      {
        '@type': 'Offer',
        'itemOffered': {
          '@type': 'Service',
          'name': 'Backend API Development',
          'description': 'Scalable, secure REST APIs built with Node.js and Express.js'
        }
      }
    ],
    'memberOf': [
      {
        '@type': 'Organization',
        'name': 'JavaScript Developer Community'
      },
      {
        '@type': 'Organization',
        'name': 'React.js Developer Network'
      },
      {
        '@type': 'Organization',
        'name': 'Node.js Community'
      }
    ],
    'award': [
      {
        '@type': 'Honour',
        'name': 'Certified MERN Stack Developer',
        'description': 'Certification in MERN stack development'
      }
    ],
    'subjectOf': {
      '@type': 'CreativeWork',
      'name': 'Developer Portfolio',
      'url': 'https://ajithkumarr.com/devfolio'
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}