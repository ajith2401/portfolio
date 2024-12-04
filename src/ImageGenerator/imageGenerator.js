//src/lib/ImageGenerator/imageGenerator.js
import sharp from 'sharp';
import { TEXT_METRICS } from './textMextrcis';
import { TextMetricsCalculator } from './textMetricsCalculator';
import { NoiseTextureGenerator } from './noiseAndTextureGenerator';
import { BrandingGenerator } from './brandingGenerator';
import ThemeSetup from './themeSetup';
import SvgGenerator from './svgGenerator';
import { TextEffects } from './textEffects';
import { Writing } from '@/models';
import ColorHelper from './colorHelper';

export class ImageGenerationService {
  constructor() {
    this.themeSetup = ThemeSetup;
  }

  async createImage(text, options = {}) {
    const {
      width = TEXT_METRICS.CANVAS_WIDTH,
      height = TEXT_METRICS.CANVAS_HEIGHT,
      themeMode = 'backgroundImage',
      theme: themeName = 'default',
      category = 'article',
      title = '',
      style = {},
      analysis = {},
      textureType = "waterDrops",
      isCustomStyles = false,
      customSettings
    } = options;
  
    let formattedText;
    let theme;
  
    if (isCustomStyles) {
      formattedText = text;
  
      // Extract colors from customSettings
      const backgroundColor = customSettings.colors.background;
      const textColor = customSettings.colors.text;
      const titleColor = customSettings.colors.title;
      const brandingColor = customSettings.colors.branding;
  
      // Calculate center point of canvas
      const centerX = width / 2;
      const centerY = height / 2;
  
      // Get positioning from customSettings
      const position = customSettings.position || {
        global: { x: 0, y: 0 },
        title: { x: 0, y: 0 },
        content: { x: 0, y: 0 }
      };
  
      // Calculate actual positions based on transforms
      const globalOffset = {
        x: position.global.x,
        y: position.global.y
      };
  
      // Calculate content positions with transforms
      const contentPosition = {
        x: centerX + globalOffset.x + (position.content?.x || 0),
        y: centerY + globalOffset.y + (position.content?.y || 0)
      };
  
      // Calculate title positions with transforms
      const titlePosition = {
        x: centerX + globalOffset.x + (position.title?.x || 0),
        y: centerY - 100 + globalOffset.y + (position.title?.y || 0) // 100px offset for title
      };
  
      theme = {
        isCustomStyles: true,
        colors: {
          background: backgroundColor,
          title: {
            color: titleColor,
            hoverColor: ColorHelper.adjustColor(titleColor, 1.4),
          },
          text: {
            color: textColor,
            hoverColor: ColorHelper.adjustColor(textColor, 1.1),
          },
          branding: {
            background: brandingColor,
            name: {
              color: customSettings.branding.colors.name,
              hoverColor: ColorHelper.adjustColor(customSettings.branding.colors.name, 1.2),
            },
            web: {
              color: customSettings.branding.colors.web,
              hoverColor: ColorHelper.adjustColor(customSettings.branding.colors.web, 1.1),
            },
            phone: {
              color: customSettings.branding.colors.phone,
              hoverColor: ColorHelper.adjustColor(customSettings.branding.colors.phone, 1.1),
            },
            social: {
              color: customSettings.branding.colors.social,
              hoverColor: ColorHelper.adjustColor(customSettings.branding.colors.social, 1.1),
            }
          }
        },
        fonts: {
          title: {
            family: customSettings.fonts.title.family,
            weight: customSettings.fonts.title.weight,
            style: 'normal',
            size: customSettings.fonts.title.size,
          },
          body: {
            family: customSettings.fonts.body.family,
            weight: customSettings.fonts.body.weight,
            style: 'normal',
            size: customSettings.fonts.body.size,
          },
          branding: {
            name: {
              family: customSettings.branding.font,
              weight: 700,
              size: 24,
            },
            web: {
              family: customSettings.branding.font,
              weight: 500,
              size: 24,
            },
            phone: {
              family: customSettings.branding.font,
              weight: 500,
              size: 24,
            },
            social: {
              family: customSettings.branding.font,
              weight: 500,
              size: 24,
            }
          }
        },
        layout: {
          textAlign: style.textAlign || 'center',
          lineHeight: style.lineHeight || 2,
          contentWidth: '80%',
          branding: {
            height: customSettings.canvas.brandingHeight,
            padding: '20px 40px',
          },
          positions: {
            content: contentPosition,
            title: titlePosition
          }
        },
        effects: {
          textShadow: options.effects?.textShadow || false,
          glow: options.effects?.glow || false,
          decorativeElements: options.effects?.decorativeElements || false,
          backgroundTexture: options.effects?.backgroundTexture || true,
          shadow: {
            blur: customSettings.effects?.shadow?.blur || 3,
            opacity: customSettings.effects?.shadow?.opacity || 0.3,
            offset: customSettings.effects?.shadow?.offset || { x: 2, y: 2 }
          }
        }
      };
  
      if (themeMode === 'gradient' && customSettings.gradient) {
        theme.gradient = {
          type: customSettings.gradient.type || 'linear',
          angle: customSettings.gradient.angle || 45,
          colors: customSettings.gradient.colors || [customSettings.gradient.startColor, customSettings.gradient.endColor]
        };
      }
  
      try {
        let processedImage = await NoiseTextureGenerator.createTexturedBackground(width, height, theme, textureType);
  
        // Add title
        if (title) {
          const titleSvg = SvgGenerator.generateTitleSVG(title, theme);
          processedImage = await sharp(processedImage)
            .composite([{
              input: Buffer.from(titleSvg),
              top: Math.round(theme.layout.positions.title.y),
              left: Math.round(theme.layout.positions.title.x),
              gravity: theme.layout.textAlign === 'center' ? 'center' : undefined
            }])
            .toBuffer();
        }
  
        // Add content
        if (text && text.trim()) {
          const contentSvg = SvgGenerator.generateContentSVG(formattedText, theme, analysis);
          processedImage = await sharp(processedImage)
            .composite([{
              input: Buffer.from(contentSvg),
              top: Math.round(theme.layout.positions.content.y),
              left: Math.round(theme.layout.positions.content.x),
              gravity: theme.layout.textAlign === 'center' ? 'center' : undefined
            }])
            .toBuffer();
        }
  
        const finalImage = await BrandingGenerator.addBrandingElements(processedImage, theme);
        return finalImage;
  
      } catch (error) {
        console.error("Error in createImage:", error);
        throw error;
      }
    } else {
      // Standard theme processing
      formattedText = TextMetricsCalculator.textFormatter(text, category);
      theme = this.themeSetup.getTheme(themeName);

      try {
        let processedImage = await NoiseTextureGenerator.createTexturedBackground(width, height, theme, textureType);
        
        const textLineCount = TextMetricsCalculator.lineCounter(text, category);
        const layout = TextMetricsCalculator.calculateMetrics(textLineCount, category, Boolean(title));
        
        theme.layout = {
          ...theme.layout,
          bodySize: style.bodySize || layout.fontSize,
          lineHeight: style.lineHeight || layout.lineHeight
        };

        if (title) {
          const titleSvg = SvgGenerator.generateTitleSVG(title, theme);
          processedImage = await sharp(processedImage)
            .composite([{ 
              input: Buffer.from(titleSvg), 
              top: layout.topPosition - 120,
              left: 0 
            }])
            .toBuffer();
        }

        if (text && text.trim()) {
          const contentSvg = SvgGenerator.generateContentSVG(formattedText, theme, analysis);
          processedImage = await sharp(processedImage)
            .composite([{ 
              input: Buffer.from(contentSvg), 
              top: layout.topPosition,
              left: 0 
            }])
            .toBuffer();
        }

        const finalImage = await BrandingGenerator.addBrandingElements(processedImage, theme);
        return finalImage;

      } catch (error) {
        console.error("Error in createImage standard theme:", error);
        throw error;
      }
    }
  }

  async createAndSaveWriting(options) {
    const { 
      title, 
      body, 
      category, 
      theme = 'default', 
      themeMode,
      textureType,
      effects,
      style,
      isCustomStyles,
      customSettings
    } = options;

    if (!body || typeof body !== 'string' || !body.trim()) {
      throw new Error("Body content is required for generating an image.");
    }

    const themeMap = { 
      poem: 'love', 
      philosophy: 'philosophical', 
      article: 'default', 
      'short story': 'emotional' 
    };

    try {
      const textEffects = new TextEffects();
      const images = await textEffects.generateForText(body, {
        title,
        themeMode: themeMode || 'backgroundImage',
        textureType: textureType || "starrySky",
        theme: theme || themeMap[category] || 'default',
        effects,
        style,
        isCustomStyles,
        customSettings
      });

      return await Writing.create({
        title,
        body,
        category,
        images,
        createdAt: options.createdAt || new Date()
      });
    } catch (error) {
      console.error("Error in createAndSaveWriting:", error.message);
      throw error;
    }
  }
}
// Create a named instance
const imageGenerationService = new ImageGenerationService();

// Export both the class and the instance
export default imageGenerationService;
