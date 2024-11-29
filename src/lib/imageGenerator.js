// src/lib/imageGeneration/imageGenerationService.js
import sharp from 'sharp';
import path from 'path';
import { TamilTextAnalyzer } from './tamilAnalysis/analyzer';
import { uploadGeneratedImage } from './cloudinary';
import connectDB from './db';
import { Writing } from '@/models';


const TEXT_METRICS = {
  CANVAS_WIDTH: 1200,
  CANVAS_HEIGHT: 1200,
  BRANDING_HEIGHT: 150,  // Fixed branding space at bottom
  
  // Line count thresholds
  MIN_LINES: 1,
  MAX_LINES: 28,  // (1200 - 150 branding) / (24px * 1.4 min spacing) ≈ 31.5 lines max
  
  // Font size ranges - Adjusted for new minimum
  MAX_FONT_SIZE: 32,     // For short content (1-5 lines)
  MIN_FONT_SIZE: 24,     // New minimum for better readability
  
  // Line height ranges - Optimized for new font sizes
  MAX_LINE_HEIGHT: 1.8,  // For content with few lines (1-10)
  MIN_LINE_HEIGHT: 1.4,  // Minimum readable spacing for Tamil
  
  // Positioning - Adjusted for new metrics
  BASE_POSITION: 200,    // Reduced to accommodate larger minimum font
  MIN_POSITION: 80,      // Minimum distance from top
  
  // Words per line
  POEM_MAX_WORDS: 4,
  PROSE_MAX_WORDS: 8,    // 8 words max for prose
  
  // Dynamic adjustment thresholds - Recalculated for new minimum font size
  LINE_THRESHOLDS: [
    { lines: 8,  fontSize: 32, lineHeight: 1.8 },  // 1-8 lines: largest font
    { lines: 15, fontSize: 28, lineHeight: 1.6 },  // 9-15 lines: medium font
    { lines: 20, fontSize: 26, lineHeight: 1.5 },  // 16-20 lines: smaller font
    { lines: 28, fontSize: 24, lineHeight: 1.4 }   // 21+ lines: minimum font
  ],
  
  // Font reduction steps - Adjusted for new range
  FONT_REDUCTION: {
    STEP: 2,            // Smaller steps due to smaller font range
    MIN_THRESHOLD: 5    // Start reducing after 5 lines
  }
};

class TextMetricsCalculator {
  calculateMetrics(lineCount, category, hasTitle = false) {
    // 1. Validate line count with new maximum
    const validLineCount = Math.max(
      TEXT_METRICS.MIN_LINES,
      Math.min(lineCount, TEXT_METRICS.MAX_LINES)
    );

    // 2. Calculate available space
    const titleHeight = hasTitle ? 120 : 0;
    const availableHeight = TEXT_METRICS.CANVAS_HEIGHT - 
                          TEXT_METRICS.BRANDING_HEIGHT - 
                          titleHeight;

    // 3. Calculate initial font size based on line count
    const fontSize = this.calculateDynamicFontSize(validLineCount);
    
    // 4. Calculate line height
    const lineHeight = this.calculateDynamicLineHeight(validLineCount);
    
    // 5. Calculate initial text block height
    const textBlockHeight = this.calculateTextBlockHeight(validLineCount, fontSize, lineHeight);
    
    // 6. Adjust values if content exceeds boundaries
    const { adjustedFontSize, adjustedLineHeight } = this.adjustForBoundaries(
      fontSize, 
      lineHeight, 
      textBlockHeight, 
      availableHeight,
      validLineCount
    );

    // 7. Calculate final text block height
    const finalTextBlockHeight = this.calculateTextBlockHeight(
      validLineCount, 
      adjustedFontSize, 
      adjustedLineHeight
    );

    // 8. Calculate optimal top position
    const topPosition = this.calculateTopPosition(
      validLineCount, 
      finalTextBlockHeight, 
      hasTitle
    );

    // 9. Calculate words per line based on font size and category
    const maxWordsPerLine = category === 'poem' ? 
      TEXT_METRICS.POEM_MAX_WORDS : 
      Math.min(
        TEXT_METRICS.PROSE_MAX_WORDS,
        Math.floor((TEXT_METRICS.CANVAS_WIDTH - 120) / (adjustedFontSize * 2))
      );

    return {
      fontSize: adjustedFontSize,
      lineHeight: adjustedLineHeight,
      topPosition,
      maxWordsPerLine,
      textBlockHeight: finalTextBlockHeight,
      metrics: {
        totalHeight: finalTextBlockHeight + titleHeight + TEXT_METRICS.BRANDING_HEIGHT,
        exceedsCanvas: finalTextBlockHeight > availableHeight
      }
    };
  }

  calculateDynamicFontSize(lineCount) {
    // Find appropriate threshold
    const threshold = TEXT_METRICS.LINE_THRESHOLDS.find(t => lineCount <= t.lines) || 
                     TEXT_METRICS.LINE_THRESHOLDS[TEXT_METRICS.LINE_THRESHOLDS.length - 1];
    
    // Calculate reduction for lines exceeding threshold
    const reduction = Math.max(0, 
      Math.floor((lineCount - TEXT_METRICS.FONT_REDUCTION.MIN_THRESHOLD) / 5) * 
      TEXT_METRICS.FONT_REDUCTION.STEP
    );
    
    // Ensure we never go below minimum font size
    return Math.max(
      TEXT_METRICS.MIN_FONT_SIZE,
      threshold.fontSize - reduction
    );
  }

  calculateDynamicLineHeight(lineCount) {
    const threshold = TEXT_METRICS.LINE_THRESHOLDS.find(t => lineCount <= t.lines) || 
                     TEXT_METRICS.LINE_THRESHOLDS[TEXT_METRICS.LINE_THRESHOLDS.length - 1];
    
    return Math.max(
      TEXT_METRICS.MIN_LINE_HEIGHT,
      threshold.lineHeight
    );
  }

  calculateTextBlockHeight(lineCount, fontSize, lineHeight) {
    return lineCount * fontSize * lineHeight;
  }

  adjustForBoundaries(fontSize, lineHeight, textBlockHeight, availableHeight, lineCount) {
    let adjustedFontSize = fontSize;
    let adjustedLineHeight = lineHeight;

    // If content exceeds boundaries, adjust line height first
    if (textBlockHeight > availableHeight) {
      adjustedLineHeight = Math.max(
        TEXT_METRICS.MIN_LINE_HEIGHT,
        (availableHeight / (lineCount * fontSize))
      );
      
      // If still too large, reduce font size to minimum
      if (lineCount * fontSize * adjustedLineHeight > availableHeight) {
        adjustedFontSize = TEXT_METRICS.MIN_FONT_SIZE;
        adjustedLineHeight = TEXT_METRICS.MIN_LINE_HEIGHT;
      }
    }

    return { adjustedFontSize, adjustedLineHeight };
  }

  calculateTopPosition(lineCount, textBlockHeight, hasTitle) {
    let position = TEXT_METRICS.BASE_POSITION;
    
    // Adjust position based on content length
    if (lineCount > 15) {
      position -= Math.min(50, (lineCount - 15) * 3);
    }
    
    // Ensure minimum position
    position = Math.max(TEXT_METRICS.MIN_POSITION, position);
    
    // Add title offset if present
    if (hasTitle) {
      position += 80;
    }
    
    return position;
  }
}

export class ImageGenerationService {
  constructor() {
    this.analyzer = new TamilTextAnalyzer();
    this.setupThemes();
    this.textMetrics = new TextMetricsCalculator();
  }

  setupThemes() {
    const defaultFonts = {
      title: {
        family: '"Noto Serif Tamil Slanted"',
        size: 48,
        weight: 800
      },
      body: {
        family: '"Annai MN"',
        size: 32,
        weight: 400
      },
      branding: {
        name: {
          family: '"Tamil Sangam MN"',
          size: 32,
          weight: 700,
        },
        web: {
          family: '"Noto Sans Tamil"',
          size: 24,
          weight: 400,
        },
        phone: {
          family: '"Noto Sans Tamil"',
          size: 24,
          weight: 400,
        },
        social: {
          family: '"Noto Sans Tamil"',
          size: 24,
          weight: 400,
        }
      }
    };
  
    this.themes = {
      // Light Themes
      default: {
        ...this.createTheme('#FFFFFF', '#000000'),
        name: 'default',
        backgroundImage: 'whiteIinedImg.jpg',
        fonts: defaultFonts,
        colors: {
          title: { color: '#000000', hoverColor: '#333333' },
          text: { color: '#000000', hoverColor: '#333333' },
          branding: {
            background: '#095086',
            name: { color: '#ffffff', hoverColor: '#333333' },
            web: { color: '#ffffff', hoverColor: '#333333' },
            phone: { color: '#ffffff', hoverColor: '#333333' },
            social: { color: '#ffffff', hoverColor: '#333333' }
          }
        }
      },
  
      red: {
        ...this.createTheme('#FFE6E6', '#8B0000'),
        name: 'red',
        backgroundImage: 'red.jpg',
        fonts: defaultFonts,
        colors: {
          title: { color: '#FFFFFF', hoverColor: '#660000' },
          text: { color: '#FFFFFF', hoverColor: '#660000' },
          branding: {
            background: '#FFE6E6',
            name: { color: '#8B0000', hoverColor: '#660000' },
            web: { color: '#8B0000', hoverColor: '#660000' },
            phone: { color: '#8B0000', hoverColor: '#660000' },
            social: { color: '#8B0000', hoverColor: '#660000' }
          }
        }
      },
  
      blue: {
        ...this.createTheme('#E6F3FF', '#003366'),
        name: 'blue',
        backgroundImage: 'blueImg.jpg',
        fonts: defaultFonts,
        colors: {
          title: { color: '#ffffff', hoverColor: '#002147' },
          text: { color: '#ffffff', hoverColor: '#002147' },
          branding: {
            background: '#E6F3FF',
            name: { color: '#003366', hoverColor: '#002147' },
            web: { color: '#004080', hoverColor: '#003366' },
            phone: { color: '#004080', hoverColor: '#003366' },
            social: { color: '#004080', hoverColor: '#003366' }
          }
        }
      },
  
      green: {
        ...this.createTheme('#E6FFE6', '#006400'),
        name: 'green',
        backgroundImage: 'greenAlt2.png',
        fonts: defaultFonts,
        colors: {
          title: { color: '	#FFFFFF', hoverColor: '#004d00' },
          text: { color: '	#FFFFFF', hoverColor: '#004d00' },
          branding: {
            background: '#E6FFE6',
            name: { color: '#006400', hoverColor: '#004d00' },
            web: { color: '#007300', hoverColor: '#006400' },
            phone: { color: '#007300', hoverColor: '#006400' },
            social: { color: '#007300', hoverColor: '#006400' }
          }
        }
      },
  
      // Dark Themes
      black: {
        ...this.createTheme('#1A1A1A', '#FFFFFF'),
        name: 'black',
        backgroundImage: 'paintedBlackImg.jpg',
        fonts: defaultFonts,
        colors: {
          title: { color: '#FFFFFF', hoverColor: '#E0E0E0' },
          text: { color: '#FFFFFF', hoverColor: '#E0E0E0' },
          branding: {
            background: '#1A1A1A',
            name: { color: '#FFFFFF', hoverColor: '#E0E0E0' },
            web: { color: '#F0F0F0', hoverColor: '#E0E0E0' },
            phone: { color: '#F0F0F0', hoverColor: '#E0E0E0' },
            social: { color: '#F0F0F0', hoverColor: '#E0E0E0' }
          }
        }
      },
  
      // Nature-inspired Themes
      navyBlue: {
        ...this.createTheme('#D3EFF4', '#05445E'),
        name: 'navyBlue',
        backgroundImage: 'navyblueAlt.jpg',
        fonts: defaultFonts,
        colors: {
          title: { color: '#CBCBD4', hoverColor: '#043444' },
          text: { color: '#CBCBD4', hoverColor: '#043444' },
          branding: {
            background: '#D3EFF4',
            name: { color: '#05445E', hoverColor: '#043444' },
            web: { color: '#189AB4', hoverColor: '#05445E' },
            phone: { color: '#189AB4', hoverColor: '#05445E' },
            social: { color: '#189AB4', hoverColor: '#05445E' }
          }
        }
      },
  
      midnightBlue: {
        ...this.createTheme('#D3EFF4', '#274472'),
        name: 'midnightBlue',
        backgroundImage: 'navyblueImg.jpg',
        fonts: defaultFonts,
        colors: {
          title: { color: '#274472', hoverColor: '#1b2f4d' },
          text: { color: '#274472', hoverColor: '#1b2f4d' },
          branding: {
            background: '#D3EFF4',
            name: { color: '#274472', hoverColor: '#1b2f4d' },
            web: { color: '#41729F', hoverColor: '#274472' },
            phone: { color: '#41729F', hoverColor: '#274472' },
            social: { color: '#41729F', hoverColor: '#274472' }
          }
        }
      },
   
    blackDustyRose: {
      ...this.createTheme('#E9DDD4', '#8B4513'),
      name: 'blackDustyRose',
      backgroundImage: 'blackDustyRose.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#8B4513', hoverColor: '#723709' },
        text: { color: '#8B4513', hoverColor: '#723709' },
        branding: {
          background: '#E9DDD4',
          name: { color: '#8B4513', hoverColor: '#723709' },
          web: { color: '#A0522D', hoverColor: '#8B4513' },
          phone: { color: '#A0522D', hoverColor: '#8B4513' },
          social: { color: '#A0522D', hoverColor: '#8B4513' }
        }
      }
    },

    oceanBlue: {
      ...this.createTheme('#E1F5FE', '#01579B'),
      name: 'oceanBlue',
      backgroundImage: 'oceanBlueAlt.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#FFA500', hoverColor: '#014378' },
        text: { color: '#FFA500', hoverColor: '#014378' },
        branding: {
          background: '#E1F5FE',
          name: { color: '#01579B', hoverColor: '#014378' },
          web: { color: '#0277BD', hoverColor: '#01579B' },
          phone: { color: '#0277BD', hoverColor: '#01579B' },
          social: { color: '#0277BD', hoverColor: '#01579B' }
        }
      }
    },

    peacockFeather: {
      ...this.createTheme('#E0F7FA', '#006064'),
      name: 'peacockFeather',
      backgroundImage: 'peacockFeatherImg.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#FFFFFF', hoverColor: '#004d4d' },
        text: { color: '#FFFFFF', hoverColor: '#004d4d' },
        branding: {
          background: '#E0F7FA',
          name: { color: '#006064', hoverColor: '#004d4d' },
          web: { color: '#00838F', hoverColor: '#006064' },
          phone: { color: '#00838F', hoverColor: '#006064' },
          social: { color: '#00838F', hoverColor: '#006064' }
        }
      }
    },

    eveningSky: {
      ...this.createTheme('#FFF8E1', '#4A148C'),
      name: 'eveningSky',
      backgroundImage: 'eveningSkyImg.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#FFFFFF', hoverColor: '#3A1070' },
        text: { color: '#FFFFFF', hoverColor: '#3A1070' },
        branding: {
          background: '#FFF8E1',
          name: { color: '#4A148C', hoverColor: '#3A1070' },
          web: { color: '#6A1B9A', hoverColor: '#4A148C' },
          phone: { color: '#6A1B9A', hoverColor: '#4A148C' },
          social: { color: '#6A1B9A', hoverColor: '#4A148C' }
        }
      }
    },
    starSky: {
      ...this.createTheme('#1A237E', '#FFFFFF'),
      name: 'starSky',
      backgroundImage: 'starSkyImg.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#FFFFFF', hoverColor: '#E0E0E0' },
        text: { color: '#FFFFFF', hoverColor: '#E0E0E0' },
        branding: {
          background: '#1A237E',
          name: { color: '#FFFFFF', hoverColor: '#E0E0E0' },
          web: { color: '#E8EAF6', hoverColor: '#FFFFFF' },
          phone: { color: '#E8EAF6', hoverColor: '#FFFFFF' },
          social: { color: '#E8EAF6', hoverColor: '#FFFFFF' }
        }
      },
      effects: {
        textShadow: true,
        shadow: {
          blur: 4,
          opacity: 0.5,
          offset: { x: 2, y: 2 }
        }
      }
    },
    creamTan: {
      ...this.createTheme('#F3ECDA', '#94553D'),
      name: 'creamTan',
      backgroundImage: 'brownAlt.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#f5f5f0', hoverColor: '#7A4632' },
        text: { color: '#f5f5f0', hoverColor: '#7A4632' },
        branding: {
          background: '#F3ECDA',
          name: { color: '#94553D', hoverColor: '#7A4632' },
          web: { color: '#6B4423', hoverColor: '#94553D' },
          phone: { color: '#6B4423', hoverColor: '#94553D' },
          social: { color: '#6B4423', hoverColor: '#94553D' }
        }
      }
    },
    jetBlack: {
      ...this.createTheme('#FDFDFD', '#050606'),
      name: 'jetBlack',
      backgroundImage: 'blackCloth.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#FFFFFF', hoverColor: '#1A1A1A' },
        text: { color: '#FFFFFF', hoverColor: '#1A1A1A' },
        branding: {
          background: '#FDFDFD',
          name: { color: '#050606', hoverColor: '#1A1A1A' },
          web: { color: '#ADB3BC', hoverColor: '#050606' },
          phone: { color: '#ADB3BC', hoverColor: '#050606' },
          social: { color: '#ADB3BC', hoverColor: '#050606' }
        }
      }
    },
    limeGreen: {
      ...this.createTheme('#F6FFE5', '#4A7212'),
      name: 'limeGreen',
      backgroundImage: 'limeGreenImg.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#4A7212', hoverColor: '#3A5A0E' },
        text: { color: '#4A7212', hoverColor: '#3A5A0E' },
        branding: {
          background: '#F6FFE5',
          name: { color: '#4A7212', hoverColor: '#3A5A0E' },
          web: { color: '#104210', hoverColor: '#4A7212' },
          phone: { color: '#104210', hoverColor: '#4A7212' },
          social: { color: '#104210', hoverColor: '#4A7212' }
        }
      }
    },
    tealGray: {
      ...this.createTheme('#EAF4F4', '#4B7A7A'),
      name: 'tealGray',
      backgroundImage: 'tealGrayImg.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: "#022036", hoverColor: '#3D6363' },
        text: { color: "#022036", hoverColor: '#3D6363' },
        branding: {
          background: '#EAF4F4',
          name: { color: '#4B7A7A', hoverColor: '#3D6363' },
          web: { color: '#2F4F4F', hoverColor: '#4B7A7A' },
          phone: { color: '#2F4F4F', hoverColor: '#4B7A7A' },
          social: { color: '#2F4F4F', hoverColor: '#4B7A7A' }
        }
      }
    },
    softGreen: {
      ...this.createTheme('#F9FFF2', '#47565E'),
      name: 'softGreen',
      backgroundImage: 'lightGreenBlueImg.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#47565E', hoverColor: '#394347' },
        text: { color: '#47565E', hoverColor: '#394347' },
        branding: {
          background: '#F9FFF2',
          name: { color: '#47565E', hoverColor: '#394347' },
          web: { color: '#214456', hoverColor: '#47565E' },
          phone: { color: '#214456', hoverColor: '#47565E' },
          social: { color: '#214456', hoverColor: '#47565E' }
        }
      }
    },
    vintage: {
      ...this.createTheme('#F4F2F3', '#656256'),
      name: 'vintage',
      backgroundImage: 'vintageGreenImg.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#656256', hoverColor: '#4E4B42' },
        text: { color: '#656256', hoverColor: '#4E4B42' },
        branding: {
          background: '#F4F2F3',
          name: { color: '#656256', hoverColor: '#4E4B42' },
          web: { color: '#230903', hoverColor: '#656256' },
          phone: { color: '#230903', hoverColor: '#656256' },
          social: { color: '#230903', hoverColor: '#656256' }
        }
      }
    },
    flower: {
      ...this.createTheme('#F4F2F3', '#656256'),
      name: 'flower',
      backgroundImage: 'flower.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#656256', hoverColor: '#4E4B42' },
        text: { color: '#656256', hoverColor: '#4E4B42' },
        branding: {
          background: '#F4F2F3',
          name: { color: '#656256', hoverColor: '#4E4B42' },
          web: { color: '#230903', hoverColor: '#656256' },
          phone: { color: '#230903', hoverColor: '#656256' },
          social: { color: '#230903', hoverColor: '#656256' }
        }
      }
    },
    blackCloth: {
      ...this.createTheme('#1A1A1A', '#FFFFFF'),
      name: 'blackCloth',
      backgroundImage: 'blackCloth.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#FFFFFF', hoverColor: '#E0E0E0' },
        text: { color: '#FFFFFF', hoverColor: '#E0E0E0' },
        branding: {
          background: '#1A1A1A',
          name: { color: '#FFFFFF', hoverColor: '#E0E0E0' },
          web: { color: '#FFFFFF', hoverColor: '#E0E0E0' },
          phone: { color: '#FFFFFF', hoverColor: '#E0E0E0' },
          social: { color: '#FFFFFF', hoverColor: '#E0E0E0' }
        }
      }
    },
    gradient: {
      ...this.createTheme('#FFFFFF', '#333333'),
      name: 'gradient',
      backgroundImage: 'gradient.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#333333', hoverColor: '#1A1A1A' },
        text: { color: '#333333', hoverColor: '#1A1A1A' },
        branding: {
          background: '#FFFFFF',
          name: { color: '#333333', hoverColor: '#1A1A1A' },
          web: { color: '#666666', hoverColor: '#333333' },
          phone: { color: '#666666', hoverColor: '#333333' },
          social: { color: '#666666', hoverColor: '#333333' }
        }
      }
    },
    waterColor: {
      ...this.createTheme('#FFF5F5', '#8B4513'),
      name: 'waterColor',
      backgroundImage: 'waterColourRoseImg.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#8B4513', hoverColor: '#723709' },
        text: { color: '#8B4513', hoverColor: '#723709' },
        branding: {
          background: '#FFF5F5',
          name: { color: '#8B4513', hoverColor: '#723709' },
          web: { color: '#A0522D', hoverColor: '#8B4513' },
          phone: { color: '#A0522D', hoverColor: '#8B4513' },
          social: { color: '#A0522D', hoverColor: '#8B4513' }
        }
      }
    },
    textile: {
      ...this.createTheme('#F5F5F5', '#4A4A4A'),
      name: 'textile',
      backgroundImage: 'textileMaterialImg.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#4A4A4A', hoverColor: '#333333' },
        text: { color: '#4A4A4A', hoverColor: '#333333' },
        branding: {
          background: '#F5F5F5',
          name: { color: '#4A4A4A', hoverColor: '#333333' },
          web: { color: '#666666', hoverColor: '#4A4A4A' },
          phone: { color: '#666666', hoverColor: '#4A4A4A' },
          social: { color: '#666666', hoverColor: '#4A4A4A' }
        }
      }
    },
    foggyForest: {
      ...this.createTheme('#E8F5E9', '#2E7D32'),
      name: 'foggyForest',
      backgroundImage: 'foggyGreenForestImg.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#2E7D32', hoverColor: '#1B5E20' },
        text: { color: '#2E7D32', hoverColor: '#1B5E20' },
        branding: {
          background: '#E8F5E9',
          name: { color: '#2E7D32', hoverColor: '#1B5E20' },
          web: { color: '#1B5E20', hoverColor: '#2E7D32' },
          phone: { color: '#1B5E20', hoverColor: '#2E7D32' },
          social: { color: '#1B5E20', hoverColor: '#2E7D32' }
        }
      }
    },
    greenLeaf: {
      ...this.createTheme('#E8F5E9', '#1B5E20'),
      name: 'greenLeaf',
      backgroundImage: 'greenLeafImg.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#1B5E20', hoverColor: '#0A4A0E' },
        text: { color: '#1B5E20', hoverColor: '#0A4A0E' },
        branding: {
          background: '#E8F5E9',
          name: { color: '#1B5E20', hoverColor: '#0A4A0E' },
          web: { color: '#004D40', hoverColor: '#1B5E20' },
          phone: { color: '#004D40', hoverColor: '#1B5E20' },
          social: { color: '#004D40', hoverColor: '#1B5E20' }
        }
      }
    },
    leafRose: {
      ...this.createTheme('#F3E5F5', '#4A148C'),
      name: 'leafRose',
      backgroundImage: 'greenLeafRoseImg.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#4A148C', hoverColor: '#3A1070' },
        text: { color: '#4A148C', hoverColor: '#3A1070' },
        branding: {
          background: '#F3E5F5',
          name: { color: '#4A148C', hoverColor: '#3A1070' },
          web: { color: '#311B92', hoverColor: '#4A148C' },
          phone: { color: '#311B92', hoverColor: '#4A148C' },
          social: { color: '#311B92', hoverColor: '#4A148C' }
        }
      }
    },
    greenishBrown: {
      ...this.createTheme('#EFEBE9', '#3E2723'),
      name: 'greenishBrown',
      backgroundImage: 'greenishBrownLeafImg.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#3E2723', hoverColor: '#2D1B19' },
        text: { color: '#3E2723', hoverColor: '#2D1B19' },
        branding: {
          background: '#EFEBE9',
          name: { color: '#3E2723', hoverColor: '#2D1B19' },
          web: { color: '#4E342E', hoverColor: '#3E2723' },
          phone: { color: '#4E342E', hoverColor: '#3E2723' },
          social: { color: '#4E342E', hoverColor: '#3E2723' }
        }
      }
    },
    lightBlack: {
      ...this.createTheme('#212121', '#FFFFFF'),
      name: 'lightBlack',
      backgroundImage: 'lightBlackImg.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#FFFFFF', hoverColor: '#E0E0E0' },
        text: { color: '#FFFFFF', hoverColor: '#E0E0E0' },
        branding: {
          background: '#212121',
          name: { color: '#FFFFFF', hoverColor: '#E0E0E0' },
          web: { color: '#EEEEEE', hoverColor: '#FFFFFF' },
          phone: { color: '#EEEEEE', hoverColor: '#FFFFFF' },
          social: { color: '#EEEEEE', hoverColor: '#FFFFFF' }
        }
      }
    },
    oldPaper: {
      ...this.createTheme('#EFEBE9', '#3E2723'),
      name: 'oldPaper',
      backgroundImage: 'oldDullBrownPaperImg.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#3E2723', hoverColor: '#2D1B19' },
        text: { color: '#3E2723', hoverColor: '#2D1B19' },
        branding: {
          background: '#EFEBE9',
          name: { color: '#3E2723', hoverColor: '#2D1B19' },
          web: { color: '#4E342E', hoverColor: '#3E2723' },
          phone: { color: '#4E342E', hoverColor: '#3E2723' },
          social: { color: '#4E342E', hoverColor: '#3E2723' }
        }
      }
    },
   redForest: {
      ...this.createTheme('#FFEBEE', '#B71C1C'),
      name: 'redForest',
      backgroundImage: 'redFlowerForestImg.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#B71C1C', hoverColor: '#8F1616' },
        text: { color: '#B71C1C', hoverColor: '#8F1616' },
        branding: {
          background: '#FFEBEE',
          name: { color: '#B71C1C', hoverColor: '#8F1616' },
          web: { color: '#C62828', hoverColor: '#B71C1C' },
          phone: { color: '#C62828', hoverColor: '#B71C1C' },
          social: { color: '#C62828', hoverColor: '#B71C1C' }
        }
      }
    },
    redTexture: {
      ...this.createTheme('#FFEBEE', '#B71C1C'),
      name: 'redTexture',
      backgroundImage: 'redTextureImg.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#B71C1C', hoverColor: '#8F1616' },
        text: { color: '#B71C1C', hoverColor: '#8F1616' },
        branding: {
          background: '#FFEBEE',
          name: { color: '#B71C1C', hoverColor: '#8F1616' },
          web: { color: '#C62828', hoverColor: '#B71C1C' },
          phone: { color: '#C62828', hoverColor: '#B71C1C' },
          social: { color: '#C62828', hoverColor: '#B71C1C' }
        }
      }
    },
    pinkBlueWater: {
      ...this.createTheme('#F3E5F5', '#4A148C'),
      name: 'pinkBlueWater',
      backgroundImage: 'pinkBlueWaterColurImg.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#4A148C', hoverColor: '#3A1070' },
        text: { color: '#4A148C', hoverColor: '#3A1070' },
        branding: {
          background: '#F3E5F5',
          name: { color: '#4A148C', hoverColor: '#3A1070' },
          web: { color: '#6A1B9A', hoverColor: '#4A148C' },
          phone: { color: '#6A1B9A', hoverColor: '#4A148C' },
          social: { color: '#6A1B9A', hoverColor: '#4A148C' }
        }
      }
    },
    lightBluePaint: {
      ...this.createTheme('#E3F2FD', '#0D47A1'),
      name: 'lightBluePaint',
      backgroundImage: 'lightBluePaintImg.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#0D47A1', hoverColor: '#093777' },
        text: { color: '#0D47A1', hoverColor: '#093777' },
        branding: {
          background: '#E3F2FD',
          name: { color: '#0D47A1', hoverColor: '#093777' },
          web: { color: '#1565C0', hoverColor: '#0D47A1' },
          phone: { color: '#1565C0', hoverColor: '#0D47A1' },
          social: { color: '#1565C0', hoverColor: '#0D47A1' }
        }
      }
    },
    ancientStone: {
      ...this.createTheme('#E8E0D5', '#2B1810'),
      name: 'ancientStone',
      backgroundImage: 'BrownAncientStoneImg.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#2B1810', hoverColor: '#1A0F0A' },
        text: { color: '#2B1810', hoverColor: '#1A0F0A' },
        branding: {
          background: '#E8E0D5',
          name: { color: '#2B1810', hoverColor: '#1A0F0A' },
          web: { color: '#463026', hoverColor: '#2B1810' },
          phone: { color: '#463026', hoverColor: '#2B1810' },
          social: { color: '#463026', hoverColor: '#2B1810' }
        }
      }
    },
    morningSun: {
      ...this.createTheme('#FFF7E6', '#8B4513'),
      name: 'morningSun',
      backgroundImage: 'MorningYelllowSunImg.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#8B4513', hoverColor: '#723709' },
        text: { color: '#8B4513', hoverColor: '#723709' },
        branding: {
          background: '#FFF7E6',
          name: { color: '#8B4513', hoverColor: '#723709' },
          web: { color: '#A0522D', hoverColor: '#8B4513' },
          phone: { color: '#A0522D', hoverColor: '#8B4513' },
          social: { color: '#A0522D', hoverColor: '#8B4513' }
        }
      }
    },
    multiColor: {
      ...this.createTheme('#FFFFFF', '#1A237E'),
      name: 'multiColor',
      backgroundImage: 'MultiBlueRedYellowImg.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#1A237E', hoverColor: '#131A5E' },
        text: { color: '#1A237E', hoverColor: '#131A5E' },
        branding: {
          background: '#FFFFFF',
          name: { color: '#1A237E', hoverColor: '#131A5E' },
          web: { color: '#0D47A1', hoverColor: '#1A237E' },
          phone: { color: '#0D47A1', hoverColor: '#1A237E' },
          social: { color: '#0D47A1', hoverColor: '#1A237E' }
        }
      }
    },
    pureBlack: {
      ...this.createTheme('#000000', '#FFFFFF'),
      name: 'pureBlack',
      backgroundImage: 'OldArchBWImg.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#FFFFFF', hoverColor: '#E0E0E0' },
        text: { color: '#FFFFFF', hoverColor: '#E0E0E0' },
        branding: {
          background: '#000000',
          name: { color: '#FFFFFF', hoverColor: '#E0E0E0' },
          web: { color: '#CCCCCC', hoverColor: '#FFFFFF' },
          phone: { color: '#CCCCCC', hoverColor: '#FFFFFF' },
          social: { color: '#CCCCCC', hoverColor: '#FFFFFF' }
        }
      },
      effects: {
        textShadow: true,
        glow: false,
        decorativeElements: true,
        backgroundTexture: true,
        shadow: {
          blur: 4,
          opacity: 0.5,
          offset: { x: 2, y: 2 }
        }
      }
    },
    blueFire: {
      ...this.createTheme('#E3F2FD', '#1565C0'),
      name: 'blueFire',
      backgroundImage: 'blueBGFilreImg.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#1565C0', hoverColor: '#0D47A1' },
        text: { color: '#1565C0', hoverColor: '#0D47A1' },
        branding: {
          background: '#E3F2FD',
          name: { color: '#1565C0', hoverColor: '#0D47A1' },
          web: { color: '#0D47A1', hoverColor: '#1565C0' },
          phone: { color: '#0D47A1', hoverColor: '#1565C0' },
          social: { color: '#0D47A1', hoverColor: '#1565C0' }
        }
      }
    },
    bluePastel: {
  ...this.createTheme('#FBEAEB', '#2F3C7E'),
  name: 'bluePastel',
  backgroundImage: 'bluePastelImg.jpg',
  fonts: defaultFonts,
  colors: {
    title: { color: '#2F3C7E', hoverColor: '#243064' },
    text: { color: '#2F3C7E', hoverColor: '#243064' },
    branding: {
      background: '#FBEAEB',
      name: { color: '#2F3C7E', hoverColor: '#243064' },
      web: { color: '#38478F', hoverColor: '#2F3C7E' },
      phone: { color: '#38478F', hoverColor: '#2F3C7E' },
      social: { color: '#38478F', hoverColor: '#2F3C7E' }
    }
  }
},
charcoalYellow: {
  ...this.createTheme('#FEE715', '#101820'),
  name: 'charcoalYellow',
  backgroundImage: 'charcoalYellowImg.jpg',
  fonts: defaultFonts,
  colors: {
    title: { color: '#101820', hoverColor: '#0E1618' },
    text: { color: '#101820', hoverColor: '#0E1618' },
    branding: {
      background: '#FEE715',
      name: { color: '#101820', hoverColor: '#0E1618' },
      web: { color: '#252B2E', hoverColor: '#101820' },
      phone: { color: '#252B2E', hoverColor: '#101820' },
      social: { color: '#252B2E', hoverColor: '#101820' }
    }
  }
},
coralYellow: {
  ...this.createTheme('#F9E795', '#F96167'),
  name: 'coralYellow',
  backgroundImage: 'coralYellowImg.jpg',
  fonts: defaultFonts,
  colors: {
    title: { color: '#F96167', hoverColor: '#D7505B' },
    text: { color: '#F96167', hoverColor: '#D7505B' },
    branding: {
      background: '#F9E795',
      name: { color: '#F96167', hoverColor: '#D7505B' },
      web: { color: '#FC7B85', hoverColor: '#F96167' },
      phone: { color: '#FC7B85', hoverColor: '#F96167' },
      social: { color: '#FC7B85', hoverColor: '#F96167' }
    }
  }
},
cherryCream: {
  ...this.createTheme('#FCF6F5', '#990011'),
  name: 'cherryCream',
  backgroundImage: 'cherryCreamImg.jpg',
  fonts: defaultFonts,
  colors: {
    title: { color: '#990011', hoverColor: '#7A0010' },
    text: { color: '#990011', hoverColor: '#7A0010' },
    branding: {
      background: '#FCF6F5',
      name: { color: '#990011', hoverColor: '#7A0010' },
      web: { color: '#B20013', hoverColor: '#990011' },
      phone: { color: '#B20013', hoverColor: '#990011' },
      social: { color: '#B20013', hoverColor: '#990011' }
    }
  }
},
babyBlueWhite: {
  ...this.createTheme('#FFFFFF', '#8AAAE5'),
  name: 'babyBlueWhite',
  backgroundImage: 'babyBlueWhiteImg.jpg',
  fonts: defaultFonts,
  colors: {
    title: { color: '#8AAAE5', hoverColor: '#7191C4' },
    text: { color: '#8AAAE5', hoverColor: '#7191C4' },
    branding: {
      background: '#FFFFFF',
      name: { color: '#8AAAE5', hoverColor: '#7191C4' },
      web: { color: '#9BBCE8', hoverColor: '#8AAAE5' },
      phone: { color: '#9BBCE8', hoverColor: '#8AAAE5' },
      social: { color: '#9BBCE8', hoverColor: '#8AAAE5' }
    }
  }
},
dualBlue: {
  ...this.createTheme('#CADCFC', '#00246B'),
  name: 'dualBlue',
  backgroundImage: 'dualBlueImg.jpg',
  fonts: defaultFonts,
  colors: {
    title: { color: '#00246B', hoverColor: '#001D58' },
    text: { color: '#00246B', hoverColor: '#001D58' },
    branding: {
      background: '#CADCFC',
      name: { color: '#00246B', hoverColor: '#001D58' },
      web: { color: '#00307F', hoverColor: '#00246B' },
      phone: { color: '#00307F', hoverColor: '#00246B' },
      social: { color: '#00307F', hoverColor: '#00246B' }
    }
  }
},
skyPink: {
  ...this.createTheme('#EA738D', '#89ABE3'),
  name: 'skyPink',
  backgroundImage: 'skyPinkImg.jpg',
  fonts: defaultFonts,
  colors: {
    title: { color: '#89ABE3', hoverColor: '#718EC6' },
    text: { color: '#89ABE3', hoverColor: '#718EC6' },
    branding: {
      background: '#EA738D',
      name: { color: '#89ABE3', hoverColor: '#718EC6' },
      web: { color: '#A3B9E9', hoverColor: '#89ABE3' },
      phone: { color: '#A3B9E9', hoverColor: '#89ABE3' },
      social: { color: '#A3B9E9', hoverColor: '#89ABE3' }
    }
  }
},
forestGreen: {
  ...this.createTheme('#97BC62', '#2C5F2D'),
  name: 'forestGreen',
  backgroundImage: 'forestGreenImg.jpg',
  fonts: defaultFonts,
  colors: {
    title: { color: '#2C5F2D', hoverColor: '#244D25' },
    text: { color: '#2C5F2D', hoverColor: '#244D25' },
    branding: {
      background: '#97BC62',
      name: { color: '#2C5F2D', hoverColor: '#244D25' },
      web: { color: '#3A713A', hoverColor: '#2C5F2D' },
      phone: { color: '#3A713A', hoverColor: '#2C5F2D' },
      social: { color: '#3A713A', hoverColor: '#2C5F2D' }
    }
  }
},
midnightRoyal: {
  ...this.createTheme('#7A2048', '#1E2761'),
  name: 'midnightRoyal',
  backgroundImage: 'midnightRoyalImg.jpg',
  fonts: defaultFonts,
  colors: {
    title: { color: '#1E2761', hoverColor: '#181D4D' },
    text: { color: '#1E2761', hoverColor: '#181D4D' },
    branding: {
      background: '#7A2048',
      name: { color: '#1E2761', hoverColor: '#181D4D' },
      web: { color: '#2A3B81', hoverColor: '#1E2761' },
      phone: { color: '#2A3B81', hoverColor: '#1E2761' },
      social: { color: '#2A3B81', hoverColor: '#1E2761' }
    }
  }
},
terracottaTeal: {
  ...this.createTheme('#A7BEAE', '#B85042'),
  name: 'terracottaTeal',
  backgroundImage: 'terracottaTealImg.jpg',
  fonts: defaultFonts,
  colors: {
    title: { color: '#B85042', hoverColor: '#984338' },
    text: { color: '#B85042', hoverColor: '#984338' },
    branding: {
      background: '#A7BEAE',
      name: { color: '#B85042', hoverColor: '#984338' },
      web: { color: '#D06757', hoverColor: '#B85042' },
      phone: { color: '#D06757', hoverColor: '#B85042' },
      social: { color: '#D06757', hoverColor: '#B85042' }
    }
  }
},
bluePastelPink: {
  ...this.createTheme('#FBEAEB', '#2F3C7E'),
  name: 'BluePastelPink',
  backgroundImage: 'bluePastelHarmony.jpg',
  fonts: defaultFonts,
  colors: {
    title: { color: '#2F3C7E', hoverColor: '#1F2C5E' },
    text: { color: '#2F3C7E', hoverColor: '#1F2C5E' },
    branding: {
      background: '#FBEAEB',
      name: { color: '#2F3C7E', hoverColor: '#1F2C5E' },
      web: { color: '#3C4F9E', hoverColor: '#2F3C7E' },
      phone: { color: '#3C4F9E', hoverColor: '#2F3C7E' },
      social: { color: '#3C4F9E', hoverColor: '#2F3C7E' }
    }
  }
},
charcoalYellow: {
  ...this.createTheme('#FEE715', '#101820'),
  name: 'CharcoalYellow',
  backgroundImage: 'urbanContrast.jpg',
  fonts: defaultFonts,
  colors: {
    title: { color: '#101820', hoverColor: '#0A1014' },
    text: { color: '#101820', hoverColor: '#0A1014' },
    branding: {
      background: '#FEE715',
      name: { color: '#101820', hoverColor: '#0A1014' },
      web: { color: '#323232', hoverColor: '#101820' },
      phone: { color: '#323232', hoverColor: '#101820' },
      social: { color: '#323232', hoverColor: '#101820' }
    }
  }
},
redYellow: {
  ...this.createTheme('#F96167', '#F9E795'),
  name: 'RedYellow',
  backgroundImage: 'vibrantPlayful.jpg',
  fonts: defaultFonts,
  colors: {
    title: { color: '#F96167', hoverColor: '#E65058' },
    text: { color: '#F96167', hoverColor: '#E65058' },
    branding: {
      background: '#F9E795',
      name: { color: '#F96167', hoverColor: '#E65058' },
      web: { color: '#FF727B', hoverColor: '#F96167' },
      phone: { color: '#FF727B', hoverColor: '#F96167' },
      social: { color: '#FF727B', hoverColor: '#F96167' }
    }
  }
},
cherryOffWhite: {
  ...this.createTheme('#FCF6F5', '#990011'),
  name: 'CherryOffWhite',
  backgroundImage: 'romanticTimeless.jpg',
  fonts: defaultFonts,
  colors: {
    title: { color: '#990011', hoverColor: '#880010' },
    text: { color: '#990011', hoverColor: '#880010' },
    branding: {
      background: '#FCF6F5',
      name: { color: '#990011', hoverColor: '#880010' },
      web: { color: '#B00012', hoverColor: '#990011' },
      phone: { color: '#B00012', hoverColor: '#990011' },
      social: { color: '#B00012', hoverColor: '#990011' }
    }
  }
},
babyBlueWhite: {
  ...this.createTheme('#FFFFFF', '#8AAAE5'),
  name: 'BabyBlueWhite',
  backgroundImage: 'trustAndEase.jpg',
  fonts: defaultFonts,
  colors: {
    title: { color: '#8AAAE5', hoverColor: '#7993D4' },
    text: { color: '#8AAAE5', hoverColor: '#7993D4' },
    branding: {
      background: '#FFFFFF',
      name: { color: '#8AAAE5', hoverColor: '#7993D4' },
      web: { color: '#A2BBF0', hoverColor: '#8AAAE5' },
      phone: { color: '#A2BBF0', hoverColor: '#8AAAE5' },
      social: { color: '#A2BBF0', hoverColor: '#8AAAE5' }
    }
  }
},
forestMoss: {
  ...this.createTheme('#97BC62', '#2C5F2D'),
  name: 'ForestMoss',
  backgroundImage: 'natureInspired.jpg',
  fonts: defaultFonts,
  colors: {
    title: { color: '#2C5F2D', hoverColor: '#1F4720' },
    text: { color: '#2C5F2D', hoverColor: '#1F4720' },
    branding: {
      background: '#97BC62',
      name: { color: '#2C5F2D', hoverColor: '#1F4720' },
      web: { color: '#44853E', hoverColor: '#2C5F2D' },
      phone: { color: '#44853E', hoverColor: '#2C5F2D' },
      social: { color: '#44853E', hoverColor: '#2C5F2D' }
    }
  }
},
terracottaGreen: {
  ...this.createTheme('#A7BEAE', '#B85042'),
  name: 'TerracottaGreen',
  backgroundImage: 'earthyRetro.jpg',
  fonts: defaultFonts,
  colors: {
    title: { color: '#B85042', hoverColor: '#A04539' },
    text: { color: '#B85042', hoverColor: '#A04539' },
    branding: {
      background: '#A7BEAE',
      name: { color: '#B85042', hoverColor: '#A04539' },
      web: { color: '#C96C58', hoverColor: '#B85042' },
      phone: { color: '#C96C58', hoverColor: '#B85042' },
      social: { color: '#C96C58', hoverColor: '#B85042' }
    }
  }
},
sunsetPeach: {
  ...this.createTheme('#FFC4A3', '#FF5E5B'),
  name: 'SunsetPeach',
  backgroundImage: 'warmTwilight.jpg',
  fonts: defaultFonts,
  colors: {
    title: { color: '#FF5E5B', hoverColor: '#E54F4A' },
    text: { color: '#FF5E5B', hoverColor: '#E54F4A' },
    branding: {
      background: '#FFC4A3',
      name: { color: '#FF5E5B', hoverColor: '#E54F4A' },
      web: { color: '#FF6F6B', hoverColor: '#FF5E5B' },
      phone: { color: '#FF6F6B', hoverColor: '#FF5E5B' },
      social: { color: '#FF6F6B', hoverColor: '#FF5E5B' }
    }
  }
},
royalGold: {
  ...this.createTheme('#FFD700', '#1B1464'),
  name: 'RoyalGold',
  backgroundImage: 'opulentElegance.jpg',
  fonts: defaultFonts,
  colors: {
    title: { color: '#1B1464', hoverColor: '#141046' },
    text: { color: '#1B1464', hoverColor: '#141046' },
    branding: {
      background: '#FFD700',
      name: { color: '#1B1464', hoverColor: '#141046' },
      web: { color: '#322378', hoverColor: '#1B1464' },
      phone: { color: '#322378', hoverColor: '#1B1464' },
      social: { color: '#322378', hoverColor: '#1B1464' }
    }
  }
},
lavenderDream: {
  ...this.createTheme('#E0BBE4', '#957DAD'),
  name: 'LavenderDream',
  backgroundImage: 'soothingSerenity.jpg',
  fonts: defaultFonts,
  colors: {
    title: { color: '#957DAD', hoverColor: '#7B6690' },
    text: { color: '#957DAD', hoverColor: '#7B6690' },
    branding: {
      background: '#E0BBE4',
      name: { color: '#957DAD', hoverColor: '#7B6690' },
      web: { color: '#A983B5', hoverColor: '#957DAD' },
      phone: { color: '#A983B5', hoverColor: '#957DAD' },
      social: { color: '#A983B5', hoverColor: '#957DAD' }
    }
  }
},
tealOrange: {
  ...this.createTheme('#88D9E6', '#FF8A5B'),
  name: 'TealOrange',
  backgroundImage: 'energeticContrast.jpg',
  fonts: defaultFonts,
  colors: {
    title: { color: '#FF8A5B', hoverColor: '#E57A4D' },
    text: { color: '#FF8A5B', hoverColor: '#E57A4D' },
    branding: {
      background: '#88D9E6',
      name: { color: '#FF8A5B', hoverColor: '#E57A4D' },
      web: { color: '#FF9B6C', hoverColor: '#FF8A5B' },
      phone: { color: '#FF9B6C', hoverColor: '#FF8A5B' },
      social: { color: '#FF9B6C', hoverColor: '#FF8A5B' }
    }
  }
},
goldenMint: {
  ...this.createTheme('#ADE498', '#F3C13A'),
  name: 'GoldenMint',
  backgroundImage: 'freshAndLively.jpg',
  fonts: defaultFonts,
  colors: {
    title: { color: '#F3C13A', hoverColor: '#D3A52F' },
    text: { color: '#F3C13A', hoverColor: '#D3A52F' },
    branding: {
      background: '#ADE498',
      name: { color: '#F3C13A', hoverColor: '#D3A52F' },
      web: { color: '#F7D54A', hoverColor: '#F3C13A' },
      phone: { color: '#F7D54A', hoverColor: '#F3C13A' },
      social: { color: '#F7D54A', hoverColor: '#F3C13A' }
    }
  }
},
seafoamRust: {
  ...this.createTheme('#6C91C2', '#D1495B'),
  name: 'SeafoamRust',
  backgroundImage: 'earthyCool.jpg',
  fonts: defaultFonts,
  colors: {
    title: { color: '#D1495B', hoverColor: '#BA3E4D' },
    text: { color: '#D1495B', hoverColor: '#BA3E4D' },
    branding: {
      background: '#6C91C2',
      name: { color: '#D1495B', hoverColor: '#BA3E4D' },
      web: { color: '#E06775', hoverColor: '#D1495B' },
      phone: { color: '#E06775', hoverColor: '#D1495B' },
      social: { color: '#E06775', hoverColor: '#D1495B' }
    }
  }
},
coolMagenta: {
  ...this.createTheme('#E1F8DC', '#6F1D1B'),
  name: 'CoolMagenta',
  backgroundImage: 'crispContrast.jpg',
  fonts: defaultFonts,
  colors: {
    title: { color: '#6F1D1B', hoverColor: '#5C1816' },
    text: { color: '#6F1D1B', hoverColor: '#5C1816' },
    branding: {
      background: '#E1F8DC',
      name: { color: '#6F1D1B', hoverColor: '#5C1816' },
      web: { color: '#7F2220', hoverColor: '#6F1D1B' },
      phone: { color: '#7F2220', hoverColor: '#6F1D1B' },
      social: { color: '#7F2220', hoverColor: '#6F1D1B' }
    }
  }
},




  }; 
} 


  createTheme(backgroundColor, textColor, secondaryColor = null, backgroundImage = null) {
    return {
      colors: {
        background: backgroundColor,
        // Title customization
        title: {
          color: this.adjustColor(textColor, 1.2),
          hoverColor: this.adjustColor(textColor, 1.4),
        },
        // Main text customization
        text: {
          color: textColor,
          hoverColor: this.adjustColor(textColor, 1.1),
        },
        // Branding section customization
        branding: {
          background: backgroundColor, // Separate background for branding section
          name: {
            color: textColor,
            hoverColor: this.adjustColor(textColor, 1.2),
          },
          web: {
            color: secondaryColor || textColor,
            hoverColor: this.adjustColor(secondaryColor || textColor, 1.1),
          },
          phone: {
            color: secondaryColor || textColor,
            hoverColor: this.adjustColor(secondaryColor || textColor, 1.1),
          },
          social: {
            color: secondaryColor || textColor,
            hoverColor: this.adjustColor(secondaryColor || textColor, 1.1),
          }
        }
      },
      fonts: {
        title: {
          family: '"Noto Serif Tamil Slanted"',
          weight: 800,
          style: 'normal',
          size: 48,
        },
        body: {
          family: '"Annai MN"',
          weight: 400,
          style: 'normal',
          size: 36,
        },
        branding: {
          name: {
            family: '"Tamil Sangam MN"',
            weight: 700,
            style: 'normal',
            size: 32,
          },
          web: {
            family: '"Noto Sans Tamil"',
            weight: 400,
            style: 'normal',
            size: 24,
          },
          phone: {
            family: '"Noto Sans Tamil"',
            weight: 400,
            style: 'normal',
            size: 24,
          },
          social: {
            family: '"Noto Sans Tamil"',
            weight: 400,
            style: 'normal',
            size: 24,
          }
        }
      },
      layout: {
        padding: 60,
        margins: {
          top: 60,
          bottom: 60,
          left: 60,
          right: 60
        },
        spacing: {
          paragraph: 1.5,
          section: 2.5
        },
        lineHeight: 1.8,
        textAlign: 'center',
        branding: {
          height: 150,
          padding: 20,
          spacing: 10
        }
      },
      backgroundImage: backgroundImage,
      effects: {
        textShadow: false,
        glow: false,
        outline: false,
        decorativeElements: false,
        backgroundTexture: true,
        shadow: {
          blur: 3,
          opacity: 0.3,
          offset: { x: 2, y: 2 }
        }
      }
    };
  }

  adjustColor(hexColor, factor) {
    const rgb = this.hexToRgb(hexColor);
    return `rgb(${Math.min(255, Math.floor(rgb.r * factor))}, 
                ${Math.min(255, Math.floor(rgb.g * factor))}, 
                ${Math.min(255, Math.floor(rgb.b * factor))})`;
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }


// Add this method to your ImageGenerationService class
calculateTopPosition(lineCount) {
  // Base position for single line
  const basePosition = 500;
  const decrementPerLine = 10;  // Decrease by 10px per line
  const minPosition = 150;      // Minimum top position
  
  // Validate line count
  if (lineCount < 1) return basePosition;
  if (lineCount > 25) lineCount = 25;  // Cap at maximum 25 lines

  // Calculate position
  let position = basePosition - ((lineCount - 1) * decrementPerLine);
  
  // Ensure position doesn't go below minimum
  return Math.max(position, minPosition);
}


async createImage(text, options = {}) {
  const {
    width = TEXT_METRICS.CANVAS_WIDTH,
    height = TEXT_METRICS.CANVAS_HEIGHT,
    theme: themeName = 'default',
    category = 'article',
    title = '',
    style = {},
    analysis = {} // Add analysis with default empty object
  } = options;

  const metrics = this.calculateDynamicTextMetrics(text, category);
  const formattedText = this.textFormatter(text, category);
  
  const theme = {
    ...this.themes[themeName],
    layout: {
      ...this.themes[themeName].layout,
      bodySize: metrics.fontSize,
      lineHeight: metrics.lineHeight,
      ...style,
      margins: {
        ...this.themes[themeName].layout.margins,
        ...style.margins
      }
    }
  };

  try {
    console.log("Creating image with theme:", themeName);

    // Step 1: Create base textured background
    let processedImage = await this.createTexturedBackground(width, height, theme);
    
    // Step 2: Calculate text metrics
    const textLineCount = this.lineCounter(text, category);
    const formattedText = this.textFormatter(text, category);
    
    // Get layout calculations
    const layout = this.textMetrics.calculateMetrics(textLineCount, category, Boolean(title));
    
    // Update theme with calculated metrics
    theme.layout = {
      ...theme.layout,
      bodySize: layout.fontSize,
      lineHeight: layout.lineHeight
    };

    // Step 3: Add title if provided
    if (title) {
      const titleSvg = this.generateTitleSVG(title, theme);
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
      const contentSvg = this.generateContentSVG(formattedText, theme, analysis);
      processedImage = await sharp(processedImage)
        .composite([{ 
          input: Buffer.from(contentSvg), 
          top: layout.topPosition,
          left: 0 
        }])
        .toBuffer();
    }

    // Step 5: Add branding
    const finalImage = await this.addBrandingElements(processedImage, theme);

    return finalImage;
  } catch (error) {
    console.error("Error in createImage:", error.message);
    throw error;
  }
}

async createTexturedBackground(width, height, theme) {
  try {
    console.log({ width, height, theme });

    // Resolve the path to the public folder for background textures
    const bgImage = theme.backgroundImage || `${theme.name}Img.jpg`;
    const texturePath = path.join(process.cwd(), 'public/backgrounds', bgImage);
    console.log({ texturePath });

    // Create base image with the theme's background color
    const baseImage = await sharp({
      create: {
        width,
        height,
        channels: 4,
        background: this.parseBackgroundColor(theme.colors.background),
      },
    }).png().toBuffer();

    try {
      // Check if a specific texture image exists for the theme
      let textureBuffer = await sharp(texturePath)
        .resize(width, height, { 
          fit: 'cover',
          position: 'center'
        })
        .modulate({
          brightness: 1.1,  // Slightly increase brightness
          saturation: 1.2,  // Boost saturation
          hue: 0           // Keep original hue
        })
        .toBuffer();

      // Apply the resized texture with improved settings
      return await sharp(baseImage)
        .composite([
          {
            input: textureBuffer,
            blend: 'multiply',    // Changed from overlay to multiply for better color
            opacity: 0.95,        // Increased opacity significantly
          },
        ])
        .modulate({
          brightness: 1.05,      // Slight brightness boost
          saturation: 1.1        // Slight saturation boost
        })
        .toBuffer();
    } catch (textureError) {
      console.warn(`Texture for theme '${theme.name}' not found. Using fallback texture.`, textureError.message);

      // Fallback to a default texture with improved settings
      const defaultTextureUrl = "https://res.cloudinary.com/dk5p5vrwa/image/upload/v1732732038/image-generation-assets/textures/v7gnw9kgeoy501gjqnou.png";
      const response = await fetch(defaultTextureUrl);
      if (!response.ok) throw new Error(`Failed to fetch fallback texture: ${response.statusText}`);

      const fallbackTextureBuffer = await response.arrayBuffer();

      // Resize and enhance fallback texture
      const resizedFallbackTexture = await sharp(Buffer.from(fallbackTextureBuffer))
        .resize(width, height, { 
          fit: 'cover',
          position: 'center'
        })
        .modulate({
          brightness: 1.1,
          saturation: 1.2,
          hue: 0
        })
        .toBuffer();

      // Apply the fallback texture with improved settings
      return await sharp(baseImage)
        .composite([
          {
            input: resizedFallbackTexture,
            blend: 'multiply',
            opacity: 0.95,
          },
        ])
        .modulate({
          brightness: 1.05,
          saturation: 1.1
        })
        .toBuffer();
    }
  } catch (error) {
    console.error("Error creating textured background:", error.message);
    throw error;
  }
}

// Helper method to parse background color
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

lineCounter(text, category = 'poem') {
  if (!text) return 0;
  
  const maxWordsPerLine = category === 'poem' ? 4 : 8;
  const lines = text.split('\n').filter(line => line.trim());
  let totalLines = 0;
  
  lines.forEach(line => {
    const words = line.split(' ').filter(word => word.trim());
    const additionalLines = Math.ceil(words.length / maxWordsPerLine);
    totalLines += additionalLines;
  });
  
  return totalLines;
}

calculateDynamicTextMetrics(text, category) {
  const lines = text.split('\n').filter(line => line.trim());
  const totalChars = text.length;
  const wordsPerLine = category === 'poem' ? 
    TEXT_METRICS.POEM_MAX_WORDS : 
    TEXT_METRICS.PROSE_MAX_WORDS;
  
  // Calculate optimal font size based on content length
  let fontSize = TEXT_METRICS.MAX_FONT_SIZE;
  if (totalChars > 500) {
    fontSize = Math.max(
      TEXT_METRICS.MIN_FONT_SIZE, 
      TEXT_METRICS.MAX_FONT_SIZE - Math.floor(totalChars / 500)
    );
  }

  // Calculate optimal line height
  let lineHeight = TEXT_METRICS.MAX_LINE_HEIGHT;
  if (lines.length > 15) {
    lineHeight = Math.max(
      TEXT_METRICS.MIN_LINE_HEIGHT,
      TEXT_METRICS.MAX_LINE_HEIGHT - (lines.length / 30)
    );
  }

  // Calculate top position
  let topPosition = TEXT_METRICS.BASE_POSITION;
  if (lines.length > 15) {
    topPosition = Math.max(
      TEXT_METRICS.MIN_POSITION,
      topPosition - ((lines.length - 15) * TEXT_METRICS.DECREMENT_PER_LINE)
    );
  }

  return {
    fontSize,
    lineHeight,
    wordsPerLine,
    topPosition
  };
}

// Update textFormatter method
textFormatter(text, category = 'article') {
  if (!text) return '';
  
  const maxWordsPerLine = category === 'poem' ? 
    TEXT_METRICS.POEM_MAX_WORDS : 
    TEXT_METRICS.PROSE_MAX_WORDS;
    
  const lines = text.split('\n').filter(line => line.trim());
  const formattedLines = [];
  
  lines.forEach(line => {
    const words = line.split(' ').filter(word => word.trim());
    
    if (words.length <= maxWordsPerLine) {
      formattedLines.push(line);
      return;
    }
    
    // Split into multiple lines
    for (let i = 0; i < words.length; i += maxWordsPerLine) {
      const lineWords = words.slice(i, Math.min(i + maxWordsPerLine, words.length));
      formattedLines.push(lineWords.join(' '));
    }
  });
  
  return formattedLines.join('\n');
}


// Update branding elements with simpler SVG structure
async addBrandingElements(buffer, theme) {
  const brandingSvg = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="${theme.layout.branding.height || 150}" version="1.1">
  <!-- Brand Name -->
  <text
    x="600"
    y="40"
    font-family="${theme.fonts.branding.name.family.replace(/"/g, '&quot;')}"
    font-size="${theme.fonts.branding.name.size}"
    font-weight="${theme.fonts.branding.name.weight}"
    fill="${theme.colors.branding.name.color}"
    text-anchor="middle"
    class="branding-name"
  >அஜித்குமார்</text>

  <!-- Contact Information Group -->
  <g transform="translate(100, 100)">
    <!-- Website -->
    <text
      x="0"
      y="0"
      font-family="${theme.fonts.branding.web.family.replace(/"/g, '&quot;')}"
      font-size="${theme.fonts.branding.web.size}"
      font-weight="${theme.fonts.branding.web.weight}"
      fill="${theme.colors.branding.web.color}"
      class="branding-web"
    >www.ajithkumar.dev</text>

    <!-- Phone Number -->
    <text
      x="500"
      y="0"
      font-family="${theme.fonts.branding.phone.family.replace(/"/g, '&quot;')}"
      font-size="${theme.fonts.branding.phone.size}"
      font-weight="${theme.fonts.branding.phone.weight}"
      fill="${theme.colors.branding.phone.color}"
      text-anchor="middle"
      class="branding-phone"
    >9944154823</text>

    <!-- Social Media Handle -->
    <text
      x="900"
      y="0"
      font-family="${theme.fonts.branding.social.family.replace(/"/g, '&quot;')}"
      font-size="${theme.fonts.branding.social.size}"
      font-weight="${theme.fonts.branding.social.weight}"
      fill="${theme.colors.branding.social.color}"
      text-anchor="end"
      class="branding-social"
    >@vaanawill</text>
  </g>
</svg>`;

  try {
    // Create background matching theme
    const brandingBackground = await sharp({
      create: {
        width: 1200,
        height: theme.layout.branding.height || 150,
        channels: 4,
        background: this.parseBackgroundColor(theme.colors.branding.background)
      }
    }).png().toBuffer();

    const brandingBuffer = await sharp(brandingBackground)
      .composite([{
        input: Buffer.from(brandingSvg),
        top: 0,
        left: 0
      }])
      .toBuffer();

    return await sharp(buffer)
      .composite([{
        input: brandingBuffer,
        gravity: 'south'
      }])
      .toBuffer();

  } catch (error) {
    console.error('Error generating branding:', error);
    throw new Error(`Failed to generate branding: ${error.message}`);
  }
}

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
      fill="${theme.colors.text.color}"
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
  ${this.generateDecorationElements(theme)}

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

// Enhanced title generation
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
  <text
    x="${xPosition}"
    y="75"
    font-family="${theme.fonts.title.family.replace(/"/g, '&quot;')}"
    font-size="${theme.fonts.title.size}"
    font-weight="${theme.fonts.title.weight}"
    fill="${theme.colors.title.color}"
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

// Helper function for generating decorative elements
generateDecorationElements(theme) {
  if (!theme.effects?.decorativeElements) return '';

  const decorations = [];
  const width = 1200;
  const height = 1200;

  // Add decorative lines
  if (theme.layout.textAlign === 'right') {
    decorations.push(`
      <line 
        x1="${width - 500}" 
        y1="150" 
        x2="${width - 100}" 
        y2="150" 
        stroke="${theme.colors.text}" 
        stroke-width="1"
        stroke-opacity="0.3"
      />
      <line 
        x1="${width - 400}" 
        y1="${height - 150}" 
        x2="${width - 100}" 
        y2="${height - 150}" 
        stroke="${theme.colors.text}" 
        stroke-width="1"
        stroke-opacity="0.3"
      />
    `);
  }

  return decorations.join('\n');
}

// Helper function for calculating text metrics
calculateTextMetrics(text, fontSize, fontFamily) {
  // Approximate character widths based on script
  const metrics = {
    tamil: fontSize * 0.8,  // Tamil characters are typically wider
    latin: fontSize * 0.5,  // Latin characters
    space: fontSize * 0.3   // Space between words
  };

  const tamilCount = (text.match(/[\u0B80-\u0BFF]/g) || []).length;
  const spaceCount = (text.match(/\s/g) || []).length;
  const latinCount = text.length - tamilCount - spaceCount;

  return {
    width: (tamilCount * metrics.tamil) + 
           (latinCount * metrics.latin) + 
           (spaceCount * metrics.space),
    height: fontSize * 1.2
  };
}

// Helper method for Tamil text metrics
calculateTamilTextWidth(text, fontSize) {
  const tamilCharCount = (text.match(/[\u0B80-\u0BFF]/g) || []).length;
  const latinCharCount = text.length - tamilCharCount;
  
  // Adjust width calculation for Tamil characters
  return (tamilCharCount * fontSize * 0.8) + (latinCharCount * fontSize * 0.5);
}


getCloudinaryUrl(assetPath) {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const folderPath = 'image-generation-assets';
    return `https://res.cloudinary.com/${cloudName}/image/upload/${folderPath}/${assetPath}`;
}

async generateForText(text, options = {}) {
  if (!text || typeof text !== 'string' || !text.trim()) {
    console.error("Error: Missing or invalid text content for image generation.");
    throw new Error("Text content is required for generating an image.");
  }

  console.log("Generating image with text:", text);

  try {
    // Create empty analysis object if analyzer is not available
    const analysis = this.analyzer ? await this.analyzer.analyzeText(text) : {};
    
    const imageBuffer = await this.createImage(text, { 
      ...options, 
      analysis: analysis || {} // Ensure analysis is always defined
    });

    if (!imageBuffer || !(imageBuffer instanceof Buffer)) {
      throw new Error("Invalid image data generated.");
    }

    const uploadResult = await uploadGeneratedImage(imageBuffer, {
      folder: 'writings',
      transformation: [{ width: 1200, crop: 'scale', quality: 'auto' }]
    });

    return uploadResult;
  } catch (error) {
    console.error("Error generating image:", error.message);
    throw new Error(`Failed to generate image: ${error.message}`);
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
    const images = await this.generateForText(body, {
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

async generateForWriting(writingId) {
    await connectDB();
    const writing = await Writing.findById(writingId);
    
    if (!writing) {
      throw new Error('Writing not found');
    }

    const themeMap = {
      poem: 'love',
      philosophy: 'philosophical',
      article: 'default',
      'short story': 'emotional'
    };

    const images = await this.generateForText(writing.body, {
      title: writing.title,
      themeName: themeMap[writing.category] || 'default',
      category: writing.category
    });
    
    writing.images = images;
    await writing.save();
    
    return images;
  }

// Update the wrapText method to handle different alignments
wrapText(text, maxChars, alignment = 'start') {
  if (!text) return [];
  
  // Adjust max chars based on alignment
  const adjustedMaxChars = alignment === 'start' ? maxChars + 5 : maxChars;
  
  // Split by explicit line breaks first
  const paragraphs = text.split('\n');
  
  // Process each paragraph for word wrapping
  return paragraphs.map(paragraph => {
    const words = paragraph.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const testLine = `${currentLine} ${word}`;
      
      // Adjust for Tamil characters
      const tamilCharCount = (testLine.match(/[\u0B80-\u0BFF]/g) || []).length;
      const effectiveLength = testLine.length + (tamilCharCount * 0.3);

      if (effectiveLength <= adjustedMaxChars) {
        currentLine = testLine;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    
    if (currentLine) {
      lines.push(currentLine);
    }
    
    return lines;
  }).flat();
}

  calculateTextDimensions(text, fontSize, fontFamily) {
    // Utility method to calculate text dimensions
    const avgCharWidth = fontSize * 0.6; // Approximate width for Tamil chars
    const tamilCharCount = (text.match(/[\u0B80-\u0BFF]/g) || []).length;
    const latinCharCount = text.length - tamilCharCount;
    
    return {
      width: (tamilCharCount * avgCharWidth * 1.2) + (latinCharCount * avgCharWidth),
      height: fontSize * 1.2
    };
  }

  async addTextEffects(buffer, theme) {
    // Add various text effects based on theme
    const composite = [];
    
    if (theme.effects?.textShadow) {
      composite.push({
        input: await this.createShadowLayer(buffer),
        blend: 'multiply',
        opacity: 0.3
      });
    }

    if (theme.effects?.glow) {
      composite.push({
        input: await this.createGlowLayer(buffer),
        blend: 'screen',
        opacity: 0.4
      });
    }

    return sharp(buffer)
      .composite(composite)
      .toBuffer();
  }

  async createShadowLayer(buffer) {
    return sharp(buffer)
      .blur(3)
      .linear(-0.5, 1)
      .toBuffer();
  }

  async createGlowLayer(buffer) {
    return sharp(buffer)
      .blur(10)
      .linear(1, 0)
      .toBuffer();
  }

  getThemeDecorations(theme, analysis) {
    const decorations = [];
    
    // Theme-specific decorations
    if (theme.decorations?.length > 0) {
      theme.decorations.forEach(decoration => {
        decorations.push({
          type: decoration,
          position: this.getRandomPosition(),
          opacity: 0.3,
          rotation: Math.random() * 360
        });
      });
    }

    // Sentiment-based decorations
    if (analysis?.sentiment?.polarity === 'positive') {
      decorations.push({
        type: 'sparkles',
        position: { x: 'random', y: 'top' },
        opacity: 0.4
      });
    }

    return decorations;
  }

  getRandomPosition() {
    return {
      x: Math.floor(Math.random() * 800) + 200, // Keep away from edges
      y: Math.floor(Math.random() * 800) + 200
    };
  }

  hexToRgba(hex, alpha = 1) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  validateImageDimensions(width, height) {
    const maxDimension = 3000;
    const minDimension = 200;

    if (width > maxDimension || height > maxDimension) {
      throw new Error(`Image dimensions cannot exceed ${maxDimension}px`);
    }

    if (width < minDimension || height < minDimension) {
      throw new Error(`Image dimensions cannot be less than ${minDimension}px`);
    }

    return true;
  }
}

export default new ImageGenerationService();
