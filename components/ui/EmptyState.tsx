import React from 'react';
import { motion } from 'framer-motion';

export const EmptyState = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 text-center col-span-full border-t border-b border-rule"
    >
      <svg className="w-48 h-48 mb-8 text-rule" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="square" strokeLinejoin="miter">
        {/* Newspaper Outline */}
        <path d="M4 4h16v16H4z" />
        <path d="M4 8h16" />
        {/* Columns */}
        <path d="M12 8v12" />
        {/* Lines */}
        <path d="M6 10h4" />
        <path d="M6 12h4" />
        <path d="M6 14h2" />
        <path d="M14 10h4" />
        <path d="M14 12h4" />
        <path d="M14 14h4" />
        <path d="M14 16h3" />
      </svg>
      <h3 className="text-3xl font-playfair text-ink mb-3">No Stories Filed Today</h3>
      <p className="text-ink-soft font-garamond italic text-lg max-w-md mx-auto mb-6">
        Our correspondents are searching the archives. Check back shortly.
      </p>
      
      <button className="font-cormorant text-gold tracking-[0.1em] uppercase hover:text-ink transition-colors border-b border-transparent hover:border-ink pb-1">
        Refresh Edition
      </button>
    </motion.div>
  );
};
