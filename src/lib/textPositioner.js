// src/lib/textPositioner.js
export class TextPositioner {
    constructor(containerWidth = 1200, containerHeight = 1200) {
      this.width = containerWidth;
      this.height = containerHeight;
      this.padding = 60;
      this.contentPadding = 100; // Additional padding for content blocks
    }
  
    getPosition(position, textHeight, alignment) {
      // Get base position
      const basePosition = this._getBasePosition(position, textHeight);
      
      // Calculate content margins
      const margins = this._calculateMargins(position);
      
      // Adjust position based on alignment
      const adjustedPosition = this._adjustForAlignment(basePosition, alignment, margins);
      
      return {
        ...adjustedPosition,
        contentBox: {
          x: margins.left,
          y: margins.top,
          width: this.width - (margins.left + margins.right),
          height: this.height - (margins.top + margins.bottom)
        }
      };
    }
  
    _getBasePosition(position, textHeight) {
      // Calculate available content area
      const contentArea = {
        width: this.width - (this.padding * 2),
        height: this.height - (this.padding * 2)
      };

      const positions = {
        'top-right': { 
          x: this.width - this.contentPadding,
          y: this.contentPadding + textHeight/2,
          blockWidth: contentArea.width/2,
          zone: 'top'
        },
        'top-left': {
          x: this.contentPadding,
          y: this.contentPadding + textHeight/2,
          blockWidth: contentArea.width/2,
          zone: 'top'
        },
        'top-center': {
          x: this.width/2,
          y: this.contentPadding + textHeight/2,
          blockWidth: contentArea.width,
          zone: 'top'
        },
        'bottom-right': {
          x: this.width - this.contentPadding,
          y: this.height - (this.contentPadding + textHeight),
          blockWidth: contentArea.width/2,
          zone: 'bottom'
        },
        'bottom-left': {
          x: this.contentPadding,
          y: this.height - (this.contentPadding + textHeight),
          blockWidth: contentArea.width/2,
          zone: 'bottom'
        },
        'bottom-center': {
          x: this.width/2,
          y: this.height - (this.contentPadding + textHeight),
          blockWidth: contentArea.width,
          zone: 'bottom'
        },
        'middle-right': {
          x: this.width - this.contentPadding,
          y: this.height/2,
          blockWidth: contentArea.width/2,
          zone: 'middle'
        },
        'middle-left': {
          x: this.contentPadding,
          y: this.height/2,
          blockWidth: contentArea.width/2,
          zone: 'middle'
        },
        'middle-center': {
          x: this.width/2,
          y: this.height/2,
          blockWidth: contentArea.width,
          zone: 'middle'
        }
      };
      
      return positions[position] || positions['middle-center'];
    }
  
    _calculateMargins(position) {
      const defaultMargin = this.padding;
      const margins = {
        top: defaultMargin,
        right: defaultMargin,
        bottom: defaultMargin,
        left: defaultMargin
      };

      // Adjust margins based on position
      if (position.includes('right')) {
        margins.left = this.width / 2;
      } else if (position.includes('left')) {
        margins.right = this.width / 2;
      }

      return margins;
    }

    _adjustForAlignment(position, alignment = 'center', margins) {
      const { x, y, blockWidth, zone } = position;
      
      // Calculate effective width for the text block
      const effectiveWidth = this.width - (margins.left + margins.right);
      
      let anchor;
      let adjustedX = x;
      let adjustedY = y;

      // Handle horizontal alignment
      switch(alignment) {
        case 'left':
          anchor = 'start';
          adjustedX = margins.left + (this.contentPadding / 2);
          break;
        case 'right':
          anchor = 'end';
          adjustedX = this.width - margins.right - (this.contentPadding / 2);
          break;
        case 'justify':
          anchor = 'start';
          adjustedX = margins.left + (this.contentPadding / 2);
          break;
        default: // center
          anchor = 'middle';
          adjustedX = margins.left + (effectiveWidth / 2);
      }

      // Adjust vertical position based on zone
      switch(zone) {
        case 'top':
          adjustedY = margins.top + this.contentPadding;
          break;
        case 'bottom':
          adjustedY = this.height - margins.bottom - this.contentPadding;
          break;
        default: // middle
          adjustedY = this.height / 2;
      }

      return {
        x: adjustedX,
        y: adjustedY,
        anchor,
        blockWidth: effectiveWidth,
        alignment
      };
    }

    // Helper method to calculate text metrics for Tamil text
    calculateTextMetrics(text, fontSize) {
      const tamilCharWidth = fontSize * 0.8;
      const latinCharWidth = fontSize * 0.5;
      const spaceWidth = fontSize * 0.3;

      const tamilCount = (text.match(/[\u0B80-\u0BFF]/g) || []).length;
      const spaceCount = (text.match(/\s/g) || []).length;
      const latinCount = text.length - tamilCount - spaceCount;

      return {
        width: (tamilCount * tamilCharWidth) + 
               (latinCount * latinCharWidth) + 
               (spaceCount * spaceWidth),
        height: fontSize * 1.2
      };
    }
}

export default new TextPositioner();