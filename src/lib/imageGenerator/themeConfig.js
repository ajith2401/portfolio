import ColorHelper from "./colorHelper";
import { defaultFonts,defaultLayout} from "./themeConstants";

export const themeConfigs = {
            // Light Themes
            default: {
              baseColors: ['#FFFFFF', '#000000'],
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
              baseColors: ['#FFE6E6', '#8B0000'],
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
              baseColors: ['#E6F3FF', '#003366'],
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
              baseColors: ['#E6FFE6', '#006400'],
              name: 'green',
              backgroundImage: 'greenAlt2.png',
              fonts: defaultFonts,
              colors: {
                title: { color: '#FFFFFF', hoverColor: '#004d00' },
                text: { color: '#FFFFFF', hoverColor: '#004d00' },
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
              baseColors: ['#1A1A1A', '#FFFFFF'],
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
              baseColors: ['#D3EFF4', '#05445E'],
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
              baseColors: ['#D3EFF4', '#274472'],
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
            baseColors: ['#E9DDD4', '#8B4513'],
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
            baseColors: ['#E1F5FE', '#01579B'],
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
            baseColors: ['#E0F7FA', '#006064'],
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
            baseColors: ['#FFF8E1', '#4A148C'],
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
            baseColors: ['#1A237E', '#FFFFFF'],
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
            baseColors: ['#F3ECDA', '#94553D'],
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
            baseColors: ['#FDFDFD', '#050606'],
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
            baseColors: ['#F6FFE5', '#4A7212'],
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
            baseColors: ['#EAF4F4', '#4B7A7A'],
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
            baseColors: ['#F9FFF2', '#47565E'],
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
            baseColors: ['#F4F2F3', '#656256'],
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
            baseColors: ['#F4F2F3', '#656256'],
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
            baseColors: ['#1A1A1A', '#FFFFFF'],
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
            baseColors: ['#FFFFFF', '#333333'],
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
            baseColors: ['#FFF5F5', '#8B4513'],
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
            baseColors: ['#F5F5F5', '#4A4A4A'],
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
            baseColors: ['#E8F5E9', '#2E7D32'],
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
            baseColors: ['#E8F5E9', '#1B5E20'],
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
            baseColors: ['#E8F5E9', '#1B5E20'],
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
            baseColors: ['#E8F5E9', '#1B5E20'],
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
            baseColors: ['#F3E5F5', '#4A148C'],
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
            baseColors: ['#EFEBE9', '#3E2723'],
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
            baseColors: ['#212121', '#FFFFFF'],
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
            baseColors: ['#EFEBE9', '#3E2723'],
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
            baseColors: ['#FFEBEE', '#B71C1C'],
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
            baseColors: ['#FFEBEE', '#B71C1C'],
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
            baseColors: ['#F3E5F5', '#4A148C'],
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
            baseColors: ['#E3F2FD', '#0D47A1'],
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
            baseColors: ['#E8E0D5', '#2B1810'],
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
            baseColors: ['#FFF7E6', '#8B4513'],
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
            baseColors: ['#FFFFFF', '#1A237E'],
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
            baseColors: ['#000000', '#FFFFFF'],
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
            baseColors: ['#E3F2FD', '#1565C0'],
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

          // solid colurs without image
      
          bluePastelHarmony: {
            baseColors: ['#FBEAEB', '#2F3C7E'],
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
            baseColors: ['#FEE715', '#101820'],
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
            baseColors: ['#F9E795', '#F96167'],
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
            baseColors: ['#FCF6F5', '#990011'],
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
            baseColors: ['#FFFFFF', '#8AAAE5'],
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
            baseColors: ['#CADCFC', '#00246B'],
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
            baseColors: ['#EA738D', '#89ABE3'],
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
            baseColors: ['#97BC62', '#2C5F2D'],
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
        baseColors: ['#7A2048', '#1E2761'],
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
            baseColors: ['#A7BEAE', '#B85042'],
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
            baseColors: ['#F98866', '#A1BE95'],
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
            baseColors: ['#D3C5E5', '#735DA5'],
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
            baseColors: ['#C4DFE6', '#66A5AD'],
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
            baseColors: ['#6AB187', '#20948B'],
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
            baseColors: ['#FB6542', '#FFBB00'],
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
            baseColors: ['#CEE6F2', '#962E2A'],
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
            baseColors: ['#D09683', '#330000'],
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
            baseColors: ['#F1F1F2', '#1995AD'],
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
            baseColors: ['#F1D3B2', '#46211A'],
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
            baseColors: ['#90AFC5', '#2A3132'],
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
            baseColors: ['#EDF4F2', '#31473A'],
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
            baseColors: ['#FA6775', '#F52549'],
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
            baseColors: ['#CEE6F2', '#763626'],
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
            baseColors: ['#66A5AD', '#07575B'],
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
            baseColors: ['#FFD460', '#F07B3F'],
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
            baseColors: ['#E8DDB5', '#C1B098'],
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

          // 1. Tranquil Teal
            tranquilTeal: {
                baseColors: ['#008080', '#FFFFFF'],
                name: 'tranquilTeal',
                colors: {
                    title: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
                    text: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
                    branding: {
                        background: '#E0F7FA',
                        name: { color: '#008080', hoverColor: '#004D4D' },
                        web: { color: '#008080', hoverColor: '#004D4D' },
                        phone: { color: '#008080', hoverColor: '#004D4D' },
                        social: { color: '#008080', hoverColor: '#004D4D' }
                    }
                },
                layout: defaultLayout,
                fonts: defaultFonts,
                effects: {
                    textShadow: true,
                    backgroundTexture: true
                }
            },

            // 2. Amber Glow
            amberGlow: {
                baseColors: ['#FFBF00', '#2A2A2A'],
                name: 'amberGlow',
                colors: {
                    title: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
                    text: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
                    branding: {
                        background: '#FFF8E1',
                        name: { color: '#FFBF00', hoverColor: '#E6AC00' },
                        web: { color: '#FFBF00', hoverColor: '#E6AC00' },
                        phone: { color: '#FFBF00', hoverColor: '#E6AC00' },
                        social: { color: '#FFBF00', hoverColor: '#E6AC00' }
                    }
                },
                layout: defaultLayout,
                fonts: defaultFonts,
                effects: {
                    textShadow: true,
                    backgroundTexture: true
                }
            },

            // 3. Sapphire Night
            sapphireNight: {
                baseColors: ['#0F52BA', '#FFFFFF'],
                name: 'sapphireNight',
                colors: {
                    title: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
                    text: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
                    branding: {
                        background: '#E3F2FD',
                        name: { color: '#0F52BA', hoverColor: '#0A3A7A' },
                        web: { color: '#0F52BA', hoverColor: '#0A3A7A' },
                        phone: { color: '#0F52BA', hoverColor: '#0A3A7A' },
                        social: { color: '#0F52BA', hoverColor: '#0A3A7A' }
                    }
                },
                layout: defaultLayout,
                fonts: defaultFonts,
                effects: {
                    textShadow: true,
                    backgroundTexture: true
                }
            },

            // 4. Coral Reef
            coralReef: {
                baseColors: ['#FF7F50', '#2A2A2A'],
                name: 'coralReef',
                colors: {
                    title: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
                    text: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
                    branding: {
                        background: '#FFF3E0',
                        name: { color: '#FF7F50', hoverColor: '#E66A3F' },
                        web: { color: '#FF7F50', hoverColor: '#E66A3F' },
                        phone: { color: '#FF7F50', hoverColor: '#E66A3F' },
                        social: { color: '#FF7F50', hoverColor: '#E66A3F' }
                    }
                },
                layout: defaultLayout,
                fonts: defaultFonts,
                effects: {
                    textShadow: true,
                    backgroundTexture: true
                }
            },

            // 5. Plum Essence
            plumEssence: {
                baseColors: ['#8E4585', '#FFFFFF'],
                name: 'plumEssence',
                colors: {
                    title: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
                    text: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
                    branding: {
                        background: '#F3E5F5',
                        name: { color: '#8E4585', hoverColor: '#6A2E61' },
                        web: { color: '#8E4585', hoverColor: '#6A2E61' },
                        phone: { color: '#8E4585', hoverColor: '#6A2E61' },
                        social: { color: '#8E4585', hoverColor: '#6A2E61' }
                    }
                },
                layout: defaultLayout,
                fonts: defaultFonts,
                effects: {
                    textShadow: true,
                    backgroundTexture: true
                }
            },

            // 6. Forest Canopy
            forestCanopy: {
                baseColors: ['#228B22', '#FFFFFF'],
                name: 'forestCanopy',
                colors: {
                    title: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
                    text: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
                    branding: {
                        background: '#E8F5E9',
                        name: { color: '#228B22', hoverColor: '#1A661A' },
                        web: { color: '#228B22', hoverColor: '#1A661A' },
                        phone: { color: '#228B22', hoverColor: '#1A661A' },
                        social: { color: '#228B22', hoverColor: '#1A661A' }
                    }
                },
                layout: defaultLayout,
                fonts: defaultFonts,
                effects: {
                    textShadow: true,
                    backgroundTexture: true
                }
            },

            // 7. Marigold Sunshine
            marigoldSunshine: {
                baseColors: ['#FFD700', '#2A2A2A'],
                name: 'marigoldSunshine',
                colors: {
                    title: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
                    text: { color: '#2A2A2A', hoverColor: '#1A1A1A' },
                    branding: {
                        background: '#FFF9C4',
                        name: { color: '#FFD700', hoverColor: '#E6C200' },
                        web: { color: '#FFD700', hoverColor: '#E6C200' },
                        phone: { color: '#FFD700', hoverColor: '#E6C200' },
                        social: { color: '#FFD700', hoverColor: '#E6C200' }
                    }
                }
            },
    
            // 8. Midnight Violet
            midnightViolet: {
                baseColors: ['#4B0082', '#FFFFFF'],
                name: 'midnightViolet',
                colors: {
                    title: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
                    text: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
                    branding: {
                        background: '#EDE7F6',
                        name: { color: '#4B0082', hoverColor: '#330061' },
                        web: { color: '#4B0082', hoverColor: '#330061' },
                        phone: { color: '#4B0082', hoverColor: '#330061' },
                        social: { color: '#4B0082', hoverColor: '#330061' }
                    }
                },
                layout: defaultLayout,
                fonts: defaultFonts,
                effects: {
                    textShadow: true,
                    backgroundTexture: true
                }
            },
            
            // 9. Arctic Ice
            arcticIce: {
                baseColors: ['#00CED1', '#FFFFFF'],
                name: 'arcticIce',
                colors: {
                    title: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
                    text: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
                    branding: {
                        background: '#E0F7FA',
                        name: { color: '#00CED1', hoverColor: '#008B8B' },
                        web: { color: '#00CED1', hoverColor: '#008B8B' },
                        phone: { color: '#00CED1', hoverColor: '#008B8B' },
                        social: { color: '#00CED1', hoverColor: '#008B8B' }
                    }
                },
                layout: defaultLayout,
                fonts: defaultFonts,
                effects: {
                    textShadow: true,
                    backgroundTexture: true
                }
            },
            
            // 10. Rosewood Charm
            rosewoodCharm: {
                baseColors: ['#993333', '#FFFFFF'],
                name: 'rosewoodCharm',
                colors: {
                    title: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
                    text: { color: '#FFFFFF', hoverColor: '#F5F5F5' },
                    branding: {
                        background: '#FFEBEE',
                        name: { color: '#993333', hoverColor: '#661D1D' },
                        web: { color: '#993333', hoverColor: '#661D1D' },
                        phone: { color: '#993333', hoverColor: '#661D1D' },
                        social: { color: '#993333', hoverColor: '#661D1D' }
                    }
                },
                layout: defaultLayout,
                fonts: defaultFonts,
                effects: {
                    textShadow: true,
                    backgroundTexture: true
                }
            },
            
 

      
          moonlitNight: {
            baseColors: ['#2C3E50', '#E0E0E0'],
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
            baseColors: ['#A8E6CE', '#3D6657'],
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
        baseColors: ['#F09819', '#FFFFFF'],
        name: 'sunsetGradient',
        gradient: {
          type: 'linear',
          angle: 45,
          colors: ['#FF512F', '#F09819', '#DD2476']
        },
        layout: defaultLayout,
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
        baseColors: ['#6dd5ed', '#FFFFFF'],
        name: 'oceanGradient',
        gradient: {
          type: 'linear',
          angle: 135,
          colors: ['#2193b0', '#6dd5ed']
        },
        layout: defaultLayout,
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
        baseColors: ['#4A00E0', '#FFFFFF'],
        name: 'purpleDream',
        gradient: {
          type: 'linear',
          angle: 120,
          colors: ['#8E2DE2', '#4A00E0']
        },
        layout: defaultLayout,
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
        baseColors: ['#0F2027', '#FFFFFF'],
        name: 'midnightOcean',
        gradient: {
          type: 'linear',
          angle: 135,
          colors: ['#0F2027', '#203A43', '#2C5364']
        },
        layout: defaultLayout,
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
        baseColors: ['#ff6e7f', '#FFFFFF'],
        name: 'roseMist',
        gradient: {
          type: 'linear',
          angle: 45,
          colors: ['#ff6e7f', '#bfe9ff']
        },
        layout: defaultLayout,
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
        baseColors: ['#43cea2', '#FFFFFF'],
        name: 'emeraldDream',
        gradient: {
          type: 'linear',
          angle: 150,
          colors: ['#43cea2', '#185a9d']
        },
        layout: defaultLayout,
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
        baseColors: ['#f7971e', '#FFFFFF'],
        name: 'goldenHour',
        gradient: {
          type: 'linear',
          angle: 60,
          colors: ['#f7971e', '#ffd200']
        },
        layout: defaultLayout,
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
        baseColors: ['#834d9b', '#FFFFFF'],
        name: 'lavenderMist',
        gradient: {
          type: 'linear',
          angle: 165,
          colors: ['#834d9b', '#d04ed6']
        },
        layout: defaultLayout,
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
        baseColors: ['#ff00cc', '#FFFFFF'],
        name: 'cosmicFusion',
        gradient: {
          type: 'linear',
          angle: 130,
          colors: ['#ff00cc', '#333399']
        },
        layout: defaultLayout,
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
        baseColors: ['#4ECDC4', '#FFFFFF'],
        name: 'arcticAurora',
        gradient: {
          type: 'linear',
          angle: 145,
          colors: ['#4ECDC4', '#556270']
        },
        layout: defaultLayout,
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
        baseColors: ['#FBD3E9', '#000000'],
        name: 'cherryBlossom',
        gradient: {
          type: 'linear',
          angle: 75,
          colors: ['#FBD3E9', '#BB377D']
        },
        layout: defaultLayout,
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
        baseColors: ['#FFB75E', '#FFFFFF'],
        name: 'desertSunrise',
        gradient: {
          type: 'linear',
          angle: 90,
          colors: ['#FFB75E', '#ED8F03']
        },
        layout: defaultLayout,
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
        baseColors: ['#134E5E', '#FFFFFF'],
        name: 'forestDepths',
        gradient: {
          type: 'linear',
          angle: 155,
          colors: ['#134E5E', '#71B280']
        },
        layout: defaultLayout,
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
        baseColors: ['#2C3E50', '#FFFFFF'],
        name: 'twilightHaze',
        gradient: {
          type: 'linear',
          angle: 140,
          colors: ['#2C3E50', '#3498DB']
        },
        layout: defaultLayout,
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
        baseColors: ['#FFE000', '#FFFFFF'],
        name: 'sunsetSerenade',
        gradient: {
          type: 'linear',
          angle: 65,
          colors: ['#FFE000', '#799F0C']
        },
        layout: defaultLayout,
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
        baseColors: ['#FF512F', '#FFFFFF'],
        name: 'mysticDawn',
        gradient: {
          type: 'linear',
          angle: 125,
          colors: ['#FF512F', '#F09819']
        },
        layout: defaultLayout,
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
        baseColors: ['#00C9FF', '#FFFFFF'],
        name: 'crystalline',
        gradient: {
          type: 'linear',
          angle: 160,
          colors: ['#00C9FF', '#92FE9D']
        },
        layout: defaultLayout,
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
        baseColors: ['#0F2027', '#FFFFFF'],
        name: 'moonlightSonata',
        gradient: {
          type: 'linear',
          angle: 145,
          colors: ['#0F2027', '#2C5364', '#203A43']
        },
        layout: defaultLayout,
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
        baseColors: ['#CC2B5E', '#FFFFFF'],
        name: 'plumSunset',
        gradient: {
          type: 'linear',
          angle: 135,
          colors: ['#CC2B5E', '#753A88']
        },
        layout: defaultLayout,
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
        baseColors: ['#00B09B', '#FFFFFF'],
        name: 'mintLeaf',
        gradient: {
          type: 'linear',
          angle: 120,
          colors: ['#00B09B', '#96C93D']
        },
        layout: defaultLayout,
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
        baseColors: ['#2980B9', '#FFFFFF'],
        name: 'polarLight',
        gradient: {
          type: 'linear',
          angle: 155,
          colors: ['#2980B9', '#6DD5FA', '#FFFFFF']
        },
        layout: defaultLayout,
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
        baseColors: ['#E8CBC0', '#000000'],
        name: 'roseQuartz',
        gradient: {
          type: 'linear',
          angle: 145,
          colors: ['#E8CBC0', '#636FA4']
        },
        layout: defaultLayout,
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
        baseColors: ['#1A2980', '#FFFFFF'],
        name: 'celestialNight',
        gradient: {
          type: 'linear',
          angle: 165,
          colors: ['#1A2980', '#26D0CE']
        },
        layout: defaultLayout,
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
        baseColors: ['#FF057C', '#FFFFFF'],
        name: 'retroWave',
        gradient: {
          type: 'linear',
          angle: 30,
          colors: ['#FF057C', '#7C64D5', '#4CC3FF']
        },
        layout: defaultLayout,
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
        baseColors: ['#FFB88C', '#000000'],
        name: 'pastelSunrise',
        gradient: {
          type: 'linear',
          angle: 45,
          colors: ['#FFB88C', '#DE6262']
        },
        layout: defaultLayout,
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
        baseColors: ['#1A2980', '#FFFFFF'],
        name: 'aquaMarine',
        gradient: {
          type: 'linear',
          angle: 60,
          colors: ['#1A2980', '#26D0CE']
        },
        layout: defaultLayout,
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
        baseColors: ['#2C3E50', '#FFFFFF'],
        name: 'soulfulNight',
        gradient: {
          type: 'linear',
          angle: 135,
          colors: ['#2C3E50', '#3498db', '#2980b9']
        },
        layout: defaultLayout,
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
        baseColors: ['#614385', '#FFFFFF'],
        name: 'innerPeace',
        gradient: {
          type: 'linear',
          angle: 145,
          colors: ['#614385', '#516395']
        },
        layout: defaultLayout,
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
        baseColors: ['#1a2a6c', '#FFFFFF'],
        name: 'serenityFlow',
        gradient: {
          type: 'linear',
          angle: 120,
          colors: ['#1a2a6c', '#b21f1f', '#fdbb2d']
        },
        layout: defaultLayout,
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
        baseColors: ['#355C7D', '#FFFFFF'],
        name: 'tranquilDawn',
        gradient: {
          type: 'linear',
          angle: 150,
          colors: ['#355C7D', '#6C5B7B', '#C06C84']
        },
        layout: defaultLayout,
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
        baseColors: ['#076585', '#FFFFFF'],
        name: 'mindfulMist',
        gradient: {
          type: 'linear',
          angle: 165,
          colors: ['#076585', '#fff']
        },
        layout: defaultLayout,
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
            baseColors: ['#232526', '#FFFFFF'],
            name: 'mysticTwilight',
            gradient: {
            type: 'linear',
            angle: 145,
            colors: ['#232526', '#414345', '#232526']
            },
            layout: defaultLayout,
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
            baseColors: ['#4B79A1', '#FFFFFF'],
            name: 'silentRain',
            gradient: {
            type: 'linear',
            angle: 165,
            colors: ['#4B79A1', '#283E51']
            },
            layout: defaultLayout,
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
            baseColors: ['#7F7FD5', '#FFFFFF'],
            name: 'etherealDream',
            gradient: {
            type: 'linear',
            angle: 130,
            colors: ['#7F7FD5', '#86A8E7', '#91EAE4']
            },
            layout: defaultLayout,
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
            baseColors: ['#141E30', '#FFFFFF'],
            name: 'meditativeSpace',
            gradient: {
            type: 'linear',
            angle: 155,
            colors: ['#141E30', '#243B55']
            },
            layout: defaultLayout,
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
            baseColors: ['#373B44', '#FFFFFF'],
            name: 'gentleDusk',
            gradient: {
            type: 'linear',
            angle: 145,
            colors: ['#373B44', '#4286f4']
            },
            layout: defaultLayout,
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
            baseColors: ['#CAC531', '#000000'],
            name: 'peacefulAutumn',
            gradient: {
            type: 'linear',
            angle: 135,
            colors: ['#CAC531', '#F3F9A7']
            },
            layout: defaultLayout,
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
            baseColors: ['#0F2027', '#FFFFFF'],
            name: 'moonlessNight',
            gradient: {
            type: 'linear',
            angle: 150,
            colors: ['#0F2027', '#203A43', '#2C5364']
            },
            layout: defaultLayout,
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
            baseColors: ['#1e3c72', '#FFFFFF'],
            name: 'soulfulSunset',
            gradient: {
            type: 'linear',
            angle: 120,
            colors: ['#1e3c72', '#2a5298', '#7F7FD5']
            },
            layout: defaultLayout,
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
            baseColors: ['#3494E6', '#FFFFFF'],
            name: 'innerCalm',
            gradient: {
            type: 'linear',
            angle: 145,
            colors: ['#3494E6', '#EC6EAD']
            },
            layout: defaultLayout,
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

        // Additional soul-touching gradient themes for poetic expression

        morningSerenity: {
            baseColors: ['#A8BFFF', '#FFFFFF'],
            name: 'morningSerenity',
            gradient: {
                type: 'linear',
                angle: 135,
                colors: ['#A8BFFF', '#884D80', '#AF5C97']
            },
            layout: defaultLayout,
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

        riverDream: {
            baseColors: ['#43C6AC', '#FFFFFF'],
            name: 'riverDream',
            gradient: {
                type: 'linear',
                angle: 165,
                colors: ['#43C6AC', '#191654', '#43C6AC']
            },
            layout: defaultLayout,
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

        templewWisdom: {
            baseColors: ['#FF8008', '#FFFFFF'],
            name: 'templeWisdom',
            gradient: {
                type: 'linear',
                angle: 145,
                colors: ['#FF8008', '#FFC837', '#E8CBC0']
            },
            layout: defaultLayout,
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

        pearlMist: {
            baseColors: ['#E6DFD9', '#000000'],
            name: 'pearlMist',
            gradient: {
                type: 'linear',
                angle: 150,
                colors: ['#E6DFD9', '#CDC6C3', '#B7ACA6']
            },
            layout: defaultLayout,
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

        kovilSanctuary: {
            baseColors: ['#642B73', '#FFFFFF'],
            name: 'kovilSanctuary',
            gradient: {
                type: 'linear',
                angle: 130,
                colors: ['#642B73', '#C6426E', '#642B73']
            },
            layout: defaultLayout,
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

        oceanWhisper: {
            baseColors: ['#11998e', '#FFFFFF'],
            name: 'oceanWhisper',
            gradient: {
                type: 'linear',
                angle: 155,
                colors: ['#11998e', '#38ef7d', '#11998e']
            },
            layout: defaultLayout,
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

        silkDream: {
            baseColors: ['#EB5757', '#FFFFFF'],
            name: 'silkDream',
            gradient: {
                type: 'linear',
                angle: 145,
                colors: ['#EB5757', '#000000', '#FFFFFF']
            },
            layout: defaultLayout,
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

        tamaraiBloom: {
            baseColors: ['#FF5F6D', '#FFFFFF'],
            name: 'tamaraiBloom',
            gradient: {
                type: 'linear',
                angle: 125,
                colors: ['#FF5F6D', '#FFC371', '#FF5F6D']
            },
            layout: defaultLayout,
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

        moonlightRaga: {
            baseColors: ['#0F0C29', '#FFFFFF'],
            name: 'moonlightRaga',
            gradient: {
                type: 'linear',
                angle: 165,
                colors: ['#0F0C29', '#302B63', '#24243E']
            },
            layout: defaultLayout,
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

        velvetHeaven: {
            baseColors: ['#654ea3', '#FFFFFF'],
            name: 'velvetHeaven',
            gradient: {
                type: 'linear',
                angle: 140,
                colors: ['#654ea3', '#eaafc8', '#654ea3']
            },
            layout: defaultLayout,
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

        mistyMemories: {
            baseColors: ['#4A569D', '#FFFFFF'],
            name: 'mistyMemories',
            gradient: {
                type: 'linear',
                angle: 135,
                colors: ['#4A569D', '#DC2424', '#4A569D']
            },
            layout: defaultLayout,
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

        blissfulDawn: {
            baseColors: ['#FF9966', '#FFFFFF'],
            name: 'blissfulDawn',
            gradient: {
                type: 'linear',
                angle: 145,
                colors: ['#FF9966', '#FF5E62', '#FF9966']
            },
            layout: defaultLayout,
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

        // Romantic & Emotional Moods
        heartSong: {
            baseColors: ['#ee9ca7', '#FFFFFF'],
            name: 'heartSong',
            gradient: {
                type: 'linear',
                angle: 165,
                colors: ['#ee9ca7', '#ffdde1', '#ee9ca7']
            },
            layout: defaultLayout,
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

        // Deep & Philosophical Moods
        wisdomPath: {
            baseColors: ['#2C3E50', '#FFFFFF'],
            name: 'wisdomPath',
            gradient: {
                type: 'linear',
                angle: 150,
                colors: ['#2C3E50', '#3498db', '#2980b9']
            },
            layout: defaultLayout,
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
        // 1. Peaceful and Serene (Inspired by temple gopurams at sunrise)
        dawnHarmony: {
            baseColors: ['#FFC371', '#FFFFFF'],
            name: 'dawnHarmony',
            gradient: {
                type: 'linear',
                angle: 135,
                colors: ['#FFC371', '#FF5F6D']
            },
            layout: defaultLayout,
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

        // 2. Romantic and Passionate (Inspired by the warm tones of a Tamil love story)
        velvetDesire: {
            baseColors: ['#D72638', '#FFFFFF'],
            name: 'velvetDesire',
            gradient: {
                type: 'linear',
                angle: 150,
                colors: ['#D72638', '#F46036', '#2E294E']
            },
            layout: defaultLayout,
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

        // 3. Philosophical and Reflective (Inspired by stone carvings and inscriptions)
        graniteWisdom: {
            baseColors: ['#2A2A2A', '#FFFFFF'],
            name: 'graniteWisdom',
            gradient: {
                type: 'linear',
                angle: 165,
                colors: ['#2A2A2A', '#606060', '#A8A8A8']
            },
            layout: defaultLayout,
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

        // 4. Energetic and Vibrant (Inspired by Tamil Nadu’s festivals and folk art)
        festiveFlare: {
            baseColors: ['#FF9A00', '#FFFFFF'],
            name: 'festiveFlare',
            gradient: {
                type: 'linear',
                angle: 120,
                colors: ['#FF9A00', '#FF3D00', '#F79824']
            },
            layout: defaultLayout,
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

        // 5. Nature and Tranquility (Inspired by Tamil Nadu’s lush green fields and rivers)
        emeraldSerenity: {
            baseColors: ['#2A7F62', '#FFFFFF'],
            name: 'emeraldSerenity',
            gradient: {
                type: 'linear',
                angle: 140,
                colors: ['#2A7F62', '#61C0BF', '#A7E9AF']
            },
            layout: defaultLayout,
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


        // Light and airy gradient themes with excellent readability

        morningPastel: {
            baseColors: ['#f6d5f7', '#2A2A2A'],
            name: 'morningPastel',
            gradient: {
                type: 'linear',
                angle: 135,
                colors: ['#f6d5f7', '#fbe9d7', '#f3e7e9']
            },
            layout: defaultLayout,
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

        gentleLavender: {
            baseColors: ['#E3E7EF', '#2A2A2A'],
            name: 'gentleLavender',
            gradient: {
                type: 'linear',
                angle: 145,
                colors: ['#E3E7EF', '#FED6E3', '#E3E7EF']
            },
            layout: defaultLayout,
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

        freshMint: {
            baseColors: ['#E0F4F1', '#2A2A2A'],
            name: 'freshMint',
            gradient: {
                type: 'linear',
                angle: 165,
                colors: ['#E0F4F1', '#F7FEFF', '#E0F4F1']
            },
            layout: defaultLayout,
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

        pinkClouds: {
            baseColors: ['#fee2e2', '#2A2A2A'],
            name: 'pinkClouds',
            gradient: {
                type: 'linear',
                angle: 140,
                colors: ['#fee2e2', '#fecaca', '#fee2e2']
            },
            layout: defaultLayout,
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

        softLemonCream: {
            baseColors: ['#fef9c3', '#2A2A2A'],
            name: 'softLemonCream',
            gradient: {
                type: 'linear',
                angle: 155,
                colors: ['#fef9c3', '#fef3c7', '#fef9c3']
            },
            layout: defaultLayout,
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

        skyBloom: {
            baseColors: ['#dbeafe', '#2A2A2A'],
            name: 'skyBloom',
            gradient: {
                type: 'linear',
                angle: 145,
                colors: ['#dbeafe', '#e0f2fe', '#dbeafe']
            },
            layout: defaultLayout,
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

        peachSorbet: {
            baseColors: ['#fed7aa', '#2A2A2A'],
            name: 'peachSorbet',
            gradient: {
                type: 'linear',
                angle: 150,
                colors: ['#fed7aa', '#fee2e2', '#fed7aa']
            },
            layout: defaultLayout,
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

        lilacBreeze: {
            baseColors: ['#e9d5ff', '#2A2A2A'],
            name: 'lilacBreeze',
            gradient: {
                type: 'linear',
                angle: 135,
                colors: ['#e9d5ff', '#f3e8ff', '#e9d5ff']
            },
            layout: defaultLayout,
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

        seaPearl: {
            baseColors: ['#cffafe', '#2A2A2A'],
            name: 'seaPearl',
            gradient: {
                type: 'linear',
                angle: 160,
                colors: ['#cffafe', '#e0f2fe', '#cffafe']
            },
            layout: defaultLayout,
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

        roseGarden: {
            baseColors: ['#fce7f3', '#2A2A2A'],
            name: 'roseGarden',
            gradient: {
                type: 'linear',
                angle: 145,
                colors: ['#fce7f3', '#fbcfe8', '#fce7f3']
            },
            layout: defaultLayout,
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

        // 1. Morning Bliss
        morningBliss: {
            baseColors: ['#FFFBCC', '#2A2A2A'],
            name: 'morningBliss',
            gradient: {
                type: 'linear',
                angle: 145,
                colors: ['#FFF8E1', '#FFD180']
            },
            layout: defaultLayout,
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

        // 2. Peach Harmony
        peachHarmony: {
            baseColors: ['#FFE3E3', '#2A2A2A'],
            name: 'peachHarmony',
            gradient: {
                type: 'linear',
                angle: 160,
                colors: ['#FFE3E3', '#FFB3B3']
            },
            layout: defaultLayout,
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

        // 3. Minty Fresh
        mintyFresh: {
            baseColors: ['#E6FFFA', '#2A2A2A'],
            name: 'mintyFresh',
            gradient: {
                type: 'linear',
                angle: 130,
                colors: ['#E6FFFA', '#B2F5EA']
            },
            layout: defaultLayout,
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

        // 4. Lavender Dream
        lavenderDream: {
            baseColors: ['#F3E8FF', '#2A2A2A'],
            name: 'lavenderDream',
            gradient: {
                type: 'linear',
                angle: 150,
                colors: ['#F3E8FF', '#D6BCFA']
            },
            layout: defaultLayout,
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

        // 5. Sky Whisper
        skyWhisper: {
            baseColors: ['#EBF8FF', '#2A2A2A'],
            name: 'skyWhisper',
            gradient: {
                type: 'linear',
                angle: 140,
                colors: ['#EBF8FF', '#90CDF4']
            },
            layout: defaultLayout,
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

        // 6. Cotton Candy
        cottonCandy: {
            baseColors: ['#FFFAF0', '#2A2A2A'],
            name: 'cottonCandy',
            gradient: {
                type: 'linear',
                angle: 160,
                colors: ['#FFD1DC', '#FF9CEE']
            },
            layout: defaultLayout,
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

        // 7. Soft Spring
        softSpring: {
            baseColors: ['#F0FFF4', '#2A2A2A'],
            name: 'softSpring',
            gradient: {
                type: 'linear',
                angle: 135,
                colors: ['#F0FFF4', '#C6F6D5']
            },
            layout: defaultLayout,
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

        // 8. Sunset Glow
        sunsetGlow: {
            baseColors: ['#FFFAE5', '#2A2A2A'],
            name: 'sunsetGlow',
            gradient: {
                type: 'linear',
                angle: 145,
                colors: ['#FFFAE5', '#FFDAC1']
            },
            layout: defaultLayout,
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

        // 9. Ocean Mist
        oceanMist: {
            baseColors: ['#F0F8FF', '#2A2A2A'],
            name: 'oceanMist',
            gradient: {
                type: 'linear',
                angle: 140,
                colors: ['#F0F8FF', '#B3E5FC']
            },
            layout: defaultLayout,
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

        // 10. Dew Drop
        dewDrop: {
            baseColors: ['#EBF4FF', '#2A2A2A'],
            name: 'dewDrop',
            gradient: {
                type: 'linear',
                angle: 135,
                colors: ['#EBF4FF', '#C3DAFE']
            },
            layout: defaultLayout,
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


        // 11. Blossom Pink
        blossomPink: {
            baseColors: ['#FFF5F7', '#2A2A2A'],
            name: 'blossomPink',
            gradient: {
                type: 'linear',
                angle: 145,
                colors: ['#FFF5F7', '#FFB6C1']
            },
            layout: defaultLayout,
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

        // 12. Citrus Breeze
        citrusBreeze: {
            baseColors: ['#FFFAF0', '#2A2A2A'],
            name: 'citrusBreeze',
            gradient: {
                type: 'linear',
                angle: 150,
                colors: ['#FFFDE7', '#FFE082']
            },
            layout: defaultLayout,
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

        // 13. Serenity Blue
        serenityBlue: {
            baseColors: ['#F0F8FF', '#2A2A2A'],
            name: 'serenityBlue',
            gradient: {
                type: 'linear',
                angle: 135,
                colors: ['#F0F8FF', '#87CEFA']
            },
            layout: defaultLayout,
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

        // 14. Lemon Frost
        lemonFrost: {
            baseColors: ['#FAFFD1', '#2A2A2A'],
            name: 'lemonFrost',
            gradient: {
                type: 'linear',
                angle: 160,
                colors: ['#FAFFD1', '#D4E157']
            },
            layout: defaultLayout,
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

        // 15. Frosty Lilac
        frostyLilac: {
            baseColors: ['#F3E5F5', '#2A2A2A'],
            name: 'frostyLilac',
            gradient: {
                type: 'linear',
                angle: 145,
                colors: ['#F3E5F5', '#CE93D8']
            },
            layout: defaultLayout,
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

        // 16. Soft Coral
        softCoral: {
            baseColors: ['#FFF8F1', '#2A2A2A'],
            name: 'softCoral',
            gradient: {
                type: 'linear',
                angle: 150,
                colors: ['#FFF8F1', '#FFA07A']
            },
            layout: defaultLayout,
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

        // 17. Pale Gold
        paleGold: {
            baseColors: ['#FFF9E6', '#2A2A2A'],
            name: 'paleGold',
            gradient: {
                type: 'linear',
                angle: 130,
                colors: ['#FFF9E6', '#FFD700']
            },
            layout: defaultLayout,
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

        // 18. Powder Blue
        powderBlue: {
            baseColors: ['#E0F7FA', '#2A2A2A'],
            name: 'powderBlue',
            gradient: {
                type: 'linear',
                angle: 140,
                colors: ['#E0F7FA', '#81D4FA']
            },
            layout: defaultLayout,
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

        // 19. Morning Mist
        morningMist: {
            baseColors: ['#F1F8E9', '#2A2A2A'],
            name: 'morningMist',
            gradient: {
                type: 'linear',
                angle: 165,
                colors: ['#F1F8E9', '#AED581']
            },
            layout: defaultLayout,
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

        // 20. Peach Glow
        peachGlow: {
            baseColors: ['#FFF2E5', '#2A2A2A'],
            name: 'peachGlow',
            gradient: {
                type: 'linear',
                angle: 135,
                colors: ['#FFF2E5', '#FFA726']
            },
            layout: defaultLayout,
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
    // 1. Inspired by the dawn prayers at temples and morning ragas
    thiruppalliFlight: {
        baseColors: ['#E8D5C4', '#2A2A2A'],
        name: 'thiruppalliFlight',
        gradient: {
            type: 'linear',
            angle: 135,
            colors: ['#E8D5C4', '#C7B7A3', '#67595E']
        },
        layout: defaultLayout,
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

    // 2. Inspired by the deep philosophical teachings of Thirukkural
    kuralamrit: {
        baseColors: ['#1F2937', '#FFFFFF'],
        name: 'kuralamrit',
        gradient: {
            type: 'linear',
            angle: 145,
            colors: ['#1F2937', '#374151', '#4B5563']
        },
        layout: defaultLayout,
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

    // 3. Inspired by the colors of Kanchipuram silk sarees
    pattuPrism: {
        baseColors: ['#7C3AED', '#FFFFFF'],
        name: 'pattuPrism',
        gradient: {
            type: 'linear',
            angle: 150,
            colors: ['#7C3AED', '#9D174D', '#DC2626']
        },
        layout: defaultLayout,
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

    // 4. Inspired by the waters of Marina Beach at dusk
    kadalkaviyam: {
        baseColors: ['#0F172A', '#FFFFFF'],
        name: 'kadalkaviyam',
        gradient: {
            type: 'linear',
            angle: 160,
            colors: ['#0F172A', '#1E3A8A', '#2563EB']
        },
        layout: defaultLayout,
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

    // 5. Inspired by the red earth and green fields of Tamil Nadu
    mannInMayil: {
        baseColors: ['#92400E', '#FFFFFF'],
        name: 'mannInMayil',
        gradient: {
            type: 'linear',
            angle: 165,
            colors: ['#92400E', '#854D0E', '#65A30D']
        },
        layout: defaultLayout,
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
    // 1. Inspired by the mystical evening prayers and temple lamps
    deepaRaagam: {
        baseColors: ['#581C87', '#FFFFFF'],
        name: 'deepaRaagam',
        gradient: {
            type: 'linear',
            angle: 145,
            colors: ['#581C87', '#9333EA', '#F59E0B']
        },
        layout: defaultLayout,
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

    // 2. Inspired by the Mullai flowers and moonlight
    mullaiNilavu: {
        baseColors: ['#E2E8F0', '#2A2A2A'],
        name: 'mullaiNilavu',
        gradient: {
            type: 'linear',
            angle: 135,
            colors: ['#E2E8F0', '#CBD5E1', '#94A3B8']
        },
        layout: defaultLayout,
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

    // 3. Inspired by the passion of Bharatanatyam
    natyaJwala: {
        baseColors: ['#991B1B', '#FFFFFF'],
        name: 'natyaJwala',
        gradient: {
            type: 'linear',
            angle: 155,
            colors: ['#991B1B', '#DC2626', '#EA580C']
        },
        layout: defaultLayout,
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

    // 4. Inspired by the monsoon rains and green hills
    malaiMazhai: {
        baseColors: ['#064E3B', '#FFFFFF'],
        name: 'malaiMazhai',
        gradient: {
            type: 'linear',
            angle: 160,
            colors: ['#064E3B', '#047857', '#059669']
        },
        layout: defaultLayout,
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

    // 5. Inspired by the lotus ponds at ancient temples
    thamaraiKulam: {
        baseColors: ['#831843', '#FFFFFF'],
        name: 'thamaraiKulam',
        gradient: {
            type: 'linear',
            angle: 150,
            colors: ['#831843', '#9D174D', '#BE185D']
        },
        layout: defaultLayout,
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
    // 1. Inspired by the Marutham landscape (agricultural lands)
    nelVayal: {
        baseColors: ['#166534', '#FFFFFF'],
        name: 'nelVayal',
        gradient: {
            type: 'linear',
            angle: 145,
            colors: ['#166534', '#15803D', '#4D7C0F']
        },
        layout: defaultLayout,
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

    // 2. Inspired by the dawn at Thirukadaiyur temple
    brahmaWake: {
        baseColors: ['#7E22CE', '#FFFFFF'],
        name: 'brahmaWake',
        gradient: {
            type: 'linear',
            angle: 150,
            colors: ['#7E22CE', '#C026D3', '#DB2777']
        },
        layout: defaultLayout,
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

    // 3. Inspired by the philosophical depths of Thiruvasagam
    sivaGnanam: {
        baseColors: ['#1E293B', '#FFFFFF'],
        name: 'sivaGnanam',
        gradient: {
            type: 'linear',
            angle: 155,
            colors: ['#1E293B', '#334155', '#475569']
        },
        layout: defaultLayout,
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

    // 4. Inspired by the coastal beauty of Neithal landscape
    kadaloram: {
        baseColors: ['#0C4A6E', '#FFFFFF'],
        name: 'kadaloram',
        gradient: {
            type: 'linear',
            angle: 140,
            colors: ['#0C4A6E', '#0369A1', '#0EA5E9']
        },
        layout: defaultLayout,
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

    // 5. Inspired by the sacred ash (Vibuthi)
    thiruNeeru: {
        baseColors: ['#E2E8F0', '#2A2A2A'],
        name: 'thiruNeeru',
        gradient: {
            type: 'linear',
            angle: 160,
            colors: ['#E2E8F0', '#CBD5E1', '#94A3B8']
        },
        layout: defaultLayout,
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

    // 6. Inspired by the Kurinji flowers that bloom every 12 years
    kurinjiMalai: {
        baseColors: ['#4C1D95', '#FFFFFF'],
        name: 'kurinjiMalai',
        gradient: {
            type: 'linear',
            angle: 165,
            colors: ['#4C1D95', '#6D28D9', '#8B5CF6']
        },
        layout: defaultLayout,
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

    // 7. Inspired by the traditional palm leaf manuscripts
    olaichuvadi: {
        baseColors: ['#365314', '#FFFFFF'],
        name: 'olaichuvadi',
        gradient: {
            type: 'linear',
            angle: 145,
            colors: ['#365314', '#3F6212', '#4D7C0F']
        },
        layout: defaultLayout,
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

    // 8. Inspired by the Tanjore paintings
    thanjavurOviyam: {
        baseColors: ['#B45309', '#FFFFFF'],
        name: 'thanjavurOviyam',
        gradient: {
            type: 'linear',
            angle: 150,
            colors: ['#B45309', '#D97706', '#F59E0B']
        },
        layout: defaultLayout,
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

    // 9. Inspired by the Palani temple twilight
    palaniSayam: {
        baseColors: ['#3730A3', '#FFFFFF'],
        name: 'palaniSayam',
        gradient: {
            type: 'linear',
            angle: 155,
            colors: ['#3730A3', '#4F46E5', '#6366F1']
        },
        layout: defaultLayout,
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

    // 10. Inspired by the sacred Rudraksha beads
    rudrakshaJapa: {
        baseColors: ['#9F1239', '#FFFFFF'],
        name: 'rudrakshaJapa',
        gradient: {
            type: 'linear',
            angle: 160,
            colors: ['#9F1239', '#BE123C', '#E11D48']
        },
        layout: defaultLayout,
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

        // 11. Inspired by the philosophical concept of Siddha medicine
        siddhaVaidya: {
            baseColors: ['#5B21B6', '#FFFFFF'],
            name: 'siddhaVaidya',
            gradient: {
                type: 'linear',
                angle: 140,
                colors: ['#5B21B6', '#7C3AED', '#8B5CF6']
            },
            layout: defaultLayout,
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
    
        // 12. Inspired by the majestic Thanjai Periya Kovil
        thanjaiPerumai: {
            baseColors: ['#B91C1C', '#FFFFFF'],
            name: 'thanjaiPerumai',
            gradient: {
                type: 'linear',
                angle: 150,
                colors: ['#B91C1C', '#DC2626', '#EF4444']
            },
            layout: defaultLayout,
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
    
        // 13. Inspired by the Madurai Meenakshi Temple's night atmosphere
        meenakshiNilavu: {
            baseColors: ['#0F172A', '#FFFFFF'],
            name: 'meenakshiNilavu',
            gradient: {
                type: 'linear',
                angle: 155,
                colors: ['#0F172A', '#1E293B', '#334155']
            },
            layout: defaultLayout,
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
    
    // 14. Inspired by the ancient Sangam literature (completing previous theme)
    sangaPuthir: {
        baseColors: ['#FEF3C7', '#2A2A2A'],
        name: 'sangaPuthir',
        gradient: {
            type: 'linear',
            angle: 160,
            colors: ['#FEF3C7', '#FDE68A', '#FCD34D']
        },
        layout: defaultLayout,
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
    
    // 15. Inspired by the Carnatic music's depth
    ragaAnubhuti: {
        baseColors: ['#5B21B6', '#FFFFFF'],
        name: 'ragaAnubhuti',
        gradient: {
            type: 'linear',
            angle: 145,
            colors: ['#5B21B6', '#7C3AED', '#9333EA']
        },
        layout: defaultLayout,
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
    
    // 16. Inspired by the Kolam art patterns
    kolamKaviyam: {
        baseColors: ['#BE185D', '#FFFFFF'],
        name: 'kolamKaviyam',
        gradient: {
            type: 'linear',
            angle: 150,
            colors: ['#BE185D', '#DB2777', '#EC4899']
        },
        layout: defaultLayout,
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
    
    // 17. Inspired by the philosophical concept of Saivaite meditation
    sivaDhyanam: {
        baseColors: ['#0F172A', '#FFFFFF'],
        name: 'sivaDhyanam',
        gradient: {
            type: 'linear',
            angle: 155,
            colors: ['#0F172A', '#1E293B', '#334155']
        },
        layout: defaultLayout,
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
    
    // 18. Inspired by the Thanjavur style of painting
    ratnaAlankaram: {
        baseColors: ['#B45309', '#FFFFFF'],
        name: 'ratnaAlankaram',
        gradient: {
            type: 'linear',
            angle: 160,
            colors: ['#B45309', '#D97706', '#F59E0B']
        },
        layout: defaultLayout,
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
    
    // 19. Inspired by the sacred Kumkumam
    kumkumaSandhya: {
        baseColors: ['#DC2626', '#FFFFFF'],
        name: 'kumkumaSandhya',
        gradient: {
            type: 'linear',
            angle: 165,
            colors: ['#DC2626', '#EF4444', '#F87171']
        },
        layout: defaultLayout,
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
    
    // 20. Inspired by the Nilgiri mountains
    neelaMalai: {
        baseColors: ['#1E40AF', '#FFFFFF'],
        name: 'neelaMalai',
        gradient: {
            type: 'linear',
            angle: 140,
            colors: ['#1E40AF', '#2563EB', '#3B82F6']
        },
        layout: defaultLayout,
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
    
    // 1. Mystic Horizon
    mysticHorizon: {
        baseColors: ['#FFB347', '#FFFFFF'],
        name: 'mysticHorizon',
        gradient: {
            type: 'linear',
            angle: 135,
            colors: ['#FFB347', '#FFCC33', '#FFC3A0']
        },
        layout: defaultLayout,
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
    
    // 2. Celestial Grace
    celestialGrace: {
        baseColors: ['#8A2BE2', '#FFFFFF'],
        name: 'celestialGrace',
        gradient: {
            type: 'linear',
            angle: 150,
            colors: ['#8A2BE2', '#6A5ACD', '#9370DB']
        },
        layout: defaultLayout,
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
    
    // 3. Desert Bloom
    desertBloom: {
        baseColors: ['#D1A054', '#FFFFFF'],
        name: 'desertBloom',
        gradient: {
            type: 'linear',
            angle: 140,
            colors: ['#D1A054', '#E6B89C', '#FFD700']
        },
        layout: defaultLayout,
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
    
    // 4. Ocean Tranquility
    oceanTranquility: {
        baseColors: ['#00CED1', '#FFFFFF'],
        name: 'oceanTranquility',
        gradient: {
            type: 'linear',
            angle: 135,
            colors: ['#00CED1', '#4682B4', '#5F9EA0']
        },
        layout: defaultLayout,
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
    
    // 5. Philosophical Dusk
    philosophicalDusk: {
        baseColors: ['#3C3B6E', '#FFFFFF'],
        name: 'philosophicalDusk',
        gradient: {
            type: 'linear',
            angle: 145,
            colors: ['#3C3B6E', '#836FFF', '#B0C4DE']
        },
        layout: defaultLayout,
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
    
    // 6. Ethereal Sands
    etherealSands: {
        baseColors: ['#FFDAB9', '#FFFFFF'],
        name: 'etherealSands',
        gradient: {
            type: 'linear',
            angle: 140,
            colors: ['#FFDAB9', '#FFE4C4', '#FFDEAD']
        },
        layout: defaultLayout,
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
    
    // 7. Moonlit Journey
    moonlitJourney: {
        baseColors: ['#1C1C1C', '#FFFFFF'],
        name: 'moonlitJourney',
        gradient: {
            type: 'linear',
            angle: 150,
            colors: ['#1C1C1C', '#4A4A4A', '#7B7B7B']
        },
        layout: defaultLayout,
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
    
    // 8. Mystic Lagoon
    mysticLagoon: {
        baseColors: ['#76D7C4', '#FFFFFF'],
        name: 'mysticLagoon',
        gradient: {
            type: 'linear',
            angle: 145,
            colors: ['#76D7C4', '#48C9B0', '#1ABC9C']
        },
        layout: defaultLayout,
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
    
    // 9. Crimson Glow
    crimsonGlow: {
        baseColors: ['#FF4500', '#FFFFFF'],
        name: 'crimsonGlow',
        gradient: {
            type: 'linear',
            angle: 140,
            colors: ['#FF4500', '#DC143C', '#FF6347']
        },
        layout: defaultLayout,
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
    
    // 10. Serene Frost
    sereneFrost: {
        baseColors: ['#AFEEEE', '#FFFFFF'],
        name: 'sereneFrost',
        gradient: {
            type: 'linear',
            angle: 150,
            colors: ['#AFEEEE', '#B0E0E6', '#ADD8E6']
        },
        layout: defaultLayout,
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
    
    anandaThandavam: {
        baseColors: ['#4A044E', '#FFFFFF'],
        name: 'anandaThandavam',
        gradient: {
            type: 'linear',
            angle: 145,
            colors: ['#4A044E', '#6D28D9', '#7E22CE']
        },
        layout: defaultLayout,
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
    
        // 1. Inspired by the Natarajar's cosmic dance
        anandaThandavam: {
            baseColors: ['#4A044E', '#FFFFFF'],
            name: 'anandaThandavam',
            gradient: {
                type: 'linear',
                angle: 145,
                colors: ['#4A044E', '#6D28D9', '#7E22CE']
            },
            layout: defaultLayout,
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
    
        // 2. Inspired by the sacred Pavazha Malli (Coral Jasmine) flowers
        pavazhaMalligai: {
            baseColors: ['#FEF2F2', '#2A2A2A'],
            name: 'pavazhaMalligai',
            gradient: {
                type: 'linear',
                angle: 150,
                colors: ['#FEF2F2', '#FECDD3', '#FDA4AF']
            },
            layout: defaultLayout,
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
    
        // 3. Inspired by the Yaal instrument's melodies
        yaalIsai: {
            baseColors: ['#422006', '#FFFFFF'],
            name: 'yaalIsai',
            gradient: {
                type: 'linear',
                angle: 155,
                colors: ['#422006', '#854D0E', '#A16207']
            },
            layout: defaultLayout,
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
    
        // 4. Inspired by the Valluvar's wisdom
        thirukkuralAmutham: {
            baseColors: ['#134E4A', '#FFFFFF'],
            name: 'thirukkuralAmutham',
            gradient: {
                type: 'linear',
                angle: 160,
                colors: ['#134E4A', '#0F766E', '#0D9488']
            },
            layout: defaultLayout,
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
    
        // 5. Inspired by the Thirunelveli halwa's golden hue
        halwaKanavugal: {
            baseColors: ['#FBBF24', '#2A2A2A'],
            name: 'halwaKanavugal',
            gradient: {
                type: 'linear',
                angle: 145,
                colors: ['#FBBF24', '#F59E0B', '#D97706']
            },
            layout: defaultLayout,
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
    
        // 6. Inspired by the Kaveri's flow
        kaveriyinOsai: {
            baseColors: ['#0369A1', '#FFFFFF'],
            name: 'kaveriyinOsai',
            gradient: {
                type: 'linear',
                angle: 150,
                colors: ['#0369A1', '#0EA5E9', '#38BDF8']
            },
            layout: defaultLayout,
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
    
        // 7. Inspired by the Chettinad mansions
        chettinaduVaibhavam: {
            baseColors: ['#7C2D12', '#FFFFFF'],
            name: 'chettinaduVaibhavam',
            gradient: {
                type: 'linear',
                angle: 155,
                colors: ['#7C2D12', '#9A3412', '#C2410C']
            },
            layout: defaultLayout,
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
    
        // 8. Inspired by the morning Suprabhatam
        thiruPalli: {
            baseColors: ['#FAF5FF', '#2A2A2A'],
            name: 'thiruPalli',
            gradient: {
                type: 'linear',
                angle: 160,
                colors: ['#FAF5FF', '#F3E8FF', '#E9D5FF']
            },
            layout: defaultLayout,
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
    
        // 9. Inspired by the Mullaiperiyar Dam
        mullaiPeriyar: {
            baseColors: ['#064E3B', '#FFFFFF'],
            name: 'mullaiPeriyar',
            gradient: {
                type: 'linear',
                angle: 165,
                colors: ['#064E3B', '#065F46', '#047857']
            },
            layout: defaultLayout,
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
    
        // 10. Inspired by the Bharatanatyam's Sringara rasa
        sringaraRasa: {
            baseColors: ['#831843', '#FFFFFF'],
            name: 'sringaraRasa',
            gradient: {
                type: 'linear',
                angle: 140,
                colors: ['#831843', '#9D174D', '#BE185D']
            },
            layout: defaultLayout,
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

        // Tamil Female Poets and Literary Figures Gradient Themes

    avvaiyarWisdom: {
        baseColors: ['#1E40AF', '#FFFFFF'],
        name: 'avvaiyarWisdom',
        gradient: {
            type: 'linear',
            angle: 140,
            colors: ['#1E40AF', '#2563EB', '#3B82F6']
        },
        layout: defaultLayout,
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

    // 2. Inspired by Bharathi Dasan's Female Muse - Strength and Resilience
    bharathiMuse: {
        baseColors: ['#9F1239', '#FFFFFF'],
        name: 'bharathiMuse',
        gradient: {
            type: 'linear',
            angle: 150,
            colors: ['#9F1239', '#BE123C', '#E11D48']
        },
        layout: defaultLayout,
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

    // 3. Inspired by Gnanasundari - Philosophical Depth
    gnanaSundarReflection: {
        baseColors: ['#4D7C0F', '#FFFFFF'],
        name: 'gnanaSundarReflection',
        gradient: {
            type: 'linear',
            angle: 145,
            colors: ['#4D7C0F', '#65A30D', '#84CC16']
        },
        layout: defaultLayout,
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

    // 4. Inspired by Subramanya Bharathi's Female Characters - Passionate Rebellion
    bharathiRebellion: {
        baseColors: ['#7E22CE', '#FFFFFF'],
        name: 'bharathiRebellion',
        gradient: {
            type: 'linear',
            angle: 155,
            colors: ['#7E22CE', '#9333EA', '#A855F7']
        },
        layout: defaultLayout,
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

    // 5. Inspired by Kavimani Desiga Vinayagam's Female Poetic Voice - Gentle Strength
    kavimaniEchoes: {
        baseColors: ['#0C4A6E', '#FFFFFF'],
        name: 'kavimaniEchoes',
        gradient: {
            type: 'linear',
            angle: 160,
            colors: ['#0C4A6E', '#0369A1', '#0EA5E9']
        },
        layout: defaultLayout,
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

 
        // 21. Inspired by the mystical Siddha medicine tradition
        siddhaChinthai: {
            baseColors: ['#006064', '#FFFFFF'],
            name: 'siddhaChinthai',
            gradient: {
                type: 'linear',
                angle: 140,
                colors: ['#006064', '#00838F', '#00ACC1']
            },
            layout: defaultLayout,
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
    
        // 22. Capturing the essence of Tamil classical dance (Bharatanatyam)
        natyaAnanda: {
            baseColors: ['#C51162', '#FFFFFF'],
            name: 'natyaAnanda',
            gradient: {
                type: 'linear',
                angle: 150,
                colors: ['#C51162', '#E91E63', '#F06292']
            },
            layout: defaultLayout,
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
    
        // 23. Inspired by the ancient Tamil maritime trade and exploration
        valaiKadal: {
            baseColors: ['#1565C0', '#FFFFFF'],
            name: 'valaiKadal',
            gradient: {
                type: 'linear',
                angle: 135,
                colors: ['#1565C0', '#1976D2', '#42A5F5']
            },
            layout: defaultLayout,
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
    
        // 24. Reflecting the spiritual wisdom of Tamil Saivite philosophy
        saivaSamadhi: {
            baseColors: ['#37474F', '#FFFFFF'],
            name: 'saivaSamadhi',
            gradient: {
                type: 'linear',
                angle: 160,
                colors: ['#37474F', '#455A64', '#607D8B']
            },
            layout: defaultLayout,
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
    
        // 25. Inspired by the lush landscapes of Tamil Nadu
        karuNilam: {
            baseColors: ['#2E7D32', '#FFFFFF'],
            name: 'karuNilam',
            gradient: {
                type: 'linear',
                angle: 125,
                colors: ['#2E7D32', '#43A047', '#66BB6A']
            },
            layout: defaultLayout,
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
    

      
        // 26. Capturing the essence of Tamil mathematical and astronomical brilliance
        ganitagaVeli: {
            baseColors: ['#6A1B9A', '#FFFFFF'],
            name: 'ganitagaVeli',
            gradient: {
                type: 'linear',
                angle: 145,
                colors: ['#6A1B9A', '#8E24AA', '#AB47BC']
            },
            layout: defaultLayout,
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
    
        // 27. Inspired by the vibrant temple festivals of Tamil Nadu
        utsavaVanam: {
            baseColors: ['#C62828', '#FFFFFF'],
            name: 'utsavaVanam',
            gradient: {
                type: 'linear',
                angle: 155,
                colors: ['#C62828', '#D32F2F', '#EF5350']
            },
            layout: defaultLayout,
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
    
        // 28. Reflecting the poetic tradition of Sangam literature
        sangamPaatu: {
            baseColors: ['#4527A0', '#FFFFFF'],
            name: 'sangamPaatu',
            gradient: {
                type: 'linear',
                angle: 130,
                colors: ['#4527A0', '#5E35B1', '#7E57C2']
            },
            layout: defaultLayout,
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
    
        // 29. Inspired by the architectural marvel of Madurai Meenakshi Temple
        meenakshiVasal: {
            baseColors: ['#FF6F00', '#FFFFFF'],
            name: 'meenakshiVasal',
            gradient: {
                type: 'linear',
                angle: 140,
                colors: ['#FF6F00', '#FFA000', '#FFB300']
            },
            layout: defaultLayout,
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
    
        // 30. Capturing the spirit of Tamil agricultural abundance
        unavuVayal: {
            baseColors: ['#2E7D32', '#FFFFFF'],
            name: 'unavuVayal',
            gradient: {
                type: 'linear',
                angle: 150,
                colors: ['#2E7D32', '#43A047', '#66BB6A']
            },
            layout: defaultLayout,
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

            // 31. Inspired by ancient Tamil literary manuscripts
    ezhuthuChuvadu: {
        baseColors: ['#6D4C41', '#FFFFFF'],
        name: 'ezhuthuChuvadu',
        gradient: {
            type: 'linear',
            angle: 135,
            colors: ['#6D4C41', '#8D6E63', '#A1887F']
        },
        layout: defaultLayout,
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

    // 32. Capturing the essence of Sangam poetry and its landscape imagery
    sangamNilam: {
        baseColors: ['#2E7D32', '#FFFFFF'],
        name: 'sangamNilam',
        gradient: {
            type: 'linear',
            angle: 140,
            colors: ['#2E7D32', '#43A047', '#66BB6A']
        },
        layout: defaultLayout,
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

    // 33. Reflecting the spiritual depth of Tamil philosophical writings
    gnanaVelicham: {
        baseColors: ['#1A237E', '#FFFFFF'],
        name: 'gnanaVelicham',
        gradient: {
            type: 'linear',
            angle: 150,
            colors: ['#1A237E', '#3F51B5', '#5C6BC0']
        },
        layout: defaultLayout,
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

    // 34. Inspired by the rhythmic flow of Tamil literary language
    mozhibhavam: {
        baseColors: ['#00695C', '#FFFFFF'],
        name: 'mozhibhavam',
        gradient: {
            type: 'linear',
            angle: 125,
            colors: ['#00695C', '#00897B', '#26A69A']
        },
        layout: defaultLayout,
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

    // 35. Representing the passion of Tamil love poetry
    anameghamPaatu: {
        baseColors: ['#C62828', '#FFFFFF'],
        name: 'anameghamPaatu',
        gradient: {
            type: 'linear',
            angle: 160,
            colors: ['#C62828', '#D32F2F', '#EF5350']
        },
        layout: defaultLayout,
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

    // 36. Capturing the wisdom of ancient Tamil literary traditions
    muraiMozhi: {
        baseColors: ['#4A148C', '#FFFFFF'],
        name: 'muraiMozhi',
        gradient: {
            type: 'linear',
            angle: 135,
            colors: ['#4A148C', '#7B1FA2', '#9C27B0']
        },
        layout: defaultLayout,
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

    // 37. Inspired by the maritime poetry and trading history of Tamil Nadu
    kadaloraVazhvu: {
        baseColors: ['#1565C0', '#FFFFFF'],
        name: 'kadaloraVazhvu',
        gradient: {
            type: 'linear',
            angle: 145,
            colors: ['#1565C0', '#1976D2', '#42A5F5']
        },
        layout: defaultLayout,
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

    // 38. Reflecting the poetic exploration of human emotions
    unarvilamBam: {
        baseColors: ['#AD1457', '#FFFFFF'],
        name: 'unarvilamBam',
        gradient: {
            type: 'linear',
            angle: 130,
            colors: ['#AD1457', '#D81B60', '#F06292']
        },
        layout: defaultLayout,
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

    // 39. Capturing the rhythm of Tamil literary language
    mozhinadai: {
        baseColors: ['#37474F', '#FFFFFF'],
        name: 'mozhinadai',
        gradient: {
            type: 'linear',
            angle: 155,
            colors: ['#37474F', '#455A64', '#607D8B']
        },
        layout: defaultLayout,
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
    // 40. Inspired by the introspective nature of Tamil literature
    aatmaVazhvu: {
        baseColors: ['#512DA8', '#FFFFFF'],
        name: 'aatmaVazhvu',
        gradient: {
            type: 'linear',
            angle: 140,
            colors: ['#512DA8', '#673AB7', '#7E57C2']
        },
        layout: defaultLayout,
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
     // 6. Inspired by Akkamadevi - Spiritual Rebellion
     soulFireAkkam: {
        baseColors: ['#B45309', '#FFFFFF'],
        name: 'soulFireAkkam',
        gradient: {
            type: 'linear',
            angle: 140,
            colors: ['#B45309', '#D97706', '#F59E0B']
        },
        layout: defaultLayout,
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

    // 7. Inspired by Andal - Divine Feminine Devotion
    andhalsDream: {
        baseColors: ['#4C1D95', '#FFFFFF'],
        name: 'andhalsDream',
        gradient: {
            type: 'linear',
            angle: 150,
            colors: ['#4C1D95', '#6D28D9', '#8B5CF6']
        },
        layout: defaultLayout,
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

    // 8. Inspired by Rashmi Rekha - Modern Poetic Voice
    rhythmOfRashmi: {
        baseColors: ['#365314', '#FFFFFF'],
        name: 'rhythmOfRashmi',
        gradient: {
            type: 'linear',
            angle: 145,
            colors: ['#365314', '#3F6212', '#4D7C0F']
        },
        layout: defaultLayout,
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

    // 9. Inspired by Venmathi - Lyrical Elegance
    venmathiSong: {
        baseColors: ['#1E293B', '#FFFFFF'],
        name: 'venmathiSong',
        gradient: {
            type: 'linear',
            angle: 155,
            colors: ['#1E293B', '#334155', '#475569']
        },
        layout: defaultLayout,
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

    // 10. Inspired by Mangai Natarajan - Social Activist Poet
    mangaiSpirit: {
        baseColors: ['#3730A3', '#FFFFFF'],
        name: 'mangaiSpirit',
        gradient: {
            type: 'linear',
            angle: 160,
            colors: ['#3730A3', '#4F46E5', '#6366F1']
        },
        layout: defaultLayout,
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

    // 11. Inspired by Lakshmi Holmström - Literary Translator
    holmstromBridge: {
        baseColors: ['#5B21B6', '#FFFFFF'],
        name: 'holmstromBridge',
        gradient: {
            type: 'linear',
            angle: 140,
            colors: ['#5B21B6', '#7C3AED', '#8B5CF6']
        },
        layout: defaultLayout,
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

    // 12. Inspired by Punitha Palanisamy - Contemporary Poet
    punithaWhispers: {
        baseColors: ['#B91C1C', '#FFFFFF'],
        name: 'punithaWhispers',
        gradient: {
            type: 'linear',
            angle: 150,
            colors: ['#B91C1C', '#DC2626', '#EF4444']
        },
        layout: defaultLayout,
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

    // 13. Inspired by Sitara Ranganathan - Modern Feminist Voice
    sitaraEchoes: {
        baseColors: ['#0F172A', '#FFFFFF'],
        name: 'sitaraEchoes',
        gradient: {
            type: 'linear',
            angle: 155,
            colors: ['#0F172A', '#1E293B', '#334155']
        },
        layout: defaultLayout,
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

    // 14. Inspired by Chandra Bose - Revolutionary Poet
    chandraFirelight: {
        baseColors: ['#7E22CE', '#FFFFFF'],
        name: 'chandraFirelight',
        gradient: {
            type: 'linear',
            angle: 145,
            colors: ['#7E22CE', '#9333EA', '#A855F7']
        },
        layout: defaultLayout,
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

    // 15. Inspired by Baudhyanayaki - Classical Poet
    baudhyaGrace: {
        baseColors: ['#166534', '#FFFFFF'],
        name: 'baudhyaGrace',
        gradient: {
            type: 'linear',
            angle: 160,
            colors: ['#166534', '#15803D', '#4D7C0F']
        },
        layout: defaultLayout,
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

    // Themes inspired by Sangam era descriptions of feminine beauty
    thamaraiKann: {
        baseColors: ['#FDF4FF', '#2A2A2A'],
        name: 'thamaraiKann',
        gradient: {
            type: 'linear',
            angle: 145,
            colors: ['#FDF4FF', '#FAE8FF', '#F5D0FE']
        },
        layout: defaultLayout,
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

    // 2. Inspired by peacock-like gait (மயில் போன்ற நடை)
    mayilNadai: {
        baseColors: ['#1E40AF', '#FFFFFF'],
        name: 'mayilNadai',
        gradient: {
            type: 'linear',
            angle: 150,
            colors: ['#1E40AF', '#3B82F6', '#60A5FA']
        },
        layout: defaultLayout,
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

    // 3. Inspired by flower garlands (பூ மாலை)
    pooMalai: {
        baseColors: ['#BE185D', '#FFFFFF'],
        name: 'pooMalai',
        gradient: {
            type: 'linear',
            angle: 155,
            colors: ['#BE185D', '#DB2777', '#EC4899']
        },
        layout: defaultLayout,
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

    // 4. Inspired by dark hair like clouds (கருமேக கூந்தல்)
    karuMegaKoonthal: {
        baseColors: ['#020617', '#FFFFFF'],
        name: 'karuMegaKoonthal',
        gradient: {
            type: 'linear',
            angle: 160,
            colors: ['#020617', '#0F172A', '#1E293B']
        },
        layout: defaultLayout,
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

    // 5. Inspired by bamboo-like shoulders (மூங்கில் போன்ற தோள்)
    moongiltholVannam: {
        baseColors: ['#166534', '#FFFFFF'],
        name: 'moongiltholVannam',
        gradient: {
            type: 'linear',
            angle: 145,
            colors: ['#166534', '#15803D', '#22C55E']
        },
        layout: defaultLayout,
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

    // 6. Inspired by youthful radiance (இளமை ஒளி)
    ilamaiOli: {
        baseColors: ['#FEF9C3', '#2A2A2A'],
        name: 'ilamaiOli',
        gradient: {
            type: 'linear',
            angle: 150,
            colors: ['#FEF9C3', '#FEF08A', '#FDE047']
        },
        layout: defaultLayout,
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

    // 7. Inspired by pearl-like smile (முத்து போன்ற புன்னகை)
    muthuPunnagai: {
        baseColors: ['#F8FAFC', '#2A2A2A'],
        name: 'muthuPunnagai',
        gradient: {
            type: 'linear',
            angle: 155,
            colors: ['#F8FAFC', '#F1F5F9', '#E2E8F0']
        },
        layout: defaultLayout,
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

    // 8. Inspired by crescent brow (பிறை நுதல்)
    piraiNuthal: {
        baseColors: ['#0F172A', '#FFFFFF'],
        name: 'piraiNuthal',
        gradient: {
            type: 'linear',
            angle: 160,
            colors: ['#0F172A', '#1E293B', '#334155']
        },
        layout: defaultLayout,
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

    // 9. Inspired by parrot-like speech (கிளி மொழி)
    kiliMozhi: {
        baseColors: ['#166534', '#FFFFFF'],
        name: 'kiliMozhi',
        gradient: {
            type: 'linear',
            angle: 145,
            colors: ['#166534', '#22C55E', '#4ADE80']
        },
        layout: defaultLayout,
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

    // 10. Inspired by red coral lips (பவழ இதழ்)
    pavazhaIthazh: {
        baseColors: ['#BE123C', '#FFFFFF'],
        name: 'pavazhaIthazh',
        gradient: {
            type: 'linear',
            angle: 150,
            colors: ['#BE123C', '#E11D48', '#F43F5E']
        },
        layout: defaultLayout,
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

    // 11. Inspired by dark eyes with red edges (செங்கயல் விழி)
    sengayalVizhi: {
        baseColors: ['#881337', '#FFFFFF'],
        name: 'sengayalVizhi',
        gradient: {
            type: 'linear',
            angle: 155,
            colors: ['#881337', '#9F1239', '#BE123C']
        },
        layout: defaultLayout,
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

    // 12. Inspired by swan-like gait (அன்னநடை)
    annaNadai: {
        baseColors: ['#FAF5FF', '#2A2A2A'],
        name: 'annaNadai',
        gradient: {
            type: 'linear',
            angle: 160,
            colors: ['#FAF5FF', '#F3E8FF', '#E9D5FF']
        },
        layout: defaultLayout,
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

    // 13. Inspired by jasmine-like fragrance (முல்லை நறுமணம்)
    mullaiNarumanam: {
        baseColors: ['#F0FDF4', '#2A2A2A'],
        name: 'mullaiNarumanam',
        gradient: {
            type: 'linear',
            angle: 145,
            colors: ['#F0FDF4', '#DCFCE7', '#BBF7D0']
        },
        layout: defaultLayout,
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

    // 14. Inspired by golden complexion (பொன்னிற மேனி)
    ponMeni: {
        baseColors: ['#B45309', '#FFFFFF'],
        name: 'ponMeni',
        gradient: {
            type: 'linear',
            angle: 150,
            colors: ['#B45309', '#D97706', '#F59E0B']
        },
        layout: defaultLayout,
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
            // 1. Inspired by slender waist (நுண்ணிடை)
            nunIdai: {
                baseColors: ['#4338CA', '#FFFFFF'],
                name: 'nunIdai',
                gradient: {
                    type: 'linear',
                    angle: 145,
                    colors: ['#4338CA', '#6366F1', '#818CF8']
                },
                layout: defaultLayout,
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
        
            // 2. Inspired by shell-like bangles (வளை நிறை முன்கை)
            valaiNiraiMunkai: {
                baseColors: ['#FEF3C7', '#2A2A2A'],
                name: 'valaiNiraiMunkai',
                gradient: {
                    type: 'linear',
                    angle: 150,
                    colors: ['#FEF3C7', '#FDE68A', '#FCD34D']
                },
                layout: defaultLayout,
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
        
            // 3. Inspired by conch-like neck (சங்கு போல் கழுத்து)
            sankuKandham: {
                baseColors: ['#F9FAFB', '#2A2A2A'],
                name: 'sankuKandham',
                gradient: {
                    type: 'linear',
                    angle: 155,
                    colors: ['#F9FAFB', '#F3F4F6', '#E5E7EB']
                },
                layout: defaultLayout,
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
        
            // 4. Inspired by rounded shoulders (திரண்ட தோள்)
            thirandaTholVannam: {
                baseColors: ['#7C2D12', '#FFFFFF'],
                name: 'thirandaTholVannam',
                gradient: {
                    type: 'linear',
                    angle: 160,
                    colors: ['#7C2D12', '#9A3412', '#C2410C']
                },
                layout: defaultLayout,
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
        
            // 5. Inspired by young bamboo-like arms (மூங்கில் போன்ற கை)
            mungirkai: {
                baseColors: ['#166534', '#FFFFFF'],
                name: 'mungirkai',
                gradient: {
                    type: 'linear',
                    angle: 145,
                    colors: ['#166534', '#15803D', '#22C55E']
                },
                layout: defaultLayout,
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
        
            // 6. Inspired by elegant breasts (முலை அழகு)
            MullaiAzhagu: {
                baseColors: ['#831843', '#FFFFFF'],
                name: 'MullaiAzhagu',
                gradient: {
                    type: 'linear',
                    angle: 150,
                    colors: ['#831843', '#9D174D', '#BE185D']
                },
                layout: defaultLayout,
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
        
            // 7. Inspired by tender feet (மென்னடை)
            menNadai: {
                baseColors: ['#FDF4FF', '#2A2A2A'],
                name: 'menNadai',
                gradient: {
                    type: 'linear',
                    angle: 155,
                    colors: ['#FDF4FF', '#FAE8FF', '#F5D0FE']
                },
                layout: defaultLayout,
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
        
            // 8. Inspired by arrow-like glance (அம்பு போன்ற பார்வை)
            ambuPaarvai: {
                baseColors: ['#581C87', '#FFFFFF'],
                name: 'ambuPaarvai',
                gradient: {
                    type: 'linear',
                    angle: 160,
                    colors: ['#581C87', '#7E22CE', '#9333EA']
                },
                layout: defaultLayout,
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
        
            // 9. Inspired by doe-like steps (மான் போன்ற நடை)
            maanNadai: {
                baseColors: ['#713F12', '#FFFFFF'],
                name: 'maanNadai',
                gradient: {
                    type: 'linear',
                    angle: 145,
                    colors: ['#713F12', '#854D0E', '#A16207']
                },
                layout: defaultLayout,
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
        
            // 10. Inspired by lightning-like beauty (மின்னல் போன்ற அழகு)
            minnalAzhagu: {
                baseColors: ['#FBBF24', '#2A2A2A'],
                name: 'minnalAzhagu',
                gradient: {
                    type: 'linear',
                    angle: 150,
                    colors: ['#FBBF24', '#F59E0B', '#D97706']
                },
                layout: defaultLayout,
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
            }
    },

    // 15. Inspired by bashful glance (நாண் மலர் நோக்கு)
    naanMalarNokku: {
        baseColors: ['#7E22CE', '#FFFFFF'],
        name: 'naanMalarNokku',
        gradient: {
            type: 'linear',
            angle: 155,
            colors: ['#7E22CE', '#9333EA', '#A855F7']
        },
        layout: defaultLayout,
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
        // 1. Inspired by கொங்கை - tender buds (முகிழ் போன்ற)
        kongaiMugil: {
            baseColors: ['#FDF2F8', '#2A2A2A'],
            name: 'kongaiMugil',
            gradient: {
                type: 'linear',
                angle: 145,
                colors: ['#FDF2F8', '#FCE7F3', '#FBCFE8']
            },
            layout: defaultLayout,
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
    
        // 2. Inspired by முலை வனப்பு - beauty like fresh flowers
        MullaiVanappu: {
            baseColors: ['#FEF2F2', '#2A2A2A'],
            name: 'MullaiVanappu',
            gradient: {
                type: 'linear',
                angle: 150,
                colors: ['#FEF2F2', '#FEE2E2', '#FECACA']
            },
            layout: defaultLayout,
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
    
        // 3. Inspired by கச்சு அணி முலை - adorned beauty
        kachuAniMullai: {
            baseColors: ['#FFFBEB', '#2A2A2A'],
            name: 'kachuAniMullai',
            gradient: {
                type: 'linear',
                angle: 155,
                colors: ['#FFFBEB', '#FEF3C7', '#FDE68A']
            },
            layout: defaultLayout,
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
    
        // 4. Inspired by தளிர் போன்ற - tender like young leaves
        thalirMullai: {
            baseColors: ['#F0FDF4', '#2A2A2A'],
            name: 'thalirMullai',
            gradient: {
                type: 'linear',
                angle: 160,
                colors: ['#F0FDF4', '#DCFCE7', '#BBF7D0']
            },
            layout: defaultLayout,
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
    
        // 5. Inspired by பால் போன்ற - milk-like softness
        paalMullai: {
            baseColors: ['#F8FAFC', '#2A2A2A'],
            name: 'paalMullai',
            gradient: {
                type: 'linear',
                angle: 145,
                colors: ['#F8FAFC', '#F1F5F9', '#E2E8F0']
            },
            layout: defaultLayout,
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
            // 1. Inspired by சிங்க இடை (Lion-like waist - signifying grace and strength)
    singaIdai: {
        baseColors: ['#78350F', '#FFFFFF'],
        name: 'singaIdai',
        gradient: {
            type: 'linear',
            angle: 145,
            colors: ['#78350F', '#92400E', '#B45309']
        },
        layout: defaultLayout,
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

    // 2. Inspired by மின்னிடை (Lightning-like slender waist)
    minIdai: {
        baseColors: ['#FBBF24', '#2A2A2A'],
        name: 'minIdai',
        gradient: {
            type: 'linear',
            angle: 150,
            colors: ['#FBBF24', '#F59E0B', '#FBBF24']
        },
        layout: defaultLayout,
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

    // 3. Inspired by பூ நுசுப்பு (Flower-like delicate waist)
    pooNusuppu: {
        baseColors: ['#FDF4FF', '#2A2A2A'],
        name: 'pooNusuppu',
        gradient: {
            type: 'linear',
            angle: 155,
            colors: ['#FDF4FF', '#FAE8FF', '#F5D0FE']
        },
        layout: defaultLayout,
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

    // 4. Inspired by கொடி இடை (Creeper-like slim waist)
    kodiIdai: {
        baseColors: ['#166534', '#FFFFFF'],
        name: 'kodiIdai',
        gradient: {
            type: 'linear',
            angle: 160,
            colors: ['#166534', '#15803D', '#22C55E']
        },
        layout: defaultLayout,
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

    // 5. Inspired by சாயல் இடை (Graceful waist)
    sayalIdai: {
        baseColors: ['#7E22CE', '#FFFFFF'],
        name: 'sayalIdai',
        gradient: {
            type: 'linear',
            angle: 145,
            colors: ['#7E22CE', '#9333EA', '#A855F7']
        },
        layout: defaultLayout,
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

    // 6. Inspired by பவள நிதம்பம் (Coral-like hips)
    pavalanithambam: {
        baseColors: ['#BE123C', '#FFFFFF'],
        name: 'pavalanithambam',
        gradient: {
            type: 'linear',
            angle: 150,
            colors: ['#BE123C', '#E11D48', '#F43F5E']
        },
        layout: defaultLayout,
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

    // 7. Inspired by பொன் அரை (Golden waist)
    ponArai: {
        baseColors: ['#B45309', '#FFFFFF'],
        name: 'ponArai',
        gradient: {
            type: 'linear',
            angle: 155,
            colors: ['#B45309', '#D97706', '#F59E0B']
        },
        layout: defaultLayout,
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

// Extended Tamil Poetry Gradient Themes - Part 2



export const createThemeColors = (textColor, hoverFactors = { title: 1.4, text: 1.1, brand: 1.2 }) => ({
    title: { 
        color: textColor, 
        hoverColor: ColorHelper.adjustColor(textColor, hoverFactors.title)
    },
    text: { 
        color: textColor, 
        hoverColor: ColorHelper.adjustColor(textColor, hoverFactors.text)
    },
    branding: {
        name: { color: textColor, hoverColor: ColorHelper.adjustColor(textColor, hoverFactors.brand) },
        web: { color: textColor, hoverColor: ColorHelper.adjustColor(textColor, hoverFactors.brand) },
        phone: { color: textColor, hoverColor: ColorHelper.adjustColor(textColor, hoverFactors.brand) },
        social: { color: textColor, hoverColor: ColorHelper.adjustColor(textColor, hoverFactors.brand) }
    }
    });