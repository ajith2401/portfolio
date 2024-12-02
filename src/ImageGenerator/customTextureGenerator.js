import sharp from "sharp";

export class CustomTextureGenerator {
  static async generateStarrySky(width, height, options = {}) {
    const {
      starCount = 200,
      starSize = 2,
      starBrightness = 0.8,
      backgroundDarkness = 0.1
    } = options;

    // Create dark background using the background buffer
    const background = await sharp({
      create: {
        width,
        height,
        channels: 4,
        background: { r: 0, g: 0, b: 30, alpha: 0.3 }
      }
    }).png().toBuffer();

    const stars = Array.from({ length: starCount }, () => ({
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height),
      brightness: 0.5 + Math.random() * 0.5,
      size: Math.max(1, Math.random() * starSize)
    }));

    const starsSvg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        ${stars.map(star => `
          <g>
            <circle
              cx="${star.x}"
              cy="${star.y}"
              r="${star.size}"
              fill="white"
              opacity="${star.brightness * starBrightness}"
            />
            <circle
              cx="${star.x}"
              cy="${star.y}"
              r="${star.size * 2}"
              fill="white"
              opacity="${star.brightness * 0.3 * starBrightness}"
            />
            <!-- Add star sparkle effect -->
            <path
              d="M ${star.x - star.size * 2},${star.y} L ${star.x + star.size * 2},${star.y} M ${star.x},${star.y - star.size * 2} L ${star.x},${star.y + star.size * 2}"
              stroke="white"
              stroke-width="0.5"
              opacity="${star.brightness * 0.2 * starBrightness}"
            />
          </g>
        `).join('')}
      </svg>`;

    return {
      composite: [
        {
          input: background,
          blend: 'over',
          opacity: 1
        },
        {
          input: Buffer.from(starsSvg),
          blend: 'screen',
          opacity: 1
        }
      ],
      modulate: {
        brightness: 1.1,
        saturation: 0.8,
        lightness: 1.05
      }
    };
  }

  static async generateFlyingBirds(width, height, options = {}) {
    const {
      birdCount = 50,
      minSize = 10,
      maxSize = 30,
      opacity = 0.6
    } = options;

    const birds = Array.from({ length: birdCount }, () => ({
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height),
      size: minSize + Math.random() * (maxSize - minSize),
      rotation: Math.random() * 360,
      opacity: 0.3 + Math.random() * 0.7
    }));

    // Improved bird shape
    const birdsSvg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        ${birds.map(bird => `
          <path
            d="M0,0 L5,-3 A3,3 0 0,1 10,0 A3,3 0 0,1 15,-3 L20,0 L15,3 A3,3 0 0,1 10,0 A3,3 0 0,1 5,3 Z"
            transform="translate(${bird.x},${bird.y}) scale(${bird.size / 20}) rotate(${bird.rotation})"
            fill="black"
            opacity="${bird.opacity * opacity}"
          />
        `).join('')}
      </svg>`;

    return {
      composite: [{
        input: Buffer.from(birdsSvg),
        blend: 'multiply',
        opacity: 1
      }],
      modulate: { brightness: 1.0, saturation: 1.0, lightness: 1.0 }
    };
  }

  static async generateLacePattern(width, height, options = {}) {
    const {
      scale = 1,
      opacity = 0.8,
      color = 'white'
    } = options;

    const patternSize = 100 * scale;
    const flowerPattern = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="flowerPattern" x="0" y="0" width="${patternSize}" height="${patternSize}" patternUnits="userSpaceOnUse">
            <path d="
              M50,20 C60,10 70,15 75,25 C80,35 75,45 65,45 C55,45 50,35 55,25 Z
              M25,50 C15,40 20,30 30,25 C40,20 50,25 50,35 C50,45 40,50 30,45 Z
              M50,80 C40,90 30,85 25,75 C20,65 25,55 35,55 C45,55 50,65 45,75 Z
              M75,50 C85,60 80,70 70,75 C60,80 50,75 50,65 C50,55 60,50 70,55 Z"
              fill="${color}"
              opacity="${opacity}"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#flowerPattern)"/>
      </svg>`;

    return {
      composite: [{
        input: Buffer.from(flowerPattern),
        blend: 'overlay',
        opacity: opacity
      }],
      modulate: { brightness: 1.05, saturation: 0.9, lightness: 1.02 }
    };
  }

  static async generateDenimTexture(width, height, options = {}) {
    const {
      density = 0.8,
      color = '#1a365d',
      opacity = 0.9
    } = options;

    // Create diagonal line pattern
    const lineSpacing = 4;
    const lines = [];
    for (let i = 0; i < width + height; i += lineSpacing) {
      lines.push(`
        <line 
          x1="${i}" y1="0" 
          x2="${i - height}" y2="${height}"
          stroke="${color}"
          stroke-width="1"
          opacity="${0.3 * density}"
        />
      `);
    }

    const denimPattern = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="denimWeave" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
            <rect width="8" height="8" fill="${color}" opacity="0.1"/>
            <line x1="0" y1="0" x2="8" y2="8" stroke="${color}" stroke-width="1" opacity="0.2"/>
            <line x1="8" y1="0" x2="0" y2="8" stroke="${color}" stroke-width="1" opacity="0.2"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#denimWeave)"/>
        <g opacity="${opacity}">${lines.join('')}</g>
      </svg>`;

    return {
      composite: [
        {
          input: Buffer.from(denimPattern),
          blend: 'overlay',
          opacity: 1
        }
      ],
      modulate: { brightness: 0.95, saturation: 1.2, lightness: 0.9 }
    };
  }

  static async generateWaterDrops(width, height, options = {}) {
    const {
      largeDropCount = 80,      // Reduced for less crowding
      smallDropCount = 1000,    // Increased tiny drops
      maxDropSize = 20,         // Reduced max size
      minDropSize = 0.5,        // Smaller minimum size
      opacity = 0.85            // Slightly reduced opacity
    } = options;

    const createDrop = (isLarge = false) => {
      const size = isLarge 
        ? minDropSize * 4 + Math.pow(Math.random(), 2) * (maxDropSize - minDropSize * 4)
        : minDropSize + Math.pow(Math.random(), 4) * minDropSize * 2;
      
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size,
        skewX: 1 + (Math.random() * 0.1 - 0.05),
        skewY: 1 + (Math.random() * 0.1 - 0.05),
        opacity: 0.3 + Math.random() * 0.5,
        highlightOffsetX: size * (0.25 + Math.random() * 0.1),
        highlightOffsetY: size * (0.25 + Math.random() * 0.1)
      };
    };

    const largeDrops = Array.from({ length: largeDropCount }, () => createDrop(true));
    const smallDrops = Array.from({ length: smallDropCount }, () => createDrop(false));
    const allDrops = [...largeDrops, ...smallDrops];

    const dropsSvg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- Main drop gradient with softer transitions -->
          <radialGradient id="dropGradient">
            <stop offset="0%" stop-color="white" stop-opacity="0.4"/>
            <stop offset="30%" stop-color="white" stop-opacity="0.3"/>
            <stop offset="60%" stop-color="white" stop-opacity="0.2"/>
            <stop offset="100%" stop-color="white" stop-opacity="0"/>
          </radialGradient>
          
          <!-- Highlight gradient with sharper contrast -->
          <radialGradient id="highlightGradient">
            <stop offset="0%" stop-color="white" stop-opacity="0.9"/>
            <stop offset="50%" stop-color="white" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="white" stop-opacity="0"/>
          </radialGradient>
          
          <!-- Edge highlight for 3D effect -->
          <radialGradient id="edgeGradient">
            <stop offset="50%" stop-color="white" stop-opacity="0.5"/>
            <stop offset="100%" stop-color="white" stop-opacity="0"/>
          </radialGradient>

          <!-- Subtle shadow -->
          <filter id="dropShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="0.5"/>
            <feOffset dx="0.5" dy="0.5"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        ${allDrops.map(drop => `
          <g opacity="${drop.opacity * opacity}" filter="url(#dropShadow)">
            <!-- Base drop -->
            <ellipse
              cx="${drop.x}"
              cy="${drop.y}"
              rx="${drop.size * drop.skewX}"
              ry="${drop.size * drop.skewY}"
              fill="url(#dropGradient)"
            />
            
            <!-- Edge highlight -->
            <ellipse
              cx="${drop.x}"
              cy="${drop.y}"
              rx="${drop.size * drop.skewX * 0.95}"
              ry="${drop.size * drop.skewY * 0.95}"
              fill="url(#edgeGradient)"
              opacity="0.4"
            />
            
            <!-- Main highlight -->
            <ellipse
              cx="${drop.x - drop.highlightOffsetX * 0.7}"
              cy="${drop.y - drop.highlightOffsetY * 0.7}"
              rx="${drop.size * 0.35 * drop.skewX}"
              ry="${drop.size * 0.35 * drop.skewY}"
              fill="url(#highlightGradient)"
              opacity="0.6"
            />
            
            <!-- Bright spot -->
            <circle
              cx="${drop.x - drop.highlightOffsetX * 0.5}"
              cy="${drop.y - drop.highlightOffsetY * 0.5}"
              r="${drop.size * 0.1}"
              fill="white"
              opacity="0.8"
            />
          </g>
        `).join('')}
      </svg>`;

    return {
      composite: [
        // Deeper shadow layer
        {
          input: Buffer.from(dropsSvg),
          blend: 'multiply',
          opacity: 0.1
        },
        // Main drops layer
        {
          input: Buffer.from(dropsSvg),
          blend: 'screen',
          opacity: 0.9
        },
        // Subtle highlight layer
        {
          input: Buffer.from(dropsSvg),
          blend: 'screen',
          opacity: 0.2
        }
      ],
      modulate: {
        brightness: 1.02,
        saturation: 0.95,
        lightness: 1.01
      }
    };
}
}

export default CustomTextureGenerator;