// src/components/navigation/NavLinks.jsx
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';

export default function NavLinks() {
  const pathname = usePathname();
  
  const links = [
    { href: '/', label: 'Home' },
    { href: '/techblog', label: 'Tech Blog' },
    { href: '/quill', label: 'Writings' },
    { href: '/devfolio', label: 'Portfolio' },
    { href: '/spotlight', label: 'Spotlight' },
    { href: '/about', label: 'About' },
  ];
  
  // Preload routes on hover for faster navigation
  const prefetchRoute = (href) => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
  };
  
  return (
    <nav>
      <ul className="flex space-x-6">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`transition-colors ${
                pathname === link.href ? 'text-primary font-medium' : 'text-gray-600 hover:text-primary'
              }`}
              onMouseEnter={() => prefetchRoute(link.href)}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}