// src/lib/imageGenerator/gridSystem.js
export class GridSystem {
    constructor(width, height) {
      this.width = width;
      this.height = height;
    }
  
    distributeText(lines, columns = 1) {
      if (columns === 1) return lines;
      
      const linesPerColumn = Math.ceil(lines.length / columns);
      const distributedText = [];
      
      for (let i = 0; i < columns; i++) {
        distributedText.push(lines.slice(i * linesPerColumn, (i + 1) * linesPerColumn));
      }
      
      return distributedText;
    }
  
    calculateColumnWidths(width, columns, gutterWidth = 20) {
      const totalGutterWidth = (columns - 1) * gutterWidth;
      const availableWidth = width - totalGutterWidth;
      const columnWidth = availableWidth / columns;
      
      return {
        columnWidth,
        gutterWidth,
        columns
      };
    }
  }