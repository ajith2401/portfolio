// src/lib/imageGenerator/effectsSystem.js

export class EffectsSystem {
    constructor() {
      this.effects = {
        shadow: {
          generate: (params) => this.generateShadowEffect(params),
          defaultParams: {
            blur: 3,
            offset: { x: 2, y: 2 },
            color: '#000000',
            opacity: 0.3
          }
        },
        glow: {
          generate: (params) => this.generateGlowEffect(params),
          defaultParams: {
            blur: 5,
            color: '#ffffff',
            strength: 0.8,
            opacity: 0.5
          }
        },
        gradient: {
          generate: (params) => this.generateGradientEffect(params),
          defaultParams: {
            colors: ['#000000', '#333333'],
            angle: 45,
            stops: [0, 100]
          }
        },
        outline: {
          generate: (params) => this.generateOutlineEffect(params),
          defaultParams: {
            width: 2,
            color: '#000000',
            opacity: 1
          }
        },
        neon: {
          generate: (params) => this.generateNeonEffect(params),
          defaultParams: {
            color: '#ff00ff',
            blur: 5,
            strength: 2,
            layers: 3
          }
        },
        dotted: {
          generate: (params) => this.generateDottedEffect(params),
          defaultParams: {
            size: 2,
            spacing: 5,
            color: '#000000',
            opacity: 0.5
          }
        },
        texture: {
          generate: (params) => this.generateTextureEffect(params),
          defaultParams: {
            pattern: 'noise',
            scale: 1,
            opacity: 0.2,
            blendMode: 'overlay'
          }
        },
        distort: {
          generate: (params) => this.generateDistortEffect(params),
          defaultParams: {
            scale: 5,
            frequency: 0.1,
            turbulence: 2
          }
        }
      };
  
      // Initialize filter IDs
      this.filterIdCounter = 0;
    }
  
    generateUniqueId(prefix = 'effect') {
      return `${prefix}-${++this.filterIdCounter}`;
    }
  
    generateEffect(effectName, params = {}) {
      const effect = this.effects[effectName];
      if (!effect) throw new Error(`Effect ${effectName} not found`);
      
      const effectParams = { ...effect.defaultParams, ...params };
      return effect.generate(effectParams);
    }
  
    combineEffects(effectsList) {
      const filterId = this.generateUniqueId('combined');
      let filterElements = '';
      
      effectsList.forEach((effect, index) => {
        const params = typeof effect === 'string' ? {} : effect.params;
        const effectName = typeof effect === 'string' ? effect : effect.name;
        
        filterElements += this.generateEffect(effectName, params);
      });
  
      return `
        <filter id="${filterId}" x="-50%" y="-50%" width="200%" height="200%">
          ${filterElements}
        </filter>
      `;
    }
  
    generateShadowEffect(params) {
      const filterId = this.generateUniqueId('shadow');
      return `
        <filter id="${filterId}">
          <feGaussianBlur in="SourceAlpha" stdDeviation="${params.blur}"/>
          <feOffset dx="${params.offset.x}" dy="${params.offset.y}" result="offsetblur"/>
          <feFlood flood-color="${params.color}" flood-opacity="${params.opacity}"/>
          <feComposite in2="offsetblur" operator="in"/>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      `;
    }
  
    generateGlowEffect(params) {
      const filterId = this.generateUniqueId('glow');
      return `
        <filter id="${filterId}">
          <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 1 0" result="mask"/>
          <feFlood flood-color="${params.color}" flood-opacity="${params.opacity}" result="color"/>
          <feComposite in="color" in2="mask" operator="in" result="colored-mask"/>
          <feGaussianBlur in="colored-mask" stdDeviation="${params.blur}" result="blurred"/>
          <feComposite in="blurred" in2="SourceGraphic" operator="over"/>
          <feComponentTransfer>
            <feFuncA type="linear" slope="${params.strength}"/>
          </feComponentTransfer>
        </filter>
      `;
    }
  
    generateGradientEffect(params) {
      const gradientId = this.generateUniqueId('gradient');
      const filterId = this.generateUniqueId('gradient-filter');
      
      return `
        <linearGradient id="${gradientId}" gradientTransform="rotate(${params.angle})">
          ${params.colors.map((color, index) => {
            const offset = params.stops[index] || (index * 100 / (params.colors.length - 1));
            return `<stop offset="${offset}%" stop-color="${color}"/>`;
          }).join('\n')}
        </linearGradient>
        <filter id="${filterId}">
          <feFlood flood-color="white" result="neutral"/>
          <feComposite in="neutral" in2="SourceAlpha" operator="in"/>
          <feImage xlink:href="#${gradientId}" result="gradient"/>
          <feComposite in="gradient" in2="SourceAlpha" operator="in"/>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      `;
    }
  
    generateOutlineEffect(params) {
      const filterId = this.generateUniqueId('outline');
      return `
        <filter id="${filterId}">
          <feMorphology operator="dilate" radius="${params.width}" in="SourceAlpha" result="thicken"/>
          <feFlood flood-color="${params.color}" flood-opacity="${params.opacity}"/>
          <feComposite in2="thicken" operator="in"/>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      `;
    }
  
    generateNeonEffect(params) {
      const filterId = this.generateUniqueId('neon');
      let layers = '';
      
      // Generate multiple glow layers for neon effect
      for (let i = 1; i <= params.layers; i++) {
        const intensity = (params.layers - i + 1) * (params.strength / params.layers);
        layers += `
          <feGaussianBlur in="SourceAlpha" stdDeviation="${params.blur * i}" result="blur${i}"/>
          <feFlood flood-color="${params.color}" flood-opacity="${intensity}" result="color${i}"/>
          <feComposite in="color${i}" in2="blur${i}" operator="in" result="glow${i}"/>
        `;
      }
  
      return `
        <filter id="${filterId}">
          ${layers}
          <feMerge>
            ${Array.from({ length: params.layers }, (_, i) => 
              `<feMergeNode in="glow${i + 1}"/>`
            ).join('\n')}
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      `;
    }
  
    generateDottedEffect(params) {
      const patternId = this.generateUniqueId('dotted-pattern');
      const filterId = this.generateUniqueId('dotted');
      
      return `
        <pattern id="${patternId}" patternUnits="userSpaceOnUse" width="${params.spacing}" height="${params.spacing}">
          <circle cx="${params.spacing/2}" cy="${params.spacing/2}" r="${params.size/2}" 
                  fill="${params.color}" opacity="${params.opacity}"/>
        </pattern>
        <filter id="${filterId}">
          <feFlood flood-color="white" result="neutral"/>
          <feComposite in="neutral" in2="SourceAlpha" operator="in"/>
          <feImage xlink:href="#${patternId}" result="pattern"/>
          <feComposite in="pattern" in2="SourceAlpha" operator="in"/>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      `;
    }
  
    generateTextureEffect(params) {
      const filterId = this.generateUniqueId('texture');
      return `
        <filter id="${filterId}">
          <feTurbulence type="fractalNoise" baseFrequency="${params.scale}" numOctaves="3" result="noise"/>
          <feColorMatrix type="matrix" in="noise" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${params.opacity} 0" result="adjusted"/>
          <feBlend in="SourceGraphic" in2="adjusted" mode="${params.blendMode}"/>
        </filter>
      `;
    }
  
    generateDistortEffect(params) {
      const filterId = this.generateUniqueId('distort');
      return `
        <filter id="${filterId}">
          <feTurbulence type="turbulence" baseFrequency="${params.frequency}" numOctaves="1" result="turbulence"/>
          <feDisplacementMap in2="turbulence" in="SourceGraphic" scale="${params.scale}" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      `;
    }
  
    // Utility method to apply effects to SVG elements
    applyEffects(svgElement, effects) {
      const effectsList = Array.isArray(effects) ? effects : [effects];
      const combinedFilter = this.combineEffects(effectsList);
      const filterId = combinedFilter.match(/id="([^"]+)"/)[1];
      
      return svgElement.replace(/^(<[^>]+)>/, `$1 filter="url(#${filterId})">`);
    }
  
    // Generate a preview of an effect
    generateEffectPreview(effectName, params = {}) {
      const previewText = 'Preview';
      const effect = this.generateEffect(effectName, params);
      const filterId = effect.match(/id="([^"]+)"/)[1];
      
      return `
        <svg width="200" height="100">
          <defs>${effect}</defs>
          <text x="100" y="50" font-family="Arial" font-size="24" fill="black" 
                text-anchor="middle" filter="url(#${filterId})">${previewText}</text>
        </svg>
      `;
    }
  }
  
  export default new EffectsSystem();