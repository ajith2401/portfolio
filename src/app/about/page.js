import React from 'react';
import PersonSchema from '@/components/schema/PersonSchema';
import AboutClient from './AboutClient';

export const metadata = {
  title: 'About Ajithkumar | Full Stack Developer, Claude Architect & Tamil Poet',
  description:
    'Learn about Ajithkumar — Full Stack Developer, AI automation specialist, Anthropic-certified Claude Architect, and published Tamil poet with 5 poetry books based in Bengaluru, India.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Ajithkumar | Full Stack Developer, Claude Architect & Tamil Poet',
    description:
      'Learn about Ajithkumar — Full Stack Developer, AI automation specialist, Anthropic-certified Claude Architect, and published Tamil poet based in Bengaluru, India.',
    url: 'https://www.ajithkumarr.com/about',
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
