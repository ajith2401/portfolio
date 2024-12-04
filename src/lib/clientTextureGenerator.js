
// src/lib/clientTextureGenerator.js

export const generateTextureSVG = (type, width, height, options = {}) => {
  // console.log(options);
  
  switch (type) {
    case 'starrySky':
      return generateStarrySky(width, height, options);
    case 'waterDrops':
      return generateWaterDrops(width, height, options);
    case 'lacePattern':
      return generateLacePattern(width, height, options);
    case 'flyingBirds':
      return generateFlyingBirds(width, height, options);
    default:
      return null;
  }
};

const generateStarrySky = (width, height, options = {}) => {
  const {
    starCount = 200,
    starBrightness = 0.8
  } = options;

  const stars = Array.from({ length: starCount }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 2 + 1,
    opacity: Math.random() * starBrightness
  }));

  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#001"/>
      ${stars.map(star => `
        <circle
          cx="${star.x}"
          cy="${star.y}"
          r="${star.size}"
          fill="white"
          opacity="${star.opacity}"
        />
      `).join('')}
    </svg>
  `;
};

const generateWaterDrops = (width, height, options = {}) => {
  const { dropCount = 50 } = options;
  const drops = Array.from({ length: dropCount }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 20 + 5
  }));

  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="dropGradient">
          <stop offset="0%" stop-color="white" stop-opacity="0.5"/>
          <stop offset="100%" stop-color="white" stop-opacity="0"/>
        </radialGradient>
      </defs>
      ${drops.map(drop => `
        <circle
          cx="${drop.x}"
          cy="${drop.y}"
          r="${drop.size}"
          fill="url(#dropGradient)"
        />
      `).join('')}
    </svg>
  `;
};

const generateLacePattern = (width, height, options = {}) => {
  const { scale = 50 } = options;
  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="lacePattern" x="0" y="0" width="${scale}" height="${scale}" patternUnits="userSpaceOnUse">
          <path d="M0,0 L${scale},0 L${scale},${scale} L0,${scale} Z" fill="none" stroke="white" stroke-width="1"/>
          <circle cx="${scale/2}" cy="${scale/2}" r="${scale/4}" fill="none" stroke="white" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#lacePattern)"/>
    </svg>
  `;
};

const generateFlyingBirds = (width, height, options = {}) => {
  const { birdCount = 30 } = options;
  const birds = Array.from({ length: birdCount }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    rotation: Math.random() * 360
  }));

  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      ${birds.map(bird => `
        <path
          d="M0,0 C5,-5 10,-5 15,0 C20,-5 25,-5 30,0"
          transform="translate(${bird.x},${bird.y}) rotate(${bird.rotation})"
          stroke="black"
          fill="none"
          opacity="0.3"
        />
      `).join('')}
    </svg>
  `;
};
