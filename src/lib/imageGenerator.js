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
      default: this.createTheme('#FFFFFF', '#000000'),
      red: this.createTheme('#FFE6E6', '#8B0000'),
      blue: this.createTheme('#E6F3FF', '#00008B'),
      green: this.createTheme('#E6FFE6', '#006400'),
      black: this.createTheme('#1A1A1A', '#FFFFFF'),
      gray: this.createTheme('#F0F0F0', '#333333'),
      dark: this.createTheme('#1a1a1a', '#FFFFFF'),
      love: this.createTheme('#FFF5F5', '#ff4646')
    };
  }

  createTheme(backgroundColor, textColor) {
    return {
      colors: {
        primary: textColor,
        secondary: this.adjustColor(textColor, 0.8),
        background: backgroundColor,
        text: textColor,
        title: this.adjustColor(textColor, 1.2),
        accent: this.adjustColor(textColor, 1.3)
      },
      fonts: {
        title: '"Noto Serif Tamil Slanted"',
        body: '"Annai MN"',
        branding: '"Tamil Sangam MN"',
        contact: '"Noto Sans Tamil"'
      },
      layout: {
        padding: 60,
        titleSize: 48,     // Increased title size
        bodySize: 36,      // Increased body text size
        lineHeight: 1.8,
        brandingSize: 32,  // Increased branding size
        contactSize: 24,   // Increased contact size
        textAlign: 'center' // Default alignment
      }
    };
  }

  adjustColor(hexColor, factor) {
    const rgb = this.hexToRgb(hexColor);
    return `rgb(${Math.min(255, Math.floor(rgb.r * factor))}, 
                ${Math.min(255, Math.floor(rgb.g * factor))}, 
                ${Math.min(255, Math.floor(rgb.b * factor))})`;
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }


  async createImage(text, options = {}) {
    const {
      width = 1200,
      height = 1200,
      theme: themeName = 'default',
      analysis = {},
      title = '',
      style = {}
    } = options;
  
    // Safely resolve the theme
    const baseTheme = this.themes[themeName] || this.themes.default;
    const theme = { ...baseTheme, layout: { ...baseTheme.layout, ...style } };
  
    try {
      console.log("Creating image with theme:", themeName);
      console.log("Resolved theme properties:", theme);
  
      // Step 1: Create base textured background
      let processedImage = await this.createTexturedBackground(width, height, theme);
  
      // Step 2: Add title if provided
      if (title) {
        const titleSvg = this.generateTitleSVG(title, theme);
        processedImage = await sharp(processedImage)
          .composite([{ input: Buffer.from(titleSvg), top: 80, left: 0 }])
          .toBuffer();
        console.log("Added title to the image.");
      }
  
      // Step 3: Add main content (text)
      if (text && text.trim()) {
        const contentSvg = this.generateContentSVG(text, theme, analysis);
        processedImage = await sharp(processedImage)
          .composite([{ input: Buffer.from(contentSvg), top: title ? 200 : 80, left: 0 }])
          .toBuffer();
        console.log("Added main content to the image.");
      } else {
        console.warn("Text content is missing or empty. Skipping content addition.");
      }
  
      // Step 4: Add branding and contact details
      const finalImage = await this.addBrandingElements(processedImage, theme);
      console.log("Added branding and contact details.");
  
      return finalImage;
    } catch (error) {
      console.error("Error in createImage:", error.message);
      throw error;
    }
  }
  

  async createTexturedBackground(width, height, theme) {
    try {
        // Create base image
        const baseImage = await sharp({
            create: {
                width,
                height,
                channels: 4,
                background: this.parseBackgroundColor(theme.colors.background)
            }
        }).png().toBuffer();

        try {
            // Use node-fetch or axios for fetching
            const textureUrl = "https://res.cloudinary.com/dk5p5vrwa/image/upload/v1732732038/image-generation-assets/textures/v7gnw9kgeoy501gjqnou.png";
            const response = await fetch(textureUrl);
            if (!response.ok) throw new Error(`Failed to fetch texture: ${response.statusText}`);
            
            const textureBuffer = await response.arrayBuffer();
            
            // Apply texture
            return await sharp(baseImage)
                .composite([{
                    input: Buffer.from(textureBuffer),
                    tile: true,
                    blend: 'overlay',
                    opacity: 0.15
                }])
                .toBuffer();
        } catch (textureError) {
            console.warn("Texture application failed:", textureError.message);
            // Return base image if texture application fails
            return baseImage;
        }
    } catch (error) {
        console.error("Error creating background:", error.message);
        throw error;
    }
}

// Helper method to parse background color
parseBackgroundColor(color) {
    if (!color) return { r: 255, g: 255, b: 255, alpha: 1 };
    
    if (typeof color === 'string' && color.startsWith('#')) {
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        return { r, g, b, alpha: 1 };
    }
    
    return color;
}
  

// Update branding elements with simpler SVG structure
async addBrandingElements(buffer, theme) {
  const brandingSvg = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="150" version="1.1">
  <text
    x="600"
    y="40"
    font-family="${theme.fonts.branding.replace(/"/g, '&quot;')}"
    font-size="${theme.layout.brandingSize}"
    fill="${theme.colors.primary}"
    text-anchor="middle"
  >அஜித்குமார்</text>
  <g transform="translate(100, 100)">
    <text
      x="0"
      y="0"
      font-family="${theme.fonts.contact.replace(/"/g, '&quot;')}"
      font-size="${theme.layout.contactSize}"
      fill="${theme.colors.text}"
    >www.ajithkumar.dev</text>
    <text
      x="500"
      y="0"
      font-family="${theme.fonts.contact.replace(/"/g, '&quot;')}"
      font-size="${theme.layout.contactSize}"
      fill="${theme.colors.text}"
      text-anchor="middle"
    >9944154823</text>
    <text
      x="900"
      y="0"
      font-family="${theme.fonts.contact.replace(/"/g, '&quot;')}"
      font-size="${theme.layout.contactSize}"
      fill="${theme.colors.text}"
      text-anchor="end"
    >@vaanawill</text>
  </g>
</svg>`;

  // Create background matching theme
  const brandingBackground = await sharp({
    create: {
      width: 1200,
      height: 150,
      channels: 4,
      background: this.parseBackgroundColor(theme.colors.background)
    }
  }).png().toBuffer();

  try {
    const brandingBuffer = await sharp(brandingBackground)
      .composite([{
        input: Buffer.from(brandingSvg),
        top: 0,
        left: 0
      }])
      .toBuffer();

    return await sharp(buffer)
      .composite([{
        input: brandingBuffer,
        gravity: 'south'
      }])
      .toBuffer();
  } catch (error) {
    console.error('Error generating branding:', error);
    throw new Error(`Failed to generate branding: ${error.message}`);
  }
}


// Update content generation for new font
generateContentSVG(text, theme, analysis) {
  const lines = text.split('\n').filter(line => line.trim());
  const lineHeight = theme.layout.lineHeight || 2.0;
  
  // Constants for positioning
  const RIGHT_MARGIN = 1100; // Right margin position
  const START_Y = theme.title ? 300 : 200; // Start lower if there's a title
  
  // Process each line with proper escaping
  const escapedLines = lines.map(line => 
    line.trim()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
  );

  // Generate SVG text elements with right alignment
  const svgContent = escapedLines.map((line, index) => {
    const yPosition = START_Y + (index * theme.layout.bodySize * lineHeight);
    
    return `    <text
      x="${RIGHT_MARGIN}"
      y="${yPosition}"
      font-family="${theme.fonts.body.replace(/"/g, '&quot;')}"
      font-size="${theme.layout.bodySize}"
      fill="${theme.colors.text}"
      text-anchor="end"
      dominant-baseline="middle"
      class="poetry-line"
    >${line}</text>`;
  }).join('\n');

  // Add decorative elements for poetry
  const decorativeElements = theme.effects?.decorativeElements ? `
    <path 
      d="M ${RIGHT_MARGIN - 500} 150 L ${RIGHT_MARGIN} 150" 
      stroke="${theme.colors.text}" 
      stroke-width="1"
      stroke-opacity="0.3"
    />
    <path 
      d="M ${RIGHT_MARGIN - 300} ${START_Y + (lines.length * theme.layout.bodySize * lineHeight) + 50} L ${RIGHT_MARGIN} ${START_Y + (lines.length * theme.layout.bodySize * lineHeight) + 50}" 
      stroke="${theme.colors.text}" 
      stroke-width="1"
      stroke-opacity="0.3"
    />` : '';

  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" version="1.1">
  <style>
    .poetry-line {
      font-family: ${theme.fonts.body.replace(/"/g, '&quot;')};
      ${theme.effects?.textShadow ? 'filter: drop-shadow(2px 2px 2px rgba(0,0,0,0.3));' : ''}
    }
  </style>
  ${decorativeElements}
  ${svgContent}
</svg>`;
}

// Update title generation for poetry
generateTitleSVG(title, theme) {
  const escapedTitle = title
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="150" version="1.1">
  <text
    x="600"
    y="75"
    font-family="${theme.fonts.title.replace(/"/g, '&quot;')}"
    font-size="${theme.layout.titleSize}"
    font-weight="800"
    fill="${theme.colors.title}"
    text-anchor="middle"
    dominant-baseline="middle"
    ${theme.effects?.textShadow ? 'filter="drop-shadow(2px 2px 2px rgba(0,0,0,0.3))"' : ''}
  >${escapedTitle}</text>
  <line 
    x1="300" 
    y1="100" 
    x2="900" 
    y2="100" 
    stroke="${theme.colors.title}"
    stroke-width="1"
  />
</svg>`;
}

// Helper method for Tamil text metrics
calculateTamilTextWidth(text, fontSize) {
  const tamilCharCount = (text.match(/[\u0B80-\u0BFF]/g) || []).length;
  const latinCharCount = text.length - tamilCharCount;
  
  // Adjust width calculation for Tamil characters
  return (tamilCharCount * fontSize * 0.8) + (latinCharCount * fontSize * 0.5);
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

// Update the wrapText method to handle different alignments
wrapText(text, maxChars, alignment = 'start') {
  if (!text) return [];
  
  // Adjust max chars based on alignment
  const adjustedMaxChars = alignment === 'start' ? maxChars + 5 : maxChars;
  
  // Split by explicit line breaks first
  const paragraphs = text.split('\n');
  
  // Process each paragraph for word wrapping
  return paragraphs.map(paragraph => {
    const words = paragraph.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const testLine = `${currentLine} ${word}`;
      
      // Adjust for Tamil characters
      const tamilCharCount = (testLine.match(/[\u0B80-\u0BFF]/g) || []).length;
      const effectiveLength = testLine.length + (tamilCharCount * 0.3);

      if (effectiveLength <= adjustedMaxChars) {
        currentLine = testLine;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    
    if (currentLine) {
      lines.push(currentLine);
    }
    
    return lines;
  }).flat();
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
