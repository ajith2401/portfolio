import { NextResponse } from 'next/server';
import { Project } from '@/models/project.model';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';

/**
 * GET handler for related projects with enhanced search capabilities
 */
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    const url = new URL(request.url);
    
    // Get query parameters
    const limit = parseInt(url.searchParams.get('limit') || '3', 10);
    const searchTerm = url.searchParams.get('search') || '';
    const shouldIncludeAllCategories = url.searchParams.get('allCategories') === 'true';
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid project ID format' },
        { status: 400 }
      );
    }
    
    // Use lean() for better performance when we just need the data
    const currentProject = await Project.findById(id).lean();
    
    if (!currentProject) {
      return NextResponse.json(
        { status: 'error', message: 'Project not found' },
        { status: 404 }
      );
    }
    
    // Base query to exclude current project and only show published projects
    const baseQuery = {
      _id: { $ne: id },
      status: 'published'
    };
    
    // Add text search if provided
    if (searchTerm) {
      baseQuery.$or = [
        { title: { $regex: searchTerm, $options: 'i' } },
        { shortDescription: { $regex: searchTerm, $options: 'i' } },
        { longDescription: { $regex: searchTerm, $options: 'i' } },
        { 'stack': { $in: [new RegExp(searchTerm, 'i')] } }
      ];
    }
    
    // Determine strategy based on whether we want to enforce same category
    let projects = [];
    
    if (shouldIncludeAllCategories) {
      // Just get related projects across all categories
      projects = await Project.find(baseQuery)
        .sort({ featured: -1, createdAt: -1 })
        .limit(limit)
        .select('-longDescription') // Exclude long text
        .lean();
    } else {
      // Try to get projects from the same category first
      const sameCategory = { ...baseQuery, category: currentProject.category };
      
      const relatedProjects = await Project.find(sameCategory)
        .sort({ featured: -1, createdAt: -1 })
        .limit(limit)
        .select('-longDescription')
        .lean();
      
      // If not enough projects in the same category, get others to fill the quota
      if (relatedProjects.length < limit) {
        const otherCategories = {
          ...baseQuery,
          category: { $ne: currentProject.category }
        };
        
        const additionalProjects = await Project.find(otherCategories)
          .sort({ featured: -1, createdAt: -1 })
          .limit(limit - relatedProjects.length)
          .select('-longDescription')
          .lean();
        
        projects = [...relatedProjects, ...additionalProjects];
      } else {
        projects = relatedProjects;
      }
    }
    
    // Optionally enhance the related projects selection using stack/technologies for better matches
    // This adds a relevance score based on shared technologies
    if (projects.length > 0 && currentProject.stack && currentProject.stack.length > 0) {
      // Calculate relevance score (number of shared technologies)
      projects = projects.map(project => {
        const sharedTechnologies = project.stack?.filter(tech => 
          currentProject.stack.includes(tech)
        ).length || 0;
        
        return {
          ...project,
          relevanceScore: sharedTechnologies
        };
      });
      
      // Sort by relevance score (highest first), then by creation date
      projects.sort((a, b) => {
        if (b.relevanceScore !== a.relevanceScore) {
          return b.relevanceScore - a.relevanceScore;
        }
        return b.featured ? 1 : -1;
      });
      
      // Limit to the requested number
      projects = projects.slice(0, limit);
    }
    
    return NextResponse.json({
      status: 'success',
      data: { 
        projects,
        meta: {
          total: projects.length,
          currentProjectId: id,
          currentProjectCategory: currentProject.category
        }
      }
    });
  } catch (error) {
    console.error('Error fetching related projects:', error);
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}