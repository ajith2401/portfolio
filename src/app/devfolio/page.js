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
    canonical: "https://www.ajithkumarr.com/devfolio",
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
    url: 'https://www.ajithkumarr.com/devfolio',
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

  // Convert MongoDB documents to plain objects and include slug
  const safeProjects = projects.map(project => ({
    _id: project._id.toString(),
    slug: project.slug,
    title: project.title,
    shortDescription: project.shortDescription,
    category: project.category,
    technologies: project.technologies,
    publishedAt: project.publishedAt,
    images: project.images,
    performance: project.performance,
    featured: project.featured,
    createdAt: project.createdAt?.toString(),
    updatedAt: project.updatedAt?.toString()
  }));

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
      
      <Suspense fallback={<DevfolioLoading />}>
        <DevfolioClient initialProjects={safeProjects} />
      </Suspense>
    </>
  );
}