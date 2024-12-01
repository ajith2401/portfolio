'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ThemeToggleAnimated } from '../ui/button/ThemeToggleButton';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="w-full py-4 bg-background border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="ajith-logo text-[30px] font-great-vibes text-foreground">
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
              <Link
                href="/"
                className="text-foreground hover:text-primary transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/devfolio"
                className="text-foreground hover:text-primary transition-colors"
              >
                Devfolio
              </Link>
            </li>
            <li>
              <Link
                href="/quill"
                className="text-foreground hover:text-primary transition-colors"
              >
                Quill
              </Link>
            </li>
            <li>
              <Link
                href="/spotlight"
                className="text-foreground hover:text-primary transition-colors"
              >
                Spotlight
              </Link>
            </li>
            <li>
            <button className="ml-4 px-6 py-2 rounded-full bg-red-800 text-white hover:bg-red-700 transition-colors">
            Contact Me
          </button>
            </li>
          </ul>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <ThemeToggleAnimated/>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 px-6">
          <ul className="flex flex-col gap-4 text-lg">
            <li>
              <Link
                href="/"
                className="block text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/devfolio"
                className="block text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Devfolio
              </Link>
            </li>
            <li>
              <Link
                href="/quill"
                className="block text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Quill
              </Link>
            </li>
            <li>
              <Link
                href="/spotlight"
                className="block text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Spotlight
              </Link>
            </li>
            <li>
              <button className="w-full px-4 py-2 rounded-full bg-red-800 text-white hover:bg-red-700 transition-colors">
                Contact Me
              </button>
            </li>
            <li>
              <ThemeToggleAnimated/>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;