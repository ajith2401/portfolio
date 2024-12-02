//src/app/api/writings/with-image/route.js
import connectDB from "@/lib/db";
import { ImageGenerationService } from "@/lib/ImageGenerator/imageGenerator";
import { NextResponse } from "next/server";
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// // Initialize the service
const imageGenerationService = new ImageGenerationService();

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


// const imageCustomizer = new ImageCustomizer();

// // Supported image configurations
// const CONFIG = {
//   categories: ['poem', 'article', 'short story', 'philosophy', 'letter'],
//   defaultResolutions: {
//     poem: 'square',
//     article: 'fullHd',
//     'short story': 'fullHd',
//     philosophy: 'square',
//     letter: 'square'
//   },
//   themeMap: {
//     poem: 'nature',
//     philosophy: 'ocean',
//     article: 'minimal',
//     'short story': 'midnight',
//     letter: 'sky'
//   }
// };

// export async function POST(request) {
//   try {
//     await connectDB();
    
//     const writingData = await request.json();
//     console.log('Received writing data:', writingData);

//     // Validate request
//     const validationError = validateRequest(writingData);
//     if (validationError) {
//       return validationError;
//     }

//     // Process and generate image
//     const processedWriting = await processWriting(writingData);

//     return NextResponse.json(processedWriting, { status: 201 });

//   } catch (error) {
//     console.error('Error processing writing:', error);
//     return NextResponse.json(
//       createErrorResponse(error),
//       { status: 500 }
//     );
//   }
// }

// function validateRequest(data) {
//   // Validate required fields
//   if (!data.body || !data.title) {
//     return NextResponse.json({ error: 'Title and body are required' }, { status: 400 });
//   }

//   // Validate category
//   const normalizedCategory = data.category.trim().toLowerCase();
//   if (!CONFIG.categories.includes(normalizedCategory)) {
//     return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
//   }

//   // Validate theme (optional)
//   if (data.theme && !Object.values(CONFIG.themeMap).includes(data.theme)) {
//     console.warn(`Invalid theme "${data.theme}", falling back to default.`);
//   }

//   return null;
// }

// function processEffects(effects = {}) {
//   const processedEffects = [];

//   if (effects.textShadow) {
//     processedEffects.push({
//       type: 'shadow',
//       options: {
//         blur: effects.shadowBlur || 3,
//         opacity: effects.shadowOpacity || 0.3
//       }
//     });
//   }

//   if (effects.glow) {
//     processedEffects.push({
//       type: 'glow',
//       options: {
//         intensity: effects.glowIntensity || 0.4,
//         color: effects.glowColor || '#ffffff'
//       }
//     });
//   }

//   return processedEffects;
// }

// async function processWriting(data) { 
//   try {
//     // Prepare image generation options
//     const imageOptions = createImageOptions(data);

//     // Generate image
//     const imageBuffer = await imageCustomizer.generateImage(
//       { title: data.title, body: data.body, type: data.category },
//       imageOptions
//     );

//     // Upload to Cloudinary
//     let uploadResult;
//     try {
//       uploadResult = await uploadGeneratedImage(imageBuffer, {
//         folder: 'writings',
//         transformation: [{ quality: 'auto' }, { format: 'auto' }]
//       });
//     } catch (error) {
//       console.error('Cloudinary upload failed:', error);
//       throw new Error('Failed to upload image');
//     }

//     // Create writing document
//     const writing = await Writing.create({
//       title: data.title,
//       body: data.body,
//       category: data.category,
//       images: uploadResult,
//       createdAt: new Date(),
//       metadata: {
//         theme: imageOptions.themeName,
//         resolution: imageOptions.resolution,
//         effects: imageOptions.effects
//       }
//     });

//     return writing;
//   } catch (error) {
//     console.error('Error processing writing:', error.message);
//     throw error;
//   }
// }

// function createImageOptions(data) {
//   return {
//     // Theme selection
//     themeName: data.theme || CONFIG.themeMap[data.category] || 'minimal',
    
//     // Layout configuration
//     layoutType: data.category,
//     resolution: data.resolution || CONFIG.defaultResolutions[data.category],
    
//     // Format and quality
//     format: data.format || 'webp',
//     quality: data.quality || 90,
//     optimize: true,
    
//     // Effects
//     effects: processEffects(data.effects),
    
//     // Typography
//     typography: {
//       titleSize: data.style?.titleSize || 48,
//       bodySize: data.style?.bodySize || 32,
//       titleLineHeight: data.style?.titleLineHeight || 1.4,
//       bodyLineHeight: data.style?.lineHeight || 1.8,
//       titleWeight: data.style?.titleWeight || 800,
//       bodyWeight: data.style?.bodyWeight || 400
//     },
    
//     // Custom layout options
//     customLayout: {
//       padding: data.style?.padding || 60,
//       spacing: data.style?.spacing || 40
//     }
//   };
// }

// function createErrorResponse(error) {
//   return {
//     error: 'Failed to process writing',
//     details: error.message,
//     stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
//   };
// }


// Handle DELETE request to cleanup images if needed
// export async function DELETE(request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const id = searchParams.get('id');

//     if (!id) {
//       return NextResponse.json(
//         { error: 'Writing ID is required' },
//         { status: 400 }
//       );
//     }

//     await connectDB();
//     await imageGenerationService.deleteWritingWithImages(id);

//     return NextResponse.json({ success: true }, { status: 200 });

//   } catch (error) {
//     console.error('Error deleting writing and images:', error);
//     return NextResponse.json(
//       { error: 'Failed to delete writing and images' },
//       { status: 500 }
//     );
//   }
// }