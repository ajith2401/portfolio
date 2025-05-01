'use client';

import React from 'react';
import Link from 'next/link';
import eventEmitter from '@/lib/eventEmitter';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  // Add this function to handle subscription button click
  const handleSubscribe = () => {
    if (eventEmitter) {
      eventEmitter.emit('showSubscriptionModal');
    }
  };

  return (
    <footer className="w-full py-8 mt-16">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="font-great-vibes text-logo text-foreground">Ajith Kumar</h3>
            <p className="text-body-sm text-secondary-600 dark:text-secondary-400">
              Crafting digital experiences with passion and precision. Full-stack developer focused on creating impactful solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-playfair text-h4 text-foreground">Quick Links</h4>
            <ul className="space-y-2">
              {['DevFolio', 'Quill', 'Spotlight', 'Contact'].map((item) => (
                <li key={item}>
                  <a
                    href={`${item.toLowerCase()}`}
                    className="text-body-sm text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
              {/* Add Subscribe link */}
              <li>
                <button
                  onClick={handleSubscribe}
                  className="text-body-sm text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Subscribe
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-playfair text-h4 text-foreground">Contact</h4>
            <ul className="space-y-2">
              <li className="text-body-sm text-secondary-600 dark:text-secondary-400">
                Bangalore, Karnataka, India
              </li>
              <li>
                <a
                  href="mailto:ajith24ram@gmail.com"
                  className="text-body-sm text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  ajith24ram@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h4 className="font-playfair text-h4 text-foreground">Connect</h4>
            <div className="flex flex-wrap gap-4">
              {[
                { name: 'GitHub', url: 'https://github.com/ajith2401' },
                { name: 'LinkedIn', url: 'https://www.linkedin.com/in/ajithkumar-r-a6531a232/' },
                { name: 'Twitter', url: 'https://twitter.com' }
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="clean-container px-4 py-2 rounded-md text-body-sm text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-all hover:-translate-y-1"
                >
                  {social.name}
                </a>
              ))}
              
              {/* Add Subscribe button */}
              <button
                onClick={handleSubscribe}
                className="clean-container px-4 py-2 rounded-md text-body-sm text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-all hover:-translate-y-1 border border-primary-400"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-decorative-line opacity-20 my-6"></div>

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-body-sm text-secondary-600 dark:text-secondary-400">
            © {currentYear} Ajith Kumar. All rights reserved.
          </p>
    
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <Link
              href="/privacy-policy"
              className="text-body-sm text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="text-secondary-400">•</span>
            <Link
              href="/terms-conditions"
              className="text-body-sm text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Terms of Service
            </Link>
            <span className="text-secondary-400">•</span>
            <button
              onClick={handleSubscribe}
              className="text-body-sm text-primary-600 dark:text-primary-400 hover:underline transition-colors"
            >
              Subscribe to Updates
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;