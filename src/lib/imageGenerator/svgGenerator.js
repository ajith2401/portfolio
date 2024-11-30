import ColorHelper from "./colorHelper";
import { TextEffects } from "./textEffects";

export class SvgGenerator {
    generateContentSVG(text, theme, analysis = {}) {
        const lines = text.split('\n').filter(line => line.trim());
        const lineHeight = theme.layout.lineHeight || 2.0;
        // Enhanced positioning system
        const containerWidth = 1200;
        const padding = theme.layout.margins?.horizontal || theme.layout.padding || 60;
        const effectiveWidth = containerWidth - (padding * 2);
        
        // Calculate x position based on alignment
        const getXPosition = (alignment) => {
          switch (alignment?.toLowerCase()) {
            case 'right':
              return containerWidth - padding;
            case 'center':
              return containerWidth / 2;
            case 'justify':
              return padding;
            default: // left
              return padding;
          }
        };
      
        // Get text anchor based on alignment
        const getTextAnchor = (alignment) => {
          switch (alignment?.toLowerCase()) {
            case 'right':
              return 'end';
            case 'center':
              return 'middle';
            default:
              return 'start';
          }
        };
      
        // Enhanced text effects
        const baseTextStyle = `
          font-family: ${theme.fonts.body.family.replace(/"/g, '&quot;')};
          font-weight: ${theme.fonts.body.weight};
          font-style: ${theme.fonts.body.style || 'normal'};
        `;
      
        const textEffects = [];
        if (theme.effects?.textShadow) {
          textEffects.push(`filter: drop-shadow(${theme.effects.shadow?.offset?.x || 2}px ${theme.effects.shadow?.offset?.y || 2}px ${theme.effects.shadow?.blur || 3}px rgba(0,0,0,${theme.effects.shadow?.opacity || 0.3}))`);
        }
        if (theme.effects?.glow) {
          textEffects.push(`filter: drop-shadow(0 0 ${theme.effects.glow?.blur || 10}px ${theme.colors.text.color})`);
        }
      
        // Calculate vertical spacing
        const getTotalHeight = (lineCount) => {
          return theme.layout.margins?.top || 60 + 
                 (lineCount * theme.layout.bodySize * lineHeight);
        };
      
        // Generate SVG content with enhanced positioning
        const svgContent = lines.map((line, index) => {
          const yPosition = (theme.layout.margins?.top || 60) + 
                           (index * theme.layout.bodySize * lineHeight);
          
          const xPos = getXPosition(theme.layout.textAlign);
          const anchor = getTextAnchor(theme.layout.textAlign);
          
          const escapedLine = line.trim()
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
      
          return `    <text
            x="${xPos}"
            y="${yPosition}"
            font-size="${theme.fonts.body.size}"
            fill="${ColorHelper.darkenColor(theme.colors.text.color, 0.8)}"
            text-anchor="${anchor}"
            dominant-baseline="middle"
            class="content-line"
            ${theme.effects?.textShadow ? 'filter="url(#shadow)"' : ''}
          >${escapedLine}</text>`;
        }).join('\n');
      
        // Complete SVG with filters and styling
        return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
      <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" version="1.1">
        <defs>
          <!-- Shadow filter -->
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="${theme.effects?.shadow?.blur || 3}"/>
            <feOffset dx="${theme.effects?.shadow?.offset?.x || 2}" dy="${theme.effects?.shadow?.offset?.y || 2}"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="${theme.effects?.shadow?.opacity || 0.3}"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="textGlow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2"/>
            <feComposite in="SourceGraphic" operator="over"/>
          </filter>
      
      
          <!-- Text hover effects -->
          <style>
            .content-line {
              ${baseTextStyle}
              ${textEffects.join(';')}
              transition: fill 0.3s ease;
            }
            .content-line:hover {
              fill: ${theme.colors.text.hoverColor || theme.colors.text.color};
            }
          </style>
        </defs>
      
        <!-- Decorative elements -->
        ${TextEffects.generateDecorationElements(theme)}
      
        <!-- Main content -->
        ${svgContent}
      
        <!-- Additional effects for analysis-based styling -->
        ${analysis.sentiment?.polarity === 'positive' ? `
          <defs>
            <linearGradient id="positiveGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:${theme.colors.text.color};stop-opacity:0.1"/>
              <stop offset="50%" style="stop-color:${theme.colors.text.color};stop-opacity:0.2"/>
              <stop offset="100%" style="stop-color:${theme.colors.text.color};stop-opacity:0.1"/>
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="1200" height="1200" fill="url(#positiveGlow)" opacity="0.1"/>
        ` : ''}
      </svg>`;
      }

   generateTitleSVG(title, theme) {
        const escapedTitle = title
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');

        // Calculate title position based on alignment
        const xPosition = theme.layout.textAlign === 'right' ? 1100 :
                        theme.layout.textAlign === 'left' ? 100 : 600;
        
        const textAnchor = theme.layout.textAlign === 'right' ? 'end' :
                            theme.layout.textAlign === 'left' ? 'start' : 'middle';

        // Use the new theme structure for fonts
        return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
        <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="150" version="1.1">
        <defs>
            <filter id="titleGlow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2"/>
            <feComposite in="SourceGraphic" operator="over"/>
            </filter>
        </defs>
        <text
            x="${xPosition}"
            y="75"
            font-family="${theme.fonts.title.family.replace(/"/g, '&quot;')}"
            font-size="${theme.fonts.title.size}"
            font-weight="${theme.fonts.title.weight}"
            fill="${ColorHelper.darkenColor(theme.colors.title.color, 0.8)}"
            text-anchor="${textAnchor}"
            dominant-baseline="middle"
            ${theme.effects?.textShadow ? 'filter="url(#shadow)"' : ''}
        >${escapedTitle}</text>
        ${theme.layout.textAlign === 'right' ?
            `<line x1="300" y1="100" x2="${xPosition + 50}" y2="100"` :
            `<line x1="${xPosition - 300}" y1="100" x2="${xPosition + 300}" y2="100"`}
            stroke="${theme.colors.title.color}"
            stroke-width="1"
        />
        </svg>`;
     }
}

export default new SvgGenerator();