/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // Enable dark mode using class strategy (we're controlling it via data-theme attributes)
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    // Container configurations
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
    },
    extend: {
      fontFamily: {
        'great-vibes': ['var(--font-great-vibes)', 'cursive'],
        'inter': ['var(--font-inter)', 'sans-serif'],
        'playfair': ['var(--font-playfair)', 'serif'],
        'geist-sans': ['var(--font-geist-sans)', 'sans-serif'],
        'geist-mono': ['var(--font-geist-mono)', 'monospace'],
        'merriweather': ['var(--font-merriweather)', 'serif'],
        'dm-sans': ['var(--font-dm-sans)', 'sans-serif'],
        'work-sans': ['var(--font-work-sans)', 'sans-serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'monospace'],
        heading: ['var(--font-heading)', 'serif'],
        'poppins': ['var(--font-poppins)', 'sans-serif'], 
      },
      // Color palette
      colors: {
        // Theme colors (light mode by default)
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          50: "var(--primary-50)",
          100: "var(--primary-100)",
          200: "var(--primary-200)",
          300: "var(--primary-300)",
          400: "var(--primary-400)",
          500: "var(--primary-500)",
          600: "var(--primary-600)",
          700: "var(--primary-700)",
          800: "var(--primary-800)",
          900: "var(--primary-900)",
          DEFAULT: "var(--primary-500)",
        },
        secondary: {
          50: "var(--secondary-50)",
          100: "var(--secondary-100)",
          200: "var(--secondary-200)",
          300: "var(--secondary-300)",
          400: "var(--secondary-400)",
          500: "var(--secondary-500)",
          600: "var(--secondary-600)",
          700: "var(--secondary-700)",
          800: "var(--secondary-800)",
          900: "var(--secondary-900)",
          DEFAULT: "var(--secondary-500)",
        },
        accent: "var(--accent)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        'decorative-line': {
          DEFAULT: 'var(--decorative-line-color)',
        }
      },
      // Font sizes with line heights
      fontSize: {
        // For headings
        'display-1': ['4.5rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'display-2': ['3.75rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'display-3': ['3rem', { lineHeight: '1.25', letterSpacing: '-0.02em' }],
        'custom-56': ['56px', { lineHeight: '72.91px' }],
        // For body text
        'body-lg': ['1.125rem', { lineHeight: '1.75' }],
        'body-base': ['1rem', { lineHeight: '1.75' }],
        'body-sm': ['0.875rem', { lineHeight: '1.75' }],
        // For UI elements
        'ui-lg': ['1.125rem', { lineHeight: '1.5' }],
        'ui-base': ['1rem', { lineHeight: '1.5' }],
        'ui-sm': ['0.875rem', { lineHeight: '1.5' }],
        // Logo specific size
        'logo': ['24px', {
          lineHeight: '30.05px',
          letterSpacing: '0',
        }],
        
        // Heading sizes
        'h1': ['48px', {
          lineHeight: '1.2',
          letterSpacing: '-0.02em',
        }],
        'h2': ['36px', {
          lineHeight: '1.3',
          letterSpacing: '-0.01em',
        }],
        'h3': ['30px', {
          lineHeight: '1.4',
          letterSpacing: '0',
        }],
        'h4': ['24px', {
          lineHeight: '1.5',
          letterSpacing: '0',
        }],
        
        // Body text sizes
        'body-lg': ['18px', {
          lineHeight: '1.75',
          letterSpacing: '0.01em',
        }],
        'body': ['16px', {
          lineHeight: '1.75',
          letterSpacing: '0.01em',
        }],
        'body-sm': ['14px', {
          lineHeight: '1.75',
          letterSpacing: '0.01em',
        }],
      },

      lineHeight: {
        '34': '34px',  // This will create a 'leading-34' class
      },
      // Spacing scale
      spacing: {
        '4.5': '1.125rem',
        '5.5': '1.375rem',
        '6.5': '1.625rem',
      },

      // Border radius
      borderRadius: {
        'sm': '0.25rem',
        DEFAULT: '0.375rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },

      // Box shadows
      boxShadow: {
        'subtle': '0 2px 4px rgba(0,0,0,0.05)',
        'hover': '0 8px 16px rgba(0,0,0,0.1)',
        'card': '0 4px 8px rgba(0,0,0,0.08)',
      },
      

      // Animation durations and keyframes
      animation: {
        'pulse': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 8s ease-in-out infinite',
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'spin-slow': 'spin 10s linear infinite',
        'slide-up': 'slideUp 0.3s ease-out forwards',
        'slide-down': 'slideDown 0.3s ease-out forwards',
        'fade-in': 'fadeIn 0.3s ease-in-out forwards',
      },

      // Screen breakpoints
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      
      // Box shadow for cards and interactive elements
      boxShadow: {
        'card': 'var(--shadow-card)',
        'card-hover': 'var(--shadow-card-hover)',
        'outer': 'var(--shadow-outer)',
        'inner': 'var(--shadow-inner)',
      },
    },
  },
  plugins: [],
};