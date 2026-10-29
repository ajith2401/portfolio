// src/app/devfolio/page.js
import DevfolioClient from "./DevfolioClient";
import { Project } from '@/models/project.model';
import connectDB from '@/lib/db';
import { Suspense } from "react";
import DeveloperSchema from "@/components/schema/DeveloperSchema";

// Enhanced metadata for better SEO - targeting developer-focused keywords
export const metadata = {
  title: "Ajithkumar R | Full Stack Developer & AI Architect Portfolio",
  description: "Explore technical projects and applications by Ajithkumar R built with React.js, Next.js, Node.js, TypeScript, and MongoDB. Full stack developer, Anthropic-certified Claude Architect, and GovTechThon winner.",
  keywords: [
    "Ajithkumar R",
    "Ajithkumar developer", 
    "Ajithkumar full stack developer",
    "Ajithkumar MERN stack developer",
    "Ajithkumar ReactJS developer",
    "Ajithkumar NodeJS developer",
    "Claude Certified Architect",
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
    title: "Ajithkumar R | Full Stack Developer & AI Architect",
    description: "Explore technical projects showcasing expertise in React.js, Next.js, Node.js, TypeScript, Express.js, MongoDB, and AI system architecture.",
    images: [
      {
        url: '/og-image-developer.jpg',
        width: 1200,
        height: 630,
        alt: 'Ajithkumar R - Full Stack Developer Portfolio'
      }
    ],
    type: 'website',
    url: 'https://www.ajithkumarr.com/devfolio',
    siteName: 'Ajithkumar R - Full Stack Developer'
  },
  twitter: {
    card: 'summary_large_image',
    title: "Ajithkumar R | Full Stack Developer & AI Architect",
    description: "Explore technical projects showcasing expertise in React.js, Next.js, Node.js, TypeScript, Express.js, MongoDB, and AI system architecture.",
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
  let safeProjects = [];
  try {
    await connectDB();
    
    // Pre-render the page with initial data
    const projects = await Project.find({ status: 'published' })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    // Convert MongoDB documents to plain objects and include slug
    safeProjects = projects.map(project => ({
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
  } catch (error) {
    console.error('Error prefetching devfolio projects on server:', error);
  }

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