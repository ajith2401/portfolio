'use client';

import { useContext } from 'react';
import { Sun, Moon, Stars } from 'lucide-react';
import { ThemeContext } from '@/components/theme/themeProvider';

export const ThemeToggleAnimated = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  return (
    <button 
      onClick={toggleTheme}
      className={`
        relative p-3 rounded-xl transition-all duration-300
        ${isDark
          ? 'bg-tertiary border border-color hover:bg-secondary shadow-lg'
          : 'bg-card border border-color hover:bg-secondary shadow-lg'}
        hover:scale-105 active:scale-95
      `}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div className="relative w-6 h-6 flex items-center justify-center">
        {/* Sun */}
        <Sun
          className={`absolute transition-all duration-300 ease-in-out
            ${isDark
              ? 'opacity-0 rotate-90 scale-0'
              : 'opacity-100 rotate-0 scale-100 text-warning'
            }`}
          size={24}
        />

        {/* Moon */}
        <Moon
          className={`absolute transition-all duration-300 ease-in-out
            ${isDark
              ? 'opacity-100 rotate-0 scale-100 text-info'
              : 'opacity-0 -rotate-90 scale-0'
            }`}
          size={22}
        />

        {/* Stars around the moon in dark mode */}
        <Stars
          className={`absolute -top-1 -right-1 transition-all duration-300 ease-in-out
            ${isDark
              ? 'opacity-70 rotate-0 scale-100 text-accent'
              : 'opacity-0 rotate-90 scale-0'
            }`}
          size={12}
        />
      </div>
      
      {/* Glow effect */}
      <div 
        className={`absolute inset-0 rounded-full transition-opacity duration-500 ${
          isDark ? 'opacity-0' : 'opacity-50 animate-pulse'
        }`}
        style={{
          background: 'radial-gradient(circle, rgba(255,177,60,0.3) 0%, rgba(255,177,60,0) 70%)',
        }}
      />
    </button>
  );
};

export default ThemeToggleAnimated;