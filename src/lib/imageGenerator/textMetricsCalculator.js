import { TEXT_METRICS } from "./textMextrcis";

export class TextMetricsCalculator {
    static calculateMetrics(lineCount, category, hasTitle = false) {
      // 1. Validate line count with new maximum
      const validLineCount = Math.max(
        TEXT_METRICS.MIN_LINES,
        Math.min(lineCount, TEXT_METRICS.MAX_LINES)
      );
  
      // 2. Calculate available space
      const titleHeight = hasTitle ? 120 : 0;
      const availableHeight = TEXT_METRICS.CANVAS_HEIGHT - 
                            TEXT_METRICS.BRANDING_HEIGHT - 
                            titleHeight;
  
      // 3. Calculate initial font size based on line count
      const fontSize = this.calculateDynamicFontSize(validLineCount);
      
      // 4. Calculate line height
      const lineHeight = this.calculateDynamicLineHeight(validLineCount);
      
      // 5. Calculate initial text block height
      const textBlockHeight = this.calculateTextBlockHeight(validLineCount, fontSize, lineHeight);
      
      // 6. Adjust values if content exceeds boundaries
      const { adjustedFontSize, adjustedLineHeight } = this.adjustForBoundaries(
        fontSize, 
        lineHeight, 
        textBlockHeight, 
        availableHeight,
        validLineCount
      );
  
      // 7. Calculate final text block height
      const finalTextBlockHeight = this.calculateTextBlockHeight(
        validLineCount, 
        adjustedFontSize, 
        adjustedLineHeight
      );
  
      // 8. Calculate optimal top position
      const topPosition = this.calculateTopPosition(
        validLineCount, 
        finalTextBlockHeight, 
        hasTitle
      );
  
      // 9. Calculate words per line based on font size and category
      const maxWordsPerLine = category === 'poem' ? 
        TEXT_METRICS.POEM_MAX_WORDS : 
        Math.min(
          TEXT_METRICS.PROSE_MAX_WORDS,
          Math.floor((TEXT_METRICS.CANVAS_WIDTH - 120) / (adjustedFontSize * 2))
        );
  
      return {
        fontSize: adjustedFontSize,
        lineHeight: adjustedLineHeight,
        topPosition,
        maxWordsPerLine,
        textBlockHeight: finalTextBlockHeight,
        metrics: {
          totalHeight: finalTextBlockHeight + titleHeight + TEXT_METRICS.BRANDING_HEIGHT,
          exceedsCanvas: finalTextBlockHeight > availableHeight
        }
      };
    }
  
    static calculateDynamicFontSize(lineCount) {
      // Find appropriate threshold
      const threshold = TEXT_METRICS.LINE_THRESHOLDS.find(t => lineCount <= t.lines) || 
                       TEXT_METRICS.LINE_THRESHOLDS[TEXT_METRICS.LINE_THRESHOLDS.length - 1];
      
      // Calculate reduction for lines exceeding threshold
      const reduction = Math.max(0, 
        Math.floor((lineCount - TEXT_METRICS.FONT_REDUCTION.MIN_THRESHOLD) / 5) * 
        TEXT_METRICS.FONT_REDUCTION.STEP
      );
      
      // Ensure we never go below minimum font size
      return Math.max(
        TEXT_METRICS.MIN_FONT_SIZE,
        threshold.fontSize - reduction
      );
    }
    static calculateDynamicLineHeight(lineCount) {
      const threshold = TEXT_METRICS.LINE_THRESHOLDS.find(t => lineCount <= t.lines) || 
                       TEXT_METRICS.LINE_THRESHOLDS[TEXT_METRICS.LINE_THRESHOLDS.length - 1];
      
      return Math.max(
        TEXT_METRICS.MIN_LINE_HEIGHT,
        threshold.lineHeight
      );
    }
  
    static calculateTextBlockHeight(lineCount, fontSize, lineHeight) {
      return lineCount * fontSize * lineHeight;
    }
  
    static adjustForBoundaries(fontSize, lineHeight, textBlockHeight, availableHeight, lineCount) {
      let adjustedFontSize = fontSize;
      let adjustedLineHeight = lineHeight;
  
      // If content exceeds boundaries, adjust line height first
      if (textBlockHeight > availableHeight) {
        adjustedLineHeight = Math.max(
          TEXT_METRICS.MIN_LINE_HEIGHT,
          (availableHeight / (lineCount * fontSize))
        );
        
        // If still too large, reduce font size to minimum
        if (lineCount * fontSize * adjustedLineHeight > availableHeight) {
          adjustedFontSize = TEXT_METRICS.MIN_FONT_SIZE;
          adjustedLineHeight = TEXT_METRICS.MIN_LINE_HEIGHT;
        }
      }
  
      return { adjustedFontSize, adjustedLineHeight };
    }
  
    static calculateTopPosition(lineCount, textBlockHeight, hasTitle) {
      let position = TEXT_METRICS.BASE_POSITION;
      
      // Adjust position based on content length
      if (lineCount > 15) {
        position -= Math.min(50, (lineCount - 15) * 3);
      }
      
      // Ensure minimum position
      position = Math.max(TEXT_METRICS.MIN_POSITION, position);
      
      // Add title offset if present
      if (hasTitle) {
        position += 80;
      }
      
      return position;
    }

    static calculateTopPositionLineCount(lineCount) {
      // Base position for single line
      const basePosition = 500;
      const decrementPerLine = 10;  // Decrease by 10px per line
      const minPosition = 150;      // Minimum top position
      
      // Validate line count
      if (lineCount < 1) return basePosition;
      if (lineCount > 25) lineCount = 25;  // Cap at maximum 25 lines
    
      // Calculate position
      let position = basePosition - ((lineCount - 1) * decrementPerLine);
      
      // Ensure position doesn't go below minimum
      return Math.max(position, minPosition);
    }



    static lineCounter(text, category = 'poem') {
      if (!text) return 0;
      
      const maxWordsPerLine = category === 'poem' ? 4 : 8;
      const lines = text.split('\n').filter(line => line.trim());
      let totalLines = 0;
      
      lines.forEach(line => {
        const words = line.split(' ').filter(word => word.trim());
        const additionalLines = Math.ceil(words.length / maxWordsPerLine);
        totalLines += additionalLines;
      });
      
      return totalLines;
    }

    static calculateDynamicTextMetrics(text, category) {
      const lines = text.split('\n').filter(line => line.trim());
      const totalChars = text.length;
      const wordsPerLine = category === 'poem' ? 
        TEXT_METRICS.POEM_MAX_WORDS : 
        TEXT_METRICS.PROSE_MAX_WORDS;
      
      // Calculate optimal font size based on content length
      let fontSize = TEXT_METRICS.MAX_FONT_SIZE;
      if (totalChars > 500) {
        fontSize = Math.max(
          TEXT_METRICS.MIN_FONT_SIZE, 
          TEXT_METRICS.MAX_FONT_SIZE - Math.floor(totalChars / 500)
        );
      }

      // Calculate optimal line height
      let lineHeight = TEXT_METRICS.MAX_LINE_HEIGHT;
      if (lines.length > 15) {
        lineHeight = Math.max(
          TEXT_METRICS.MIN_LINE_HEIGHT,
          TEXT_METRICS.MAX_LINE_HEIGHT - (lines.length / 30)
        );
      }

      // Calculate top position
      let topPosition = TEXT_METRICS.BASE_POSITION;
      if (lines.length > 15) {
        topPosition = Math.max(
          TEXT_METRICS.MIN_POSITION,
          topPosition - ((lines.length - 15) * TEXT_METRICS.DECREMENT_PER_LINE)
        );
      }

      return {
        fontSize,
        lineHeight,
        wordsPerLine,
        topPosition
      };
    }

    // Update textFormatter method
    static textFormatter(text, category = 'article') {
      if (!text) return '';
      
      const maxWordsPerLine = category === 'poem' ? 
        TEXT_METRICS.POEM_MAX_WORDS : 
        TEXT_METRICS.PROSE_MAX_WORDS;
        
      const lines = text.split('\n').filter(line => line.trim());
      const formattedLines = [];
      
      lines.forEach(line => {
        const words = line.split(' ').filter(word => word.trim());
        
        if (words.length <= maxWordsPerLine) {
          formattedLines.push(line);
          return;
        }
        
        // Split into multiple lines
        for (let i = 0; i < words.length; i += maxWordsPerLine) {
          const lineWords = words.slice(i, Math.min(i + maxWordsPerLine, words.length));
          formattedLines.push(lineWords.join(' '));
        }
      });
      
      return formattedLines.join('\n');
    }


    // Helper function for calculating text metrics
    static calculateTextMetrics(text, fontSize, fontFamily) {
      // Approximate character widths based on script
      const metrics = {
        tamil: fontSize * 0.8,  // Tamil characters are typically wider
        latin: fontSize * 0.5,  // Latin characters
        space: fontSize * 0.3   // Space between words
      };

      const tamilCount = (text.match(/[\u0B80-\u0BFF]/g) || []).length;
      const spaceCount = (text.match(/\s/g) || []).length;
      const latinCount = text.length - tamilCount - spaceCount;

      return {
        width: (tamilCount * metrics.tamil) + 
              (latinCount * metrics.latin) + 
              (spaceCount * metrics.space),
        height: fontSize * 1.2
      };
    }

    // Helper method for Tamil text metrics
    static calculateTamilTextWidth(text, fontSize) {
      const tamilCharCount = (text.match(/[\u0B80-\u0BFF]/g) || []).length;
      const latinCharCount = text.length - tamilCharCount;
      
      // Adjust width calculation for Tamil characters
      return (tamilCharCount * fontSize * 0.8) + (latinCharCount * fontSize * 0.5);
    }

    // Update the wrapText method to handle different alignments
    static wrapText(text, maxChars, alignment = 'start') {
      if (!text) return [];
      
      // Adjust max chars based on alignment
      const adjustedMaxChars = alignment === 'start' ? maxChars + 5 : maxChars;
      
      // Split by explicit line breaks first
      const paragraphs = text.split('\n');
      
      // Process each paragraph for word wrapping
      return paragraphs.map(paragraph => {
        const words = paragraph.split(' ');
        const lines = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
          const word = words[i];
          const testLine = `${currentLine} ${word}`;
          
          // Adjust for Tamil characters
          const tamilCharCount = (testLine.match(/[\u0B80-\u0BFF]/g) || []).length;
          const effectiveLength = testLine.length + (tamilCharCount * 0.3);

          if (effectiveLength <= adjustedMaxChars) {
            currentLine = testLine;
          } else {
            lines.push(currentLine);
            currentLine = word;
          }
        }
        
        if (currentLine) {
          lines.push(currentLine);
        }
        
        return lines;
      }).flat();
    }

    static calculateTextDimensions(text, fontSize, fontFamily) {
    // Utility method to calculate text dimensions
    const avgCharWidth = fontSize * 0.6; // Approximate width for Tamil chars
    const tamilCharCount = (text.match(/[\u0B80-\u0BFF]/g) || []).length;
    const latinCharCount = text.length - tamilCharCount;
    
    return {
      width: (tamilCharCount * avgCharWidth * 1.2) + (latinCharCount * avgCharWidth),
      height: fontSize * 1.2
    };
  }

  }

export default new TextMetricsCalculator();