// src/lib/tamilAnalysis/analyzer.js
import { tamilPatterns } from './wordPatterns';
import { sentimentPatterns } from './sentimentPatterns';
import { poeticPatterns } from './poeticPatterns';

export class TamilTextAnalyzer {
  constructor() {
    this.patterns = tamilPatterns || {};
    this.sentiments = sentimentPatterns || {};
    this.poetics = poeticPatterns || {};
  }

  analyzeText(text) {
    if (!text) {
      return {
        themes: { primary: 'default', secondary: null, scores: {} },
        sentiment: { polarity: 'neutral', intensity: 1, score: 0 },
        style: 'default'
      };
    }

    const words = this.tokenize(text);
    
    return {
      themes: this.analyzeThemes(words),
      sentiment: this.analyzeSentiment(text, words),
      style: this.determineStyle(text)
    };
  }

  tokenize(text) {
    if (!text) return [];
    return text
      .trim()
      .split(/[\s,.!?]+/)
      .filter(word => word.length > 0);
  }

  analyzeThemes(words) {
    if (!Array.isArray(words) || words.length === 0) {
      return { primary: 'default', secondary: null, scores: {} };
    }

    const themeScores = {};
    
    Object.entries(this.patterns).forEach(([theme, patterns]) => {
      let score = 0;
      if (patterns && patterns.stems) {
        words.forEach(word => {
          // Check stems
          if (patterns.stems.some(stem => word.startsWith(stem))) {
            score += 2;
          }
          // Check compounds
          if (patterns.compounds && patterns.compounds.includes(word)) {
            score += 3;
          }
          // Check metaphors
          if (patterns.metaphors && patterns.metaphors.includes(word)) {
            score += 1.5;
          }
        });
      }
      themeScores[theme] = score;
    });

    const sortedThemes = Object.entries(themeScores)
      .sort(([,a], [,b]) => b - a);

    return {
      primary: sortedThemes[0]?.[0] || 'default',
      secondary: sortedThemes[1]?.[0] || null,
      scores: themeScores
    };
  }

  analyzeSentiment(text, words) {
    if (!Array.isArray(words) || words.length === 0) {
      return { polarity: 'neutral', intensity: 1, score: 0 };
    }

    let score = 0;
    let intensity = 1;

    // Check positive sentiment words
    if (this.sentiments.positive && Array.isArray(this.sentiments.positive.words)) {
      words.forEach(word => {
        if (this.sentiments.positive.words.includes(word)) {
          score += 1;
        }
      });
    }

    // Check negative sentiment words
    if (this.sentiments.negative && Array.isArray(this.sentiments.negative.words)) {
      words.forEach(word => {
        if (this.sentiments.negative.words.includes(word)) {
          score -= 1;
        }
      });
    }

    // Check intensity modifiers
    if (this.sentiments.positive && this.sentiments.positive.intensity) {
      Object.entries(this.sentiments.positive.intensity).forEach(([level, modifiers]) => {
        if (Array.isArray(modifiers)) {
          modifiers.forEach(modifier => {
            if (text.includes(modifier)) {
              intensity *= level === 'high' ? 1.5 : level === 'low' ? 0.5 : 1;
            }
          });
        }
      });
    }

    return {
      score: score * intensity,
      polarity: score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral',
      intensity
    };
  }

  determineStyle(text) {
    if (!text) return 'default';
    
    // Simple style determination based on punctuation and length
    if (text.includes('...') || text.includes('!')) {
      return 'emotional';
    } else if (text.length > 200) {
      return 'philosophical';
    }
    return 'default';
  }
}

export default new TamilTextAnalyzer();