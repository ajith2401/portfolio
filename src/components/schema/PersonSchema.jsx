// src/components/schema/PersonSchema.jsx
import React from 'react';

export default function PersonSchema({ includeFullBio = false }) {
  // Canonical entity schema for Ajithkumar R (Author, Screenwriter, Filmmaker, Developer)
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': 'https://www.ajithkumarr.com/#ajithkumar',
    name: 'Ajithkumar R',
    alternateName: [
      'Ajithkumar',
      'Ajith Kumar',
      'Ajithkumar R.',
      'அஜித்குமார்',
      'அஜித்குமார் எழுத்தாளர்',
      'அஜித்குமார் கவிஞர்',
      'அஜித்குமார் திரைக்கதை எழுத்தாளர்',
      'அஜித்குமார் இயக்குநர்',
      'Tamil Writer Ajithkumar',
      'Tamil Screenwriter Ajithkumar'
    ],
    disambiguatingDescription:
      'Ajithkumar R is a Bengaluru-based Tamil writer, published author of 5 poetry books, screenwriter, independent filmmaker, and Full Stack software engineer. He is distinct from Tamil cinema actor Ajith Kumar and Malayalam film editor/director B. Ajithkumar.',
    description:
      'Ajithkumar R is a Tamil writer, published author of five poetry books, screenwriter, independent filmmaker, and Full Stack Developer based in Bengaluru, Karnataka, India.',
    image: 'https://res.cloudinary.com/dk5p5vrwa/image/upload/v1741809430/techblog/ujikvc0er4tebs8mps0d.jpg',
    url: 'https://www.ajithkumarr.com',
    sameAs: [
      'https://github.com/ajith2401',
      'https://www.linkedin.com/in/ajithkumar-r-a6531a232/',
      'https://www.credly.com/org/anthropic/badge/claude-certified-architect-foundations',
      'https://claude.ajithkumarr.com/',
      'https://www.instagram.com/ajithkumarr',
      'https://www.amazon.in/Antenna-Meedhamarndha-Kakkai-Vaanawill/dp/B0DCZVKSFZ'
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
      'Tamil Writer & Published Author',
      'Tamil Poet & Lyricist',
      'Screenwriter & Story Writer',
      'Independent Filmmaker & Director',
      'Full Stack Developer',
      'Claude Certified Architect'
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
        name: 'Published Author (5 Tamil Poetry Books)',
        description: 'Author of 5 published Tamil poetry books exploring feminism, social justice, identity, and human relationships'
      },
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'Claude Certified Architect – Foundations (CCA-F)',
        credentialCategory: 'Professional Certification',
        recognizedBy: {
          '@type': 'Organization',
          name: 'Anthropic'
        },
        url: 'https://www.credly.com/org/anthropic/badge/claude-certified-architect-foundations'
      }
    ],
    hasOccupation: [
      {
        '@type': 'Occupation',
        name: 'Tamil Author, Poet & Lyricist',
        occupationCategory: '27-3043.05 - Poets, Lyricists and Creative Writers',
        skills: 'Tamil Poetry, Literary Essays, Short Stories, Song Lyrics, Book Authoring'
      },
      {
        '@type': 'Occupation',
        name: 'Screenwriter & Story Writer',
        occupationCategory: '27-3043.01 - Screenwriters',
        skills: 'Screenwriting, Scene Construction, Dialogue Writing, Character Arcs, Story Development'
      },
      {
        '@type': 'Occupation',
        name: 'Independent Filmmaker & Director',
        occupationCategory: '27-2012.02 - Film Directors',
        skills: 'Directorial Vision, Visual Narrative, Independent Film Development, Storyboarding'
      },
      {
        '@type': 'Occupation',
        name: 'Full Stack Developer & AI Engineer',
        occupationCategory: '15-1254.00 - Web Developers',
        skills: 'MERN Stack, React.js, Next.js, Node.js, Express.js, MongoDB, TypeScript, REST APIs, AI Systems'
      }
    ],
    knowsAbout: [
      'Tamil Literature & Modern Poetry',
      'Screenwriting & Visual Storytelling',
      'Independent Filmmaking & Directorial Concepts',
      'Feminist Poetry & Social Justice Writing',
      'Tamil Song Lyrics & Meter',
      'Full Stack Web Development (MERN Stack)',
      'Next.js & React Architecture',
      'Claude AI Architecture & Prompt Engineering',
      'Model Context Protocol (MCP)',
      'Conversational AI & Public-Interest Technology'
    ],
    workExample: [
      {
        '@type': 'Book',
        name: 'ஆண்டெனா மீதமர்ந்த காக்கை (Antenna Meedhamarndha Kaakkai)',
        inLanguage: 'ta',
        datePublished: '2021',
        publisher: 'மகிழினி பதிப்பகம்',
        url: 'https://www.ajithkumarr.com/spotlight/ஆண்டெனா-மீதமர்ந்த-காக்கை',
        sameAs: 'https://www.amazon.in/Antenna-Meedhamarndha-Kakkai-Vaanawill/dp/B0DCZVKSFZ'
      },
      {
        '@type': 'Book',
        name: 'முற்றிய பிரியத்தின் வற்றாத துளி (Muttriya Piriyathin Vattratha Thuli)',
        inLanguage: 'ta',
        datePublished: '2020',
        publisher: 'எழுத்து பிரசுரம்',
        url: 'https://www.ajithkumarr.com/spotlight/முற்றிய-பிரியத்தின்-வற்றாத-துளி'
      },
      {
        '@type': 'Book',
        name: 'ஒரு பைத்தியக்காரனின் டைரிக் குறிப்புகள் (Oru Paithiyakaaranin Diary Kurippukal)',
        inLanguage: 'ta',
        datePublished: '2019',
        publisher: 'நாடோடி பதிப்பகம்',
        url: 'https://www.ajithkumarr.com/spotlight/ஒரு-பைத்தியக்காரனின்-டைரிக்-குறிப்புகள்'
      },
      {
        '@type': 'Book',
        name: 'சிப்பிக்குள் சிந்தா மழை (Chippikkul Sinthaa Mazhai)',
        inLanguage: 'ta',
        datePublished: '2018',
        publisher: 'கரங்கள் பதிப்பகம்',
        url: 'https://www.ajithkumarr.com/spotlight/சிப்பிக்குள்-சிந்தா-மழை'
      },
      {
        '@type': 'Book',
        name: 'அன்புடையவளுக்கும் அன்புக்குரியவளுக்கும் (Anbudaiyavalukkum Anbukkuriyaavalukkum)',
        inLanguage: 'ta',
        datePublished: '2017',
        publisher: 'விஜய பதிப்பகம்',
        url: 'https://www.ajithkumarr.com/spotlight/அன்புடையவளுக்கும்-அன்புக்குரியவளுக்கும்'
      }
    ]
  };

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
