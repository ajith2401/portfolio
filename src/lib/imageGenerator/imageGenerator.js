// src/lib/imageGeneration/imageGenerationService.js
import sharp from 'sharp';
import { TEXT_METRICS } from './textMextrcis';
import { TextMetricsCalculator } from './textMetricsCalculator';
import { NoiseTextureGenerator } from './noiseAndTextureGenerator';
// import { SvgGenerator } from './svgGenerator';
import { BrandingGenerator } from './brandingGenerator';
import ThemeSetup from './themeSetup';
import SvgGenerator from './svgGenerator';
import { TextEffects } from './textEffects';
import { Writing } from '@/models';

export class ImageGenerationService {
  constructor() {
    this.themeSetup = ThemeSetup;
  }


  static async createImage(text, options = {}) {
    const {
      width = TEXT_METRICS.CANVAS_WIDTH,
      height = TEXT_METRICS.CANVAS_HEIGHT,
      theme: themeName = 'default',
      category = 'article',
      title = '',
      style = {},
      analysis = {} // Add analysis with default empty object
    } = options;

    const metrics = TextMetricsCalculator.calculateDynamicTextMetrics(text, category);
    const formattedText = TextMetricsCalculator.textFormatter(text, category);
    const theme = this.themeSetup.getTheme(themeName);

    try {
      console.log("Creating image with theme:", themeName);

      // Step 1: Create base textured background
      let processedImage = await NoiseTextureGenerator.createTexturedBackground(width, height, theme);
      
      // Step 2: Calculate text metrics
      const textLineCount = TextMetricsCalculator.lineCounter(text, category);
      const formattedText = TextMetricsCalculator.textFormatter(text, category);
      
      // Get layout calculations
      const layout = TextMetricsCalculator.calculateMetrics(textLineCount, category, Boolean(title));
      
      // Update theme with calculated metrics
      theme.layout = {
        ...theme.layout,
        bodySize: layout.fontSize,
        lineHeight: layout.lineHeight
      };

      // Step 3: Add title if provided
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

      // Step 4: Add main content
      if (text && text.trim()) {
        // Pass the analysis object to generateContentSVG
        const contentSvg = SvgGenerator.generateContentSVG(formattedText, theme, analysis);
        processedImage = await sharp(processedImage)
          .composite([{ 
            input: Buffer.from(contentSvg), 
            top: layout.topPosition,
            left: 0 
          }])
          .toBuffer();
      }

      // Step 5: Add branding
      const finalImage = await BrandingGenerator.addBrandingElements(processedImage, theme);

      return finalImage;
    } catch (error) {
      console.error("Error in createImage:", error.message);
      throw error;
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
      const images = await TextEffects.generateForText(body, {
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


}
export default new ImageGenerationService();