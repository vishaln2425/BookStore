'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book3D } from './three/Book3D';
import { ReaderToolbar } from './ui/ReaderToolbar';
import { PageNavigator } from './ui/PageNavigator';
import { PageCounter } from './ui/PageCounter';
import { ZoomControls } from './ui/ZoomControls';
import { KeyboardShortcuts } from './ui/KeyboardShortcuts';
import { TableOfContents } from './ui/TableOfContents';
import { usePdfRenderer } from '../../hooks/usePdfRenderer';
import { usePageTurn } from '../../hooks/usePageTurn';
import { useBookmarks } from '../../hooks/useBookmarks';
import { useReaderKeyboard } from '../../hooks/useReaderKeyboard';
import { Book } from '../../types/book';

interface ReaderSceneProps {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
}

type ReaderPhase = 'entering' | 'cover-opening' | 'open' | 'closing' | 'exiting';

export const ReaderScene: React.FC<ReaderSceneProps> = ({ book, isOpen, onClose }) => {
  const [phase, setPhase] = useState<ReaderPhase>('entering');
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // PDF rendering
  const {
    totalPages,
    currentPage,
    isLoading,
    error,
    zoom,
    setZoom,
    pageCanvases,
    goToPage,
    nextPage,
    prevPage,
    nextPageSingle,
    prevPageSingle,
  } = usePdfRenderer(book.pdf_url);

  // Determine which pages to show based on mobile/desktop
  const handleNext = isMobile ? nextPageSingle : nextPage;
  const handlePrev = isMobile ? prevPageSingle : prevPage;

  // Page turn animation
  const { isFlipping, flipDirection, flipProgress, turnForward, turnBack } = usePageTurn(
    handleNext,
    handlePrev,
  );

  // Bookmarks
  const { bookmarks, toggleBookmark, isBookmarked } = useBookmarks(book.book_id);

  // Get canvas for a given page number (returns null if not rendered)
  const getCanvas = useCallback((pageNum: number): HTMLCanvasElement | null => {
    if (pageNum < 1 || pageNum > totalPages) return null;
    return pageCanvases.get(pageNum) || null;
  }, [pageCanvases, totalPages]);

  // Current spread pages
  const leftPageNum = isMobile ? null : (currentPage > 1 ? currentPage - 1 : null);
  const rightPageNum = currentPage;

  const leftCanvas = leftPageNum ? getCanvas(leftPageNum) : null;
  const rightCanvas = getCanvas(rightPageNum);

  // Turning page canvases
  const turningFrontCanvas = useMemo(() => {
    if (!isFlipping) return null;
    if (flipDirection === 'forward') return getCanvas(rightPageNum);
    return leftPageNum ? getCanvas(leftPageNum) : null;
  }, [isFlipping, flipDirection, rightPageNum, leftPageNum, getCanvas]);

  const turningBackCanvas = useMemo(() => {
    if (!isFlipping) return null;
    if (flipDirection === 'forward') {
      return isMobile ? getCanvas(rightPageNum + 1) : getCanvas(rightPageNum + 1);
    }
    return leftPageNum ? getCanvas(leftPageNum - 1) : null;
  }, [isFlipping, flipDirection, rightPageNum, leftPageNum, isMobile, getCanvas]);

  // Entry sequence
  useEffect(() => {
    if (!isOpen) return;

    setPhase('entering');

    const timer1 = setTimeout(() => setPhase('cover-opening'), 1400);
    const timer2 = setTimeout(() => setPhase('open'), 2400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isOpen]);

  // Exit sequence
  const handleClose = useCallback(() => {
    setPhase('closing');
    setTimeout(() => {
      setPhase('exiting');
      setTimeout(() => {
        onClose();
      }, 600);
    }, 500);
  }, [onClose]);

  // Zoom handlers
  const handleZoomIn = useCallback(() => {
    setZoom((z: number) => Math.min(z + 10, 150));
  }, [setZoom]);

  const handleZoomOut = useCallback(() => {
    setZoom((z: number) => Math.max(z - 10, 60));
  }, [setZoom]);

  // Keyboard shortcuts
  useReaderKeyboard({
    onNextPage: () => { if (!isFlipping && phase === 'open') turnForward(); },
    onPrevPage: () => { if (!isFlipping && phase === 'open') turnBack(); },
    onToggleBookmark: () => toggleBookmark(currentPage),
    onToggleToc: () => setIsTocOpen((v) => !v),
    onClose: handleClose,
    onZoomIn: handleZoomIn,
    onZoomOut: handleZoomOut,
    onToggleShortcuts: () => {},
    enabled: isOpen,
  });

  // Navigation ability
  const canGoNext = isMobile ? currentPage < totalPages : currentPage + 1 < totalPages;
  const canGoPrev = currentPage > 1;

  // Lock body scroll when reader is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="reader-scene"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === 'exiting' ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Desk background */}
          <div className="reader-desk" />

          {/* Warm lamp glow */}
          <motion.div
            className="reader-lamp"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'entering' ? 0.3 : 1 }}
            transition={{ duration: 1.2 }}
          />

          {/* Loading state */}
          {isLoading && (
            <div className="reader-loading">
              <div className="reader-loading-spinner" />
              <div className="reader-loading-text">Opening the book…</div>
            </div>
          )}

          {/* Error state */}
          {error && !isLoading && (
            <div className="reader-loading">
              <div style={{
                color: 'var(--r-gold)',
                fontFamily: 'var(--font-cormorant), serif',
                fontStyle: 'italic',
                textAlign: 'center',
                maxWidth: '400px',
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📖</div>
                <div style={{ marginBottom: '8px' }}>Could not open this book</div>
                <div style={{ fontSize: '0.85rem', opacity: 0.6 }}>{error}</div>
                <button
                  onClick={handleClose}
                  style={{
                    marginTop: '24px',
                    padding: '8px 24px',
                    border: '1px solid var(--r-gold)',
                    background: 'none',
                    color: 'var(--r-gold)',
                    fontFamily: 'var(--font-cormorant), serif',
                    fontStyle: 'italic',
                    cursor: 'pointer',
                    borderRadius: '4px',
                  }}
                >
                  Return to Library
                </button>
              </div>
            </div>
          )}

          {/* The 3D Book */}
          {!isLoading && !error && (
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: '80px',
              paddingBottom: '60px',
            }}>
              <Book3D
                coverImageUrl={book.image_url}
                title={book.title}
                author={book.author}
                leftPageCanvas={leftCanvas}
                rightPageCanvas={rightCanvas}
                isFirstPage={currentPage <= 1}
                zoom={zoom}
                isFlipping={isFlipping}
                flipDirection={flipDirection}
                flipProgress={flipProgress}
                turningFrontCanvas={turningFrontCanvas}
                turningBackCanvas={turningBackCanvas}
                phase={phase}
                isBookmarked={isBookmarked(currentPage)}
                onToggleBookmark={() => toggleBookmark(currentPage)}
              />
            </div>
          )}

          {/* UI Chrome - only visible when book is open */}
          {phase === 'open' && !isLoading && !error && (
            <>
              {/* Toolbar */}
              <motion.div
                initial={{ y: -80 }}
                animate={{ y: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 25, delay: 0.1 }}
              >
                <ReaderToolbar
                  title={book.title}
                  author={book.author}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onClose={handleClose}
                  onToggleToc={() => setIsTocOpen(true)}
                />
              </motion.div>

              {/* Page Navigator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <PageNavigator
                  onPrev={() => { if (!isFlipping) turnBack(); }}
                  onNext={() => { if (!isFlipping) turnForward(); }}
                  canGoPrev={canGoPrev}
                  canGoNext={canGoNext}
                />
              </motion.div>

              {/* Page Counter */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <PageCounter currentPage={currentPage} totalPages={totalPages} />
              </motion.div>

              {/* Zoom Controls */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <ZoomControls zoom={zoom} onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />
              </motion.div>

              {/* Keyboard Shortcuts */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <KeyboardShortcuts />
              </motion.div>

              {/* Table of Contents */}
              <TableOfContents
                isOpen={isTocOpen}
                onClose={() => setIsTocOpen(false)}
                totalPages={totalPages}
                currentPage={currentPage}
                onGoToPage={goToPage}
                bookmarks={bookmarks}
              />
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
