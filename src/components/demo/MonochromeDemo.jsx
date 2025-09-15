'use client';

import { useState } from 'react';

const MonochromeDemo = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div className="p-8 space-y-8 bg-primary">
      {/* Header with floating animation */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-primary animate-float">
          Monochrome Portfolio Design
        </h1>
        <p className="text-secondary max-w-2xl mx-auto">
          Elegant monochrome design with smooth animations and hover effects inspired by modern portfolio examples.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in-sequence">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="modern-card hover-lift animate-fade-in-up"
            onMouseEnter={() => setHoveredCard(i)}
            onMouseLeave={() => setHoveredCard(null)}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="space-y-4">
              <div className="w-full h-32 bg-tertiary rounded-lg flex items-center justify-center">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-xl font-semibold text-primary">
                Card {i}
              </h3>
              <p className="text-secondary">
                Beautiful monochrome design with smooth transitions and elegant hover effects.
              </p>
              <button className="modern-btn-secondary w-full">
                Learn More
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Elements */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-primary text-center">
          Interactive Elements
        </h2>

        {/* Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button className="modern-btn">Primary Button</button>
          <button className="modern-btn-secondary">Secondary Button</button>
          <button className="icon-hover px-4 py-2 border border-primary rounded-lg text-primary hover:text-accent">
            <span>Icon Button</span>
            <svg className="inline-block ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>

        {/* Form Elements */}
        <div className="max-w-md mx-auto space-y-4">
          <input
            type="text"
            placeholder="Try typing here..."
            className="modern-input"
          />
          <textarea
            placeholder="This textarea has smooth animations too..."
            className="modern-input resize-none"
            rows={4}
          />
        </div>

        {/* Animation Examples */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          <div className="theme-card hover-scale text-center p-4">
            <div className="animate-pulse text-lg mb-2">⚡</div>
            <span className="text-sm text-secondary">Pulse</span>
          </div>
          <div className="theme-card hover-rotate text-center p-4">
            <div className="text-lg mb-2">🔄</div>
            <span className="text-sm text-secondary">Rotate</span>
          </div>
          <div className="theme-card hover-lift text-center p-4">
            <div className="text-lg mb-2">⬆️</div>
            <span className="text-sm text-secondary">Lift</span>
          </div>
          <div className="theme-card text-center p-4 relative overflow-hidden">
            <div className="animate-shimmer absolute inset-0 opacity-30"></div>
            <div className="relative text-lg mb-2">✨</div>
            <span className="text-sm text-secondary relative">Shimmer</span>
          </div>
        </div>
      </div>

      {/* Theme Toggle Demo */}
      <div className="text-center space-y-4 py-8 border-t border-primary">
        <p className="text-secondary">
          Switch between light and dark modes to see the monochrome palette in action
        </p>
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-tertiary rounded-lg">
          <span className="text-sm text-secondary">Light</span>
          <div className="w-8 h-8 rounded-full bg-accent animate-pulse"></div>
          <span className="text-sm text-secondary">Dark</span>
        </div>
      </div>
    </div>
  );
};

export default MonochromeDemo;