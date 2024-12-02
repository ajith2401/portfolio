//src/lib/ImageGenerator/textMextrcis.js
export const TEXT_METRICS = {
    CANVAS_WIDTH: 1200,
    CANVAS_HEIGHT: 1200,
    BRANDING_HEIGHT: 150,  // Fixed branding space at bottom
    
    // Line count thresholds
    MIN_LINES: 1,
    MAX_LINES: 28,  // (1200 - 150 branding) / (24px * 1.4 min spacing) ≈ 31.5 lines max
    
    // Font size ranges - Adjusted for new minimum
    MAX_FONT_SIZE: 32,     // For short content (1-5 lines)
    MIN_FONT_SIZE: 24,     // New minimum for better readability
    
    // Line height ranges - Optimized for new font sizes
    MAX_LINE_HEIGHT: 1.8,  // For content with few lines (1-10)
    MIN_LINE_HEIGHT: 1.4,  // Minimum readable spacing for Tamil
    
    // Positioning - Adjusted for new metrics
    BASE_POSITION: 200,    // Reduced to accommodate larger minimum font
    MIN_POSITION: 80,      // Minimum distance from top
    
    // Words per line
    POEM_MAX_WORDS: 4,
    PROSE_MAX_WORDS: 8,    // 8 words max for prose
    
    // Dynamic adjustment thresholds - Recalculated for new minimum font size
    LINE_THRESHOLDS: [
      { lines: 8,  fontSize: 32, lineHeight: 2 },  // 1-8 lines: largest font
      { lines: 15, fontSize: 28, lineHeight: 2 },  // 9-15 lines: medium font
      { lines: 20, fontSize: 26, lineHeight: 2 },  // 16-20 lines: smaller font
      { lines: 28, fontSize: 24, lineHeight: 2 }   // 21+ lines: minimum font
    ],
    
    // Font reduction steps - Adjusted for new range
    FONT_REDUCTION: {
      STEP: 2,            // Smaller steps due to smaller font range
      MIN_THRESHOLD: 5    // Start reducing after 5 lines
    }
  };