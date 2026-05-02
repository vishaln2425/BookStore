'use client';

import React, { useEffect, useRef } from 'react';

interface PageSpreadProps {
  leftPageCanvas: HTMLCanvasElement | null;
  rightPageCanvas: HTMLCanvasElement | null;
  isFirstPage: boolean;
  zoom: number;
}

export const PageSpread: React.FC<PageSpreadProps> = ({
  leftPageCanvas,
  rightPageCanvas,
  isFirstPage,
  zoom,
}) => {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  // Mount PDF canvases into the DOM
  useEffect(() => {
    if (leftRef.current) {
      leftRef.current.innerHTML = '';
      if (leftPageCanvas) {
        const clone = leftPageCanvas.cloneNode(true) as HTMLCanvasElement;
        const ctx = clone.getContext('2d');
        if (ctx) ctx.drawImage(leftPageCanvas, 0, 0);
        clone.style.maxWidth = '100%';
        clone.style.maxHeight = '100%';
        clone.style.objectFit = 'contain';
        leftRef.current.appendChild(clone);
      }
    }
  }, [leftPageCanvas]);

  useEffect(() => {
    if (rightRef.current) {
      rightRef.current.innerHTML = '';
      if (rightPageCanvas) {
        const clone = rightPageCanvas.cloneNode(true) as HTMLCanvasElement;
        const ctx = clone.getContext('2d');
        if (ctx) ctx.drawImage(rightPageCanvas, 0, 0);
        clone.style.maxWidth = '100%';
        clone.style.maxHeight = '100%';
        clone.style.objectFit = 'contain';
        rightRef.current.appendChild(clone);
      }
    }
  }, [rightPageCanvas]);

  return (
    <div className="page-spread" style={{ transform: `scale(${zoom / 100})` }}>
      {/* Left Page */}
      <div className="page-left">
        {isFirstPage && !leftPageCanvas ? (
          <div className="page-endpaper">
            <div style={{
              position: 'absolute',
              inset: '30%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-cormorant), serif',
              fontStyle: 'italic',
              color: 'var(--r-gold)',
              opacity: 0.3,
              fontSize: '0.9rem',
              letterSpacing: '0.15em',
              fontVariant: 'small-caps',
            }}>
              swipe books
            </div>
          </div>
        ) : (
          <div className="page-canvas-container" ref={leftRef} />
        )}
      </div>

      {/* Right Page */}
      <div className="page-right">
        {rightPageCanvas ? (
          <div className="page-canvas-container" ref={rightRef} />
        ) : (
          <div className="page-endpaper" />
        )}
      </div>
    </div>
  );
};
