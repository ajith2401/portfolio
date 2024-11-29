
//src/lib/imageGenerator/customizationSystem.js
import sharp from 'sharp';
import themeBackgroundService from './themeBackgroundService';
import { LayoutManager } from './layoutSystem';
import { TextEffectProcessor } from './textEffects';

export class ImageCustomizer {
  constructor() {
    this.backgroundService = themeBackgroundService;
    this.textEffects = new TextEffectProcessor();

    // Initialize default options
    this.defaultOptions = {
      typography: {
        title: {
          font: '"Noto Serif Tamil Slanted"',
          size: 48,
          weight: 800,
          letterSpacing: 0,
          lineHeight: 1.2
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
    
    this.supportedResolutions = {
      'hd': { width: 1280, height: 720 },
      'fullHd': { width: 1920, height: 1080 },
      '2k': { width: 2560, height: 1440 },
      '4k': { width: 3840, height: 2160 },
      'square': { width: 1200, height: 1200 },
      'instagram': { width: 1080, height: 1080 },
      'story': { width: 1080, height: 1920 }
    };

    this.categoryDefaults = {
      poem: {
        resolution: 'square',
        layout: {
          titleHeight: 150,
          footerHeight: 150,
          rightPadding: 100
        },
        effects: ['shadow', 'glow'],
        typography: {
          titleSize: 48,
          bodySize: 36,
          lineHeight: 2.0
        }
      },
      article: {
        resolution: 'fullHd',
        layout: {
          titleHeight: 200,
          footerHeight: 150,
          columns: 1,
          sidePadding: 100
        },
        effects: ['shadow'],
        typography: {
          titleSize: 56,
          bodySize: 32,
          lineHeight: 1.6
        }
      },
      quote: {
        resolution: 'square',
        layout: {
          titleHeight: 150,
          footerHeight: 150,
          centerPadding: 200
        },
        effects: ['gradient', 'shadow'],
        typography: {
          titleSize: 48,
          bodySize: 42,
          lineHeight: 1.8
        }
      }
    };
  }

  async generateImage(content, options = {}) {

    console.log({content, options});
    
    try {
      // Validate content
      this.validateContent(content);
      
      // Process layout options
      const categoryDefaults = this.categoryDefaults[content.type || options.category] || this.categoryDefaults.poem;
      const mergedOptions = this.mergeOptions(categoryDefaults, options);
      
      // Get dimensions
      const dimensions = this.getResolutionDimensions(options.resolution);
      
      // Create layout manager
      const layoutManager = new LayoutManager(dimensions.width, dimensions.height);
  
      // Get base theme
      const baseTheme = this.backgroundService.getTheme(mergedOptions.themeName) || {
        name: 'minimal',
        colors: {
          background: '#FFFFFF',
          text: '#000000',
          title: '#000000',
          accent: '#000000',
          lines: '#000000'
        },
        backgroundOpacity: 0.95
      };
      
      // Structure content properly for layout manager
      const processedContent = {
        title: content.title,
        body: content.body,
        style: {
          textAlign: options.typography?.textAlign || 'right',
          titleSize: options.typography?.titleSize || 48,
          bodySize: options.typography?.bodySize || 32,
          lineHeight: options.typography?.bodyLineHeight || 2.0,
          titleLineHeight: options.typography?.titleLineHeight || 1.4
        }
      };
  
      // Generate SVG
      const svg = await layoutManager.generateLayout(
        processedContent,
        {
          ...baseTheme,
          typography: this.processTypography({
            ...this.defaultOptions.typography,
            ...mergedOptions.typography
          }, content)
        },
        mergedOptions.layoutType,
        {
          dimensions,
          ...mergedOptions.customLayout
        }
      );
  
      // Convert SVG to buffer and return
      return await this.renderFinalImage(svg, mergedOptions.format, {
        quality: mergedOptions.quality,
        optimize: mergedOptions.optimize,
        dimensions
      });
    } catch (error) {
      console.error('Error in image generation:', error);
      throw error;
    }
  }
  
  async renderFinalImage(svg, format = 'png', options = {}) {
    const { quality = 90, optimize = true, dimensions } = options;
  
    try {
      // Validate SVG input
      if (!svg || typeof svg !== 'string') {
        throw new Error('Invalid SVG input');
      }
  
      // Create Sharp instance from SVG with explicit settings
      const image = sharp(Buffer.from(svg), {
        density: 300 // Higher density for better quality
      })
      .resize(dimensions.width, dimensions.height, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      });
  
      // Apply format-specific processing
      switch (format.toLowerCase()) {
        case 'webp':
          await image.webp({ 
            quality, 
            lossless: !optimize,
            effort: optimize ? 6 : 2
          });
          break;
        
        case 'png':
        default:
          await image.png({ 
            compressionLevel: optimize ? 9 : 6,
            quality,
            effort: optimize ? 10 : 7
          });
          break;
      }
  
      // Generate buffer
      const buffer = await image.toBuffer();
  
      // Validate output
      if (!buffer || buffer.length === 0) {
        throw new Error('Generated image is empty');
      }
  
      return buffer;
  
    } catch (error) {
      console.error('Error rendering final image:', error);
      throw new Error(`Failed to render image in ${format} format: ${error.message}`);
    }
  }

  validateContent(content) {
    if (!content || typeof content !== 'object') {
      throw new Error('Content must be an object');
    }

    if (!content.body || typeof content.body !== 'string') {
      throw new Error('Content must include a body string');
    }

    if (content.title && typeof content.title !== 'string') {
      throw new Error('Title must be a string if provided');
    }
  }

  mergeOptions(defaults, custom) {
    return {
      ...defaults,
      ...custom,
      layout: { ...defaults.layout, ...(custom.layout || {}) },
      typography: { ...defaults.typography, ...(custom.typography || {}) },
      effects: this.mergeEffects(defaults.effects, custom.effects)
    };
  }

  mergeEffects(defaultEffects, customEffects = []) {
    if (!customEffects) return defaultEffects;

    const effectsMap = new Map();
    
    // Add default effects
    defaultEffects.forEach(effect => {
      if (typeof effect === 'string') {
        effectsMap.set(effect, { type: effect });
      } else {
        effectsMap.set(effect.type, effect);
      }
    });

    // Override/add custom effects
    customEffects.forEach(effect => {
      if (typeof effect === 'string') {
        effectsMap.set(effect, { type: effect });
      } else {
        effectsMap.set(effect.type, effect);
      }
    });

    return Array.from(effectsMap.values());
  }

  processTypography(typography, content) {
    return {
      title: {
        font: typography.title?.font || this.defaultOptions.typography.title.font,
        size: this.calculateFontSize(content.title, typography.title?.size || this.defaultOptions.typography.title.size),
        weight: typography.title?.weight || this.defaultOptions.typography.title.weight,
        letterSpacing: typography.title?.letterSpacing || this.defaultOptions.typography.title.letterSpacing,
        lineHeight: typography.title?.lineHeight || this.defaultOptions.typography.title.lineHeight
      },
      body: {
        font: typography.body?.font || this.defaultOptions.typography.body.font,
        size: this.calculateFontSize(content.body, typography.body?.size || this.defaultOptions.typography.body.size),
        weight: typography.body?.weight || this.defaultOptions.typography.body.weight,
        letterSpacing: typography.body?.letterSpacing || this.defaultOptions.typography.body.letterSpacing,
        lineHeight: typography.body?.lineHeight || this.defaultOptions.typography.body.lineHeight
      },
      branding: {
        font: typography.branding?.font || this.defaultOptions.typography.branding.font,
        size: typography.branding?.size || this.defaultOptions.typography.branding.size
      },
      contact: {
        font: typography.contact?.font || this.defaultOptions.typography.contact.font,
        size: typography.contact?.size || this.defaultOptions.typography.contact.size
      }
    };
  }

  addWatermark(svg, theme) {
    // Add a subtle watermark if needed
    const watermarkElement = `
      <text
        x="10"
        y="${this.height - 10}"
        font-family="${theme.typography.contact.font}"
        font-size="12"
        fill="${theme.colors.text}"
        opacity="0.5"
      >Generated with AjithKumar's Tamil Image Generator</text>
    `;

    return svg.replace('</svg>', `${watermarkElement}</svg>`);
  }


  getResolutionDimensions(resolution) {
    const defaultResolution = this.supportedResolutions.square;
    if (typeof resolution === 'string' && this.supportedResolutions[resolution]) {
        return this.supportedResolutions[resolution];
    }

    if (typeof resolution === 'object' && resolution.width && resolution.height) {
        return this.validateCustomDimensions(resolution);
    }

    console.warn('Invalid resolution provided. Falling back to default resolution.');
    return defaultResolution;
}

validateCustomDimensions({ width, height }) {
    const maxDimension = 4000;
    const minDimension = 200;

    const validatedWidth = Math.min(Math.max(width, minDimension), maxDimension);
    const validatedHeight = Math.min(Math.max(height, minDimension), maxDimension);

    if (validatedWidth !== width || validatedHeight !== height) {
        console.warn('Image dimensions adjusted to fit within allowed range');
    }

    return {
        width: validatedWidth,
        height: validatedHeight
    };
}


  async processEffects(effects, theme) {
    const effectPromises = effects.map(async (effect) => {
      switch (effect.type) {
        case 'shadow': 
          return await this.textEffects.generateShadowFilter(effect.options);
        case 'glow': 
          return await this.textEffects.generateGlowFilter(effect.options);
        case 'gradient': 
          return await this.textEffects.generateGradientFilter(effect.options, theme);
        case 'outline': 
          return await this.textEffects.generateOutlineFilter(effect.options);
        default: 
          console.warn(`Unsupported effect type: ${effect.type}`);
          return '';
      }
    });
    return (await Promise.all(effectPromises)).join('\n');
  }


  async renderFinalImage(svg, format = 'png', options = {}) {
    const { quality = 90, optimize = true, dimensions } = options;

    try {
      // Create Sharp instance from SVG
      let image = sharp(Buffer.from(svg))
        .resize(dimensions.width, dimensions.height, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        });

      // Apply format-specific processing
      switch (format.toLowerCase()) {
        case 'jpeg':
        case 'jpg':
          image = image.flatten({ background: '#FFFFFF' })
            .jpeg({ 
              quality, 
              mozjpeg: optimize,
              chromaSubsampling: optimize ? '4:2:0' : '4:4:4'
            });
          break;
        
        case 'webp':
          image = image.webp({ 
            quality, 
            lossless: !optimize,
            effort: optimize ? 6 : 2,
            smartSubsample: optimize
          });
          break;
        
        case 'avif':
          image = image.avif({ 
            quality,
            effort: optimize ? 9 : 4,
            chromaSubsampling: optimize ? '4:2:0' : '4:4:4'
          });
          break;
        
        case 'png':
        default:
          image = image.png({ 
            compressionLevel: optimize ? 9 : 6,
            palette: optimize,
            quality,
            effort: optimize ? 10 : 7,
            colors: optimize ? 256 : 512
          });
          break;
      }

      // Generate buffer
      const buffer = await image.toBuffer();

      // Validate output
      if (!buffer || buffer.length === 0) {
        throw new Error('Generated image is empty');
      }

      return buffer;

    } catch (error) {
      console.error('Error rendering final image:', error);
      throw new Error(`Failed to render image in ${format} format: ${error.message}`);
    }
  }

  calculateFontSize(text = '', baseSize = 36) {
    if (!text) return baseSize;
    
    const length = text.length;
    const maxLength = 500;
    
    // Calculate effective length considering Tamil characters
    const tamilCharCount = (text.match(/[\u0B80-\u0BFF]/g) || []).length;
    const effectiveLength = length + (tamilCharCount * 0.5); // Tamil characters count more
    
    if (effectiveLength > maxLength) {
      // Reduce size based on length, but not below 60% of base size
      const scaleFactor = Math.max(maxLength / effectiveLength, 0.6);
      return Math.round(baseSize * scaleFactor);
    }
    
    return baseSize;
  }

  getEffectPreview(effectType, options = {}) {
    try {
      const effect = { type: effectType, options };
      if (!this.textEffects.validateEffect(effect)) {
        throw new Error(`Unsupported effect type: ${effectType}`);
      }

      // Generate a simple SVG with the effect applied
      const previewText = 'Preview Text';
      const svg = `
        <svg width="300" height="100">
          <defs>
            ${this.textEffects.generateCombinedFilters([effect])}
          </defs>
          <text
            x="150"
            y="50"
            font-family="Arial"
            font-size="24"
            text-anchor="middle"
            filter="url(#${effectType})"
          >${previewText}</text>
        </svg>
      `;

      return svg;
    } catch (error) {
      console.error('Error generating effect preview:', error);
      return null;
    }
  }

  getImageStats(buffer) {
    return {
      size: buffer.length,
      dimensions: sharp(buffer).metadata(),
      format: sharp(buffer).metadata().format
    };
  }

  async optimizeImage(buffer, options = {}) {
    const {
      maxSize = 1024 * 1024, // 1MB
      quality = 90,
      format = 'png'
    } = options;

    let currentBuffer = buffer;
    let currentSize = buffer.length;
    let currentQuality = quality;

    while (currentSize > maxSize && currentQuality > 50) {
      currentQuality -= 5;
      currentBuffer = await this.renderFinalImage(
        currentBuffer,
        format,
        {
          quality: currentQuality,
          optimize: true
        }
      );
      currentSize = currentBuffer.length;
    }

    return currentBuffer;
  }
}

export default new ImageCustomizer();
