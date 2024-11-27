// src/lib/imageGeneration/imageGenerationService.js
import sharp from 'sharp';
import path from 'path';
import { TamilTextAnalyzer } from './tamilAnalysis/analyzer';
import { uploadGeneratedImage } from './cloudinary';
import connectDB from './db';
import { Writing } from '@/models';

export class ImageGenerationService {
  constructor() {
    this.analyzer = new TamilTextAnalyzer();
    this.setupThemes();
  }

  setupThemes() {
    this.themes = {
      default: {
        colors: {
          primary: '#1DA1F2',
          secondary: '#2C3E50',
          background: '#FFFFFF',
          text: '#2D3436',
          title: '#1DA1F2',
          accent: '#ff6b6b'
        },
        fonts: {
          title: 'NotoSansTamilBold',
          body: 'NotoSansTamil'
        },
        layout: {
          padding: 60,
          titleSize: 48,
          bodySize: 32,
          lineHeight: 1.6
        },
        effects: {
          textShadow: true,
          backgroundTexture: true,
          decorativeElements: true
        }
      },
      dark: {
        colors: {
          primary: '#FFFFFF',
          secondary: '#333333',
          background: '#1a1a1a',
          text: '#FFFFFF',
          title: '#1DA1F2',
          accent: '#ff6b6b'
        }
      },
      love: {
        colors: {
          primary: '#ff6b6b',
          secondary: '#ff8787',
          background: '#FFF5F5',
          text: '#2D3436',
          title: '#ff4646',
          accent: '#ff4646'
        },
        decorations: ['hearts', 'flowers']
      }
    };
  }

  async createImage(text, options = {}) {
    const { width = 1200, height = 1200, theme: themeName = 'default', analysis, title, style = {} } = options;

    const baseTheme = this.themes[themeName] || this.themes.default;
    const theme = { ...baseTheme, layout: { ...baseTheme.layout, ...style } };

    try {
      let processedImage = await this.createTexturedBackground(width, height, theme);

      if (title) {
        const titleSvg = this.generateTitleSVG(title, theme);
        processedImage = await sharp(processedImage)
          .composite([{ input: Buffer.from(titleSvg), top: 80, left: 0 }])
          .toBuffer();
      }

      const contentSvg = this.generateContentSVG(text, theme, analysis);
      processedImage = await sharp(processedImage)
        .composite([{ input: Buffer.from(contentSvg), top: title ? 200 : 80, left: 0 }])
        .toBuffer();

      return await this.addBrandingElements(processedImage, theme);
    } catch (error) {
      console.error("Error in createImage:", error.message);
      throw error;
    }
  }

  async createTexturedBackground(width, height, theme) {
    try {
      const baseImage = await sharp({
        create: {
          width,
          height,
          channels: 4,
          background: theme.colors.background || { r: 255, g: 255, b: 255, alpha: 1 }
        }
      }).png().toBuffer();

      const texturePath = path.join(process.cwd(), 'public/textures/paper-texture.png');
      return await sharp(baseImage)
        .composite([{ input: texturePath, tile: true, blend: 'overlay', opacity: 0.15 }])
        .toBuffer();
    } catch (error) {
      console.warn("Texture file missing, using plain background:", error.message);
      return baseImage;
    }
  }

  generateTitleSVG(title, theme) {
    return `
      <svg width="1200" height="120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="titleShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
            <feOffset dx="2" dy="2" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <text
          x="600"
          y="60"
          font-family="${theme?.fonts?.title}"
          font-size="${theme?.layout?.titleSize}px"
          fill="${theme?.colors?.title}"
          text-anchor="middle"
          filter="url(#titleShadow)"
        >${title}</text>
        
        <!-- Decorative underline -->
        <path 
          d="M400 80 L800 80" 
          stroke="${theme.colors.accent}"
          stroke-width="3"
          stroke-linecap="round"
          opacity="0.6"
        />
      </svg>
    `;
  }

generateContentSVG(text, theme, analysis) {
    const lines = this.wrapText(text || "No content provided.", 30);
    const lineHeight = theme.layout.lineHeight;
    const startY = 200;

    const textElements = lines.map((line, index) => `
      <text
        x="600"
        y="${startY + (index * theme?.layout?.bodySize * lineHeight)}"
        font-family="${theme?.fonts?.body}"
        font-size="${theme?.layout?.bodySize}px"
        fill="${theme?.colors?.text}"
        text-anchor="middle"
        filter="url(#textShadow)"
      >${line}</text>
    `).join('');

    return `
      <svg width="1200" height="1200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="textShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1"/>
            <feOffset dx="1" dy="1" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.2"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        ${textElements}
      </svg>
    `;
}

  async addBrandingElements(buffer, theme) {
    if (!theme || !theme.colors) {
      console.warn("Skipping branding: Theme or colors missing.");
      return buffer;
    }

    try {
      const logoPath = path.join(process.cwd(), 'public/images/logo.png');
      return await sharp(buffer)
        .composite([{ input: logoPath, left: 40, top: 1100, width: 120, height: 40 }])
        .toBuffer();
    } catch (error) {
      console.warn("Logo not found. Proceeding without branding:", error.message);
      return buffer;
    }
  }

  async generateForText(text, options = {}) {
    if (!text || typeof text !== 'string' || !text.trim()) {
      console.error("Error: Missing or invalid text content for image generation.");
      throw new Error("Text content is required for generating an image.");
    }

    console.log("Generating image with text:", text);

    try {
      const analysis = this.analyzer.analyzeText(text);
      const imageBuffer = await this.createImage(text, { ...options, analysis });

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



  async createAndSaveWriting(options) {
    const { title, body, category, theme = 'default', effects, style } = options;

    // Validate input
    if (!body || typeof body !== 'string' || !body.trim()) {
      console.error("Error: Missing or invalid 'body' content.");
      throw new Error("Body content is required for generating an image.");
    }

    console.log("Creating writing with options:", { title, category, theme });

    const themeMap = { poem: 'love', philosophy: 'philosophical', article: 'default', 'short story': 'emotional' };

    try {
      const images = await this.generateForText(body, {
        title,
        theme: theme || themeMap[category] || 'default',
        effects,
        style
      });

      const writing = await Writing.create({
        title,
        body,
        category,
        images,
        createdAt: options.createdAt || new Date()
      });

      return writing;
    } catch (error) {
      console.error("Error in createAndSaveWriting:", error.message);
      throw error;
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

  wrapText(text, maxChars) {
    // Enhanced text wrapping with Tamil language support
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const testLine = `${currentLine} ${word}`;
      
      // Check for Tamil-specific characters and adjust line breaks
      const tamilCharCount = (testLine.match(/[\u0B80-\u0BFF]/g) || []).length;
      const effectiveLength = testLine.length + (tamilCharCount * 0.5); // Adjust for Tamil chars

      if (effectiveLength <= maxChars) {
        currentLine = testLine;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    
    lines.push(currentLine);
    return lines;
  }

  calculateTextDimensions(text, fontSize, fontFamily) {
    // Utility method to calculate text dimensions
    const avgCharWidth = fontSize * 0.6; // Approximate width for Tamil chars
    const tamilCharCount = (text.match(/[\u0B80-\u0BFF]/g) || []).length;
    const latinCharCount = text.length - tamilCharCount;
    
    return {
      width: (tamilCharCount * avgCharWidth * 1.2) + (latinCharCount * avgCharWidth),
      height: fontSize * 1.2
    };
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

  getThemeDecorations(theme, analysis) {
    const decorations = [];
    
    // Theme-specific decorations
    if (theme.decorations?.length > 0) {
      theme.decorations.forEach(decoration => {
        decorations.push({
          type: decoration,
          position: this.getRandomPosition(),
          opacity: 0.3,
          rotation: Math.random() * 360
        });
      });
    }

    // Sentiment-based decorations
    if (analysis?.sentiment?.polarity === 'positive') {
      decorations.push({
        type: 'sparkles',
        position: { x: 'random', y: 'top' },
        opacity: 0.4
      });
    }

    return decorations;
  }

  getRandomPosition() {
    return {
      x: Math.floor(Math.random() * 800) + 200, // Keep away from edges
      y: Math.floor(Math.random() * 800) + 200
    };
  }

  hexToRgba(hex, alpha = 1) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  validateImageDimensions(width, height) {
    const maxDimension = 3000;
    const minDimension = 200;

    if (width > maxDimension || height > maxDimension) {
      throw new Error(`Image dimensions cannot exceed ${maxDimension}px`);
    }

    if (width < minDimension || height < minDimension) {
      throw new Error(`Image dimensions cannot be less than ${minDimension}px`);
    }

    return true;
  }
}

export default new ImageGenerationService();
