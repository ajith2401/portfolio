'use client';

import Link from 'next/link';
import { useState, useContext } from 'react';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { ThemeContext } from '../theme/themeProvider';
import { ThemeToggleAnimated } from '../ui/button/ThemeToggleButton';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const isActive = (path) => pathname === path;

  const NavLink = ({ href, children }) => (
    <Link
      href={href}
      className={`relative text-foreground transition-all group ${
        isActive(href) 
          ? 'text-primary font-medium' 
          : 'hover:text-primary'
      }`}
    >
      {children}
      <span
        className={`absolute -bottom-1 left-0 h-0.5 transition-all duration-300 
          ${isDark ? 'bg-primary-400' : 'bg-primary-600'}
          ${isActive(href) ? 'w-full' : 'w-0 group-hover:w-full'}`}
      />
    </Link>
  );

  return (
    <nav className={`
      sticky top-0 z-50 w-full backdrop-blur-md transition-all duration-300
      ${isDark 
        ? 'bg-slate-900/70 border-b border-slate-800' 
        : 'bg-sky-60/70 border-b border-sky-100'}
    `}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link 
          href="/" 
          style={{ color: 'var(--logo-color)' }}
          className="flex items-start p-0 w-[200px] h-[30px] font-great-vibes text-logo leading-[30px]"
        >
          Ajith Kumar
        </Link>

        {/* Mobile Menu Section */}
        <div className="md:hidden flex items-center space-x-2">
          {/* Mobile Menu Button */}
           {/* Theme Toggle for Mobile */}
          <ThemeToggleAnimated />
          <button
            className="p-2 rounded-md transition-colors bg-background/20 hover:bg-background/30"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>    
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-8">
            <li><NavLink href="/">Home</NavLink></li>
            <li><NavLink href="/devfolio">Devfolio</NavLink></li>
            <li><NavLink href="/blog">Blog</NavLink></li>
            <li><NavLink href="/quill">Quill</NavLink></li>
            <li><NavLink href="/spotlight">Spotlight</NavLink></li>
            <li>
              <button className={`
                ml-4 px-6 py-2 rounded-full transition-all duration-300
                ${isDark
                  ? 'bg-primary-400 text-slate-900 hover:bg-primary-300'
                  : 'bg-primary-600 text-white hover:bg-primary-700'}
                hover:shadow-lg
              `}>
                Contact Me
              </button>
            </li>
          </ul>
        </div>
        
        <div className="hidden md:flex">
          <ThemeToggleAnimated />
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className={`
          md:hidden px-6 py-4 animate-slide-down
          ${isDark ? 'bg-slate-900/95' : 'bg-sky-50/95'}
          backdrop-blur-md
        `}>
          <ul className="flex flex-col gap-6">
            <li onClick={() => setIsMenuOpen(!isMenuOpen)}><NavLink href="/">Home</NavLink></li>
            <li onClick={() => setIsMenuOpen(!isMenuOpen)}><NavLink href="/devfolio">Devfolio</NavLink></li>
            <li onClick={() => setIsMenuOpen(!isMenuOpen)}><NavLink href="/blog">Tech Blog</NavLink></li>
            <li onClick={() => setIsMenuOpen(!isMenuOpen)}><NavLink href="/quill">Quill</NavLink></li>
            <li onClick={() => setIsMenuOpen(!isMenuOpen)}><NavLink href="/spotlight">Spotlight</NavLink></li>
            <li>
              <button className={`
                w-full px-6 py-3 rounded-full transition-all duration-300
                ${isDark
                  ? 'bg-primary-400 text-slate-900 hover:bg-primary-300'
                  : 'bg-primary-600 text-white hover:bg-primary-700'}
                hover:shadow-lg
              `}>
                Contact Me
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;