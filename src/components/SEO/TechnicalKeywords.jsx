// src/components/SEO/TechnicalKeywords.jsx
'use client';

import React from 'react';
import Head from 'next/head';

/**
 * TechnicalKeywords component for enhancing SEO for technical search terms
 * Adds structured data for various technical search terms related to developer skills
 */
export default function TechnicalKeywords() {
  // Technical keywords targeted for SEO
  const technicalKeywords = [
    "Full stack developer",
    "MERN stack developer",
    "JavaScript developer",
    "ReactJS developer",
    "NodeJS developer",
    "MongoDB developer",
    "Express.js developer",
    "Ajithkumar developer",
    "Ajithkumar full stack developer",
    "Ajithkumar MERN stack developer",
    "Ajithkumar ReactJS developer",
    "Ajithkumar NodeJS developer",
    "Web application developer",
    "Frontend developer",
    "Backend developer",
    "REST API developer"
  ];

  // Technical skills for JSON-LD
  const technicalSkills = [
    {
      "@type": "DefinedTerm",
      "name": "MERN Stack",
      "description": "MongoDB, Express.js, React.js, and Node.js stack for full-stack web development"
    },
    {
      "@type": "DefinedTerm",
      "name": "JavaScript",
      "description": "Programming language for web development"
    },
    {
      "@type": "DefinedTerm",
      "name": "React.js",
      "description": "JavaScript library for building user interfaces"
    },
    {
      "@type": "DefinedTerm",
      "name": "Node.js",
      "description": "JavaScript runtime for server-side applications"
    },
    {
      "@type": "DefinedTerm",
      "name": "MongoDB",
      "description": "NoSQL database for modern applications"
    },
    {
      "@type": "DefinedTerm",
      "name": "Express.js",
      "description": "Web application framework for Node.js"
    },
    {
      "@type": "DefinedTerm",
      "name": "RESTful APIs",
      "description": "API design pattern for web services"
    },
    {
      "@type": "DefinedTerm",
      "name": "Full Stack Development",
      "description": "Development of both client and server software"
    }
  ];

  // Schema for technical skills
  const technicalSkillsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Ajithkumar's Technical Skills",
    "description": "Technical skills and expertise of Ajithkumar as a Full Stack MERN Developer",
    "itemListOrder": "Unordered",
    "numberOfItems": technicalSkills.length,
    "itemListElement": technicalSkills.map((skill, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": skill
    }))
  };
  
  // Developer identity schema
  const developerSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "name": "Ajithkumar - Full Stack MERN Developer",
    "description": "Professional profile of Ajithkumar, a Full Stack Developer specializing in MERN stack (MongoDB, Express.js, React.js, Node.js) and JavaScript development.",
    "mainEntity": {
      "@type": "Person",
      "@id": "https://ajithkumarr.com/#ajithkumar-developer",
      "name": "Ajithkumar",
      "description": "Full Stack MERN Developer with expertise in JavaScript, React.js, Node.js and MongoDB",
      "knowsAbout": technicalKeywords,
      "hasOccupation": {
        "@type": "Occupation",
        "name": "Full Stack Developer",
        "skills": "MERN Stack, JavaScript, React.js, Node.js, MongoDB, Express.js"
      },
      "url": "https://ajithkumarr.com/devfolio"
    }
  };

  return (
    <>
      <Head>
        {/* Meta keywords for search engines */}
        <meta name="keywords" content={technicalKeywords.join(', ')} />
        
        {/* Schema.org structured data for technical skills */}
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{ 
            __html: JSON.stringify(technicalSkillsSchema) 
          }}
        />
        
        {/* Schema.org structured data for developer identity */}
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{ 
            __html: JSON.stringify(developerSchema) 
          }}
        />
      </Head>
    </>
  );
}