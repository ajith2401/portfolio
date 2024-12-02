//src/app/api/writings/with-image/route.js
import connectDB from "@/lib/db";
import imageGenerationService from "@/ImageGenerator/imageGenerator";
import { NextResponse } from "next/server";
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    // Connect to database first
    await connectDB();
    
    const writingData = await request.json();
    console.log('Received writing data:', writingData);

    // Validate required fields
    if (!writingData.body || !writingData.title) {
      return NextResponse.json(
        { error: 'Title and body are required' },
        { status: 400 }
      );
    }

    // Validate category
    const validCategories = ['poem', 'article', 'short story', 'philosophy', 'letter'];
    if (!validCategories.includes(writingData.category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      );
    }

    // Prepare options with defaults
    const options = {
      title: writingData.title,
      body: writingData.body,
      category: writingData.category,
      textureType : writingData.textureType,
      themeMode : writingData.themeMode ||"backgroundImage",
      theme: writingData.theme || 'default',
      effects: {
        textShadow: writingData.effects?.textShadow ?? true,
        glow: writingData.effects?.glow ?? false,
        decorativeElements: writingData.effects?.decorativeElements ?? true,
        backgroundTexture: writingData.effects?.backgroundTexture ?? true
      },
      style: {
        titleSize: writingData.style?.titleSize || 48,
        bodySize: writingData.style?.bodySize || 32,
        lineHeight: writingData.style?.lineHeight || 1.6,
        textAlign: writingData.style?.textAlign || "center",
        position:  writingData.style?.position || "top-right"
      },
      createdAt: new Date()
    };

    // Map categories to appropriate themes if not specified
    const themeMap = {
      poem: 'love',
      philosophy: 'philosophical',
      article: 'default',
      'short story': 'emotional',
      letter: 'default'
    };

    if (!options.theme || options.theme === 'default') {

      options.theme = themeMap[options.category] || 'default';
    }

    console.log('Processing with options:', options);
    
    // Generate image and save writing
    const writing = await imageGenerationService.createAndSaveWriting(options);

    if (!writing) {
      throw new Error('Failed to create writing');
    }

    return NextResponse.json(writing, { status: 201 });

  } catch (error) {
    console.error('Error creating writing with image:', error);
    
    // Provide more detailed error response
    return NextResponse.json(
      { 
        error: 'Failed to create writing with image',
        details: error.message,
        // Only include stack trace in development
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}