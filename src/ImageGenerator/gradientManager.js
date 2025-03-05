import sharp from "sharp";
import ColorHelper from "./colorHelper";

export class GradientManager {
    static async createGradientBackground(width, height, gradientColors) {
        const svg = `
          <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:${gradientColors[0]};stop-opacity:1" />
                <stop offset="100%" style="stop-color:${gradientColors[1]};stop-opacity:1" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grad)"/>
          </svg>
        `;
      
        return await sharp(Buffer.from(svg))
          .toBuffer();
      }

      // Add radial gradient support
    static createRadialGradientSVG(width, height, gradient) {
        const { colors, centerX = '50%', centerY = '50%', radius = '70%' } = gradient;
        
        return `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <defs>
            <radialGradient id="grad" cx="${centerX}" cy="${centerY}" r="${radius}">
                ${colors.map((color, index) => `
                <stop offset="${(index * 100) / (colors.length - 1)}%" 
                        style="stop-color:${color};stop-opacity:1" />
                `).join('')}
            </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grad)"/>
        </svg>
        `;
    }

    static createGradientSVG(width, height, gradient) {
        const { type, angle = 45, colors } = gradient;
        
        // Calculate gradient coordinates based on angle
        const angleInRadians = (angle * Math.PI) / 180;
        const x1 = 50 - Math.cos(angleInRadians) * 50;
        const y1 = 50 - Math.sin(angleInRadians) * 50;
        const x2 = 50 + Math.cos(angleInRadians) * 50;
        const y2 = 50 + Math.sin(angleInRadians) * 50;

        return `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <defs>
            <linearGradient id="grad" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
                ${colors.map((color, index) => `
                <stop offset="${(index * 100) / (colors.length - 1)}%" 
                        style="stop-color:${color};stop-opacity:1" />
                `).join('')}
            </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grad)"/>
        </svg>
        `;
    }


    static createGradientColors(baseColor, steps = 3) {
        try {
        const rgb = ColorHelper.hexToRgb(baseColor);
        if (!rgb) return [baseColor];
        
        const gradientColors = [];
        for (let i = 0; i < steps; i++) {
            const factor = 0.1 + (i * 0.15); // Adjust these values for different gradient effects
            const lightenedColor = ColorHelper.lightenColor(baseColor, factor);
            gradientColors.push(lightenedColor);
        }
        
        return gradientColors;
        } catch (error) {
        console.warn('Error creating gradient:', error);
        return [baseColor];
        }
    }

    static createMultiPointGradient(width, height, colors, points) {
        const svg = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <defs>
            <linearGradient id="grad" gradientUnits="userSpaceOnUse"
                            x1="0" y1="0" x2="${width}" y2="${height}">
                ${colors.map((color, i) => `
                <stop offset="${points[i]}%" style="stop-color:${color};stop-opacity:1" />
                `).join('')}
            </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grad)"/>
        </svg>
        `;
        
        return svg;
    }

}

const managerInstance = new GradientManager();
export default managerInstance;