'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TableOfContentsProps {
  isOpen: boolean;
  onClose: () => void;
  totalPages: number;
  currentPage: number;
  onGoToPage: (page: number) => void;
  bookmarks: number[];
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  isOpen,
  onClose,
  totalPages,
  currentPage,
  onGoToPage,
  bookmarks,
}) => {
  // Generate page entries (every 10 pages as chapters for PDFs without TOC)
  const entries: { label: string; page: number }[] = [];
  entries.push({ label: 'Beginning', page: 1 });

  const chapterInterval = totalPages <= 20 ? 5 : totalPages <= 50 ? 10 : 20;
  for (let i = chapterInterval; i <= totalPages; i += chapterInterval) {
    entries.push({ label: `Section ${Math.floor(i / chapterInterval)}`, page: i });
  }
  if (entries[entries.length - 1].page !== totalPages) {
    entries.push({ label: 'End', page: totalPages });
  }

  // Add bookmarked pages
  const bookmarkEntries = bookmarks
    .filter((b) => !entries.some((e) => e.page === b))
    .map((b) => ({ label: `Bookmark`, page: b }));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 219,
            }}
          />

          {/* Panel */}
          <motion.div
            className="toc-panel"
            initial={{ x: -340 }}
            animate={{ x: 0 }}
            exit={{ x: -340 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="toc-header">
              ✦&ensp;Contents&ensp;✦
            </div>

            {/* Bookmarks Section */}
            {bookmarkEntries.length > 0 && (
              <>
                <div style={{
                  fontFamily: 'var(--font-cormorant), serif',
                  fontVariant: 'small-caps',
                  letterSpacing: '0.2em',
                  color: 'var(--r-gold)',
                  fontSize: '0.8rem',
                  marginBottom: '8px',
                  paddingLeft: '12px',
                  opacity: 0.7,
                }}>
                  Bookmarks
                </div>
                {bookmarkEntries.map(({ page }) => (
                  <div
                    key={`bm-${page}`}
                    className="toc-entry"
                    onClick={() => { onGoToPage(page); onClose(); }}
                    style={{
                      background: currentPage === page ? 'rgba(184,151,58,0.08)' : undefined,
                    }}
                  >
                    <span>🔖 Page {page}</span>
                    <span className="toc-entry-dots" />
                    <span className="toc-entry-page">{page}</span>
                  </div>
                ))}
                <div style={{
                  height: '1px',
                  background: 'rgba(184,151,58,0.15)',
                  margin: '12px 0',
                }} />
              </>
            )}

            {/* Page Sections */}
            {entries.map(({ label, page }) => (
              <div
                key={page}
                className="toc-entry"
                onClick={() => { onGoToPage(page); onClose(); }}
                style={{
                  background: currentPage === page ? 'rgba(184,151,58,0.08)' : undefined,
                  borderLeftColor: currentPage === page ? 'var(--r-gold)' : undefined,
                }}
              >
                <span>{label}</span>
                <span className="toc-entry-dots" />
                <span className="toc-entry-page">{page}</span>
              </div>
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
