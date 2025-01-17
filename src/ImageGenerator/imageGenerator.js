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
      textureType = "waterDrops"
    } = options;

    const metrics = TextMetricsCalculator.calculateDynamicTextMetrics(text, category);
    const formattedText = TextMetricsCalculator.textFormatter(text, category);
    const theme = this.themeSetup.getTheme(themeName, themeMode);

    // Merge style with theme layout
    theme.layout = {
      ...theme.layout,
      ...(style.padding !== undefined && { padding: style.padding }),
      ...(style.margins && { margins: { ...theme.layout.margins, ...style.margins } }),
      ...(style.spacing && { spacing: { ...theme.layout.spacing, ...style.spacing } }),
      ...(style.lineHeight !== undefined && { lineHeight: style.lineHeight }),
      ...(style.textAlign !== undefined && { textAlign: style.textAlign }),
      ...(style.position !== undefined && { position: style.position }),
      ...(style.branding && { branding: { ...theme.layout.branding, ...style.branding } })
    };

    // Update font sizes if provided in style
    if (style.titleSize) {
      theme.fonts.title.size = style.titleSize;
    }
    if (style.bodySize) {
      theme.fonts.body.size = style.bodySize;
    }

    try {
      let processedImage = await NoiseTextureGenerator.createTexturedBackground(width, height, theme, textureType);
      
      const textLineCount = TextMetricsCalculator.lineCounter(text, category);
      const WordCount = TextMetricsCalculator.wordCounter(text, category);
      const layout = TextMetricsCalculator.calculateMetrics(textLineCount, category, Boolean(title));
      
      // Update layout with text metrics while preserving style overrides
      theme.layout = {
        ...theme.layout,
        // bodySize: (textLineCount > 10 || WordCount > 35) ? 16 :  style.bodySize || layout.fontSize,
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
      console.error("Error in createImage:", error.message);
      throw error;
    }
  }

  async createAndSaveWriting(options) {
    const { title, body, category, theme = 'default', themeMode ,textureType, effects, style } = options;

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
      const textEffects = new TextEffects();  // Create instance
      const images = await textEffects.generateForText(body, {
        title,
        themeMode: themeMode || 'backgroundImage',
        textureType : textureType || "starrySky",
        theme: theme || themeMap[category] || 'default',
        effects,
        style
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