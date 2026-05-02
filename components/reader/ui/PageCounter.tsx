'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageCounterProps {
  currentPage: number;
  totalPages: number;
}

export const PageCounter: React.FC<PageCounterProps> = ({ currentPage, totalPages }) => {
  return (
    <div className="page-counter">
      <div className="page-counter-rule" />
      <AnimatePresence mode="wait">
        <motion.span
          key={currentPage}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2 }}
        >
          Page {currentPage} of {totalPages}
        </motion.span>
      </AnimatePresence>
      <div className="page-counter-rule" />
    </div>
  );
};
