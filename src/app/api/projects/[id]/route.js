// src/app/api/projects/[id]/route.js
import { NextResponse } from 'next/server';
import { Project } from '@/models/project.model';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';


// Helper to validate MongoDB ObjectId
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// GET a single project by ID
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    
    // Validate ObjectId
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid project ID format' },
        { status: 400 }
      );
    }
    
    // Find the project
    const project = await Project.findById(id);
    
    // Check if project exists
    if (!project) {
      return NextResponse.json(
        { status: 'error', message: 'Project not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      status: 'success',
      data: { project }
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}