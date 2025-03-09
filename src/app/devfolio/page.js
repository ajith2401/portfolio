// src/app/devfolio/page.js
import DevfolioClient from "./DevfolioClient";
import { Project } from '@/models/project.model';
import connectDB from '@/lib/db';
import { Suspense } from "react";

// Enhanced metadata for better SEO
export const metadata = {
  title: "Project Portfolio | Ajith Kumar",
  description: "Explore my projects showcasing award-winning applications and innovative solutions that make a real impact.",
  keywords: ["software development", "web development", "portfolio", "projects", "react", "full-stack", "developer"],
  openGraph: {
    title: "Project Portfolio | Ajith Kumar",
    description: "Explore my projects showcasing award-winning applications and innovative solutions.",
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Ajith Kumar Project Portfolio'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: "Project Portfolio | Ajith Kumar",
    description: "Explore my projects showcasing award-winning applications and innovative solutions.",
    images: ['/twitter-image.jpg'],
  }
};


// Loading component for Suspense
function DevfolioLoading() {
  return <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
  </div>
}


// Server component for better SEO
export default async function DevfolioPage() {
  await connectDB();
  
  // Pre-render the page with initial data
  const projects = await Project.find({ status: 'published' })
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();

  // Convert MongoDB documents to plain objects
  return (
    <Suspense fallback={<DevfolioLoading />}>
      <DevfolioClient initialProjects={JSON.parse(JSON.stringify(projects))} />
    </Suspense>
  );
}
