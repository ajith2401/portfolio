// src/app/api/writings/custom-image/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Writing } from '@/models';
import  { CustomImageGenerationService } from '@/ImageGenerator/customImageGenerationService'; 

const customImageGenerationService = new CustomImageGenerationService()

export async function POST(req) {
  try {
    const data = await req.json();
    const {
      title,
      body,
      category,
      textureType = "starrySky",
      themeMode = "gradient",
      theme = "etherealDream",
      effects = {},
      style = {},
      customSettings
    } = data;

    if (!body || typeof body !== 'string' || !body.trim()) {
      return NextResponse.json(
        { error: "Body content is required" },
        { status: 400 }
      );
    }

    // Generate image using the custom service
    const images = await customImageGenerationService.generateForTextCustom(body, {
      title,
      themeMode,
      theme,
      textureType,
      effects,
      style,
      customSettings
    });

    // Connect to database
    await connectDB();

    // Create writing record
    const writing = await Writing.create({
      title,
      body,
      category,
      images,
      createdAt: new Date()
    });

    return NextResponse.json(writing, { status: 201 });

  } catch (error) {
    console.error('Error in image generation:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate image', 
        details: error.message 
      },
      { status: 500 }
    );
  }
}