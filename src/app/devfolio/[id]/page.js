// src/app/devfolio/[id]/page.js
import { Project } from '@/models/project.model';
import connectDB from '@/lib/db';
import ProjectDetailClient from './ProjectDetailClient';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  await connectDB();
  
  try {
    const project = await Project.findById(params.id).lean();
    
    if (!project) return { title: 'Project Not Found' };
    
    // Clean up the text for description
    const description = project.shortDescription || (project.longDescription 
      ? project.longDescription.substring(0, 160).replace(/<[^>]*>?/gm, '').trim()
      : 'Project details');
    
    // Safely handle dates
    let publishedTime, modifiedTime;
    
    try {
      // Handle createdAt date
      if (project.createdAt) {
        publishedTime = project.createdAt instanceof Date 
          ? project.createdAt.toISOString() 
          : new Date(project.createdAt).toISOString();
      }
      
      // Handle updatedAt date
      if (project.updatedAt) {
        modifiedTime = project.updatedAt instanceof Date 
          ? project.updatedAt.toISOString() 
          : new Date(project.updatedAt).toISOString();
      }
    } catch (error) {
      console.error("Date conversion error in metadata:", error);
    }
    
    return {
      title: `${project.title} | Ajith Kumar`,
      description: description,
      keywords: [project.category, 'project', 'portfolio', 'development', 'Ajith Kumar'].concat(project.technologies || []).filter(Boolean),
      authors: [{ name: 'Ajith Kumar' }],
      category: project.category,
      alternates: {
        canonical: `https://www.ajithkumarr.com/devfolio/${params.id}`,
      },
      openGraph: {
        title: project.title,
        description: description,
        url: `https://www.ajithkumarr.com/devfolio/${params.id}`,
        type: 'article',
        publishedTime: publishedTime,
        modifiedTime: modifiedTime,
        authors: ['Ajith Kumar'],
        images: [
          {
            url: project.images?.large || project.images?.medium || 'https://www.ajithkumarr.com/og-image.jpg',
            width: 1200,
            height: 630,
            alt: project.title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: project.title,
        description: description,
        images: [project.images?.large || project.images?.medium || 'https://www.ajithkumarr.com/twitter-image.jpg'],
      }
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return { title: 'Project Details | Ajith Kumar' };
  }
}

export default async function ProjectDetailPage({ params }) {
  await connectDB();
  
  try {
    // Fetch initial data for server-side rendering with .lean()
    const project = await Project.findById(params.id).lean();
    
    if (!project) {
      return notFound();
    }
    
    // Create a safe object for serialization - explicitly handle all nested objects
    const safeProject = {
      _id: project._id.toString(),
      title: project.title || '',
      shortDescription: project.shortDescription || '',
      longDescription: project.longDescription || '',
      category: project.category || '',
      technologies: Array.isArray(project.technologies) ? project.technologies : [],
      achievement: project.achievement || '',
      subtitle: project.subtitle || '',
      stack: Array.isArray(project.stack) ? project.stack : [],
      images: {
        thumbnail: project.images?.thumbnail || '',
        medium: project.images?.medium || '',
        large: project.images?.large || '',
      },
      featured: Boolean(project.featured),
      status: project.status || '',
      stats: project.stats && typeof project.stats === 'object' ? {
        ...project.stats
      } : {},
      links: project.links && typeof project.links === 'object' ? {
        github: project.links.github || '',
        live: project.links.live || '',
        demo: project.links.demo || '',
      } : {},
      features: Array.isArray(project.features) ? project.features : [],
      challenges: Array.isArray(project.challenges) ? project.challenges : [],
      // Convert dates to strings to avoid serialization issues
      createdAt: project.createdAt ? 
        (project.createdAt instanceof Date ? project.createdAt.toISOString() : new Date(project.createdAt).toISOString()) 
        : null,
      updatedAt: project.updatedAt ? 
        (project.updatedAt instanceof Date ? project.updatedAt.toISOString() : new Date(project.updatedAt).toISOString()) 
        : null,
      demoVideo: project.demoVideo || '',
      teamMembers: Array.isArray(project.teamMembers) ? project.teamMembers : [],
      solutions: Array.isArray(project.solutions) ? project.solutions : []
    };
    
    // Pass the safely serialized data to the client component
    return <ProjectDetailClient 
      project={safeProject} 
      projectId={params.id} 
    />;
  } catch (error) {
    console.error("Error in ProjectDetailPage:", error);
    return notFound();
  }
}