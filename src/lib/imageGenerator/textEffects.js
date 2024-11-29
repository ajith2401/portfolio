//src/lib/imageGenerator/textEffects.js
export class TextEffectProcessor {
  constructor() {
    this.supportedEffects = {
      shadow: {
        default: { blur: 3, opacity: 0.3, offset: { x: 2, y: 2 } }
      },
      glow: {
        default: { intensity: 0.4, spread: 5, color: '#ffffff' }
      },
      outline: {
        default: { width: 2, color: '#000000' }
      },
      gradient: {
        default: {
          colors: ['#000000', '#333333'],
          angle: 45,
          stops: [0, 100]
        }
      }
    };
  }

  generateShadowFilter(options = {}) {
    const {
      blur = this.supportedEffects.shadow.default.blur,
      opacity = this.supportedEffects.shadow.default.opacity,
      offset = this.supportedEffects.shadow.default.offset
    } = options;

    return `
      <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="${blur}"/>
        <feOffset dx="${offset.x}" dy="${offset.y}" result="offsetblur"/>
        <feComponentTransfer>
          <feFuncA type="linear" slope="${opacity}"/>
        </feComponentTransfer>
        <feMerge>
          <feMergeNode/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    `;
  }

  generateGlowFilter(options = {}) {
    const {
      intensity = this.supportedEffects.glow.default.intensity,
      spread = this.supportedEffects.glow.default.spread,
      color = this.supportedEffects.glow.default.color
    } = options;

    return `
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="${spread}"/>
        <feComponentTransfer>
          <feFuncA type="linear" slope="${intensity}"/>
        </feComponentTransfer>
        <feFlood flood-color="${color}" result="glow-color"/>
        <feComposite in="glow-color" in2="SourceGraphic" operator="in"/>
        <feMerge>
          <feMergeNode/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    `;
  }

  generateOutlineFilter(options = {}) {
    const {
      width = this.supportedEffects.outline.default.width,
      color = this.supportedEffects.outline.default.color
    } = options;

    return `
      <filter id="outline">
        <feMorphology operator="dilate" radius="${width}"/>
        <feFlood flood-color="${color}"/>
        <feComposite in2="SourceAlpha" operator="in"/>
        <feMerge>
          <feMergeNode/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    `;
  }

  generateGradientFilter(options = {}, theme = null) {
    const {
      colors = this.supportedEffects.gradient.default.colors,
      angle = this.supportedEffects.gradient.default.angle,
      stops = this.supportedEffects.gradient.default.stops
    } = options;

    // Use theme colors if available
    const gradientColors = theme?.colors ? [
      theme.colors.text,
      theme.colors.accent || theme.colors.text
    ] : colors;

    return `
      <linearGradient id="textGradient" gradientTransform="rotate(${angle})">
        ${gradientColors.map((color, index) => {
          const offset = stops[index] || (index * 100 / (gradientColors.length - 1));
          return `<stop offset="${offset}%" stop-color="${color}"/>`;
        }).join('\n')}
      </linearGradient>
    `;
  }

  // Combine multiple effects
  generateCombinedFilters(effects = [], theme = null) {
    const filters = [];
    
    effects.forEach((effect, index) => {
      switch (effect.type) {
        case 'shadow':
          filters.push(this.generateShadowFilter(effect.options));
          break;
        case 'glow':
          filters.push(this.generateGlowFilter(effect.options));
          break;
        case 'outline':
          filters.push(this.generateOutlineFilter(effect.options));
          break;
        case 'gradient':
          filters.push(this.generateGradientFilter(effect.options, theme));
          break;
      }
    });

    return filters.join('\n');
  }

  // Apply filter to SVG element
  applyFilter(element, effectType, id = null) {
    const filterId = id || effectType;
    return `${element.replace(/>/, ` filter="url(#${filterId})">`)}`;
  }

  // Utility method to validate effects
  validateEffect(effect) {
    return this.supportedEffects[effect.type] !== undefined;
  }
}

export default new TextEffectProcessor();
