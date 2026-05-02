'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const KeyboardShortcuts: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts = [
    { key: '→ / Space', action: 'Next page' },
    { key: '←', action: 'Previous page' },
    { key: 'B', action: 'Bookmark' },
    { key: 'T', action: 'Contents' },
    { key: 'Esc', action: 'Close reader' },
    { key: '+ / −', action: 'Zoom' },
  ];

  return (
    <>
      <button
        className="shortcuts-trigger"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        aria-label="Keyboard shortcuts"
      >
        ?
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="shortcuts-card"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
          >
            <h4>Keyboard Shortcuts</h4>
            {shortcuts.map(({ key, action }) => (
              <div key={key} className="shortcut-row">
                <span>{action}</span>
                <span className="shortcut-key">{key}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
