import { ThemeContext } from '@/components/theme/themeProvider';
import { Sun, Moon } from 'lucide-react';
import { useContext } from 'react';

export const ThemeToggleAnimated = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    return (
      <button 
        onClick={toggleTheme}
        className="p-2 rounded-full text-foreground bg-secondary/10 
                  hover:bg-secondary/20 transform hover:scale-110 
                  transition-all duration-200"
        aria-label="Toggle theme"
      >
        <div className="relative w-5 h-5">
          <Sun className={`absolute inset-0 transform transition-transform duration-200 
            ${theme === 'light' ? 'rotate-0 opacity-100' : 'rotate-90 opacity-0'}`} 
          />
          <Moon className={`absolute inset-0 transform transition-transform duration-200
            ${theme === 'dark' ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'}`}
          />
        </div>
      </button>
    );
  };