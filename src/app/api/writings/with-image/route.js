//src/app/api/writings/with-image/route.js
import connectDB from "@/lib/db";
import imageGenerationService from "@/ImageGenerator/imageGenerator";
import { NextResponse } from "next/server";
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    await connectDB();
    
    const writingData = await request.json();
    console.dir(writingData, { depth: 5, color: true });

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

    // Base options
    const baseOptions = {
      title: writingData.title,
      body: writingData.body,
      category: writingData.category,
      textureType: writingData.textureType,
      themeMode: writingData.themeMode || "backgroundImage",
      theme: writingData.theme || 'default',
      createdAt: new Date()
    };

    // Prepare options based on whether it's custom styled or not
    let options;
    
    if (writingData.customSettings) {
      // Custom styled options
      options = {
        ...baseOptions,
        isCustomStyles: true,
        customSettings: writingData.customSettings,
        effects: {
          textShadow: writingData.effects?.textShadow ?? true,
          glow: writingData.effects?.glow ?? false,
          decorativeElements: writingData.effects?.decorativeElements ?? true,
          backgroundTexture: writingData.effects?.backgroundTexture ?? true,
          shadow: writingData.effects?.shadow || {
            blur: 4,
            opacity: 0.4,
            offset: { x: 2, y: 2 }
          }
        },
        style: {
          textAlign: writingData.style?.textAlign || "center",
          titleSize: writingData.style?.titleSize || 48,
          bodySize: writingData.style?.bodySize || 32,
          lineHeight: writingData.style?.lineHeight || 2,
          position: writingData.style?.position || {
            global: { x: 0, y: 0 },
            title: { x: 0, y: 0 },
            content: { x: 0, y: 0 }
          }
        }
      };
    } else {
      // Standard theme options
      options = {
        ...baseOptions,
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
          position: writingData.style?.position || "top-right"
        }
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
    }
    // Generate image and save writing
    const writing = await imageGenerationService.createAndSaveWriting(options);

    if (!writing) {
      throw new Error('Failed to create writing');
    }

    return NextResponse.json(writing, { status: 201 });

  } catch (error) {
    console.error('Error creating writing with image:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to create writing with image',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}