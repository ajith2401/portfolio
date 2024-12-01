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

  async createImage(text, options = {}) {  // Remove static
    const {
      width = TEXT_METRICS.CANVAS_WIDTH,
      height = TEXT_METRICS.CANVAS_HEIGHT,
      themeMode: themeMode = 'backgroundImage',
      theme: themeName = 'default',
      category = 'article',
      title = '',
      style = {},
      analysis = {}
    } = options;

    const metrics = TextMetricsCalculator.calculateDynamicTextMetrics(text, category);
    const formattedText = TextMetricsCalculator.textFormatter(text, category);
    const theme = this.themeSetup.getTheme(themeName , themeMode );  // Now this.themeSetup will work

    try {
      let processedImage = await NoiseTextureGenerator.createTexturedBackground(width, height, theme);
      
      const textLineCount = TextMetricsCalculator.lineCounter(text, category);
      const layout = TextMetricsCalculator.calculateMetrics(textLineCount, category, Boolean(title));
      
      theme.layout = {
        ...theme.layout,
        bodySize: layout.fontSize,
        lineHeight: layout.lineHeight
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
    const { title, body, category, theme = 'default', themeMode , effects, style } = options;

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

export default new ImageGenerationService();
