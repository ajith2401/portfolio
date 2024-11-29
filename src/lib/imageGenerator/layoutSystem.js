// src/lib/imageGenerator/layoutSystem.js
import sharp from 'sharp';
import { TextEffectProcessor } from './textEffects';
import { GridSystem } from './gridSystem';
import { ConstraintSystem } from './constraintSystem';

export class LayoutManager {
  constructor(width = 1200, height = 1200) {
    this.width = width;
    this.height = height;
    this.textEffects = new TextEffectProcessor();
    this.gridSystem = new GridSystem(width, height);
    this.constraintSystem = new ConstraintSystem();

    this.layoutConfigs = {
      poem: {
        type: 'vertical-flow',
        sections: ['title', 'content', 'footer'],
        spacing: 'balanced',
        margins: { top: 80, bottom: 80, left: 100, right: 100 },
        alignment: 'right',
        constraints: {
          title: { maxHeight: '20%', minHeight: 150 },
          content: { minHeight: '50%', maxHeight: '70%' },
          footer: { height: 150, pinBottom: true }
        }
      },
      article: {
        type: 'grid',
        columns: 2,
        sections: ['header', 'content', 'footer'],
        spacing: 'dynamic',
        margins: { top: 60, bottom: 60, left: 80, right: 80 },
        alignment: 'justified',
        constraints: {
          header: { height: 200, spanColumns: true },
          content: { minHeight: '60%' },
          footer: { height: 120, spanColumns: true }
        }
      },
      quote: {
        type: 'centered',
        sections: ['attribution', 'content', 'footer'],
        spacing: 'compact',
        margins: { top: 100, bottom: 100, left: 200, right: 200 },
        alignment: 'center',
        constraints: {
          attribution: { maxHeight: '15%' },
          content: { maxWidth: '80%' },
          footer: { height: 100 }
        }
      }
    };

    // Advanced typography presets
    this.typographyPresets = {
      classic: {
        title: {
          font: '"Noto Serif Tamil Slanted"',
          size: { min: 36, max: 72, default: 48 },
          weight: 800,
          letterSpacing: 0,
          lineHeight: 1.2,
          effects: ['shadow', 'gradient']
        },
        body: {
          font: '"Annai MN"',
          size: { min: 24, max: 48, default: 36 },
          weight: 400,
          letterSpacing: 0,
          lineHeight: 1.8,
          effects: ['outline']
        },
        branding: {
          font: '"Tamil Sangam MN"',
          size: { min: 24, max: 36, default: 32 },
          effects: ['shadow']
        },
        contact: {
          font: '"Noto Sans Tamil"',
          size: { min: 18, max: 28, default: 24 }
        }
      }
      // Add more typography presets here
    };

    // Initialize gradient and pattern systems
    this.initializeDecorationSystems();
  }

  initializeDecorationSystems() {
    this.gradientPatterns = {
      linear: (colors, angle = 45) => ({
        type: 'linearGradient',
        id: `grad-${Math.random().toString(36).substr(2, 9)}`,
        angle,
        stops: colors.map((color, index) => ({
          offset: `${(index * 100) / (colors.length - 1)}%`,
          color
        }))
      }),
      radial: (colors, center = { x: '50%', y: '50%' }) => ({
        type: 'radialGradient',
        id: `grad-${Math.random().toString(36).substr(2, 9)}`,
        center,
        stops: colors.map((color, index) => ({
          offset: `${(index * 100) / (colors.length - 1)}%`,
          color
        }))
      })
    };

    this.patterns = {
      dots: (size = 10, color = '#000000', opacity = 0.1) => ({
        type: 'pattern',
        id: `pattern-${Math.random().toString(36).substr(2, 9)}`,
        width: size,
        height: size,
        patternUnits: 'userSpaceOnUse',
        content: `<circle cx="${size/2}" cy="${size/2}" r="${size/4}" fill="${color}" opacity="${opacity}"/>`
      }),
      lines: (spacing = 20, color = '#000000', opacity = 0.1, angle = 45) => ({
        type: 'pattern',
        id: `pattern-${Math.random().toString(36).substr(2, 9)}`,
        width: spacing,
        height: spacing,
        patternTransform: `rotate(${angle})`,
        patternUnits: 'userSpaceOnUse',
        content: `<line x1="0" y1="0" x2="0" y2="${spacing}" stroke="${color}" opacity="${opacity}"/>`
      })
    };
  }

  getLayoutConfig(layoutType, options = {}) {
    const baseConfig = this.layoutConfigs[layoutType] || this.layoutConfigs.poem;
    return {
      ...baseConfig,
      ...options,
      margins: { ...baseConfig.margins, ...(options.margins || {}) },
      constraints: { ...baseConfig.constraints, ...(options.constraints || {}) }
    };
  }

  processStyle(sectionName, layoutConfig, contentStyle = {}) {
    // Create a base default style
    const defaultStyle = {
      fontSize: sectionName === 'title' ? 48 : 32,
      textAlign: 'right',
      lineHeight: sectionName === 'title' ? 1.4 : 2.0
    };
    
    // Process contentStyle based on section type
    let sectionStyle = {};
    if (contentStyle) {
      if (sectionName === 'title') {
        sectionStyle = {
          fontSize: contentStyle.titleSize || defaultStyle.fontSize,
          textAlign: contentStyle.textAlign || defaultStyle.textAlign,
          lineHeight: contentStyle.titleLineHeight || defaultStyle.lineHeight
        };
      } else {
        sectionStyle = {
          fontSize: contentStyle.bodySize || defaultStyle.fontSize,
          textAlign: contentStyle.textAlign || defaultStyle.textAlign,
          lineHeight: contentStyle.lineHeight || defaultStyle.lineHeight
        };
      }
    }
  
    return {
      ...defaultStyle,
      ...sectionStyle,
      textAlign: sectionStyle.textAlign || layoutConfig.alignment || defaultStyle.textAlign
    };
  }
  processSections(content, layoutConfig) {
    const sections = [
        {
            name: 'title',
            content: content.title || '',
            style: {
                fontSize: content.style?.titleSize || 48,
                lineHeight: content.style?.titleLineHeight || 1.4,
                textAlign: content.style?.textAlign || 'center'
            }
        },
        {
            name: 'content',
            content: content.body || '',
            style: {
                fontSize: content.style?.bodySize || 32,
                lineHeight: content.style?.lineHeight || 1.8,
                textAlign: content.style?.textAlign || 'left'
            }
        }
    ];

    // Log and filter out empty sections
    console.log('Processing Sections:', sections);
    return sections.filter(section => section.content && section.content.trim());
}

  

  processContent(content, layoutType) {
    if (typeof content !== 'string') {
      return content;
    }

    const lines = content.split('\n').filter(line => line.trim());
    
    switch (layoutType) {
      case 'grid':
        return this.gridSystem.distributeText(lines);
      case 'vertical-flow':
        return lines;
      case 'centered':
        return this.centerText(lines);
      default:
        return lines;
    }
  }

  centerText(lines) {
    return lines.map(line => ({
      text: line,
      alignment: 'center'
    }));
  }
  generateLayout(content, theme, layoutType = 'poem', options = {}) {
    console.log("Input Content:", { content, theme, layoutType, options });

    try {
        // Step 1: Get Layout Configuration
        const layoutConfig = this.getLayoutConfig(layoutType, options);
        console.log("Layout Config:", layoutConfig);

        // Step 2: Validate Dimensions
        const dimensions = options.dimensions || { width: 1200, height: 1200 };
        if (!dimensions.width || !dimensions.height) {
            throw new Error('Invalid dimensions for layout.');
        }

        // Step 3: Process Sections
        const sections = this.processSections(content, layoutConfig);
        console.log("Processed Sections:", sections);

        // Step 4: Resolve Constraints
        const layout = this.constraintSystem.calculateLayout(sections, {
            ...layoutConfig.constraints,
            dimensions
        });
        console.log("Calculated Layout:", layout);

        // Step 5: Generate SVG
        const svg = this.generateSVG(sections, layout, theme, { dimensions });
        console.log("Generated SVG:", svg);

        return svg;
    } catch (error) {
        console.error('Error generating layout:', error);
        throw error;
    }
}



  processTextContent(text, layoutType) {
    const lines = text.split('\n').filter(line => line.trim());
    
    switch (layoutType) {
      case 'grid':
        return this.gridSystem.distributeText(lines);
      case 'vertical-flow':
        return lines;
      case 'centered':
        return this.centerText(lines);
      default:
        return lines;
    }
  }

  generateSVG(sections, layout, theme, options) {
    const svgElements = [];

    // Loop through the layout object
    Object.entries(layout).forEach(([sectionName, sectionLayout]) => {
        const section = sections.find(sec => sec.name === sectionName);

        if (!section) {
            console.warn(`Section "${sectionName}" not found in sections.`);
            return;
        }

        // Generate SVG for the section
        const svg = this.generateSectionSVG(section, sectionLayout, theme);
        if (svg) svgElements.push(svg);
    });

    // Combine SVG elements into a full SVG
    return `
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            xmlns:xlink="http://www.w3.org/1999/xlink"
            width="${options.dimensions?.width || 1200}" 
            height="${options.dimensions?.height || 1200}"
            viewBox="0 0 ${options.dimensions?.width || 1200} ${options.dimensions?.height || 1200}"
        >
            ${svgElements.join('\n')}
        </svg>
    `;
}




generateSVGHeader() {
    // Ensure width and height are valid numbers
    const width = this.width || 1200; // Default to 1200 if not set
    const height = this.height || 1200; // Default to 1200 if not set

    if (typeof width !== 'number' || typeof height !== 'number') {
        console.error('Invalid width or height for SVG header.');
        throw new Error('SVG dimensions must be valid numbers.');
    }

    return `
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        xmlns:xlink="http://www.w3.org/1999/xlink"
        width="${width}" 
        height="${height}"
        viewBox="0 0 ${width} ${height}"
      >
    `;
}

generateDefs(theme, options) {
    let defs = '<defs>';
    
    // Add gradients
    if (theme.gradients) {
      defs += this.generateGradients(theme.gradients);
    }
    
    // Add patterns
    if (theme.patterns) {
      defs += this.generatePatterns(theme.patterns);
    }
    
    // Add filters for text effects
    if (theme.effects) {
      defs += this.textEffects.generateCombinedFilters(theme.effects);
    }
    
    defs += '</defs>';
    return defs;
  }

generateSectionSVG(section, layout, theme) {
    console.log({ section, layout, theme }); // Debug log

    if (!layout || !section.content) {
        console.warn(`Skipping section "${section.name}" due to missing layout or content.`);
        return '';
    }

    // Handle section-specific SVG generation
    switch (section.name) {
        case 'title':
            return this.generateTitleSection(section.content, layout, section.style, theme);
        case 'content':
            return this.generateContentSection(section.content, layout, section.style, theme);
        case 'footer':
            return this.generateFooterSection(section.content, layout, section.style, theme);
        default:
            console.warn(`Unknown section "${section.name}"`);
            return '';
    }
}


 
generateTitleSection(content, layout, style, theme) {
  if (!content) {
      console.error('Missing content for title section.');
      return ''; // Safeguard against missing content
  }

  const fontFamily = theme.typography?.title?.font || '"Noto Serif Tamil Slanted"';
  const fontSize = style.fontSize || 48;
  const textAlign = style.textAlign === 'right' ? 'end' : 'middle';
  const x = style.textAlign === 'right' ? layout.width - 20 : layout.width / 2;
  const y = layout.y || 50; // Default Y coordinate

  return `
    <text
      x="${x}"
      y="${y}"
      font-family="${fontFamily}"
      font-size="${fontSize}px"
      fill="${theme.colors?.title || '#000000'}"
      text-anchor="${textAlign}"
      dominant-baseline="hanging"
    >${this.escapeXml(content)}</text>
  `;
}
 

generateContentSection(content, layout, style, theme) {
    if (!Array.isArray(content)) content = content.split('\n').filter(line => line.trim());

    const fontSize = style.fontSize || 32;
    const lineHeight = style.lineHeight || 1.8;
    const spacing = fontSize * lineHeight;

    return content.map((line, index) => `
      <text
        x="${style.textAlign === 'right' ? layout.width - 20 : layout.width / 2}"
        y="${index * spacing + layout.y || 100}"  // Start at Y offset
        font-family="${theme.typography?.body?.font || '"Annai MN"'}"
        font-size="${fontSize}px"
        fill="${theme.colors?.text || '#000000'}"
        text-anchor="${style.textAlign === 'right' ? 'end' : 'middle'}"
        dominant-baseline="middle"
      >${this.escapeXml(line)}</text>
    `).join('');
}

generateFooterSection(content, layout, style, theme) {
    if (!content) {
        console.warn('Missing footer content.');
        return '';
    }

    return `
      <text
        x="${layout.width / 2}"
        y="${layout.height - 50}" // Position at bottom
        font-family="${theme.typography?.branding?.font || '"Tamil Sangam MN"'}"
        font-size="${theme.typography?.branding?.size || 24}px"
        fill="${theme.colors.text || '#000000'}"
        text-anchor="middle"
        dominant-baseline="middle"
      >${this.escapeXml(content)}</text>
    `;
}


generateGenericSection(content, layout, style, theme) {
    const fontSize = style.fontSize || 32;
    return `
      <text
        x="${layout.width / 2}"
        y="${layout.height / 2}"
        font-family="${theme.typography?.body?.font || '"Annai MN"'}"
        font-size="${fontSize}px"
        fill="${theme.colors.text || '#000000'}"
        text-anchor="middle"
        dominant-baseline="middle"
      >${this.escapeXml(content)}</text>
    `;
  }

  // Helper methods for text processing and safety
escapeXml(unsafe) {
  if (!unsafe || typeof unsafe !== 'string') return '';
  return unsafe.replace(/[<>&'"]/g, (char) => {
    switch (char) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case "'":
        return '&apos;';
      case '"':
        return '&quot;';
      default:
        return char;
    }
  });
}

}

export default new LayoutManager();