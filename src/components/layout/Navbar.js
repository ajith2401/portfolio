'use client';

import Link from 'next/link';
import { useState, useContext } from 'react';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { ThemeContext } from '../theme/themeProvider';
import { ThemeToggleAnimated } from '../ui/button/ThemeToggleButton';
import ContactForm from '../ui/ContactForm';
import eventEmitter from '@/lib/eventEmitter';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const pathname = usePathname();
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  // Add handleSubscribe function
  const handleSubscribe = () => {
    if (eventEmitter) {
      eventEmitter.emit('showSubscriptionModal');
    }
  };

  const isActive = (path) => pathname === path;

  const NavLink = ({ href, children }) => (
    <Link
      href={href}
      className={`relative text-primary transition-all group ${
        isActive(href)
          ? 'text-accent-primary font-medium'
          : 'hover:text-accent-primary'
      }`}
    >
      {children}
      <span
        className={`absolute -bottom-1 left-0 h-0.5 transition-all duration-300 bg-accent-primary
          ${isActive(href) ? 'w-full' : 'w-0 group-hover:w-full'}`}
      />
    </Link>
  );

  const openContactForm = () => {
    setIsContactFormOpen(true);
    // Close mobile menu if open
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full backdrop-blur-md transition-all duration-300 bg-card/80 border-b border-color">
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
            {/* Theme Toggle for Mobile */}
            <ThemeToggleAnimated />
            <button
              className="p-2 rounded-xl transition-colors bg-tertiary/50 hover:bg-tertiary text-primary"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
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
                <button 
                  onClick={openContactForm}
                  className={`
                    ml-4 px-6 py-2 rounded-full transition-all duration-300
                    ${isDark
                      ? 'bg-primary-400 text-slate-900 hover:bg-primary-300'
                      : 'bg-primary-600 text-white hover:bg-primary-700'}
                    hover:shadow-lg
                  `}
                >
                  Contact Me
                </button>
              </li>
              
              {/* Add Subscribe button */}
              <li>
                <button 
                  onClick={handleSubscribe}
                  className={`
                    px-4 py-1.5 rounded-full transition-all duration-300
                    border border-primary-400 text-primary-600
                    hover:bg-primary-50 dark:hover:bg-primary-900/30
                  `}
                >
                  Subscribe
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
                <button 
                  onClick={openContactForm}
                  className={`
                    w-full px-6 py-3 rounded-full transition-all duration-300
                    ${isDark
                      ? 'bg-primary-400 text-slate-900 hover:bg-primary-300'
                      : 'bg-primary-600 text-white hover:bg-primary-700'}
                    hover:shadow-lg
                  `}
                >
                  Contact Me
                </button>
              </li>
              
              {/* Add Subscribe button for mobile menu */}
              <li>
                <button 
                  onClick={handleSubscribe}
                  className={`
                    w-full px-6 py-2 mt-2 rounded-full transition-all duration-300
                    border border-primary-400 text-primary-600
                    hover:bg-primary-50 dark:hover:bg-primary-900/30
                  `}
                >
                  Subscribe to Updates
                </button>
              </li>
            </ul>
          </div>
        )}
      </nav>

      {/* Contact Form Modal */}
      <ContactForm 
        isOpen={isContactFormOpen} 
        onClose={() => setIsContactFormOpen(false)} 
      />
    </>
  );
};

export default Navbar;