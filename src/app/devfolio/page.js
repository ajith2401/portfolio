import DevfolioClient from "./DevfolioClient";

// Metadata for the page
export const metadata = {
  title: 'Project Portfolio | Ajith Kumar',
  description: 'Explore my projects showcasing award-winning applications and innovative solutions that make a real impact.',
};

// Fetch projects data on the server
async function getProjects() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/projects?status=published&limit=100`, { 
      cache: 'no-store'
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch projects');
    }
    
    const data = await res.json();
    return data.data.projects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export default async function DevfolioPage() {
  const projects = await getProjects();
  
  return (
    <DevfolioClient initialProjects={projects} />
  );
}