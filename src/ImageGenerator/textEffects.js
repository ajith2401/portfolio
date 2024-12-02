import { Writing } from "@/models";
import { uploadGeneratedImage } from "../cloudinary";
import { TamilTextAnalyzer } from "../tamilAnalysis/analyzer";
import imageGenerator from "./imageGenerator";

export class TextEffects {
  constructor () {
    this.analyzer = new TamilTextAnalyzer();
  }

   static generateDecorationElements(theme) {

        if (!theme.effects?.decorativeElements) return '';
    
        const decorations = [];
        const width = 1200;
        const height = 1200;
    
        // Add decorative lines
        if (theme.layout.textAlign === 'right') {
        decorations.push(`
            <line 
            x1="${width - 500}" 
            y1="150" 
            x2="${width - 100}" 
            y2="150" 
            stroke="${theme.colors.text}" 
            stroke-width="1"
            stroke-opacity="0.3"
            />
            <line 
            x1="${width - 400}" 
            y1="${height - 150}" 
            x2="${width - 100}" 
            y2="${height - 150}" 
            stroke="${theme.colors.text}" 
            stroke-width="1"
            stroke-opacity="0.3"
            />
        `);
        }
    
        return decorations.join('\n');
    }
  
  
    getCloudinaryUrl(assetPath) {
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        const folderPath = 'image-generation-assets';
        return `https://res.cloudinary.com/${cloudName}/image/upload/${folderPath}/${assetPath}`;
    }
  
     async generateForText(text, options = {}) {
        if (!text || typeof text !== 'string' || !text.trim()) {
        console.error("Error: Missing or invalid text content for image generation.");
        throw new Error("Text content is required for generating an image.");
        }
    
        console.log("Generating image with text:", text);
    
        try {
        // Create empty analysis object if analyzer is not available
        const analysis = this.analyzer ? await this.analyzer.analyzeText(text) : {};
        
        const imageBuffer = await imageGenerator.createImage(text, { 
            ...options, 
            analysis: analysis || {} // Ensure analysis is always defined
        });
    
        if (!imageBuffer || !(imageBuffer instanceof Buffer)) {
            throw new Error("Invalid image data generated.");
        }
    
        const uploadResult = await uploadGeneratedImage(imageBuffer, {
            folder: 'writings',
            transformation: [{ width: 1200, crop: 'scale', quality: 'auto' }]
        });
    
        return uploadResult;
        } catch (error) {
        console.error("Error generating image:", error.message);
        throw new Error(`Failed to generate image: ${error.message}`);
        }
    }
    
      async generateForWriting(writingId) {
        await connectDB();
        const writing = await Writing.findById(writingId);
        
        if (!writing) {
            throw new Error('Writing not found');
        }
    
        const themeMap = {
            poem: 'love',
            philosophy: 'philosophical',
            article: 'default',
            'short story': 'emotional'
        };

        const images = await this.generateForText(writing.body, {
            title: writing.title,
            themeName: themeMap[writing.category] || 'default',
            category: writing.category
        });
        
        writing.images = images;
        await writing.save();
        
        return images;
        }
  
     async addTextEffects(buffer, theme) {
      // Add various text effects based on theme
      const composite = [];
      
      if (theme.effects?.textShadow) {
        composite.push({
          input: await this.createShadowLayer(buffer),
          blend: 'multiply',
          opacity: 0.3
        });
      }
  
      if (theme.effects?.glow) {
        composite.push({
          input: await this.createGlowLayer(buffer),
          blend: 'screen',
          opacity: 0.4
        });
      }
  
      return sharp(buffer)
        .composite(composite)
        .toBuffer();
    }
  
     async createShadowLayer(buffer) {
      return sharp(buffer)
        .blur(3)
        .linear(-0.5, 1)
        .toBuffer();
    }
  
     async createGlowLayer(buffer) {
      return sharp(buffer)
        .blur(10)
        .linear(1, 0)
        .toBuffer();
    }
    
}

export default new TextEffects()