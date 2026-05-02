import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GENRE_COLORS } from '../../constants/genres';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeGenre: string | null;
  setActiveGenre: (genre: string | null) => void;
  isLoading?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  setSearchQuery,
  activeGenre,
  setActiveGenre,
  isLoading
}) => {
  const genres = Object.keys(GENRE_COLORS).filter(g => g !== 'default');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="sticky top-0 z-50 w-full bg-ivory/95 backdrop-blur-md transition-all duration-500"
    >
      {/* Top micro-bar */}
      <AnimatePresence>
        {!isScrolled && (
          <motion.div
            initial={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="w-full border-b border-gold flex justify-between items-center px-6 py-1 text-xs font-cormorant tracking-[0.15em] uppercase text-ink-muted overflow-hidden"
          >
            <div>DBMS Microproject </div>
            <div>VISHAL RAJENDRA NIKAM SEBCOMP56 | PRAJWAL MAHADEV NIKAS SEBCOMP57</div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between relative">
        {/* Left: Genre Navigation */}
        <div className="flex gap-6 overflow-x-auto w-full md:w-1/3 pb-2 md:pb-0 scrollbar-hide text-sm font-cormorant tracking-[0.15em] uppercase text-ink-soft relative">
          <button
            onClick={() => setActiveGenre(null)}
            className="relative whitespace-nowrap hover:text-ink transition-colors group pb-1"
          >
            All
            {activeGenre === null && (
              <motion.div layoutId="genreDot" className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-gold text-lg leading-none">
                •
              </motion.div>
            )}
            <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full" />
          </button>

          {genres.slice(0, 4).map(genre => (
            <button
              key={genre}
              onClick={() => setActiveGenre(genre === activeGenre ? null : genre)}
              className="relative whitespace-nowrap hover:text-ink transition-colors group pb-1"
            >
              {genre}
              {activeGenre === genre && (
                <motion.div layoutId="genreDot" className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-gold text-lg leading-none">
                  •
                </motion.div>
              )}
              <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </div>

        {/* Center: Masthead Logo */}
        <div className="w-full md:w-1/3 flex justify-center py-2 md:py-0">
          <h1 className={twMerge(
            clsx(
              "font-playfair font-bold text-ink tracking-tight transition-all duration-500 text-center",
              isScrolled ? "text-3xl" : "text-4xl md:text-5xl"
            )
          )}>
            SWIPE BOOKS
          </h1>
        </div>

        {/* Right: Search Classified Box */}
        <div className="w-full md:w-1/3 flex justify-end relative">
          <div className="relative w-full max-w-xs group">
            <input
              type="text"
              placeholder="Search archives..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="w-full px-4 py-2 bg-transparent border border-ink text-ink font-garamond placeholder-ink-muted/60 focus:outline-none transition-all rounded-none"
            />
            {/* Animated Gold Underline on Focus */}
            <div className={twMerge(
              clsx(
                "absolute bottom-0 left-0 h-[2px] bg-gold transition-all duration-300 ease-out origin-left",
                isSearchFocused ? "w-full scale-x-100" : "w-full scale-x-0"
              )
            )} />

            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="h-4 w-4 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom hairline rule */}
      <div className="w-full h-[1px] bg-rule" />
    </motion.nav>
  );
};
