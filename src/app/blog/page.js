// src/app/blog/page.js
import { TechBlog } from '@/models';
import connectDB from '@/lib/db';
import TechBlogClient from './TechBlogClient';
import { Suspense } from 'react';
import DeveloperSchema from '@/components/schema/DeveloperSchema';

// Enhanced metadata for SEO - targeting technical/developer focused terms
export const metadata = {
  title: "Ajithkumar | Full Stack Developer Blog",
  description: "Deep dives into JavaScript, React.js, Node.js, MongoDB, Express.js, and MERN stack development by Ajithkumar - Full Stack Developer sharing technical insights and coding best practices.",
  keywords: [
    "Ajithkumar developer", 
    "Ajithkumar full stack developer",
    "Ajithkumar MERN stack developer",
    "Ajithkumar ReactJS developer",
    "Ajithkumar NodeJS developer",
    "MERN stack development", 
    "Full stack development", 
    "JavaScript development", 
    "React.js development", 
    "Node.js development",
    "MongoDB development",
    "Express.js development",
    "Web application development"
  ],
  openGraph: {
    title: "Ajithkumar | Full Stack Developer Blog",
    description: "Technical insights and best practices for JavaScript, React.js, Node.js, MongoDB, Express.js, and MERN stack development.",
    images: [
      {
        url: '/og-image-tech.jpg',
        width: 1200,
        height: 630,
        alt: 'Ajithkumar Tech Blog'
      }
    ],
    type: 'website',
    url: 'https://ajithkumarr.com/blog',
    siteName: 'Ajithkumar - Full Stack Developer Blog'
  },
  twitter: {
    card: 'summary_large_image',
    title: "Ajithkumar | Full Stack Developer Blog",
    description: "Technical insights and best practices for JavaScript, React.js, Node.js, MongoDB, Express.js, and MERN stack development.",
    images: ['/twitter-image-tech.jpg'],
    creator: '@ajithkumarr'
  },
  alternates: {
    canonical: 'https://ajithkumarr.com/blog'
  }
};


// Loading component for Suspense
function BlogLoading() {
  return <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
  </div>
}


// Server component for better SEO
export default async function TechBlogPage() {
  await connectDB();
  // Pre-render the page with initial data
  const initialPosts = await TechBlog.find({ status: 'published' })
    .sort({ publishedAt: -1 })
    .limit(12)
    .lean();

  return (
    <>
      {/* Add Developer Schema with focus on technical skills */}
      <DeveloperSchema 
        includedSkills={[
          'JavaScript',
          'React.js',
          'Node.js',
          'Express.js',
          'MongoDB',
          'MERN Stack',
          'Full Stack Development',
          'RESTful APIs',
          'Web Development',
          'Frontend Development',
          'Backend Development',
          'Database Design'
        ]} 
      />
      
      {/* Hidden SEO content for search engines */}
      <div className="sr-only">
        <h1>Ajithkumar - Full Stack MERN Developer Blog</h1>
        <p>
          Technical insights, tutorials, and best practices for JavaScript, React.js, Node.js, 
          MongoDB, Express.js, and MERN stack development by Ajithkumar - an experienced 
          Full Stack Developer specializing in modern web application development.
        </p>
        <div>
          <h2>Technical Expertise</h2>
          <ul>
            <li>JavaScript Development - Modern ES6+ features and patterns</li>
            <li>React.js Development - Components, Hooks, State Management</li>
            <li>Node.js Development - Server-side JavaScript, Express.js</li>
            <li>MongoDB - NoSQL database design and optimization</li>
            <li>MERN Stack Development - End-to-end web applications</li>
            <li>RESTful API Design - Best practices and implementation</li>
          </ul>
        </div>
      </div>
      
      <Suspense fallback={<BlogLoading />}>
        <TechBlogClient initialPosts={JSON.parse(JSON.stringify(initialPosts))} />
      </Suspense>
    </>
  );
}