'use client';

import React from 'react';

interface ReaderToolbarProps {
  title: string;
  author: string;
  currentPage: number;
  totalPages: number;
  onClose: () => void;
  onToggleToc: () => void;
}

export const ReaderToolbar: React.FC<ReaderToolbarProps> = ({
  title,
  author,
  currentPage,
  totalPages,
  onClose,
  onToggleToc,
}) => {
  return (
    <div className="reader-toolbar">
      <div className="reader-toolbar-inner">
        {/* Left: Back button */}
        <button className="reader-back-btn" onClick={onClose}>
          ← Back to Library
        </button>

        {/* Center: Branding */}
        <span className="reader-branding">Swipe Books</span>

        {/* Right: Action icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button className="reader-icon-btn" onClick={onToggleToc} aria-label="Table of contents" title="Contents">
            ☰
          </button>
          <button className="reader-icon-btn" onClick={onClose} aria-label="Close reader" title="Close">
            ✕
          </button>
        </div>
      </div>

      {/* Meta bar with title, author, page */}
      <div className="reader-toolbar-meta">
        <span style={{
          fontFamily: 'var(--font-playfair), serif',
          fontVariant: 'small-caps',
          fontWeight: 600,
          maxWidth: '40%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {title}
        </span>
        <span className="separator">·</span>
        <span style={{ fontStyle: 'italic', opacity: 0.8 }}>{author}</span>
        <span className="separator">·</span>
        <span>Page {currentPage} / {totalPages}</span>
      </div>
    </div>
  );
};
