class ColorHelper {
    static hexToRgba(hex, alpha = 1) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    static adjustColor(hexColor, factor) {
        const rgb = this.hexToRgb(hexColor);
        return `rgb(${Math.min(255, Math.floor(rgb.r * factor))}, 
                    ${Math.min(255, Math.floor(rgb.g * factor))}, 
                    ${Math.min(255, Math.floor(rgb.b * factor))})`;
    }

    static hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
        } : null;
    }

    // Function to lighten color
    static lightenColor(hexColor, factor) {
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

    // Enhanced color darkening function
    static darkenColor(hexColor, factor) {
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

    // Helper method to parse background color
    static  parseBackgroundColor(color) {
        if (!color) return { r: 255, g: 255, b: 255, alpha: 1 };
        
        if (typeof color === 'string' && color.startsWith('#')) {
            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5, 7), 16);
            return { r, g, b, alpha: 1 };
        }
        
        return color;
    }

//   darkenColor(hexColor, factor) {
//     if (!hexColor) return '#FFFFFF';
//     try {
//       const rgb = this.hexToRgb(hexColor);
//       if (!rgb) return hexColor;
//       return `#${[rgb.r, rgb.g, rgb.b]
//         .map(c => Math.floor(c * factor))
//         .map(c => c.toString(16).padStart(2, '0'))
//         .join('')}`;
//     } catch (error) {
//       console.warn('Error darkening color:', error);
//       return hexColor;
//     }
//   }

}

export default ColorHelper;