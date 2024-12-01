// themeSetup.js

import ColorHelper from './colorHelper';
import { createThemeColors, themeConfigs } from './themeConfig';
import { defaultFonts, defaultLayout } from './themeConstants';
import { DEFAULT_LAYOUT ,themeKeyMapping } from './themeKeyMapping';

class ThemeSetup {
    constructor() {
        this.themes = {};
        this.setupThemes();
      }
    

      setupThemes() {
        if (!themeConfigs || typeof themeConfigs !== 'object') {
            console.warn('No theme configurations found');
            this.themes = {
                default: this.createTheme('#FFFFFF', '#000000')
            };
            return;
        }

        // Initialize themes object with mode categories
        this.themes = {
            backgroundImage: {},
            solidColor: {},
            gradient: {}
        };

        // Process each theme mode
        Object.entries(themeConfigs).forEach(([mode, themesByMode]) => {
            Object.entries(themesByMode).forEach(([themeName, config]) => {
                const [backgroundColor, textColor] = config.baseColors;
                const OGtextColor = config.colors?.text?.color;
                const baseTheme = this.createTheme(backgroundColor, OGtextColor);
                
                const colors = createThemeColors(config.colors?.text?.color || OGtextColor || textColor);
                const titleColors = createThemeColors(config.colors?.title?.color || OGtextColor || textColor);
                const brandColors = createThemeColors(config.textColors?.brand || textColor);
            
                this.themes[mode][themeName] = {
                    ...baseTheme,
                    name: config.name,
                    backgroundImage: config.backgroundImage,
                    gradient: config.gradient,
                    fonts: defaultFonts,
                    colors: {
                        title: titleColors.title,
                        text: colors.text,
                        branding: {
                            background: config.brandingBg || backgroundColor,
                            ...brandColors.branding
                        }
                    },
                    effects: config.effects || baseTheme.effects,
                    layout: config.gradient ? defaultLayout : baseTheme.layout
                };
            });
        });
    }



    createTheme(backgroundColor, textColor, secondaryColor = null, backgroundImage = null) {
      return {
        colors: {
          background: backgroundColor,
          // Title customization
          title: {
            color: ColorHelper.adjustColor(textColor, 1.2),
            hoverColor: ColorHelper.adjustColor(textColor, 1.4),
          },
          // Main text customization
          text: {
            color: textColor,
            hoverColor: ColorHelper.adjustColor(textColor, 1.1),
          },
          // Branding section customization
          branding: {
            background: backgroundColor, // Separate background for branding section
            name: {
              color: textColor,
              hoverColor: ColorHelper.adjustColor(textColor, 1.2),
            },
            web: {
              color: secondaryColor || textColor,
              hoverColor: ColorHelper.adjustColor(secondaryColor || textColor, 1.1),
            },
            phone: {
              color: secondaryColor || textColor,
              hoverColor: ColorHelper.adjustColor(secondaryColor || textColor, 1.1),
            },
            social: {
              color: secondaryColor || textColor,
              hoverColor: ColorHelper.adjustColor(secondaryColor || textColor, 1.1),
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

    getTheme(themeName, themeMode = 'backgroundImage') {
      // First try to get theme by mode and name
      const themesByMode = this.themes[themeMode];
      if (themesByMode && themesByMode[themeName]) {
          return themesByMode[themeName];
      }
      // Fallback to default theme in backgroundImage mode
      return this.themes.backgroundImage.default || this.createTheme('#FFFFFF', '#000000');
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

export default new ThemeSetup();