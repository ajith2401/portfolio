import React from 'react';
import PersonSchema from '@/components/schema/PersonSchema';
import AboutClient from './AboutClient';

export const metadata = {
  title: 'About Ajithkumar R — Tamil Writer, Poet, Screenwriter, Filmmaker & Developer',
  description:
    'Authoritative biography of Ajithkumar R — Published Tamil author of 5 poetry books, screenwriter, independent filmmaker, Claude Certified Architect (CCA-F), and Full Stack Developer based in Bengaluru, India.',
  keywords: [
    'About Ajithkumar R',
    'Ajithkumar writer biography',
    'Ajith Kumar writer',
    'Ajithkumar screenwriter',
    'Ajithkumar filmmaker',
    'Tamil poet Ajithkumar',
    'Ajithkumar Bengaluru'
  ],
  alternates: {
    canonical: 'https://www.ajithkumarr.com/about',
  },
  openGraph: {
    title: 'About Ajithkumar R — Tamil Writer, Poet, Screenwriter, Filmmaker & Developer',
    description:
      'Authoritative biography of Ajithkumar R — Published Tamil author of 5 poetry books, screenwriter, independent filmmaker, Claude Certified Architect (CCA-F), and Full Stack Developer based in Bengaluru, India.',
    url: 'https://www.ajithkumarr.com/about',
    type: 'profile'
  },
};

export default function About() {
  return (
    <>
      <PersonSchema />
      <AboutClient />
    </>
  );
}
