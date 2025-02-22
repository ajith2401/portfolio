'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ThemeToggleAnimated } from '../ui/button/ThemeToggleButton';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  const NavLink = ({ href, children }) => (
    <Link
      href={href}
      className={`relative text-foreground hover:text-primary transition-colors group ${
        isActive(href) ? 'text-primary' : ''
      }`}
    >
      {children}
      <span
        className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-red-500 transition-all duration-300 group-hover:w-full
        ${isActive(href) ? 'w-full' : ''}`}
      />
    </Link>
  );

  return (
    <nav className="w-full py-4 bg-background border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link 
          href="/" 
          style={{ color: 'var(--logo-color)' }}
          className="flex items-start p-0 w-[200px] h-[30px] font-great-vibes text-logo leading-[30px]"
        >
          Ajith Kumar
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6 text-foreground" />
          ) : (
            <Menu className="h-6 w-6 text-foreground" />
          )}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-8 text-lg">
            <li>
              <NavLink href="/">Home</NavLink>
            </li>
            <li>
              <NavLink href="/devfolio">Devfolio</NavLink>
            </li>
            <li>
            <NavLink href="/techblog">Tech Blog</NavLink>
          </li>
            <li>
              <NavLink href="/quill">Quill</NavLink>
            </li>
            <li>
              <NavLink href="/spotlight">Spotlight</NavLink>
            </li>
            <li>
              <button className="ml-4 px-6 py-2 rounded-full bg-red-800 text-white hover:bg-red-700 transition-colors">
                Contact Me
              </button>
            </li>
          </ul>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <ThemeToggleAnimated />
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 px-6">
          <ul className="flex flex-col gap-4 text-lg">
            <li>
              <NavLink href="/">Home</NavLink>
            </li>
            <li>
              <NavLink href="/devfolio">Devfolio</NavLink>
            </li>
            <li>
              <NavLink href="/techblog">Tech Blog</NavLink>
            </li>
            <li>
              <NavLink href="/quill">Quill</NavLink>
            </li>
            <li>
              <NavLink href="/spotlight">Spotlight</NavLink>
            </li>
            <li>
              <button className="w-full px-4 py-2 rounded-full bg-red-800 text-white hover:bg-red-700 transition-colors">
                Contact Me
              </button>
            </li>
            <li>
              <ThemeToggleAnimated />
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;