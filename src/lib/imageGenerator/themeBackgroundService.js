// src/lib/imageGenerator/themeBackgroundService.js
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

export class ThemeBackgroundService {
  constructor() {
    this.backgroundsPath = path.join(process.cwd(), 'public/backgrounds');
    this.fallbackTexture = "https://res.cloudinary.com/dk5p5vrwa/image/upload/v1732732038/image-generation-assets/textures/v7gnw9kgeoy501gjqnou.png";
    this.setupThemes();
  }

  setupThemes() {
    this.themes = {
      navy: {
        name: 'navy',
        colors: {
          background: '#D3EFF4',    // Baby Blue
          text: '#05445E',          // Navy Blue
          title: '#05445E',         // Navy Blue
          accent: '#189AB4',        // Blue Grotto
          lines: '#189AB4'          // Blue Grotto
        },
        backgroundOpacity: 0.85
      },
      midnight: {
        name: 'midnight',
        colors: {
          background: '#D3EFF4',    // Baby Blue
          text: '#274472',          // Dark Blue
          title: '#274472',         // Dark Blue
          accent: '#41729F',        // Midnight Blue
          contact: '#41729F'        // Midnight Blue
        },
        backgroundOpacity: 0.9
      },
      classic: {
        name: 'classic',
        colors: {
          background: '#E9DDD4',    // Dusty Rose
          text: '#000000',          // Black
          title: '#000000',         // Black
          accent: '#000000',        // Black
          lines: '#000000'          // Black
        },
        backgroundOpacity: 0.85
      },
      warm: {
        name: 'warm',
        colors: {
          background: '#F3ECDA',    // Cream
          text: '#94553D',          // Tan
          title: '#94553D',         // Tan
          accent: '#94553D',        // Tan
          lines: '#94553D'          // Tan
        },
        backgroundOpacity: 0.9
      },
      minimal: {
        name: 'minimal',
        colors: {
          background: '#FDFDFD',    // White
          text: '#050606',          // Jet Black
          title: '#050606',         // Jet Black
          lines: '#ADB3BC',         // Misty Blue
          accent: '#ADB3BC'         // Misty Blue
        },
        backgroundOpacity: 0.95
      },
      nature: {
        name: 'nature',
        colors: {
          background: '#F6FFE5',    // Lime Green
          text: '#4A7212',          // Kelly Green
          title: '#104210',         // Green
          accent: '#4A7212',        // Kelly Green
          lines: '#4A7212'          // Kelly Green
        },
        backgroundOpacity: 0.85
      },
      ocean: {
        name: 'ocean',
        colors: {
          background: '#EAF4F4',    // Light blue
          text: '#4B7A7A',          // Teal
          title: '#4B7A7A',         // Teal
          accent: '#4B7A7A',        // Teal
          lines: '#4B7A7A'          // Teal
        },
        backgroundOpacity: 0.9
      },
      sky: {
        name: 'sky',
        colors: {
          background: '#EDF2FB',    // Light blue
          text: '#003F88',          // Medium blue
          title: '#00296B',         // Dark blue
          accent: '#003F88',        // Medium blue
          lines: '#003F88'          // Medium blue
        },
        backgroundOpacity: 0.85
      },
      blue: {
        name: 'blue',
        colors: {
          background: '#EAF6FF', // Light blue
          text: '#004D80',       // Deep blue
          title: '#003366',      // Darker blue
          accent: '#0073E6',     // Bright accent
          lines: '#003366'       // Accent for lines
        },
        backgroundOpacity: 0.9
      },
      forest: {
        name: 'forest',
        colors: {
          background: '#F9FFF2',    // Light green
          text: '#47565E',          // Gray
          title: '#214456',         // Dark blue
          accent: '#214456',        // Dark blue
          lines: '#214456'          // Dark blue
        },
        backgroundOpacity: 0.9
      },
      neutral: {
        name: 'neutral',
        colors: {
          background: '#F4F2F3',    // Light gray
          text: '#656256',          // Medium gray
          title: '#230903',         // Dark brown
          accent: '#230903',        // Dark brown
          lines: '#656256'          // Medium gray
        },
        backgroundOpacity: 0.9
      }
    };

    this.defaultOptions = {
      typography: {
        title: {
          font: '"Noto Serif Tamil Slanted"',
          size: 48,
          weight: 800,
          letterSpacing: 0
        },
        body: {
          font: '"Annai MN"',
          size: 36,
          weight: 400,
          letterSpacing: 0,
          lineHeight: 1.8
        },
        branding: {
          font: '"Tamil Sangam MN"',
          size: 32
        },
        contact: {
          font: '"Noto Sans Tamil"',
          size: 24
        }
      }
    };
  }

  async getBackgroundImage(themeName) {
    try {
      const bgPath = path.join(this.backgroundsPath, `${themeName}.png`);
      await fs.access(bgPath);
      return bgPath;
    } catch (error) {
      console.log(`Background image for theme ${themeName} not found, using fallback texture`);
      return null;
    }
  }

  async createBackground(width, height, theme) {
    try {
      const baseImage = await sharp({
        create: {
          width,
          height,
          channels: 4,
          background: this.parseBackgroundColor(theme.colors.background)
        }
      }).png().toBuffer();

      const bgImagePath = await this.getBackgroundImage(theme.name);
      
      if (bgImagePath) {
        const background = await sharp(bgImagePath)
          .resize(width, height, {
            fit: 'cover',
            position: 'center'
          })
          .composite([{
            input: baseImage,
            blend: 'overlay',
            opacity: theme.backgroundOpacity || 0.8
          }])
          .toBuffer();
          
        return background;
      } else {
        try {
          const textureResponse = await fetch(this.fallbackTexture);
          const textureBuffer = await textureResponse.arrayBuffer();

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
          return baseImage;
        }
      }
    } catch (error) {
      console.error("Error creating background:", error.message);
      throw error;
    }
  }

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

  getTheme(themeName) {
    return this.themes[themeName] || this.themes.minimal;
  }

  getDefaultOptions() {
    return this.defaultOptions;
  }

  getAllThemes() {
    return Object.keys(this.themes);
  }

  getThemePreview(themeName) {
    const theme = this.themes[themeName];
    if (!theme) return null;

    return {
      name: themeName,
      colors: theme.colors,
      backgroundOpacity: theme.backgroundOpacity
    };
  }
}

export default new ThemeBackgroundService();