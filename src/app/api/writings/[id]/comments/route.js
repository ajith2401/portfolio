import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Writing, Comment } from '@/models';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const comments = await Comment.find({ writing: params.id })
      .sort({ createdAt: -1 });
    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    await connectDB();
    const commentData = await request.json();
    
    const writing = await Writing.findById(params.id);
    if (!writing) {
      return NextResponse.json({ error: 'Writing not found' }, { status: 404 });
    }
    
    const comment = await Comment.create({
      ...commentData,
      writing: params.id
    });
    
    writing.comments.push(comment._id);
    await writing.save();
    
    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}