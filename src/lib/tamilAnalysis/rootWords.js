// src/lib/tamilAnalysis/rootWords.js
import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';

class TamilRootWordProcessor {
  constructor() {
    this.rootWords = new Map();
    this.derivations = new Map();
  }

  async loadRootWords() {
    try {
      const results = [];
      const filePath = path.join(process.cwd(), 'data', 'tamil-root-words.csv');
      
      await new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csvParser())
          .on('data', (data) => {
            // Parse each row
            const root = data.Root?.trim();
            const derivations = data.derivation?.split(',')
              .map(d => d.trim())
              .filter(d => d);

            if (root) {
              this.rootWords.set(root, {
                derivations,
                frequency: derivations.length
              });

              // Create reverse lookup for derivations
              derivations.forEach(word => {
                this.derivations.set(word, root);
              });
            }
          })
          .on('end', resolve)
          .on('error', reject);
      });

      console.log(`Loaded ${this.rootWords.size} root words and ${this.derivations.size} derivations`);
    } catch (error) {
      console.error('Error loading root words:', error);
      throw error;
    }
  }

  findRoot(word) {
    // First check if it's a direct derivation
    if (this.derivations.has(word)) {
      return this.derivations.get(word);
    }

    // Then check if it's a root word itself
    if (this.rootWords.has(word)) {
      return word;
    }

    return null;
  }

  getAllDerivations(root) {
    return this.rootWords.get(root)?.derivations || [];
  }

  isRelated(word1, word2) {
    const root1 = this.findRoot(word1);
    const root2 = this.findRoot(word2);
    return root1 && root2 && root1 === root2;
  }
}

export const tamilRootProcessor = new TamilRootWordProcessor();

