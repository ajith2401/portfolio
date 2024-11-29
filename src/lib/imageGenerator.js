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
      // Basic themes with background images
      default: {
        ...this.createTheme('#FFFFFF', '#000000'),
        name: 'default',
        backgroundImage: 'whiteIinedImg.jpg'
      },
      
      red: {
        ...this.createTheme('#FFE6E6', '#8B0000'),
        name: 'red',
        backgroundImage: 'redlinedImg.jpg'
      },
      
      blue: {
        ...this.createTheme('#E6F3FF', '#00008B'),
        name: 'blue',
        backgroundImage: 'blueImg.jpg'
      },
      
      green: {
        ...this.createTheme('#E6FFE6', '#006400'),
        name: 'green',
        backgroundImage: 'greenImg.jpg'
      },
      
      black: {
        ...this.createTheme('#1A1A1A', '#FFFFFF'),
        name: 'black',
        backgroundImage: 'paintedBlackImg.jpg'
      },
      
      gray: {
        ...this.createTheme('#F0F0F0', '#333333'),
        name: 'gray',
        backgroundImage: 'grayImg.jpg'
      },
      
      dark: {
        ...this.createTheme('#1a1a1a', '#FFFFFF'),
        name: 'dark',
        backgroundImage: 'paintedBlackImg.jpg'
      },
  
      // Complex themes with specific backgrounds
      navyBlue: {
        ...this.createTheme('#D3EFF4', '#05445E', '#189AB4'),
        name: 'navyBlue',
        backgroundImage: 'navyblueImg.jpg'
      },
  
      midnightBlue: {
        ...this.createTheme('#D3EFF4', '#274472', '#41729F'),
        name: 'midnightBlue',
        backgroundImage: 'navyblueImg.jpg'
      },
  
      blackDustyRose: {
        ...this.createTheme('#E9DDD4', '#000000', '#8B4513'),
        name: 'blackDustyRose',
        backgroundImage: 'blackDustyRose.jpg'
      },
  
      creamTan: {
        ...this.createTheme('#F3ECDA', '#94553D', '#6B4423'),
        name: 'creamTan',
        backgroundImage: 'brownImg.jpg'
      },
  
      jetBlack: {
        ...this.createTheme('#FDFDFD', '#050606', '#ADB3BC'),
        name: 'jetBlack',
        backgroundImage: 'blackCloth.jpg'
      },
  
      limeGreen: {
        ...this.createTheme('#F6FFE5', '#4A7212', '#104210'),
        name: 'limeGreen',
        backgroundImage: 'limeGreenImg.jpg'
      },
  
      tealGray: {
        ...this.createTheme('#EAF4F4', '#4B7A7A', '#2F4F4F'),
        name: 'tealGray',
        backgroundImage: 'tealGrayImg.jpg'
      },
  
      skyBlue: {
        ...this.createTheme('#EDF2FB', '#003F88', '#00296B'),
        name: 'skyBlue',
        backgroundImage: 'lightBlueImg.jpg'
      },
  
      softGreen: {
        ...this.createTheme('#F9FFF2', '#47565E', '#214456'),
        name: 'softGreen',
        backgroundImage: 'lightGreenBlueImg.jpg'
      },
  
      vintage: {
        ...this.createTheme('#F4F2F3', '#656256', '#230903'),
        name: 'vintage',
        backgroundImage: 'vintageGreenImg.jpg'
      },
  
      flower: {
        ...this.createTheme('#F4F2F3', '#656256', '#230903'),
        name: 'flower',
        backgroundImage: 'flower.jpg'
      },
  
      blackCloth: {
        ...this.createTheme('#1A1A1A', '#FFFFFF', '#FFFFFF'),
        name: 'blackCloth',
        backgroundImage: 'blackCloth.jpg'
      },
  
      // Additional artistic themes
      artistic: {
        ...this.createTheme('#F5F5F5', '#2E4A62', '#4A6670'),
        name: 'artistic',
        backgroundImage: 'artisticGreenImg.jpg'
      },
  
      gradient: {
        ...this.createTheme('#FFFFFF', '#333333', '#666666'),
        name: 'gradient',
        backgroundImage: 'gradient.jpg'
      },
  
      waterColor: {
        ...this.createTheme('#FFF5F5', '#8B4513', '#A0522D'),
        name: 'waterColor',
        backgroundImage: 'waterColourRoseImg.jpg'
      },
  
      textile: {
        ...this.createTheme('#F5F5F5', '#4A4A4A', '#666666'),
        name: 'textile',
        backgroundImage: 'textileMaterialImg.jpg'
      },
  
      tieDye: {
        ...this.createTheme('#FFFFFF', '#333333', '#4A4A4A'),
        name: 'tieDye',
        backgroundImage: 'tieDyeImg.jpg'
      },
  
      maroon: {
        ...this.createTheme('#FFF0F0', '#800000', '#A52A2A'),
        name: 'maroon',
        backgroundImage: 'maroonImg.jpg'
      },
  
      grayLine: {
        ...this.createTheme('#F5F5F5', '#333333', '#666666'),
        name: 'grayLine',
        backgroundImage: 'grayLine.jpg'
      },

      ancientStone: {
        ...this.createTheme('#E8E0D5', '#2B1810', '#463026'),
        name: 'ancientStone',
        backgroundImage: 'BrownAncientStoneImg.jpg'
      },
  
      morningSun: {
        ...this.createTheme('#FFF7E6', '#8B4513', '#A0522D'),
        name: 'morningSun',
        backgroundImage: 'MorningYelllowSunImg.jpg'
      },
  
      multiColor: {
        ...this.createTheme('#FFFFFF', '#1A237E', '#0D47A1'),
        name: 'multiColor',
        backgroundImage: 'MultiBlueRedYellowImg.jpg'
      },
  
      oldArchBW: {
        ...this.createTheme('#F5F5F5', '#1A1A1A', '#333333'),
        name: 'oldArchBW',
        backgroundImage: 'OldArchBWImg.jpg'
      },
  
      blueFire: {
        ...this.createTheme('#E3F2FD', '#1565C0', '#0D47A1'),
        name: 'blueFire',
        backgroundImage: 'blueBGFilreImg.jpg'
      },
  
      eveningSky: {
        ...this.createTheme('#FFF8E1', '#4A148C', '#311B92'),
        name: 'eveningSky',
        backgroundImage: 'eveningSkyImg.jpg'
      },
  
      whiteFlower: {
        ...this.createTheme('#FFFFFF', '#2E7D32', '#1B5E20'),
        name: 'whiteFlower',
        backgroundImage: 'flowerInWhiteBGImg.jpg'
      },
  
      pureBlack: {
          ...this.createTheme('#000000', '#FFFFFF', '#CCCCCC'), // Changed background to black, text to white
          name: 'oldArchBW',
          backgroundImage: 'OldArchBWImg.jpg',
          effects: {
            textShadow: true,
            glow: false,
            decorativeElements: true,
            backgroundTexture: true,
            shadow: {
              blur: 4,
              opacity: 0.5,
              offset: { x: 2, y: 2 }
            }
          },
          layout: {
            padding: 60,
            titleSize: 48,
            bodySize: 32,
            lineHeight: 2.0,
            textAlign: 'center'
          }
        },
      foggyForest: {
        ...this.createTheme('#E8F5E9', '#2E7D32', '#1B5E20'),
        name: 'foggyForest',
        backgroundImage: 'foggyGreenForestImg.jpg'
      },
  
      greenLeaf: {
        ...this.createTheme('#E8F5E9', '#1B5E20', '#004D40'),
        name: 'greenLeaf',
        backgroundImage: 'greenLeafImg.jpg'
      },
  
      leafRose: {
        ...this.createTheme('#F3E5F5', '#4A148C', '#311B92'),
        name: 'leafRose',
        backgroundImage: 'greenLeafRoseImg.jpg'
      },
  
      greenishBrown: {
        ...this.createTheme('#EFEBE9', '#3E2723', '#4E342E'),
        name: 'greenishBrown',
        backgroundImage: 'greenishBrownLeafImg.jpg'
      },
  
      lightBlack: {
        ...this.createTheme('#212121', '#FFFFFF', '#EEEEEE'),
        name: 'lightBlack',
        backgroundImage: 'lightBlackImg.jpg'
      },
  
      lightBluePaint: {
        ...this.createTheme('#E3F2FD', '#0D47A1', '#1565C0'),
        name: 'lightBluePaint',
        backgroundImage: 'lightBluePaintImg.jpg'
      },
  
      oceanBlue: {
        ...this.createTheme('#E1F5FE', '#01579B', '#0277BD'),
        name: 'oceanBlue',
        backgroundImage: 'oceanBlueImg.jpg'
      },
  
      oldPaper: {
        ...this.createTheme('#EFEBE9', '#3E2723', '#4E342E'),
        name: 'oldPaper',
        backgroundImage: 'oldDullBrownPaperImg.jpg'
      },
  
      peacockFeather: {
        ...this.createTheme('#E0F7FA', '#006064', '#00838F'),
        name: 'peacockFeather',
        backgroundImage: 'peacockFeatherImg.jpg'
      },
  
      pinkBlueWater: {
        ...this.createTheme('#F3E5F5', '#4A148C', '#6A1B9A'),
        name: 'pinkBlueWater',
        backgroundImage: 'pinkBlueWaterColurImg.jpg'
      },
  
      redForest: {
        ...this.createTheme('#FFEBEE', '#B71C1C', '#C62828'),
        name: 'redForest',
        backgroundImage: 'redFlowerForestImg.jpg'
      },
  
      redTexture: {
        ...this.createTheme('#FFEBEE', '#B71C1C', '#C62828'),
        name: 'redTexture',
        backgroundImage: 'redTextureImg.jpg'
      },
  
      starSky: {
        ...this.createTheme('#1A237E', '#FFFFFF', '#E8EAF6'),
        name: 'starSky',
        backgroundImage: 'starSkyImg.jpg'
      }
  
    };
  }

  createTheme(backgroundColor, textColor, secondaryColor = null, backgroundImage = null) {
    return {
      colors: {
        primary: textColor,
        secondary: secondaryColor || textColor,
        background: backgroundColor,
        text: textColor,
        title: this.adjustColor(textColor, 1.2),
        accent: this.adjustColor(textColor, 1.3)
      },
      backgroundImage: backgroundImage, // Add background image support
      fonts: {
        title: '"Noto Serif Tamil Slanted"',
        body: '"Annai MN"',
        branding: '"Tamil Sangam MN"',
        contact: '"Noto Sans Tamil"',
        weights: {
          light: 300,
          regular: 400,
          medium: 500,
          bold: 700,
          heavy: 800
        },
        styles: {
          normal: 'normal',
          italic: 'italic',
          oblique: 'oblique'
        }
      },
      layout: {
        padding: 60,
        titleSize: 48,
        bodySize: 36,
        lineHeight: 1.8,
        brandingSize: 32,
        contactSize: 24,
        textAlign: 'center',
        spacing: {
          paragraph: 1.5,
          section: 2.5
        },
        margins: {
          top: 60,
          bottom: 60,
          left: 60,
          right: 60
        }
      },
      effects: {
        textShadow: false,
        glow: false,
        outline: false,
        decorativeElements: false,
        backgroundTexture: true,
        shadow: {
          blur: 3,
          opacity: 0.3,
          offset: { x: 2, y: 2 }
        },
        glow: {
          blur: 10,
          intensity: 0.4,
          color: textColor
        }
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
    console.log({ width, height, theme });

    // Resolve the path to the public folder for background textures
    const bgImage = theme.backgroundImage || `${theme.name}Img.jpg`;
    const texturePath = path.join(process.cwd(), 'public/backgrounds', bgImage);
    console.log({ texturePath });

    // Create base image with the theme's background color
    const baseImage = await sharp({
      create: {
        width,
        height,
        channels: 4,
        background: this.parseBackgroundColor(theme.colors.background),
      },
    }).png().toBuffer();

    try {
      // Check if a specific texture image exists for the theme
      let textureBuffer = await sharp(texturePath)
        .resize(width, height, { 
          fit: 'cover',
          position: 'center'
        })
        .modulate({
          brightness: 1.1,  // Slightly increase brightness
          saturation: 1.2,  // Boost saturation
          hue: 0           // Keep original hue
        })
        .toBuffer();

      // Apply the resized texture with improved settings
      return await sharp(baseImage)
        .composite([
          {
            input: textureBuffer,
            blend: 'multiply',    // Changed from overlay to multiply for better color
            opacity: 0.95,        // Increased opacity significantly
          },
        ])
        .modulate({
          brightness: 1.05,      // Slight brightness boost
          saturation: 1.1        // Slight saturation boost
        })
        .toBuffer();
    } catch (textureError) {
      console.warn(`Texture for theme '${theme.name}' not found. Using fallback texture.`, textureError.message);

      // Fallback to a default texture with improved settings
      const defaultTextureUrl = "https://res.cloudinary.com/dk5p5vrwa/image/upload/v1732732038/image-generation-assets/textures/v7gnw9kgeoy501gjqnou.png";
      const response = await fetch(defaultTextureUrl);
      if (!response.ok) throw new Error(`Failed to fetch fallback texture: ${response.statusText}`);

      const fallbackTextureBuffer = await response.arrayBuffer();

      // Resize and enhance fallback texture
      const resizedFallbackTexture = await sharp(Buffer.from(fallbackTextureBuffer))
        .resize(width, height, { 
          fit: 'cover',
          position: 'center'
        })
        .modulate({
          brightness: 1.1,
          saturation: 1.2,
          hue: 0
        })
        .toBuffer();

      // Apply the fallback texture with improved settings
      return await sharp(baseImage)
        .composite([
          {
            input: resizedFallbackTexture,
            blend: 'multiply',
            opacity: 0.95,
          },
        ])
        .modulate({
          brightness: 1.05,
          saturation: 1.1
        })
        .toBuffer();
    }
  } catch (error) {
    console.error("Error creating textured background:", error.message);
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


generateContentSVG(text, theme, analysis) {
  const lines = text.split('\n').filter(line => line.trim());
  const lineHeight = theme.layout.lineHeight || 2.0;
  
  // Enhanced positioning system
  const containerWidth = 1200;
  const padding = theme.layout.margins?.horizontal || theme.layout.padding || 60;
  const effectiveWidth = containerWidth - (padding * 2);
  
  // Calculate alignment position
  const getXPosition = (alignment, lineWidth) => {
    switch (alignment) {
      case 'right':
        return containerWidth - padding;
      case 'center':
        return containerWidth / 2;
      case 'justify':
        // For justify, we'll handle this separately
        return padding;
      default: // left
        return padding;
    }
  };

  // Get text anchor based on alignment
  const getTextAnchor = (alignment) => {
    switch (alignment) {
      case 'right':
        return 'end';
      case 'center':
        return 'middle';
      default:
        return 'start';
    }
  };

  // Process text styles and effects
  const baseTextStyle = `
    font-family: ${theme.fonts.body.replace(/"/g, '&quot;')};
    font-weight: ${theme.fonts.weights?.regular || 400};
    font-style: ${theme.fonts.styles?.normal || 'normal'};
  `;

  const textEffects = [];
  if (theme.effects?.textShadow) {
    textEffects.push(`filter: drop-shadow(${theme.effects.shadow.offset.x}px ${theme.effects.shadow.offset.y}px ${theme.effects.shadow.blur}px rgba(0,0,0,${theme.effects.shadow.opacity}))`);
  }
  if (theme.effects?.glow) {
    textEffects.push(`filter: drop-shadow(0 0 ${theme.effects.glow.blur}px ${theme.effects.glow.color})`);
  }

  // Generate SVG content with enhanced styling
  const svgContent = lines.map((line, index) => {
    const yPosition = (theme.layout.margins?.top || 60) + 
                     (index * theme.layout.bodySize * lineHeight);
    const escapedLine = line.trim()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

    return `    <text
      x="${getXPosition(theme.layout.textAlign)}"
      y="${yPosition}"
      font-size="${theme.layout.bodySize}"
      fill="${theme.colors.text}"
      text-anchor="${getTextAnchor(theme.layout.textAlign)}"
      dominant-baseline="middle"
      class="poetry-line"
    >${escapedLine}</text>`;
  }).join('\n');

  // Add enhanced styling
  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" version="1.1">
  <defs>
    <style>
      .poetry-line {
        ${baseTextStyle}
        ${textEffects.join(';')}
      }
    </style>
  </defs>
  ${this.generateDecorationElements(theme)}
  ${svgContent}
</svg>`;
}

// Helper function for generating decorative elements
generateDecorationElements(theme) {
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

// Helper function for calculating text metrics
calculateTextMetrics(text, fontSize, fontFamily) {
  // Approximate character widths based on script
  const metrics = {
    tamil: fontSize * 0.8,  // Tamil characters are typically wider
    latin: fontSize * 0.5,  // Latin characters
    space: fontSize * 0.3   // Space between words
  };

  const tamilCount = (text.match(/[\u0B80-\u0BFF]/g) || []).length;
  const spaceCount = (text.match(/\s/g) || []).length;
  const latinCount = text.length - tamilCount - spaceCount;

  return {
    width: (tamilCount * metrics.tamil) + 
           (latinCount * metrics.latin) + 
           (spaceCount * metrics.space),
    height: fontSize * 1.2
  };
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
