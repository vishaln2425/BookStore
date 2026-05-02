'use client';

import React from 'react';

interface PageNavigatorProps {
  onPrev: () => void;
  onNext: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
}

export const PageNavigator: React.FC<PageNavigatorProps> = ({
  onPrev,
  onNext,
  canGoPrev,
  canGoNext,
}) => {
  return (
    <>
      <button
        className="page-nav-btn page-nav-prev"
        onClick={onPrev}
        disabled={!canGoPrev}
        style={{ opacity: canGoPrev ? undefined : 0.1, cursor: canGoPrev ? 'pointer' : 'default' }}
        aria-label="Previous page"
      >
        ‹
      </button>
      <button
        className="page-nav-btn page-nav-next"
        onClick={onNext}
        disabled={!canGoNext}
        style={{ opacity: canGoNext ? undefined : 0.1, cursor: canGoNext ? 'pointer' : 'default' }}
        aria-label="Next page"
      >
        ›
      </button>
    </>
  );
};
