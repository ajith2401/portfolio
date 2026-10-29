// src/components/schema/PersonSchema.jsx
import React from 'react';

export default function PersonSchema({ includeFullBio = false }) {
  // Canonical entity schema for Ajithkumar R
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': 'https://www.ajithkumarr.com/#ajithkumar',
    name: 'Ajithkumar R',
    alternateName: ['Ajithkumar', 'Ajith Kumar', 'அஜித்குமார்'],
    description:
      'Ajithkumar R is a Full Stack Developer, AI automation specialist, Anthropic-certified Claude Architect (CCA-F), and published Tamil poet with 5 published poetry books based in Bengaluru, Karnataka, India.',
    image: 'https://res.cloudinary.com/dk5p5vrwa/image/upload/v1741809430/techblog/ujikvc0er4tebs8mps0d.jpg',
    url: 'https://www.ajithkumarr.com',
    sameAs: [
      'https://github.com/ajith2401',
      'https://www.linkedin.com/in/ajithkumar-r-a6531a232/',
      'https://www.credly.com/org/anthropic/badge/claude-certified-architect-foundations',
      'https://claude.ajithkumarr.com/',
      'https://www.instagram.com/ajithkumarr'
    ],
    knowsLanguage: [
      {
        '@type': 'Language',
        name: 'Tamil',
        alternateName: 'ta'
      },
      {
        '@type': 'Language',
        name: 'English',
        alternateName: 'en'
      }
    ],
    jobTitle: [
      'Full Stack Developer',
      'AI Automation Specialist',
      'Claude Certified Architect',
      'Tamil Writer & Poet',
      'Lyricist'
    ],
    publishingPrinciples: 'https://www.ajithkumarr.com/about',
    workLocation: {
      '@type': 'Place',
      name: 'Bengaluru, Karnataka, India',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Bengaluru',
        addressRegion: 'Karnataka',
        addressCountry: 'India'
      }
    },
    award: [
      'First Prize Winner, GovTechThon — Government Welfare Scheme Discovery Chatbot (MakkalNalamBot / SEVAI)'
    ],
    hasCredential: [
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'Claude Certified Architect – Foundations (CCA-F)',
        credentialCategory: 'Professional Certification',
        recognizedBy: {
          '@type': 'Organization',
          name: 'Anthropic'
        },
        url: 'https://www.credly.com/org/anthropic/badge/claude-certified-architect-foundations'
      },
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'Published Author',
        description: 'Author of 5 published Tamil poetry books exploring feminism, social justice, and human relationships'
      }
    ],
    hasOccupation: [
      {
        '@type': 'Occupation',
        name: 'Full Stack Developer & AI Engineer',
        occupationCategory: '15-1254.00 - Web Developers',
        skills: 'MERN Stack, React.js, Next.js, Node.js, Express.js, MongoDB, TypeScript, REST APIs, System Integration, AI Agents'
      },
      {
        '@type': 'Occupation',
        name: 'Tamil Author, Poet & Lyricist',
        occupationCategory: '27-3043.05 - Poets, Lyricists and Creative Writers',
        skills: 'Tamil Poetry, Literary Essays, Short Stories, Song Lyrics, Screenwriting'
      }
    ],
    knowsAbout: [
      'Tamil Literature & Modern Poetry',
      'Feminist Poetry & Social Justice Writing',
      'Full Stack Web Development (MERN Stack)',
      'Next.js & React.js Architecture',
      'Claude AI Architecture & Prompt Engineering',
      'Model Context Protocol (MCP)',
      'Conversational AI & Public-Interest Technology',
      'Screenwriting & Visual Storytelling'
    ]
  };

  // Enhanced details for dedicated profile pages
  if (includeFullBio) {
    schema.mainEntityOfPage = {
      '@type': 'ProfilePage',
      '@id': 'https://www.ajithkumarr.com/about'
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
