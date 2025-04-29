// src/app/devfolio/page.js
import DevfolioClient from "./DevfolioClient";
import { Project } from '@/models/project.model';
import connectDB from '@/lib/db';
import { Suspense } from "react";
import DeveloperSchema from "@/components/schema/DeveloperSchema";

// Enhanced metadata for better SEO - targeting developer-focused keywords
export const metadata = {
  title: "Ajithkumar | Full Stack MERN Developer Portfolio",
  description: "Explore Ajithkumar's projects and applications built with MERN stack (MongoDB, Express.js, React.js, Node.js). Experienced JavaScript developer creating responsive, scalable web solutions.",
  keywords: [
    "Ajithkumar developer", 
    "Ajithkumar full stack developer",
    "Ajithkumar MERN stack developer",
    "Ajithkumar ReactJS developer",
    "Ajithkumar NodeJS developer",
    "MERN stack",
    "Full stack developer",
    "JavaScript developer",
    "React.js developer",
    "Node.js developer",
    "MongoDB developer",
    "Express.js developer",
    "web application development"
  ],
  alternates: {
    canonical: "https://ajithkumarr.com/devfolio",
  },
  openGraph: {
    title: "Ajithkumar | Full Stack MERN Developer",
    description: "Explore my technical projects showcasing expertise in JavaScript, React.js, Node.js, Express.js and MongoDB development.",
    images: [
      {
        url: '/og-image-developer.jpg',
        width: 1200,
        height: 630,
        alt: 'Ajithkumar - Full Stack MERN Developer Portfolio'
      }
    ],
    type: 'website',
    url: 'https://ajithkumarr.com/devfolio',
    siteName: 'Ajithkumar - Full Stack Developer'
  },
  twitter: {
    card: 'summary_large_image',
    title: "Ajithkumar | Full Stack MERN Developer",
    description: "Explore my technical projects showcasing expertise in JavaScript, React.js, Node.js, Express.js and MongoDB development.",
    images: ['/twitter-image-developer.jpg'],
    creator: '@ajithkumarr'
  }
};

// Loading component for Suspense
function DevfolioLoading() {
  return <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
  </div>
}

// Server component with enhanced SEO
export default async function DevfolioPage() {
  await connectDB();
  
  // Pre-render the page with initial data
  const projects = await Project.find({ status: 'published' })
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();

  // Convert MongoDB documents to plain objects
  return (
    <>
      {/* Add Developer Schema */}
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
          'Web Application Development',
          'Frontend Development',
          'Backend Development',
          'Database Design'
        ]} 
      />
      
      <div className="mb-6">
        <h1 className="sr-only">Ajithkumar - Full Stack MERN Developer Portfolio</h1>
        <p className="sr-only">
          Experienced Full Stack Developer specializing in MERN stack (MongoDB, Express.js, React.js, Node.js)
          and JavaScript development. Browse my technical projects showcasing web application development skills.
        </p>
      </div>
      
      <Suspense fallback={<DevfolioLoading />}>
        <DevfolioClient initialProjects={JSON.parse(JSON.stringify(projects))} />
      </Suspense>
    </>
  );
}