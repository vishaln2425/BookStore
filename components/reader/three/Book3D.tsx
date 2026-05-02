'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PageSpread } from './PageSpread';
import { PageTurnAnimation } from './PageTurnAnimation';
import type { FlipDirection } from '../../../hooks/usePageTurn';

interface Book3DProps {
  coverImageUrl: string;
  title: string;
  author: string;
  leftPageCanvas: HTMLCanvasElement | null;
  rightPageCanvas: HTMLCanvasElement | null;
  isFirstPage: boolean;
  zoom: number;
  // Page turn
  isFlipping: boolean;
  flipDirection: FlipDirection;
  flipProgress: number;
  turningFrontCanvas: HTMLCanvasElement | null;
  turningBackCanvas: HTMLCanvasElement | null;
  // Entry animation
  phase: 'entering' | 'cover-opening' | 'open' | 'closing' | 'exiting';
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

export const Book3D: React.FC<Book3DProps> = ({
  coverImageUrl,
  title,
  author,
  leftPageCanvas,
  rightPageCanvas,
  isFirstPage,
  zoom,
  isFlipping,
  flipDirection,
  flipProgress,
  turningFrontCanvas,
  turningBackCanvas,
  phase,
  isBookmarked,
  onToggleBookmark,
}) => {
  const isCoverOpen = phase === 'cover-opening' || phase === 'open';
  const coverRotation = phase === 'open' ? -160 : phase === 'cover-opening' ? -160 : 0;

  return (
    <div className="book-scene">
      {/* Book shadow on desk */}
      <motion.div
        className="book-shadow"
        initial={{ opacity: 0, scaleX: 0.8 }}
        animate={{
          opacity: phase === 'entering' ? 0 : 0.7,
          scaleX: phase === 'open' ? 1 : 0.8,
        }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />

      <motion.div
        className="book-body"
        initial={{ y: -80, opacity: 0 }}
        animate={{
          y: phase === 'exiting' ? -60 : 0,
          opacity: phase === 'exiting' ? 0 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 28,
          mass: 2,
        }}
      >
        {/* Back cover - always visible, lies flat */}
        <div className="back-cover" />

        {/* Page spread - visible when book is open */}
        {isCoverOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <PageSpread
              leftPageCanvas={leftPageCanvas}
              rightPageCanvas={rightPageCanvas}
              isFirstPage={isFirstPage}
              zoom={zoom}
            />

            {/* Spine shadow */}
            <div className="book-spine" />

            {/* Page turn animation */}
            <PageTurnAnimation
              isFlipping={isFlipping}
              flipDirection={flipDirection}
              flipProgress={flipProgress}
              frontCanvas={turningFrontCanvas}
              backCanvas={turningBackCanvas}
            />

            {/* Bookmark ribbon */}
            <div
              className={`bookmark-ribbon ${isBookmarked ? 'active' : ''}`}
              onClick={onToggleBookmark}
              title={isBookmarked ? 'Remove bookmark' : 'Bookmark this page'}
            >
              <svg
                width="24"
                height={isBookmarked ? 48 : 36}
                viewBox={`0 0 24 ${isBookmarked ? 48 : 36}`}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d={isBookmarked
                    ? 'M2 0H22V42L12 36L2 42V0Z'
                    : 'M2 0H22V30L12 24L2 30V0Z'
                  }
                  fill={isBookmarked ? '#E8D5A3' : '#B8973A'}
                />
                {/* Diamond cut at bottom for bookmarked pages */}
                {isBookmarked && (
                  <path d="M12 40L8 36L12 32L16 36L12 40Z" fill="#B8973A" />
                )}
              </svg>
            </div>
          </motion.div>
        )}

        {/* Front cover - animated open/close */}
        <motion.div
          className="book-cover"
          style={{
            zIndex: isCoverOpen ? 1 : 30,
          }}
          animate={{
            rotateY: coverRotation,
          }}
          transition={{
            type: 'spring',
            stiffness: 80,
            damping: 20,
            mass: 2,
          }}
        >
          {/* Cover front face */}
          <div className="book-cover-front">
            {coverImageUrl ? (
              <img src={coverImageUrl} alt={title} />
            ) : (
              <div style={{
                width: '100%',
                height: '100%',
                background: `linear-gradient(160deg, var(--r-leather) 0%, #3D2515 100%)`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20%',
                textAlign: 'center',
              }}>
                <div style={{
                  fontFamily: 'var(--font-playfair), serif',
                  color: 'var(--r-gold)',
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  marginBottom: '12px',
                  lineHeight: 1.2,
                }}>
                  {title}
                </div>
                <div style={{
                  width: '40px',
                  height: '1px',
                  background: 'var(--r-gold)',
                  opacity: 0.5,
                  margin: '8px 0',
                }} />
                <div style={{
                  fontFamily: 'var(--font-cormorant), serif',
                  fontStyle: 'italic',
                  color: 'var(--r-gold-light)',
                  fontSize: '0.9rem',
                }}>
                  {author}
                </div>
              </div>
            )}
          </div>

          {/* Cover back face (endpaper) */}
          <div className="book-cover-back" />
        </motion.div>
      </motion.div>
    </div>
  );
};
