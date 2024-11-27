// src/app/api/writings/generate-image/route.js
import { NextResponse } from 'next/server';
import imageGenerationService from '@/lib/imageGeneration/imageGenerationService';

export async function POST(request) {
  try {
    const { text, writingId } = await request.json();

    if (!text && !writingId) {
      return NextResponse.json(
        { error: 'Either text or writingId is required' },
        { status: 400 }
      );
    }

    let images;
    if (writingId) {
      images = await imageGenerationService.generateForWriting(writingId);
    } else {
      images = await imageGenerationService.generateForText(text);
    }

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
}

