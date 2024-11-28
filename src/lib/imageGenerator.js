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
          text: '#000000',
          title: '#FF0000',
          accent: '#FF0000'
        },
        fonts: {
          title: '"Noto Serif Tamil Slanted"',    // Title font
          body: '"Annai MN"',                     // Body font
          branding: '"Tamil Sangam MN"',          // Author name font
          contact: '"Noto Sans Tamil"'            // Contact details font
        },
        layout: {
          padding: 60,
          titleSize: 42,     // Title size
          bodySize: 32,      // Body text size
          lineHeight: 1.8,   // Line spacing
          brandingSize: 24,  // Author name size
          contactSize: 18    // Contact details size
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
  try {
      const brandingSvg = `
          <svg width="1200" height="100" xmlns="http://www.w3.org/2000/svg">
              <!-- Brand Name -->
              <text
                  x="600"
                  y="30"
                  font-family="${theme?.fonts?.branding}"
                  font-size="${theme?.layout?.brandingSize}px"
                  fill="#FF0000"
                  text-anchor="middle"
              >அஜித்குமார்</text>

              <!-- Contact Details -->
              <g transform="translate(100, 80)">
                  <!-- Website -->
                  <text
                      x="0"
                      y="0"
                      font-family="${theme?.fonts?.contact}"
                      font-size="${theme?.layout?.contactSize}px"
                      fill="#000000"
                  >www.ajithkumar.dev</text>

                  <!-- Phone -->
                  <text
                      x="500"
                      y="0"
                      font-family="${theme?.fonts?.contact}"
                      font-size="${theme?.layout?.contactSize}px"
                      fill="#000000"
                      text-anchor="middle"
                  >9944154823</text>

                  <!-- Instagram -->
                  <text
                      x="900"
                      y="0"
                      font-family="${theme?.fonts?.contact}"
                      font-size="${theme?.layout?.contactSize}px"
                      fill="#000000"
                      text-anchor="end"
                  >@vaanawill</text>
              </g>
          </svg>
      `;

      // First create a white background for the branding area
      const brandingBackground = await sharp({
          create: {
              width: 1200,
              height: 100,
              channels: 4,
              background: { r: 255, g: 255, b: 255, alpha: 1 }
          }
      }).png().toBuffer();

      // Create final branding with text
      const brandingBuffer = await sharp(brandingBackground)
          .composite([{
              input: Buffer.from(brandingSvg),
              top: 0,
              left: 0
          }])
          .toBuffer();

      // Add the branding to the main image
      return await sharp(buffer)
          .composite([{
              input: brandingBuffer,
              gravity: 'south'  // Place at bottom
          }])
          .toBuffer();
  } catch (error) {
      console.warn("Error adding branding and contact details:", error.message);
      return buffer;
  }
}

// Update content generation for new font
generateContentSVG(text, theme, analysis) {
  const textLines = text.split('\n').map(line => this.wrapText(line, 25)).flat();
  const lineHeight = theme.layout.lineHeight || 1.8;
  const startY = 250;

  const textElements = textLines.map((line, index) => `
    <text
      x="600"
      y="${startY + (index * (theme?.layout?.bodySize || 32) * lineHeight)}"
      font-family="${theme?.fonts?.body}"
      font-size="${theme?.layout?.bodySize || 32}px"
      fill="#000000"
      text-anchor="middle"
      dominant-baseline="middle"
    >${line.trim()}</text>
  `).join('');

  return `
    <svg width="1200" height="1200" xmlns="http://www.w3.org/2000/svg">
      ${textElements}
    </svg>
  `;
}

// Update title generation for new font
generateTitleSVG(title, theme) {
  return `
      <svg width="1200" height="150" xmlns="http://www.w3.org/2000/svg">
          <text
              x="600"
              y="75"
              font-family="${theme?.fonts?.title}"
              font-size="${theme?.layout?.titleSize || 42}px"
              font-weight="800"
              fill="#FF0000"
              text-anchor="middle"
              dominant-baseline="middle"
          >${title}</text>

          <!-- Title underline -->
          <line 
              x1="300" 
              y1="100" 
              x2="900" 
              y2="100" 
              stroke="#FF0000"
              stroke-width="1"
          />
      </svg>
  `;
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

wrapText(text, maxChars) {
    if (!text) return [];
    
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

            if (effectiveLength <= maxChars) {
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
    }).flat(); // Flatten the array of arrays into a single array of lines
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
