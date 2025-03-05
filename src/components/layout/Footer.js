import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-background py-8 mt-16">
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
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-playfair text-h4 text-foreground">Contact</h4>
            <ul className="space-y-2">
              <li className="text-body-sm text-secondary-600 dark:text-secondary-400">
                Chennai, Tamil Nadu, India
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
                { name: 'LinkedIn', url: 'https://linkedin.com/in/ajithkumar-r-85b72016a' },
                { name: 'Twitter', url: 'https://twitter.com' }
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-container px-4 py-2 rounded-md text-body-sm text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-all hover:-translate-y-1"
                >
                  {social.name}
                </a>
              ))}
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
          <div className="flex items-center gap-4">
            <a
              href="/privacy"
              className="text-body-sm text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Privacy Policy
            </a>
            <span className="text-secondary-400">•</span>
            <a
              href="/terms"
              className="text-body-sm text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;