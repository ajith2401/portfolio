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

const themeKeyMapping = [
  {
    keyName: 'modernGradient',
    mainColors: ['#6B73FF', '#000DFF'],
    recommendedBg: '#000DFF',
    description: 'Modern blue gradient - professional and sleek'
  },
  
  {
    keyName: 'sunsetGradient',
    mainColors: ['#FF6B6B', '#FFE66D'],
    recommendedBg: '#FFE66D',
    description: 'Warm sunset colors - creative and energetic'
  },
  
  {
    keyName: 'oceanGradient',
    mainColors: ['#48C6EF', '#6F86D6'],
    recommendedBg: '#6F86D6',
    description: 'Ocean inspired blues - calming and serene'
  },
  
  {
    keyName: 'forestGradient',
    mainColors: ['#56AB2F', '#A8E063'],
    recommendedBg: '#A8E063',
    description: 'Forest green gradient - natural and fresh'
  },
  
  {
    keyName: 'purpleGradient',
    mainColors: ['#DA22FF', '#9733EE'],
    recommendedBg: '#9733EE',
    description: 'Rich purple gradient - luxurious and creative'
  },

  {
    keyName: 'bluePastelHarmony',
    mainColors: ['#2F3C7E', '#FBEAEB'],
    recommendedBg: '#FBEAEB',
    description: 'Blue and pastel pink - refined feminine tranquility'
  },
  {
    keyName: 'charcoalSunrise',
    mainColors: ['#101820', '#FEE715'],
    recommendedBg: '#FEE715',
    description: 'Dark charcoal and bright yellow - energetic and contemporary'
  },
  {
    keyName: 'coralSunset',
    mainColors: ['#F96167', '#F9E795'],
    recommendedBg: '#F9E795',
    description: 'Light red and yellow - modern pastel take on classic combination'
  },
  {
    keyName: 'cherryElegance',
    mainColors: ['#990011', '#FCF6F5'],
    recommendedBg: '#FCF6F5',
    description: 'Cherry red and off-white - classic and timeless'
  },
  {
    keyName: 'skySerenity',
    mainColors: ['#8AAAE5', '#FFFFFF'],
    recommendedBg: '#FFFFFF',
    description: 'Baby blue and white - serene and trustworthy'
  },
  {
    keyName: 'oceanDepths',
    mainColors: ['#00246B', '#CADCFC'],
    recommendedBg: '#CADCFC',
    description: 'Dark blue and light blue - professional and trustworthy'
  },
  {
    keyName: 'skyCandy',
    mainColors: ['#89ABE3', '#EA738D'],
    recommendedBg: '#EA738D',
    description: 'Sky blue and bubblegum pink - playful and bright'
  },
  {
    keyName: 'cherryBlossom',
    mainColors: ['#CC313D', '#F7C5CC'],
    recommendedBg: '#F7C5CC',
    description: 'Cherry red and bubblegum pink - bold and expressive'
  },
  {
    keyName: 'natureMist',
    mainColors: ['#2C5F2D', '#97BC62'],
    recommendedBg: '#97BC62',
    description: 'Forest and moss green - eco-friendly and natural'
  },
  {
    keyName: 'royalMystic',
    mainColors: ['#1E2761', '#408EC6', '#7A2048'],
    recommendedBg: '#408EC6',
    description: 'Midnight blue, royal blue, and burgundy - luxurious and mysterious'
  },
  {
    keyName: 'earthTones',
    mainColors: ['#B85042', '#E7E8D1', '#A7BEAE'],
    recommendedBg: '#E7E8D1',
    description: 'Terracotta red, light beige, and muted teal - earthy and neutral'
  },
  {
    keyName: 'oliveBloom',
    mainColors: ['#A1BE95', '#F98866'],
    recommendedBg: '#F98866',
    description: 'Pastel olive green and salmon pink - warm and nostalgic'
  },
  {
    keyName: 'mysticLavender',
    mainColors: ['#735DA5', '#D3C5E5'],
    recommendedBg: '#D3C5E5',
    description: 'Deep periwinkle and soft lilac - ethereal and grounded'
  },
  {
    keyName: 'salmonDream',
    mainColors: ['#F98866', '#FFF2D7'],
    recommendedBg: '#FFF2D7',
    description: 'Salmon pink and soft peach - subtly elegant'
  },
  {
    keyName: 'oceanBreeze',
    mainColors: ['#C4DFE6', '#66A5AD'],
    recommendedBg: '#C4DFE6',
    description: 'Seafoam green and light blue - refreshing and harmonious'
  },
  {
    keyName: 'mintLagoon',
    mainColors: ['#20948B', '#6AB187'],
    recommendedBg: '#6AB187',
    description: 'Teal and light green - fresh and serene'
  },
  {
    keyName: 'forestMist',
    mainColors: ['#31473A', '#EDF4F2'],
    recommendedBg: '#EDF4F2',
    description: 'Dark green and light gray - serene and timeless'
  },
  {
    keyName: 'berryBurst',
    mainColors: ['#F52549', '#FA6775'],
    recommendedBg: '#FA6775',
    description: 'Cranberry red and bubblegum - stylish and playful'
  },
  {
    keyName: 'sunsetVibes',
    mainColors: ['#375E97', '#FB6542', '#FFBB00'],
    recommendedBg: '#FFBB00',
    description: 'Deep blue, orange-red, and yellow-orange - dynamic and playful'
  },
  {
    keyName: 'vintageMauve',
    mainColors: ['#962E2A', '#E3867D', '#CEE6F2'],
    recommendedBg: '#CEE6F2',
    description: 'Mauve, dusty rose, and soft blue-gray - refined and feminine'
  },
  {
    keyName: 'rusticCharm',
    mainColors: ['#330000', '#73605B', '#D09683'],
    recommendedBg: '#D09683',
    description: 'Dark reddish brown, taupe, and peachy brown - warm and cozy'
  },
  {
    keyName: 'patriotDawn',
    mainColors: ['#05031F', '#CB0000', '#E4EA8C'],
    recommendedBg: '#E4EA8C',
    description: 'Dark navy, scarlet red, and lemon yellow - striking and bold'
  },
  {
    keyName: 'glacierMist',
    mainColors: ['#1995AD', '#A1D6E2', '#F1F1F2'],
    recommendedBg: '#F1F1F2',
    description: 'Teal blue, light blue, and light gray - refreshing and modern'
  },
  {
    keyName: 'navyRose',
    mainColors: ['#002C54', '#C5001A', '#FDF6F6'],
    recommendedBg: '#FDF6F6',
    description: 'Deep navy, bright red, and pale pink - bold and sophisticated'
  },
  {
    keyName: 'autumnHarmony',
    mainColors: ['#46211A', '#A43820', '#F1D3B2'],
    recommendedBg: '#F1D3B2',
    description: 'Dark chestnut, burnt sienna, and soft cream - warm and earthy'
  },
  {
    keyName: 'industrialChic',
    mainColors: ['#2A3132', '#763626', '#90AFC5'],
    recommendedBg: '#90AFC5',
    description: 'Dark charcoal, deep rust, and sky blue - sophisticated and modern'
  },

  // Add these to the themeKeyMapping array:

{
  keyName: 'autumnSunset',
  mainColors: ['#375E97', '#FB6542', '#FFBB00'],
  recommendedBg: '#FB6542',
  description: 'Autumn sunset colors - warm and dynamic'
},

{
  keyName: 'dustyRoseHarmony',
  mainColors: ['#31473A', '#EDF4F2'],
  recommendedBg: '#EDF4F2',
  description: 'Dark green and light gray - elegant and harmonious'
},

{
  keyName: 'mistyMorning',
  mainColors: ['#763626', '#CEE6F2'],
  recommendedBg: '#CEE6F2',
  description: 'Deep rust and light blue - serene and misty'
},

{
  keyName: 'seafoamDream',
  mainColors: ['#07575B', '#66A5AD'],
  recommendedBg: '#66A5AD',
  description: 'Deep teal and seafoam - oceanic and tranquil'
},

{
  keyName: 'sunsetGlow',
  mainColors: ['#F07B3F', '#FFD460'],
  recommendedBg: '#FFD460',
  description: 'Warm orange and golden yellow - vibrant and glowing'
},

{
  keyName: 'desertSage',
  mainColors: ['#6B705C', '#E8DDB5'],
  recommendedBg: '#E8DDB5',
  description: 'Sage green and sand - natural and earthy'
},

{
  keyName: 'moonlitNight',
  mainColors: ['#E0E0E0', '#2C3E50'],
  recommendedBg: '#2C3E50',
  description: 'Light gray and deep blue - mysterious and elegant'
},

{
  keyName: 'sageGarden',
  mainColors: ['#3D6657', '#A8E6CE'],
  recommendedBg: '#A8E6CE',
  description: 'Deep green and mint - fresh and natural'
}
];

const DEFAULT_LAYOUT = {
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
        title: { color: '#FFFFFF', hoverColor: '#394347' },
        text: { color: '#FFFFFF', hoverColor: '#394347' },
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
      backgroundImage: 'background-616360.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#FFFFFF', hoverColor: '#723709' },
        text: { color: '#FFFFFF', hoverColor: '#723709' },
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
        title: { color: '#FFFFFF', hoverColor: '#333333' },
        text: { color: '#FFFFFF', hoverColor: '#333333' },
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
        title: { color: '#FFFFFF', hoverColor: '#1B5E20' },
        text: { color: '#FFFFFF', hoverColor: '#1B5E20' },
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
      backgroundImage: 'greenLeafAlt.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#000000', hoverColor: '#0A4A0E' },
        text: { color: '#000000', hoverColor: '#0A4A0E' },
        branding: {
          background: '#E8F5E9',
          name: { color: '#1B5E20', hoverColor: '#0A4A0E' },
          web: { color: '#004D40', hoverColor: '#1B5E20' },
          phone: { color: '#004D40', hoverColor: '#1B5E20' },
          social: { color: '#004D40', hoverColor: '#1B5E20' }
        }
      }
    },
    paperFlower: {
      ...this.createTheme('#E8F5E9', '#1B5E20'),
      name: 'greenLeaf',
      backgroundImage: 'flowerDummy.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#000000', hoverColor: '#0A4A0E' },
        text: { color: '#000000', hoverColor: '#0A4A0E' },
        branding: {
          background: '#E8F5E9',
          name: { color: '#1B5E20', hoverColor: '#0A4A0E' },
          web: { color: '#004D40', hoverColor: '#1B5E20' },
          phone: { color: '#004D40', hoverColor: '#1B5E20' },
          social: { color: '#004D40', hoverColor: '#1B5E20' }
        }
      }
    },
    pinkFlower: {
      ...this.createTheme('#E8F5E9', '#1B5E20'),
      name: 'greenLeaf',
      backgroundImage: 'flowerReal.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#000000', hoverColor: '#0A4A0E' },
        text: { color: '#000000', hoverColor: '#0A4A0E' },
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
        title: { color: '#FFFFFF', hoverColor: '#3A1070' },
        text: { color: '#FFFFFF', hoverColor: '#3A1070' },
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
        title: { color: '#FFFFFF', hoverColor: '#2D1B19' },
        text: { color: '#FFFFFF', hoverColor: '#2D1B19' },
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
   redFlower: {
      ...this.createTheme('#FFEBEE', '#B71C1C'),
      name: 'redForest',
      backgroundImage: 'redFlower.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#FFFFFF', hoverColor: '#8F1616' },
        text: { color: '#FFFFFF', hoverColor: '#8F1616' },
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
      backgroundImage: 'BrownAncientStoneAit.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#0D47A1', hoverColor: '#1A0F0A' },
        text: { color: '#0D47A1', hoverColor: '#1A0F0A' },
        branding: {
          background: '#E8E0D5',
          name: { color: '#2B1810', hoverColor: '#1A0F0A' },
          web: { color: '#463026', hoverColor: '#2B1810' },
          phone: { color: '#463026', hoverColor: '#2B1810' },
          social: { color: '#463026', hoverColor: '#2B1810' }
        }
      }
    },
    darkNight: {
      ...this.createTheme('#FFF7E6', '#8B4513'),
      name: 'morningSun',
      backgroundImage: 'darkNight.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#000000', hoverColor: '#723709' },
        text: { color: '#000000', hoverColor: '#723709' },
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
      backgroundImage: 'pureBlack.jpg',
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
    warmToneFlower: {
      ...this.createTheme('#E3F2FD', '#1565C0'),
      name: 'warmToneFlower',
      backgroundImage: 'warmToneFlower.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#FFFFFF', hoverColor: '#0D47A1' },
        text: { color: '#FFFFFF', hoverColor: '#0D47A1' },
        branding: {
          background: '#E3F2FD',
          name: { color: '#1565C0', hoverColor: '#0D47A1' },
          web: { color: '#0D47A1', hoverColor: '#1565C0' },
          phone: { color: '#0D47A1', hoverColor: '#1565C0' },
          social: { color: '#0D47A1', hoverColor: '#1565C0' }
        }
      }
    },

    bluePastelHarmony: {
      ...this.createTheme('#FBEAEB', '#2F3C7E'),
      name: 'bluePastelHarmony',
      backgroundImage: 'bluePastelHarmonyImg.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#2F3C7E', hoverColor: '#252F63' },
        text: { color: '#2F3C7E', hoverColor: '#252F63' },
        branding: {
          background: '#FBEAEB',
          name: { color: '#2F3C7E', hoverColor: '#252F63' },
          web: { color: '#3F4C8E', hoverColor: '#2F3C7E' },
          phone: { color: '#3F4C8E', hoverColor: '#2F3C7E' },
          social: { color: '#3F4C8E', hoverColor: '#2F3C7E' }
        }
      }
    },

    charcoalSunrise: {
      ...this.createTheme('#FEE715', '#101820'),
      name: 'charcoalSunrise',
      backgroundImage: 'charcoalSunriseImg.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#101820', hoverColor: '#0D131A' },
        text: { color: '#101820', hoverColor: '#0D131A' },
        branding: {
          background: '#FEE715',
          name: { color: '#101820', hoverColor: '#0D131A' },
          web: { color: '#1C242C', hoverColor: '#101820' },
          phone: { color: '#1C242C', hoverColor: '#101820' },
          social: { color: '#1C242C', hoverColor: '#101820' }
        }
      }
    },

    coralSunset: {
      ...this.createTheme('#F9E795', '#F96167'),
      name: 'coralSunset',
      backgroundImage: 'coralSunsetImg.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#F96167', hoverColor: '#E54E54' },
        text: { color: '#F96167', hoverColor: '#E54E54' },
        branding: {
          background: '#F9E795',
          name: { color: '#F96167', hoverColor: '#E54E54' },
          web: { color: '#FA7478', hoverColor: '#F96167' },
          phone: { color: '#FA7478', hoverColor: '#F96167' },
          social: { color: '#FA7478', hoverColor: '#F96167' }
        }
      }
    },

    cherryElegance: {
      ...this.createTheme('#FCF6F5', '#990011'),
      name: 'cherryElegance',
      backgroundImage: 'cherryEleganceImg.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#990011', hoverColor: '#7A000D' },
        text: { color: '#990011', hoverColor: '#7A000D' },
        branding: {
          background: '#FCF6F5',
          name: { color: '#990011', hoverColor: '#7A000D' },
          web: { color: '#B30014', hoverColor: '#990011' },
          phone: { color: '#B30014', hoverColor: '#990011' },
          social: { color: '#B30014', hoverColor: '#990011' }
        }
      }
    },

    skySerenity: {
      ...this.createTheme('#FFFFFF', '#8AAAE5'),
      name: 'skySerenity',
      backgroundImage: 'skySerenityImg.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#8AAAE5', hoverColor: '#7089B8' },
        text: { color: '#8AAAE5', hoverColor: '#7089B8' },
        branding: {
          background: '#FFFFFF',
          name: { color: '#8AAAE5', hoverColor: '#7089B8' },
          web: { color: '#9BBCF7', hoverColor: '#8AAAE5' },
          phone: { color: '#9BBCF7', hoverColor: '#8AAAE5' },
          social: { color: '#9BBCF7', hoverColor: '#8AAAE5' }
        }
      }
    },

    oceanDepths: {
      ...this.createTheme('#CADCFC', '#00246B'),
      name: 'oceanDepths',
      backgroundImage: 'oceanDepthsImg.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#00246B', hoverColor: '#001C54' },
        text: { color: '#00246B', hoverColor: '#001C54' },
        branding: {
          background: '#CADCFC',
          name: { color: '#00246B', hoverColor: '#001C54' },
          web: { color: '#002D82', hoverColor: '#00246B' },
          phone: { color: '#002D82', hoverColor: '#00246B' },
          social: { color: '#002D82', hoverColor: '#00246B' }
        }
      }
    },

    skyCandy: {
      ...this.createTheme('#EA738D', '#89ABE3'),
      name: 'skyCandy',
      backgroundImage: 'skyCandyImg.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#89ABE3', hoverColor: '#7089B8' },
        text: { color: '#89ABE3', hoverColor: '#7089B8' },
        branding: {
          background: '#EA738D',
          name: { color: '#89ABE3', hoverColor: '#7089B8' },
          web: { color: '#9BBCF7', hoverColor: '#89ABE3' },
          phone: { color: '#9BBCF7', hoverColor: '#89ABE3' },
          social: { color: '#9BBCF7', hoverColor: '#89ABE3' }
        }
      }
    },

    natureMist: {
      ...this.createTheme('#97BC62', '#2C5F2D'),
      name: 'natureMist',
      backgroundImage: 'natureMistImg.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#2C5F2D', hoverColor: '#234C24' },
        text: { color: '#2C5F2D', hoverColor: '#234C24' },
        branding: {
          background: '#97BC62',
          name: { color: '#2C5F2D', hoverColor: '#234C24' },
          web: { color: '#357236', hoverColor: '#2C5F2D' },
          phone: { color: '#357236', hoverColor: '#2C5F2D' },
          social: { color: '#357236', hoverColor: '#2C5F2D' }
        }
      }
    },
    royalMystic: {
  ...this.createTheme('#7A2048', '#1E2761'),
  name: 'royalMystic',
  backgroundImage: 'royalMysticImg.jpg',
  fonts: defaultFonts,
  colors: {
    title: { color: '#1E2761', hoverColor: '#161D4D' },
    text: { color: '#1E2761', hoverColor: '#161D4D' },
    branding: {
      background: '#7A2048',
      name: { color: '#1E2761', hoverColor: '#161D4D' },
      web: { color: '#2A3575', hoverColor: '#1E2761' },
      phone: { color: '#2A3575', hoverColor: '#1E2761' },
      social: { color: '#2A3575', hoverColor: '#1E2761' }
    }
  }
    },

    earthTones: {
      ...this.createTheme('#A7BEAE', '#B85042'),
      name: 'earthTones',
      backgroundImage: 'earthTonesImg.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#B85042', hoverColor: '#934235' },
        text: { color: '#B85042', hoverColor: '#934235' },
        branding: {
          background: '#A7BEAE',
          name: { color: '#B85042', hoverColor: '#934235' },
          web: { color: '#CC5A4A', hoverColor: '#B85042' },
          phone: { color: '#CC5A4A', hoverColor: '#B85042' },
          social: { color: '#CC5A4A', hoverColor: '#B85042' }
        }
      }
    },

    oliveBloom: {
      ...this.createTheme('#F98866', '#A1BE95'),
      name: 'oliveBloom',
      backgroundImage: 'oliveBloomImg.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#A1BE95', hoverColor: '#819878' },
        text: { color: '#A1BE95', hoverColor: '#819878' },
        branding: {
          background: '#F98866',
          name: { color: '#A1BE95', hoverColor: '#819878' },
          web: { color: '#B3D0A7', hoverColor: '#A1BE95' },
          phone: { color: '#B3D0A7', hoverColor: '#A1BE95' },
          social: { color: '#B3D0A7', hoverColor: '#A1BE95' }
        }
      }
    },

    mysticLavender: {
      ...this.createTheme('#D3C5E5', '#735DA5'),
      name: 'mysticLavender',
      backgroundImage: 'mysticLavenderImg.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#735DA5', hoverColor: '#5C4A84' },
        text: { color: '#735DA5', hoverColor: '#5C4A84' },
        branding: {
          background: '#D3C5E5',
          name: { color: '#735DA5', hoverColor: '#5C4A84' },
          web: { color: '#8A70BB', hoverColor: '#735DA5' },
          phone: { color: '#8A70BB', hoverColor: '#735DA5' },
          social: { color: '#8A70BB', hoverColor: '#735DA5' }
        }
      }
    },

    oceanBreeze: {
      ...this.createTheme('#C4DFE6', '#66A5AD'),
      name: 'oceanBreeze',
      backgroundImage: 'oceanBreezeImg.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#66A5AD', hoverColor: '#52848B' },
        text: { color: '#66A5AD', hoverColor: '#52848B' },
        branding: {
          background: '#C4DFE6',
          name: { color: '#66A5AD', hoverColor: '#52848B' },
          web: { color: '#7AB6BE', hoverColor: '#66A5AD' },
          phone: { color: '#7AB6BE', hoverColor: '#66A5AD' },
          social: { color: '#7AB6BE', hoverColor: '#66A5AD' }
        }
      }
    },

    mintLagoon: {
      ...this.createTheme('#6AB187', '#20948B'),
      name: 'mintLagoon',
      backgroundImage: 'mintLagoonImg.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#20948B', hoverColor: '#1A766F' },
        text: { color: '#20948B', hoverColor: '#1A766F' },
        branding: {
          background: '#6AB187',
          name: { color: '#20948B', hoverColor: '#1A766F' },
          web: { color: '#26B2A7', hoverColor: '#20948B' },
          phone: { color: '#26B2A7', hoverColor: '#20948B' },
          social: { color: '#26B2A7', hoverColor: '#20948B' }
        }
      }
    },

    autumnSunset: {
      ...this.createTheme('#FB6542', '#FFBB00'),
      name: 'autumnSunset',
      backgroundImage: 'autumnSunsetImg.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#375E97', hoverColor: '#2C4B79' },
        text: { color: '#375E97', hoverColor: '#2C4B79' },
        branding: {
          background: '#FB6542',
          name: { color: '#375E97', hoverColor: '#2C4B79' },
          web: { color: '#4271B5', hoverColor: '#375E97' },
          phone: { color: '#4271B5', hoverColor: '#375E97' },
          social: { color: '#4271B5', hoverColor: '#375E97' }
        }
      }
    },

    vintageMauve: {
      ...this.createTheme('#CEE6F2', '#962E2A'),
      name: 'vintageMauve',
      backgroundImage: 'vintageMauveImg.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#962E2A', hoverColor: '#782522' },
        text: { color: '#962E2A', hoverColor: '#782522' },
        branding: {
          background: '#CEE6F2',
          name: { color: '#962E2A', hoverColor: '#782522' },
          web: { color: '#B03632', hoverColor: '#962E2A' },
          phone: { color: '#B03632', hoverColor: '#962E2A' },
          social: { color: '#B03632', hoverColor: '#962E2A' }
        }
      }
    },

    rusticCharm: {
      ...this.createTheme('#D09683', '#330000'),
      name: 'rusticCharm',
      backgroundImage: 'rusticCharmImg.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#330000', hoverColor: '#290000' },
        text: { color: '#330000', hoverColor: '#290000' },
        branding: {
          background: '#D09683',
          name: { color: '#330000', hoverColor: '#290000' },
          web: { color: '#4D0000', hoverColor: '#330000' },
          phone: { color: '#4D0000', hoverColor: '#330000' },
          social: { color: '#4D0000', hoverColor: '#330000' }
        }
      }
    },

    glacierMist: {
      ...this.createTheme('#F1F1F2', '#1995AD'),
      name: 'glacierMist',
      backgroundImage: 'glacierMistImg.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#1995AD', hoverColor: '#14778A' },
        text: { color: '#1995AD', hoverColor: '#14778A' },
        branding: {
          background: '#F1F1F2',
          name: { color: '#1995AD', hoverColor: '#14778A' },
          web: { color: '#1EB3D0', hoverColor: '#1995AD' },
          phone: { color: '#1EB3D0', hoverColor: '#1995AD' },
          social: { color: '#1EB3D0', hoverColor: '#1995AD' }
        }
      }
    },

    autumnHarmony: {
      ...this.createTheme('#F1D3B2', '#46211A'),
      name: 'autumnHarmony',
      backgroundImage: 'autumnHarmonyImg.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#46211A', hoverColor: '#381A15' },
        text: { color: '#46211A', hoverColor: '#381A15' },
        branding: {
          background: '#F1D3B2',
          name: { color: '#46211A', hoverColor: '#381A15' },
          web: { color: '#54281F', hoverColor: '#46211A' },
          phone: { color: '#54281F', hoverColor: '#46211A' },
          social: { color: '#54281F', hoverColor: '#46211A' }
        }
      }
    },

    industrialChic: {
      ...this.createTheme('#90AFC5', '#2A3132'),
      name: 'industrialChic',
      backgroundImage: 'industrialChicImg.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#2A3132', hoverColor: '#1F2425' },
        text: { color: '#2A3132', hoverColor: '#1F2425' },
        branding: {
          background: '#90AFC5',
          name: { color: '#2A3132', hoverColor: '#1F2425' },
          web: { color: '#363E3F', hoverColor: '#2A3132' },
          phone: { color: '#363E3F', hoverColor: '#2A3132' },
          social: { color: '#363E3F', hoverColor: '#2A3132' }
        }
      }
    },

    dustyRoseHarmony: {
      ...this.createTheme('#EDF4F2', '#31473A'),
      name: 'dustyRoseHarmony',
      backgroundImage: 'dustyRoseHarmonyImg.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#31473A', hoverColor: '#273730' },
        text: { color: '#31473A', hoverColor: '#273730' },
        branding: {
          background: '#EDF4F2',
          name: { color: '#31473A', hoverColor: '#273730' },
          web: { color: '#3B5744', hoverColor: '#31473A' },
          phone: { color: '#3B5744', hoverColor: '#31473A' },
          social: { color: '#3B5744', hoverColor: '#31473A' }
        }
      }
    },

    berryBurst: {
      ...this.createTheme('#FA6775', '#F52549'),
      name: 'berryBurst',
      backgroundImage: 'berryBurstImg.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#F52549', hoverColor: '#D91B3D' },
        text: { color: '#F52549', hoverColor: '#D91B3D' },
        branding: {
          background: '#FA6775',
          name: { color: '#F52549', hoverColor: '#D91B3D' },
          web: { color: '#FF2F55', hoverColor: '#F52549' },
          phone: { color: '#FF2F55', hoverColor: '#F52549' },
          social: { color: '#FF2F55', hoverColor: '#F52549' }
        }
      }
    },

    mistyMorning: {
      ...this.createTheme('#CEE6F2', '#763626'),
      name: 'mistyMorning',
      backgroundImage: 'mistyMorningImg.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#763626', hoverColor: '#5E2B1E' },
        text: { color: '#763626', hoverColor: '#5E2B1E' },
        branding: {
          background: '#CEE6F2',
          name: { color: '#763626', hoverColor: '#5E2B1E' },
          web: { color: '#8E412E', hoverColor: '#763626' },
          phone: { color: '#8E412E', hoverColor: '#763626' },
          social: { color: '#8E412E', hoverColor: '#763626' }
        }
      }
    },

    seafoamDream: {
      ...this.createTheme('#66A5AD', '#07575B'),
      name: 'seafoamDream',
      backgroundImage: 'seafoamDreamImg.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#07575B', hoverColor: '#054448' },
        text: { color: '#07575B', hoverColor: '#054448' },
        branding: {
          background: '#66A5AD',
          name: { color: '#07575B', hoverColor: '#054448' },
          web: { color: '#096A6E', hoverColor: '#07575B' },
          phone: { color: '#096A6E', hoverColor: '#07575B' },
          social: { color: '#096A6E', hoverColor: '#07575B' }
        }
      }
    },

    sunsetGlow: {
      ...this.createTheme('#FFD460', '#F07B3F'),
      name: 'sunsetGlow',
      backgroundImage: 'sunsetGlowImg.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#F07B3F', hoverColor: '#D86632' },
        text: { color: '#F07B3F', hoverColor: '#D86632' },
        branding: {
          background: '#FFD460',
          name: { color: '#F07B3F', hoverColor: '#D86632' },
          web: { color: '#FF904C', hoverColor: '#F07B3F' },
          phone: { color: '#FF904C', hoverColor: '#F07B3F' },
          social: { color: '#FF904C', hoverColor: '#F07B3F' }
        }
      }
    },

    desertSage: {
      ...this.createTheme('#E8DDB5', '#C1B098'),
      name: 'desertSage',
      backgroundImage: 'desertSageImg.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#6B705C', hoverColor: '#565A49' },
        text: { color: '#6B705C', hoverColor: '#565A49' },
        branding: {
          background: '#E8DDB5',
          name: { color: '#6B705C', hoverColor: '#565A49' },
          web: { color: '#80866F', hoverColor: '#6B705C' },
          phone: { color: '#80866F', hoverColor: '#6B705C' },
          social: { color: '#80866F', hoverColor: '#6B705C' }
        }
      }
    },

    moonlitNight: {
      ...this.createTheme('#2C3E50', '#E0E0E0'),
      name: 'moonlitNight',
      backgroundImage: 'moonlitNightImg.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#E0E0E0', hoverColor: '#C4C4C4' },
        text: { color: '#E0E0E0', hoverColor: '#C4C4C4' },
        branding: {
          background: '#2C3E50',
          name: { color: '#E0E0E0', hoverColor: '#C4C4C4' },
          web: { color: '#F2F2F2', hoverColor: '#E0E0E0' },
          phone: { color: '#F2F2F2', hoverColor: '#E0E0E0' },
          social: { color: '#F2F2F2', hoverColor: '#E0E0E0' }
        }
      }
    },

    sageGarden: {
      ...this.createTheme('#A8E6CE', '#3D6657'),
      name: 'sageGarden',
      backgroundImage: 'sageGardenImg.jpg',
      fonts: defaultFonts,
      colors: {
        title: { color: '#3D6657', hoverColor: '#2F4F42' },
        text: { color: '#3D6657', hoverColor: '#2F4F42' },
        branding: {
          background: '#A8E6CE',
          name: { color: '#3D6657', hoverColor: '#2F4F42' },
          web: { color: '#4B7D6C', hoverColor: '#3D6657' },
          phone: { color: '#4B7D6C', hoverColor: '#3D6657' },
          social: { color: '#4B7D6C', hoverColor: '#3D6657' }
        }
      }
    },

    //gradeint themes

sunsetGradient: {
  ...this.createTheme('#F09819', '#FFFFFF'),
  name: 'sunsetGradient',
  gradient: {
    type: 'linear',
    angle: 45,
    colors: ['#FF512F', '#F09819', '#DD2476']
  },
  layout: DEFAULT_LAYOUT,
  fonts: defaultFonts,
  colors: {
    title: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
    text: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
    branding: {
      background: 'transparent',
      name: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      web: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      phone: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      social: { color: '#FFFFFF', hoverColor: '#F5F5F5' }
    }
  },
  effects: {
    textShadow: true,
    glow: true,
    shadow: {
      blur: 4,
      opacity: 0.4,
      offset: { x: 2, y: 2 }
    }
  }
},

oceanGradient: {
  ...this.createTheme('#6dd5ed', '#FFFFFF'),
  name: 'oceanGradient',
  gradient: {
    type: 'linear',
    angle: 135,
    colors: ['#2193b0', '#6dd5ed']
  },
  layout: DEFAULT_LAYOUT,
  fonts: defaultFonts,
  colors: {
    title: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
    text: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
    branding: {
      background: 'transparent',
      name: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      web: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      phone: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      social: { color: '#FFFFFF', hoverColor: '#F5F5F5' }
    }
  }
},

purpleDream: {
  ...this.createTheme('#4A00E0', '#FFFFFF'),
  name: 'purpleDream',
  gradient: {
    type: 'linear',
    angle: 120,
    colors: ['#8E2DE2', '#4A00E0']
  },
  layout: DEFAULT_LAYOUT,
  fonts: defaultFonts,
  colors: {
    title: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
    text: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
    branding: {
      background: 'transparent',
      name: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      web: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      phone: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      social: { color: '#FFFFFF', hoverColor: '#F5F5F5' }
    }
  }
},

// Add these aesthetic gradient themes

midnightOcean: {
  ...this.createTheme('#0F2027', '#FFFFFF'),
  name: 'midnightOcean',
  gradient: {
    type: 'linear',
    angle: 135,
    colors: ['#0F2027', '#203A43', '#2C5364']
  },
  layout: DEFAULT_LAYOUT,
  fonts: defaultFonts,
  colors: {
    title: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
    text: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
    branding: {
      background: 'transparent',
      name: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      web: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      phone: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      social: { color: '#FFFFFF', hoverColor: '#F5F5F5' }
    }
  }
},

roseMist: {
  ...this.createTheme('#ff6e7f', '#FFFFFF'),
  name: 'roseMist',
  gradient: {
    type: 'linear',
    angle: 45,
    colors: ['#ff6e7f', '#bfe9ff']
  },
  layout: DEFAULT_LAYOUT,
  fonts: defaultFonts,
  colors: {
    title: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
    text: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
    branding: {
      background: 'transparent',
      name: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
      web: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
      phone: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
      social: { color: '#2A2A2A', hoverColor: '#1A1A1A' }
    }
  }
},

emeraldDream: {
  ...this.createTheme('#43cea2', '#FFFFFF'),
  name: 'emeraldDream',
  gradient: {
    type: 'linear',
    angle: 150,
    colors: ['#43cea2', '#185a9d']
  },
  layout: DEFAULT_LAYOUT,
  fonts: defaultFonts,
  colors: {
    title: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
    text: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
    branding: {
      background: 'transparent',
      name: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      web: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      phone: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      social: { color: '#FFFFFF', hoverColor: '#F5F5F5' }
    }
  }
},

goldenHour: {
  ...this.createTheme('#f7971e', '#FFFFFF'),
  name: 'goldenHour',
  gradient: {
    type: 'linear',
    angle: 60,
    colors: ['#f7971e', '#ffd200']
  },
  layout: DEFAULT_LAYOUT,
  fonts: defaultFonts,
  colors: {
    title: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
    text: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
    branding: {
      background: 'transparent',
      name: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
      web: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
      phone: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
      social: { color: '#2A2A2A', hoverColor: '#1A1A1A' }
    }
  }
},

lavenderMist: {
  ...this.createTheme('#834d9b', '#FFFFFF'),
  name: 'lavenderMist',
  gradient: {
    type: 'linear',
    angle: 165,
    colors: ['#834d9b', '#d04ed6']
  },
  layout: DEFAULT_LAYOUT,
  fonts: defaultFonts,
  colors: {
    title: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
    text: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
    branding: {
      background: 'transparent',
      name: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      web: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      phone: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      social: { color: '#FFFFFF', hoverColor: '#F5F5F5' }
    }
  }
},

cosmicFusion: {
  ...this.createTheme('#ff00cc', '#FFFFFF'),
  name: 'cosmicFusion',
  gradient: {
    type: 'linear',
    angle: 130,
    colors: ['#ff00cc', '#333399']
  },
  layout: DEFAULT_LAYOUT,
  fonts: defaultFonts,
  colors: {
    title: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
    text: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
    branding: {
      background: 'transparent',
      name: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      web: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      phone: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      social: { color: '#FFFFFF', hoverColor: '#F5F5F5' }
    }
  }
},

arcticAurora: {
  ...this.createTheme('#4ECDC4', '#FFFFFF'),
  name: 'arcticAurora',
  gradient: {
    type: 'linear',
    angle: 145,
    colors: ['#4ECDC4', '#556270']
  },
  layout: DEFAULT_LAYOUT,
  fonts: defaultFonts,
  colors: {
    title: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
    text: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
    branding: {
      background: 'transparent',
      name: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      web: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      phone: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      social: { color: '#FFFFFF', hoverColor: '#F5F5F5' }
    }
  }
},

cherryBlossom: {
  ...this.createTheme('#FBD3E9', '#000000'),
  name: 'cherryBlossom',
  gradient: {
    type: 'linear',
    angle: 75,
    colors: ['#FBD3E9', '#BB377D']
  },
  layout: DEFAULT_LAYOUT,
  fonts: defaultFonts,
  colors: {
    title: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
    text: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
    branding: {
      background: 'transparent',
      name: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
      web: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
      phone: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
      social: { color: '#2A2A2A', hoverColor: '#1A1A1A' }
    }
  }
},

desertSunrise: {
  ...this.createTheme('#FFB75E', '#FFFFFF'),
  name: 'desertSunrise',
  gradient: {
    type: 'linear',
    angle: 90,
    colors: ['#FFB75E', '#ED8F03']
  },
  layout: DEFAULT_LAYOUT,
  fonts: defaultFonts,
  colors: {
    title: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
    text: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
    branding: {
      background: 'transparent',
      name: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
      web: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
      phone: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
      social: { color: '#2A2A2A', hoverColor: '#1A1A1A' }
    }
  }
},

forestDepths: {
  ...this.createTheme('#134E5E', '#FFFFFF'),
  name: 'forestDepths',
  gradient: {
    type: 'linear',
    angle: 155,
    colors: ['#134E5E', '#71B280']
  },
  layout: DEFAULT_LAYOUT,
  fonts: defaultFonts,
  colors: {
    title: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
    text: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
    branding: {
      background: 'transparent',
      name: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      web: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      phone: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      social: { color: '#FFFFFF', hoverColor: '#F5F5F5' }
    }
  }
},

twilightHaze: {
  ...this.createTheme('#2C3E50', '#FFFFFF'),
  name: 'twilightHaze',
  gradient: {
    type: 'linear',
    angle: 140,
    colors: ['#2C3E50', '#3498DB']
  },
  layout: DEFAULT_LAYOUT,
  fonts: defaultFonts,
  colors: {
    title: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
    text: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
    branding: {
      background: 'transparent',
      name: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      web: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      phone: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      social: { color: '#FFFFFF', hoverColor: '#F5F5F5' }
    }
  }
},

sunsetSerenade: {
  ...this.createTheme('#FFE000', '#FFFFFF'),
  name: 'sunsetSerenade',
  gradient: {
    type: 'linear',
    angle: 65,
    colors: ['#FFE000', '#799F0C']
  },
  layout: DEFAULT_LAYOUT,
  fonts: defaultFonts,
  colors: {
    title: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
    text: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
    branding: {
      background: 'transparent',
      name: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
      web: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
      phone: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
      social: { color: '#2A2A2A', hoverColor: '#1A1A1A' }
    }
  }
},

mysticDawn: {
  ...this.createTheme('#FF512F', '#FFFFFF'),
  name: 'mysticDawn',
  gradient: {
    type: 'linear',
    angle: 125,
    colors: ['#FF512F', '#F09819']
  },
  layout: DEFAULT_LAYOUT,
  fonts: defaultFonts,
  colors: {
    title: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
    text: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
    branding: {
      background: 'transparent',
      name: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      web: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      phone: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      social: { color: '#FFFFFF', hoverColor: '#F5F5F5' }
    }
  }
},

crystalline: {
  ...this.createTheme('#00C9FF', '#FFFFFF'),
  name: 'crystalline',
  gradient: {
    type: 'linear',
    angle: 160,
    colors: ['#00C9FF', '#92FE9D']
  },
  layout: DEFAULT_LAYOUT,
  fonts: defaultFonts,
  colors: {
    title: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
    text: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
    branding: {
      background: 'transparent',
      name: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
      web: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
      phone: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
      social: { color: '#2A2A2A', hoverColor: '#1A1A1A' }
    }
  }
},

moonlightSonata: {
  ...this.createTheme('#0F2027', '#FFFFFF'),
  name: 'moonlightSonata',
  gradient: {
    type: 'linear',
    angle: 145,
    colors: ['#0F2027', '#2C5364', '#203A43']
  },
  layout: DEFAULT_LAYOUT,
  fonts: defaultFonts,
  colors: {
    title: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
    text: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
    branding: {
      background: 'transparent',
      name: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      web: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      phone: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      social: { color: '#FFFFFF', hoverColor: '#F5F5F5' }
    }
  }
},

plumSunset: {
  ...this.createTheme('#CC2B5E', '#FFFFFF'),
  name: 'plumSunset',
  gradient: {
    type: 'linear',
    angle: 135,
    colors: ['#CC2B5E', '#753A88']
  },
  layout: DEFAULT_LAYOUT,
  fonts: defaultFonts,
  colors: {
    title: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
    text: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
    branding: {
      background: 'transparent',
      name: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      web: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      phone: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      social: { color: '#FFFFFF', hoverColor: '#F5F5F5' }
    }
  }
},

mintLeaf: {
  ...this.createTheme('#00B09B', '#FFFFFF'),
  name: 'mintLeaf',
  gradient: {
    type: 'linear',
    angle: 120,
    colors: ['#00B09B', '#96C93D']
  },
  layout: DEFAULT_LAYOUT,
  fonts: defaultFonts,
  colors: {
    title: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
    text: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
    branding: {
      background: 'transparent',
      name: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      web: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      phone: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      social: { color: '#FFFFFF', hoverColor: '#F5F5F5' }
    }
  }
},

polarLight: {
  ...this.createTheme('#2980B9', '#FFFFFF'),
  name: 'polarLight',
  gradient: {
    type: 'linear',
    angle: 155,
    colors: ['#2980B9', '#6DD5FA', '#FFFFFF']
  },
  layout: DEFAULT_LAYOUT,
  fonts: defaultFonts,
  colors: {
    title: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
    text: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
    branding: {
      background: 'transparent',
      name: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
      web: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
      phone: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
      social: { color: '#2A2A2A', hoverColor: '#1A1A1A' }
    }
  }
},

roseQuartz: {
  ...this.createTheme('#E8CBC0', '#000000'),
  name: 'roseQuartz',
  gradient: {
    type: 'linear',
    angle: 145,
    colors: ['#E8CBC0', '#636FA4']
  },
  layout: DEFAULT_LAYOUT,
  fonts: defaultFonts,
  colors: {
    title: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
    text: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
    branding: {
      background: 'transparent',
      name: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
      web: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
      phone: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
      social: { color: '#2A2A2A', hoverColor: '#1A1A1A' }
    }
  }
},

celestialNight: {
  ...this.createTheme('#1A2980', '#FFFFFF'),
  name: 'celestialNight',
  gradient: {
    type: 'linear',
    angle: 165,
    colors: ['#1A2980', '#26D0CE']
  },
  layout: DEFAULT_LAYOUT,
  fonts: defaultFonts,
  colors: {
    title: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
    text: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
    branding: {
      background: 'transparent',
      name: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      web: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      phone: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      social: { color: '#FFFFFF', hoverColor: '#F5F5F5' }
    }
  }
},

retroWave: {
  ...this.createTheme('#FF057C', '#FFFFFF'),
  name: 'retroWave',
  gradient: {
    type: 'linear',
    angle: 30,
    colors: ['#FF057C', '#7C64D5', '#4CC3FF']
  },
  layout: DEFAULT_LAYOUT,
  fonts: defaultFonts,
  colors: {
    title: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
    text: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
    branding: {
      background: 'transparent',
      name: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      web: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      phone: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      social: { color: '#FFFFFF', hoverColor: '#F5F5F5' }
    }
  }
},

pastelSunrise: {
  ...this.createTheme('#FFB88C', '#000000'),
  name: 'pastelSunrise',
  gradient: {
    type: 'linear',
    angle: 45,
    colors: ['#FFB88C', '#DE6262']
  },
  layout: DEFAULT_LAYOUT,
  fonts: defaultFonts,
  colors: {
    title: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
    text: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
    branding: {
      background: 'transparent',
      name: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
      web: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
      phone: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
      social: { color: '#2A2A2A', hoverColor: '#1A1A1A' }
    }
  }
},

aquaMarine: {
  ...this.createTheme('#1A2980', '#FFFFFF'),
  name: 'aquaMarine',
  gradient: {
    type: 'linear',
    angle: 60,
    colors: ['#1A2980', '#26D0CE']
  },
  layout: DEFAULT_LAYOUT,
  fonts: defaultFonts,
  colors: {
    title: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
    text: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
    branding: {
      background: 'transparent',
      name: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      web: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      phone: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      social: { color: '#FFFFFF', hoverColor: '#F5F5F5' }
    }
  }
},

// Add these new gradient themes specifically designed for contemplative poetry

soulfulNight: {
  ...this.createTheme('#2C3E50', '#FFFFFF'),
  name: 'soulfulNight',
  gradient: {
    type: 'linear',
    angle: 135,
    colors: ['#2C3E50', '#3498db', '#2980b9']
  },
  layout: DEFAULT_LAYOUT,
  fonts: defaultFonts,
  colors: {
    title: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
    text: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
    branding: {
      background: 'transparent',
      name: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      web: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      phone: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      social: { color: '#FFFFFF', hoverColor: '#F5F5F5' }
    }
  }
},

innerPeace: {
  ...this.createTheme('#614385', '#FFFFFF'),
  name: 'innerPeace',
  gradient: {
    type: 'linear',
    angle: 145,
    colors: ['#614385', '#516395']
  },
  layout: DEFAULT_LAYOUT,
  fonts: defaultFonts,
  colors: {
    title: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
    text: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
    branding: {
      background: 'transparent',
      name: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      web: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      phone: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      social: { color: '#FFFFFF', hoverColor: '#F5F5F5' }
    }
  }
},

serenityFlow: {
  ...this.createTheme('#1a2a6c', '#FFFFFF'),
  name: 'serenityFlow',
  gradient: {
    type: 'linear',
    angle: 120,
    colors: ['#1a2a6c', '#b21f1f', '#fdbb2d']
  },
  layout: DEFAULT_LAYOUT,
  fonts: defaultFonts,
  colors: {
    title: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
    text: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
    branding: {
      background: 'transparent',
      name: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      web: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      phone: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      social: { color: '#FFFFFF', hoverColor: '#F5F5F5' }
    }
  }
},

tranquilDawn: {
  ...this.createTheme('#355C7D', '#FFFFFF'),
  name: 'tranquilDawn',
  gradient: {
    type: 'linear',
    angle: 150,
    colors: ['#355C7D', '#6C5B7B', '#C06C84']
  },
  layout: DEFAULT_LAYOUT,
  fonts: defaultFonts,
  colors: {
    title: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
    text: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
    branding: {
      background: 'transparent',
      name: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      web: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      phone: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      social: { color: '#FFFFFF', hoverColor: '#F5F5F5' }
    }
  }
},

mindfulMist: {
  ...this.createTheme('#076585', '#FFFFFF'),
  name: 'mindfulMist',
  gradient: {
    type: 'linear',
    angle: 165,
    colors: ['#076585', '#fff']
  },
  layout: DEFAULT_LAYOUT,
  fonts: defaultFonts,
  colors: {
    title: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
    text: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
    branding: {
      background: 'transparent',
      name: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
      web: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
      phone: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
      social: { color: '#2A2A2A', hoverColor: '#1A1A1A' }
    }
  }
},

// More gradient themes perfect for reflective poetry

mysticTwilight: {
  ...this.createTheme('#232526', '#FFFFFF'),
  name: 'mysticTwilight',
  gradient: {
    type: 'linear',
    angle: 145,
    colors: ['#232526', '#414345', '#232526']
  },
  layout: DEFAULT_LAYOUT,
  fonts: defaultFonts,
  colors: {
    title: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
    text: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
    branding: {
      background: 'transparent',
      name: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      web: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      phone: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      social: { color: '#FFFFFF', hoverColor: '#F5F5F5' }
    }
  }
},

silentRain: {
  ...this.createTheme('#4B79A1', '#FFFFFF'),
  name: 'silentRain',
  gradient: {
    type: 'linear',
    angle: 165,
    colors: ['#4B79A1', '#283E51']
  },
  layout: DEFAULT_LAYOUT,
  fonts: defaultFonts,
  colors: {
    title: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
    text: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
    branding: {
      background: 'transparent',
      name: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      web: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      phone: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      social: { color: '#FFFFFF', hoverColor: '#F5F5F5' }
    }
  }
},

etherealDream: {
  ...this.createTheme('#7F7FD5', '#FFFFFF'),
  name: 'etherealDream',
  gradient: {
    type: 'linear',
    angle: 130,
    colors: ['#7F7FD5', '#86A8E7', '#91EAE4']
  },
  layout: DEFAULT_LAYOUT,
  fonts: defaultFonts,
  colors: {
    title: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
    text: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
    branding: {
      background: 'transparent',
      name: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
      web: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
      phone: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
      social: { color: '#2A2A2A', hoverColor: '#1A1A1A' }
    }
  }
},

meditativeSpace: {
  ...this.createTheme('#141E30', '#FFFFFF'),
  name: 'meditativeSpace',
  gradient: {
    type: 'linear',
    angle: 155,
    colors: ['#141E30', '#243B55']
  },
  layout: DEFAULT_LAYOUT,
  fonts: defaultFonts,
  colors: {
    title: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
    text: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
    branding: {
      background: 'transparent',
      name: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      web: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      phone: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      social: { color: '#FFFFFF', hoverColor: '#F5F5F5' }
    }
  }
},

gentleDusk: {
  ...this.createTheme('#373B44', '#FFFFFF'),
  name: 'gentleDusk',
  gradient: {
    type: 'linear',
    angle: 145,
    colors: ['#373B44', '#4286f4']
  },
  layout: DEFAULT_LAYOUT,
  fonts: defaultFonts,
  colors: {
    title: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
    text: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
    branding: {
      background: 'transparent',
      name: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      web: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      phone: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      social: { color: '#FFFFFF', hoverColor: '#F5F5F5' }
    }
  }
},

peacefulAutumn: {
  ...this.createTheme('#CAC531', '#000000'),
  name: 'peacefulAutumn',
  gradient: {
    type: 'linear',
    angle: 135,
    colors: ['#CAC531', '#F3F9A7']
  },
  layout: DEFAULT_LAYOUT,
  fonts: defaultFonts,
  colors: {
    title: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
    text: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
    branding: {
      background: 'transparent',
      name: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
      web: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
      phone: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
      social: { color: '#2A2A2A', hoverColor: '#1A1A1A' }
    }
  }
},

moonlessNight: {
  ...this.createTheme('#0F2027', '#FFFFFF'),
  name: 'moonlessNight',
  gradient: {
    type: 'linear',
    angle: 150,
    colors: ['#0F2027', '#203A43', '#2C5364']
  },
  layout: DEFAULT_LAYOUT,
  fonts: defaultFonts,
  colors: {
    title: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
    text: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
    branding: {
      background: 'transparent',
      name: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      web: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      phone: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      social: { color: '#FFFFFF', hoverColor: '#F5F5F5' }
    }
  }
},

soulfulSunset: {
  ...this.createTheme('#1e3c72', '#FFFFFF'),
  name: 'soulfulSunset',
  gradient: {
    type: 'linear',
    angle: 120,
    colors: ['#1e3c72', '#2a5298', '#7F7FD5']
  },
  layout: DEFAULT_LAYOUT,
  fonts: defaultFonts,
  colors: {
    title: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
    text: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
    branding: {
      background: 'transparent',
      name: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      web: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      phone: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      social: { color: '#FFFFFF', hoverColor: '#F5F5F5' }
    }
  }
},

innerCalm: {
  ...this.createTheme('#3494E6', '#FFFFFF'),
  name: 'innerCalm',
  gradient: {
    type: 'linear',
    angle: 145,
    colors: ['#3494E6', '#EC6EAD']
  },
  layout: DEFAULT_LAYOUT,
  fonts: defaultFonts,
  colors: {
    title: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
    text: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
    branding: {
      background: 'transparent',
      name: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      web: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      phone: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
      social: { color: '#FFFFFF', hoverColor: '#F5F5F5' }
    }
  }
}

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

async createGradientBackground(width, height, gradientColors) {
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
// Add this to your ImageGenerationService class
async generateTextureNoise(type, width, height) {
  const textureEffects = {
    // 1. Vintage Paper
    vintagePaper: {
      layers: [
        {
          noise: { type: 'gaussian', mean: 0, sigma: 30 },
          background: { r: 245, g: 245, b: 240, alpha: 0.8 },
          blend: 'soft-light',
          opacity: 0.7
        },
        {
          noise: { type: 'gaussian', mean: 0, sigma: 20 },
          background: { r: 180, g: 170, b: 155, alpha: 0.2 },
          blend: 'overlay',
          opacity: 0.3
        }
      ],
      modulate: { brightness: 1.05, saturation: 0.9, lightness: 1.02 }
    },

    // 2. Denim Texture
    denim: {
      layers: [
        {
          noise: { type: 'gaussian', mean: 0, sigma: 80 },
          background: { r: 25, g: 25, b: 112, alpha: 0.4 },
          blend: 'overlay',
          opacity: 0.4
        },
        {
          noise: { type: 'gaussian', mean: 0, sigma: 40 },
          background: { r: 0, g: 0, b: 50, alpha: 0.3 },
          blend: 'soft-light',
          opacity: 0.3
        }
      ],
      modulate: { brightness: 0.95, saturation: 1.2, lightness: 0.9 }
    },

    // 3. Watercolor Effect
    watercolor: {
      layers: [
        {
          noise: { type: 'gaussian', mean: 0, sigma: 30 },
          background: { r: 245, g: 245, b: 240, alpha: 0.8 },
          blend: 'soft-light',
          opacity: 0.7
        },
        {
          noise: { type: 'gaussian', mean: 0, sigma: 70 },
          background: { r: 200, g: 220, b: 200, alpha: 0.2 },
          blend: 'screen',
          opacity: 0.3
        },
        {
          noise: { type: 'gaussian', mean: 0, sigma: 20 },
          background: { r: 50, g: 50, b: 50, alpha: 0.05 },
          blend: 'overlay',
          opacity: 0.1
        }
      ],
      modulate: { brightness: 1.05, saturation: 0.9, lightness: 1.02 }
    },

    // 4. Concrete Texture
    concrete: {
      layers: [
        {
          noise: { type: 'gaussian', mean: 0, sigma: 50 },
          background: { r: 200, g: 200, b: 200, alpha: 0.5 },
          blend: 'overlay',
          opacity: 0.5
        },
        {
          noise: { type: 'gaussian', mean: 0, sigma: 30 },
          background: { r: 180, g: 180, b: 180, alpha: 0.3 },
          blend: 'soft-light',
          opacity: 0.4
        }
      ],
      modulate: { brightness: 0.98, saturation: 0.7, lightness: 1.0 }
    },

    // 5. Canvas Texture
    canvas: {
      layers: [
        {
          noise: { type: 'gaussian', mean: 0, sigma: 40 },
          background: { r: 240, g: 235, b: 230, alpha: 0.6 },
          blend: 'overlay',
          opacity: 0.4
        },
        {
          noise: { type: 'gaussian', mean: 0, sigma: 25 },
          background: { r: 220, g: 215, b: 210, alpha: 0.3 },
          blend: 'multiply',
          opacity: 0.2
        }
      ],
      modulate: { brightness: 1.02, saturation: 0.95, lightness: 1.0 }
    },

    // 6. Film Grain
    filmGrain: {
      layers: [
        {
          noise: { type: 'gaussian', mean: 0, sigma: 35 },
          background: { r: 100, g: 100, b: 100, alpha: 0.2 },
          blend: 'overlay',
          opacity: 0.3
        },
        {
          noise: { type: 'gaussian', mean: 0, sigma: 15 },
          background: { r: 50, g: 50, b: 50, alpha: 0.1 },
          blend: 'soft-light',
          opacity: 0.2
        }
      ],
      modulate: { brightness: 0.98, saturation: 0.95, lightness: 1.0 }
    },

    // 7. Marble Effect
    marble: {
      layers: [
        {
          noise: { type: 'gaussian', mean: 0, sigma: 90 },
          background: { r: 240, g: 240, b: 240, alpha: 0.7 },
          blend: 'overlay',
          opacity: 0.5
        },
        {
          noise: { type: 'gaussian', mean: 0, sigma: 40 },
          background: { r: 220, g: 220, b: 220, alpha: 0.3 },
          blend: 'soft-light',
          opacity: 0.4
        }
      ],
      modulate: { brightness: 1.1, saturation: 0.8, lightness: 1.05 }
    },

    // 8. Rusted Metal
    rustedMetal: {
      layers: [
        {
          noise: { type: 'gaussian', mean: 0, sigma: 60 },
          background: { r: 139, g: 69, b: 19, alpha: 0.5 },
          blend: 'overlay',
          opacity: 0.6
        },
        {
          noise: { type: 'gaussian', mean: 0, sigma: 30 },
          background: { r: 183, g: 65, b: 14, alpha: 0.3 },
          blend: 'soft-light',
          opacity: 0.4
        }
      ],
      modulate: { brightness: 0.95, saturation: 1.1, lightness: 0.98 }
    },

    // 9. Parchment
    parchment: {
      layers: [
        {
          noise: { type: 'gaussian', mean: 0, sigma: 25 },
          background: { r: 255, g: 250, b: 240, alpha: 0.6 },
          blend: 'soft-light',
          opacity: 0.5
        },
        {
          noise: { type: 'gaussian', mean: 0, sigma: 15 },
          background: { r: 210, g: 200, b: 180, alpha: 0.2 },
          blend: 'overlay',
          opacity: 0.3
        }
      ],
      modulate: { brightness: 1.03, saturation: 0.85, lightness: 1.02 }
    },

    // 10. Chalk Board
    chalkBoard: {
      layers: [
        {
          noise: { type: 'gaussian', mean: 0, sigma: 45 },
          background: { r: 50, g: 50, b: 50, alpha: 0.4 },
          blend: 'overlay',
          opacity: 0.5
        },
        {
          noise: { type: 'gaussian', mean: 0, sigma: 20 },
          background: { r: 30, g: 30, b: 30, alpha: 0.2 },
          blend: 'soft-light',
          opacity: 0.3
        }
      ],
      modulate: { brightness: 0.9, saturation: 0.8, lightness: 0.95 }
    }
  };

  const effect = textureEffects[type] || textureEffects.vintagePaper;
  const buffers = await Promise.all(effect.layers.map(async layer => {
    const buffer = await sharp({
      create: {
        width,
        height,
        channels: 4,
        noise: layer.noise,
        background: layer.background
      }
    })
    .png()
    .toBuffer();

    return {
      input: buffer,
      blend: layer.blend,
      opacity: layer.opacity
    };
  }));

  return {
    composite: buffers,
    modulate: effect.modulate
  };
}

// Add radial gradient support
createRadialGradientSVG(width, height, gradient) {
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

// Additional helper method for creating multi-point gradients
createMultiPointGradient(width, height, colors, points) {
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

async createTexturedBackground(width, height, theme) {
  try {
    theme = this.validateTheme(theme);

    const themeInfo = themeKeyMapping.find(t => t.keyName === theme.name) || {
      mainColors: [theme.colors.background],
      recommendedBg: theme.colors.background
    };

    console.log('====================================');
    console.log({theme});
    console.log('====================================');

    let baseImage;
    let contentBgColor;
    
    // Handle gradient themes
    if (theme.gradient) {
      const gradientSvg = this.createGradientSVG(width, height, theme.gradient);
      baseImage = await sharp(Buffer.from(gradientSvg))
        .png()
        .toBuffer();
      contentBgColor = 'transparent';
    } else {
      contentBgColor = this.lightenColor(themeInfo.recommendedBg || theme.colors.background, 0.15);
      baseImage = await sharp({
        create: {
          width,
          height,
          channels: 4,
          background: this.parseBackgroundColor(contentBgColor)
        }
      }).png().toBuffer();
    }

    if (!theme.backgroundImage) {
      // Create buffers for content and branding sections
      const contentHeight = height - (theme.layout.branding.height || 150);
      const brandingHeight = theme.layout.branding.height || 150;
      const paddingTop = theme.layout.margins?.top || theme.layout.padding || 60;

      // Create content area buffer
      const contentBuffer = await sharp({
        create: {
          width,
          height: contentHeight,
          channels: 4,
          background: theme.gradient ? { r: 0, g: 0, b: 0, alpha: 0 } : this.parseBackgroundColor(contentBgColor)
        }
      })
      .png()
      .toBuffer();

      // Create branding area buffer
      const brandingBuffer = await sharp({
        create: {
          width,
          height: brandingHeight,
          channels: 4,
          background: this.parseBackgroundColor(theme.colors.branding.background)
        }
      })
      .png()
      .toBuffer();

      // Add texture if specified
      if (theme.effects?.backgroundTexture) {
        const texture = await this.generateTextureNoise('filmGrain', width, height);
        baseImage = await sharp(baseImage)
          .composite(texture.composite.map(comp => ({
            ...comp,
            left: 0,
            top: 0
          })))
          .modulate(texture.modulate)
          .toBuffer();
      }

      // Combine all layers
      const compositeOperations = [
        {
          input: contentBuffer,
          left: 0,
          top: paddingTop,
          blend: theme.gradient ? 'over' : 'multiply'
        },
        {
          input: brandingBuffer,
          left: 0,
          top: height - brandingHeight,
          blend: 'over'
        }
      ];

      return await sharp(baseImage)
        .composite(compositeOperations)
        .modulate({
          brightness: 1.02,
          saturation: theme.gradient ? 1.1 : 1.05,
          lightness: 1.01
        })
        .toBuffer();
    }

    // Handle background image case
    try {
      const texturePath = path.join(process.cwd(), 'public/backgrounds', theme.backgroundImage);
      const textureBuffer = await sharp(texturePath)
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

      return await sharp(baseImage)
        .composite([{
          input: textureBuffer,
          left: 0,
          top: 0,
          blend: 'multiply',
          opacity: 0.95
        }])
        .modulate({
          brightness: 1.05,
          saturation: 1.1
        })
        .toBuffer();

    } catch (textureError) {
      console.warn(`Background image not found: ${theme.backgroundImage}. Using base image.`);
      
      const texture = await this.generateTextureNoise('denim', width, height);
      return await sharp(baseImage)
        .composite(texture.composite.map(comp => ({
          ...comp,
          left: 0,
          top: 0
        })))
        .modulate(texture.modulate)
        .toBuffer();
    }
  } catch (error) {
    console.error("Error creating textured background:", error.message);
    throw error;
  }
}

// Update createGradientSVG for better gradient handling
createGradientSVG(width, height, gradient) {
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
// Function to lighten color
lightenColor(hexColor, factor) {
  if (!hexColor) return '#FFFFFF';
  try {
    const rgb = this.hexToRgb(hexColor);
    if (!rgb) return hexColor;
    return `#${[rgb.r, rgb.g, rgb.b]
      .map(c => Math.floor(c + (255 - c) * factor)) // This makes it lighter
      .map(c => Math.min(255, c)) // Ensure we don't exceed 255
      .map(c => c.toString(16).padStart(2, '0'))
      .join('')}`;
  } catch (error) {
    console.warn('Error lightening color:', error);
    return hexColor;
  }
}

// Add this method to ensure theme has required properties
validateTheme(theme) {
  if (!theme) {
    return this.createTheme('#FFFFFF', '#000000');
  }

  // Ensure layout exists
  if (!theme.layout) {
    theme.layout = DEFAULT_LAYOUT;
  }

  // Ensure all required layout properties exist
  theme.layout = {
    ...DEFAULT_LAYOUT,
    ...theme.layout,
    branding: {
      ...DEFAULT_LAYOUT.branding,
      ...(theme.layout?.branding || {})
    },
    margins: {
      ...DEFAULT_LAYOUT.margins,
      ...(theme.layout?.margins || {})
    }
  };

  return theme;
}

// Function to create gradient colors
createGradientColors(baseColor, steps = 3) {
  try {
    const rgb = this.hexToRgb(baseColor);
    if (!rgb) return [baseColor];
    
    const gradientColors = [];
    for (let i = 0; i < steps; i++) {
      const factor = 0.1 + (i * 0.15); // Adjust these values for different gradient effects
      const lightenedColor = this.lightenColor(baseColor, factor);
      gradientColors.push(lightenedColor);
    }
    
    return gradientColors;
  } catch (error) {
    console.warn('Error creating gradient:', error);
    return [baseColor];
  }
}
darkenColor(hexColor, factor) {
  if (!hexColor) return '#FFFFFF';
  try {
    const rgb = this.hexToRgb(hexColor);
    if (!rgb) return hexColor;
    return `#${[rgb.r, rgb.g, rgb.b]
      .map(c => Math.floor(c * factor))
      .map(c => c.toString(16).padStart(2, '0'))
      .join('')}`;
  } catch (error) {
    console.warn('Error darkening color:', error);
    return hexColor;
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
      fill="${this.darkenColor(theme.colors.text.color, 0.8)}"
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
    fill="${this.darkenColor(theme.colors.title.color, 0.8)}"
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

// Enhanced color darkening function
darkenColor(hexColor, factor) {
  if (!hexColor) return '#000000';
  try {
    const rgb = this.hexToRgb(hexColor);
    if (!rgb) return hexColor;
    
    return `#${[rgb.r, rgb.g, rgb.b]
      .map(c => Math.floor(c * factor)) // Multiply by factor to darken
      .map(c => Math.min(255, Math.max(0, c))) // Ensure value stays between 0-255
      .map(c => c.toString(16).padStart(2, '0')) // Convert to hex
      .join('')}`;
  } catch (error) {
    console.warn('Error darkening color:', error);
    return hexColor;
  }
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
