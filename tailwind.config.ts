import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: '#FDFAF4',
        parchment: '#F5EFE0',
        ink: '#0D0D0D',
        'ink-soft': '#2C2C2C',
        'ink-muted': '#6B6560',
        gold: '#B8973A',
        'gold-light': '#E8D5A3',
        rule: '#D6CCB8',
      },
      fontFamily: {
        playfair: ['var(--font-playfair)', 'Times New Roman', 'Georgia', 'serif'],
        libre: ['var(--font-libre)', 'Book Antiqua', 'serif'],
        garamond: ['var(--font-garamond)', 'Palatino Linotype', 'serif'],
        cormorant: ['var(--font-cormorant)', 'serif'],
        dmsans: ['var(--font-dmsans)', 'sans-serif'],
      },
      boxShadow: {
        paper: '0 4px 12px rgba(0,0,0,0.08)',
        book: '0 12px 24px rgba(0,0,0,0.25)',
        'book-spine': 'inset 8px 0 16px rgba(0,0,0,0.15)',
      },
      animation: {
        'print-sweep': 'printSweep 2s ease-in-out infinite',
      },
      keyframes: {
        printSweep: {
          '0%': { backgroundPosition: '0 -200%' },
          '100%': { backgroundPosition: '0 200%' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
