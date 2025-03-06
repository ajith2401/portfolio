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
        relative p-3 rounded-full transition-all duration-500
        ${isDark 
          ? 'bg-slate-800 shadow-inner shadow-slate-900 hover:bg-slate-700' 
          : 'bg-sky-100 hover:bg-sky-200 shadow'}
      `}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div className="relative w-6 h-6 flex items-center justify-center">
        {/* Sun */}
        <Sun 
          className={`absolute transition-all duration-500 ease-in-out
            ${isDark 
              ? 'opacity-0 rotate-90 scale-0' 
              : 'opacity-100 rotate-0 scale-100 text-amber-500'
            }`}
          size={24}
        />
        
        {/* Moon */}
        <Moon 
          className={`absolute transition-all duration-500 ease-in-out
            ${isDark 
              ? 'opacity-100 rotate-0 scale-100 text-slate-300' 
              : 'opacity-0 -rotate-90 scale-0'
            }`}
          size={22}
        />
        
        {/* Stars around the moon in dark mode */}
        <Stars 
          className={`absolute -top-1 -right-1 transition-all duration-500 ease-in-out
            ${isDark 
              ? 'opacity-70 rotate-0 scale-100 text-yellow-200' 
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