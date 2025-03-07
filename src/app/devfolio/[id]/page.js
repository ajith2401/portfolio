import { notFound } from 'next/navigation';
import ProjectDetailClient from './ProjectDetailClient';

// Fetch project data using the server component
export async function generateMetadata({ params }) {
  try {
    const project = await getProject(params.id);
    
    return {
      title: `${project.title} | Ajith Kumar`,
      description: project.shortDescription,
      openGraph: {
        title: `${project.title} | Ajith Kumar`,
        description: project.shortDescription,
        images: [project.images?.large || project.images?.medium || '/placeholder.jpg'],
      },
    };
  } catch (error) {
    return {
      title: 'Project Details | Ajith Kumar',
      description: 'Explore the details of this project',
    };
  }
}

async function getProject(id) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/projects/${id}`, { 
      cache: 'no-store'
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch project data');
    }
    
    const data = await res.json();
    return data.data.project;
  } catch (error) {
    console.error('Error fetching project:', error);
    throw error;
  }
}

export default async function ProjectDetailPage({ params }) {
  try {
    const project = await getProject(params.id);
    return <ProjectDetailClient project={project} projectId={params.id} />;
  } catch (error) {
    notFound();
  }
}