class BackgroundDecorationGenerator {
    static generateRandomDecoration() {
      const decorations = [
        this.generatePen,
        this.generateBird,
        this.generateBook,
        this.generateFlower,
        this.generateLeaf,
        this.generateTree,
        this.generatePerson
      ];
      
      const randomDecoration = decorations[Math.floor(Math.random() * decorations.length)];
      return randomDecoration();
    }
  
    static generateDecorationSVG(width, height) {
      const numDecorations = Math.floor(Math.random() * 3) + 1; // 1-3 decorations
      const decorations = [];
      
      for (let i = 0; i < numDecorations; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const scale = 0.3 + Math.random() * 0.4; // Random scale between 0.3 and 0.7
        const rotation = Math.random() * 360;
        const opacity = 0.08 + Math.random() * 0.07; // Very light opacity between 0.08 and 0.15
        
        decorations.push(`
          <g transform="translate(${x} ${y}) scale(${scale}) rotate(${rotation})"
             opacity="${opacity}"
             fill="currentColor">
            ${this.generateRandomDecoration()}
          </g>
        `);
      }
  
      return `
        <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"
             xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="blur">
              <feGaussianBlur stdDeviation="0.5" />
            </filter>
          </defs>
          ${decorations.join('\n')}
        </svg>
      `;
    }
  
    // Individual decoration generators
    static generatePen() {
      return `
        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
      `;
    }
  
    static generateBird() {
      return `
        <path d="M23 11.5l-3.5-3.5v-3c0-.55-.45-1-1-1s-1 .45-1 1v1.5L14 3c-1.1-1.1-2.9-1.1-4 0L2 11.5c-.29.29-.29.77 0 1.06s.77.29 1.06 0L4 11.64V21h16v-9.36l.94.94c.29.29.77.29 1.06 0s.29-.77 0-1.06z"/>
      `;
    }
  
    static generateBook() {
      return `
        <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"/>
      `;
    }
  
    static generateFlower() {
      return `
        <path d="M12 22c4.97 0 9-4.03 9-9-4.97 0-9 4.03-9 9zM5.6 10.25c0 1.38 1.12 2.5 2.5 2.5.53 0 1.01-.16 1.42-.44l-.02.19c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5l-.02-.19c.4.28.89.44 1.42.44 1.38 0 2.5-1.12 2.5-2.5 0-1-.59-1.85-1.43-2.25.84-.4 1.43-1.25 1.43-2.25 0-1.38-1.12-2.5-2.5-2.5-.53 0-1.01.16-1.42.44l.02-.19C14.5 2.12 13.38 1 12 1S9.5 2.12 9.5 3.5l.02.19c-.4-.28-.89-.44-1.42-.44-1.38 0-2.5 1.12-2.5 2.5 0 1 .59 1.85 1.43 2.25-.84.4-1.43 1.25-1.43 2.25zM12 5.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5S9.5 9.38 9.5 8s1.12-2.5 2.5-2.5z"/>
      `;
    }
  
    static generateLeaf() {
      return `
        <path d="M6.11 21.25C6.06 21.5 6 21.74 6 22h12c0-.26-.06-.5-.11-.75C16.7 18.11 14.5 16 12 16s-4.7 2.11-5.89 5.25zM12 8c-2.76 0-5 2.24-5 5v2c0 .28.22.5.5.5s.5-.22.5-.5v-2c0-2.21 1.79-4 4-4s4 1.79 4 4v2c0 .28.22.5.5.5s.5-.22.5-.5v-2c0-2.76-2.24-5-5-5z"/>
      `;
    }
  
    static generateTree() {
      return `
        <path d="M17 11h3v2h-3v3h-2v-3h-3v-2h3V8h2v3zM3 5v14c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2zm2 0h6v14H5V5z"/>
      `;
    }
  
    static generatePerson() {
      return `
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
      `;
    }
  }
  
  export default BackgroundDecorationGenerator;