import { NextResponse } from 'next/server';
import imageGenerationService from '@/ImageGenerator/imageGenerator';
import { Writing } from '@/models';
import connectDB from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    await connectDB();
    const { text, writingId, options = {} } = await request.json();

    if (!text && !writingId) {
      return NextResponse.json(
        { error: 'Either text or writingId is required' },
        { status: 400 }
      );
    }

    let images;
    if (writingId) {
      // Find the writing
      const writing = await Writing.findById(writingId);
      if (!writing) {
        return NextResponse.json(
          { error: 'Writing not found' },
          { status: 404 }
        );
      }

      // Generate image using existing writing's content
      images = await imageGenerationService.createImage(writing.body, {
        title: writing.title,
        category: writing.category,
        ...options
      });

      // Update the writing with new images
      writing.images = images;
      await writing.save();
    } else {
      // Generate image for provided text
      images = await imageGenerationService.createImage(text, options);
    }

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate image',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}