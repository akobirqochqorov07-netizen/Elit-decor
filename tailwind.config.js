module.exports = {
  /** @type {import('tailwindcss').Config} */
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        green: {
          200: '#e5c158',
          500: '#0F4C81', // Registan Blue
          600: '#D4AF37', // Gold
          700: '#0a355c', // Dark Blue
        },
        primary: {
          light: '#2a5a8f',
          DEFAULT: '#0F4C81', // Registan Blue
          dark: '#0a355c',
        },
        accent: {
          light: '#e5c158',
          DEFAULT: '#D4AF37', // Gold 
          dark: '#b5952f',
        },
        dark: {
          DEFAULT: '#111827',
          light: '#1f2937',
        },
        text: {
          DEFAULT: '#333333',
          light: '#666666',
          muted: '#999999',
        },
        secondary: {
          light: '#f8f9fa',
          DEFAULT: '#e9ecef',
          dark: '#dee2e6',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        serif: ['var(--font-playfair)', 'serif'],
      },
      maxWidth: {
        container: '1200px',
      },
    },
  },
  plugins: [],
};
