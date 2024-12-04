import sharp from 'sharp';
import { NoiseTextureGenerator } from './noiseAndTextureGenerator';
import { TextEffects } from './textEffects';
import { uploadGeneratedImage } from '@/lib/cloudinary';

export class CustomImageGenerationService {
  generateBrandingSvg(width, height, branding, colors) {
    const sanitizedFont = branding.font.replace(/"/g, "'");
    // Properly format SVG with no extra whitespace and proper tag closing
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="${colors.branding}"/>
  <text x="40" y="${height/2}" 
        font-family="${sanitizedFont}"
        font-size="24"
        fill="${branding.colors.name}"
        stroke="white"
        stroke-width="0.5"
        dominant-baseline="middle">${branding.name}</text>
  <text x="${width/3}" y="${height/2}"
        font-family="${sanitizedFont}"
        font-size="24"
        fill="${branding.colors.web}"
        stroke="white"
        stroke-width="0.5"
        dominant-baseline="middle">${branding.website}</text>
  <text x="${2*width/3}" y="${height/2}"
        font-family="${sanitizedFont}"
        font-size="24"
        fill="${branding.colors.phone}"
        stroke="white"
        stroke-width="0.5"
        dominant-baseline="middle">${branding.phone}</text>
  <text x="${width-40}" y="${height/2}"
        font-family="${sanitizedFont}"
        font-size="24"
        fill="${branding.colors.social}"
        stroke="white"
        stroke-width="0.5"
        text-anchor="end"
        dominant-baseline="middle">${branding.social}</text>
</svg>`;
  }

  generateTitleSVG(title, options = {}) {
    const {
      style = {},
      fonts = {},
      colors = {}
    } = options;

    const sanitizedFontFamily = (fonts?.title?.family || '"Noto Serif Tamil Slanted"').replace(/"/g, "'");
    const titleSize = style.titleSize || 48;
    const fontWeight = fonts?.title?.weight || 800;
    const textColor = colors?.title || '#000000';
    const position = style.position?.title || { x: 0, y: 0 };

    const textAnchor = style.textAlign === 'left' ? 'start' : 
                      style.textAlign === 'right' ? 'end' : 
                      'middle';
    const x = style.textAlign === 'left' ? '5%' : 
             style.textAlign === 'right' ? '95%' : 
             '50%';

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
  <text x="${x}" y="50%"
        font-family="${sanitizedFontFamily}"
        font-size="${titleSize}px"
        font-weight="${fontWeight}"
        fill="${textColor}"
        text-anchor="${textAnchor}"
        dominant-baseline="middle"
        transform="translate(${position.x}, ${position.y})">${title}</text>
</svg>`;
  }

  generateContentSVG(text, options = {}) {
    const {
      style = {},
      fonts = {},
      colors = {}
    } = options;

    const sanitizedFontFamily = (fonts?.body?.family || '"Annai MN"').replace(/"/g, "'");
    const bodySize = style.bodySize || 32;
    const fontWeight = fonts?.body?.weight || 400;
    const textColor = colors?.text || '#000000';
    const lineHeight = style.lineHeight || 2;
    const position = style.position?.content || { x: 0, y: 0 };

    const textAnchor = style.textAlign === 'left' ? 'start' : 
                      style.textAlign === 'right' ? 'end' : 
                      'middle';
    const x = style.textAlign === 'left' ? '5%' : 
             style.textAlign === 'right' ? '95%' : 
             '50%';

    const lines = text.split('\n').filter(line => line.trim());
    const totalHeight = lines.length * bodySize * lineHeight;
    const startY = 50 - (totalHeight / 2);

    const textElements = lines.map((line, index) => {
      const yPosition = startY + (index * bodySize * lineHeight);
      return `  <text x="${x}" y="${yPosition}%"
        font-family="${sanitizedFontFamily}"
        font-size="${bodySize}px"
        font-weight="${fontWeight}"
        fill="${textColor}"
        text-anchor="${textAnchor}"
        dominant-baseline="middle"
        transform="translate(${position.x}, ${position.y})">${line.trim()}</text>`;
    }).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
${textElements}
</svg>`;
  }

  async createCustomImage(text, options = {}) {
    try {
      const {
        width = 1200,
        height = 1200,
        title = '',
        themeMode,
        theme,
        textureType,
        effects = {},
        style = {},
        customSettings
      } = options;

      // Create base image
      let processedImage = await NoiseTextureGenerator.createCustomTexturedBackground(
        width,
        height,
        { theme, themeMode, effects, customSettings },
        textureType
      );

      // Add title
      if (title) {
        const titleSvg = this.generateTitleSVG(title, { 
          style,
          fonts: customSettings.fonts,
          colors: customSettings.colors 
        });

        try {
          processedImage = await sharp(processedImage)
            .composite([{
              input: Buffer.from(titleSvg),
              top: Math.max(0, Math.floor(height * 0.15) + (style.position?.global?.y || 0)),
              left: Math.max(0, style.position?.global?.x || 0)
            }])
            .toBuffer();
        } catch (error) {
          console.error('Error adding title:', error);
          throw new Error('Failed to add title to image');
        }
      }

      // Add content
      if (text?.trim()) {
        const contentSvg = this.generateContentSVG(text, {
          style,
          fonts: customSettings.fonts,
          colors: customSettings.colors
        });

        try {
          processedImage = await sharp(processedImage)
            .composite([{
              input: Buffer.from(contentSvg),
              top: Math.max(0, Math.floor(height * 0.25) + (style.position?.global?.y || 0)),
              left: Math.max(0, style.position?.global?.x || 0)
            }])
            .toBuffer();
        } catch (error) {
          console.error('Error adding content:', error);
          throw new Error('Failed to add content to image');
        }
      }

      // Add branding
      const brandingSvg = this.generateBrandingSvg(
        width,
        customSettings.canvas.brandingHeight,
        customSettings.branding,
        customSettings.colors
      );

      try {
        processedImage = await sharp(processedImage)
          .composite([{
            input: Buffer.from(brandingSvg),
            top: height - customSettings.canvas.brandingHeight,
            left: 0
          }])
          .toBuffer();
      } catch (error) {
        console.error('Error adding branding:', error);
        throw new Error('Failed to add branding to image');
      }

      // Add text effects if needed
      if (effects.textShadow || effects.glow) {
        const textEffects = new TextEffects();
        processedImage = await textEffects.addTextEffects(processedImage, {
          effects,
          style
        });
      }

      return processedImage;
    } catch (error) {
      console.error('Error in createCustomImage:', error);
      throw error;
    }
  }

  async generateForTextCustom(text, options = {}) {
    if (!text?.trim()) {
      throw new Error('Text content is required for generating an image.');
    }

    try {
      const imageBuffer = await this.createCustomImage(text, options);

      if (!imageBuffer?.length) {
        throw new Error('Invalid image data generated.');
      }

      return await uploadGeneratedImage(imageBuffer, {
        folder: 'writings',
        transformation: [{ 
          width: options.customSettings.canvas.width, 
          crop: 'scale', 
          quality: 'auto' 
        }]
      });
    } catch (error) {
      console.error('Error generating custom image:', error);
      throw error;
    }
  }
}

export default new CustomImageGenerationService();