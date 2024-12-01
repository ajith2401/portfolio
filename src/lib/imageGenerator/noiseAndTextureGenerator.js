import sharp from "sharp";
import ColorHelper from "./colorHelper";
import { GradientManager } from "./gradientManager";
const { textureEffects, themeKeyMapping } = require("./themeKeyMapping");
import path from 'path';
import ThemeSetup from "./themeSetup";
import CustomTextureGenerator from "./customTextureGenerator";

export class NoiseTextureGenerator {

    static async generateTextureNoise(type, width, height, options = {}) {
        // Handle custom texture types first
        switch (type) {
            case 'starrySky':
                return await CustomTextureGenerator.generateStarrySky(width, height, {
                    starCount: options.starCount || 200,
                    starSize: options.starSize || 2,
                    starBrightness: options.starBrightness || 0.8,
                    backgroundDarkness: options.backgroundDarkness || 0.1
                });
                
            case 'flyingBirds':
                return await CustomTextureGenerator.generateFlyingBirds(width, height, {
                    birdCount: options.birdCount || 50,
                    minSize: options.minSize || 10,
                    maxSize: options.maxSize || 30,
                    opacity: options.opacity || 0.6
                });
    
            case 'lacePattern':
                return await CustomTextureGenerator.generateLacePattern(width, height, {
                    scale: options.scale || 1,
                    opacity: options.opacity || 0.8,
                    color: options.color || 'white'
                });
    
            case 'denimTexture':
                return await CustomTextureGenerator.generateDenimTexture(width, height, {
                    density: options.density || 0.8,
                    color: options.color || '#1a365d',
                    opacity: options.opacity || 0.9
                });
    
            case 'waterDrops':
                return await CustomTextureGenerator.generateWaterDrops(width, height, {
                    dropCount: options.dropCount || 200,
                    maxDropSize: options.maxDropSize || 20,
                    opacity: options.opacity || 0.8
                });
                
            default:
                // Use existing texture effects for other types
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
    }
    
    static async createTexturedBackground(width, height, theme,textureType) {
        console.log('====================================');
        console.log({textureType});
        console.log('====================================');
        try {
        theme  = ThemeSetup.validateTheme(theme);(theme);
        const themeInfo = themeKeyMapping.find(t => t.keyName === theme.name) || {
            mainColors: [theme.colors.background],
            recommendedBg: theme.colors.background
        };
        let baseImage;
        let contentBgColor;
        
        // Handle gradient themes
        if (theme.gradient) {
            const texture = await NoiseTextureGenerator.generateTextureNoise(textureType , width, height);
            const gradientSvg = GradientManager.createGradientSVG(width, height, theme.gradient);
            baseImage = await sharp(Buffer.from(gradientSvg))
            .png()
            .composite(texture.composite.map(comp => ({
                ...comp,
                left: 0,
                top: 0
                })))
            .toBuffer();
            contentBgColor = 'transparent';
        } else {
            contentBgColor = ColorHelper.lightenColor(themeInfo.recommendedBg || theme.colors.background, 0.15);
            baseImage = await sharp({
            create: {
                width,
                height,
                channels: 4,
                background: ColorHelper.parseBackgroundColor(contentBgColor)
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
                background: theme.gradient ? { r: 0, g: 0, b: 0, alpha: 0 } : ColorHelper.parseBackgroundColor(contentBgColor)
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
                background: ColorHelper.parseBackgroundColor(theme.colors.branding.background)
            }
            })
            .png()
            .toBuffer();

           // Add texture if specified
            if (theme.effects?.backgroundTexture) {
            const texture = await NoiseTextureGenerator.generateTextureNoise(textureType, width, height);
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
            
            const texture = await NoiseTextureGenerator.generateTextureNoise(textureType, width, height);
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
  
}

export default new NoiseTextureGenerator()