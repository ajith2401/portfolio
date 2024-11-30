// themeSetup.js
import ColorHelper from './colorHelper';
import { DEFAULT_LAYOUT ,themeKeyMapping } from './themeKeyMapping';

class ThemeSetup {
    constructor() {
        this.themes = {};
        this.setupThemes();
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

  getTheme(themeName) {
    return this.themes[themeName] || this.themes.default;
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