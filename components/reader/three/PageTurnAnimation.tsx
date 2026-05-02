'use client';

import React, { useEffect, useRef } from 'react';
import type { FlipDirection } from '../../../hooks/usePageTurn';

interface PageTurnAnimationProps {
  isFlipping: boolean;
  flipDirection: FlipDirection;
  flipProgress: number; // 0 to 1
  frontCanvas: HTMLCanvasElement | null;
  backCanvas: HTMLCanvasElement | null;
}

export const PageTurnAnimation: React.FC<PageTurnAnimationProps> = ({
  isFlipping,
  flipDirection,
  flipProgress,
  frontCanvas,
  backCanvas,
}) => {
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (frontRef.current) {
      frontRef.current.innerHTML = '';
      if (frontCanvas) {
        const clone = frontCanvas.cloneNode(true) as HTMLCanvasElement;
        const ctx = clone.getContext('2d');
        if (ctx) ctx.drawImage(frontCanvas, 0, 0);
        clone.style.maxWidth = '100%';
        clone.style.maxHeight = '100%';
        clone.style.objectFit = 'contain';
        frontRef.current.appendChild(clone);
      }
    }
  }, [frontCanvas]);

  useEffect(() => {
    if (backRef.current) {
      backRef.current.innerHTML = '';
      if (backCanvas) {
        const clone = backCanvas.cloneNode(true) as HTMLCanvasElement;
        const ctx = clone.getContext('2d');
        if (ctx) ctx.drawImage(backCanvas, 0, 0);
        clone.style.maxWidth = '100%';
        clone.style.maxHeight = '100%';
        clone.style.objectFit = 'contain';
        backRef.current.appendChild(clone);
      }
    }
  }, [backCanvas]);

  if (!isFlipping) return null;

  // Calculate rotation based on direction and progress
  const rotation = flipDirection === 'forward'
    ? -180 * flipProgress  // 0 to -180 (right to left)
    : -180 + 180 * flipProgress; // -180 to 0 (left to right)

  // Shadow opacity peaks at midpoint
  const shadowOpacity = Math.sin(flipProgress * Math.PI) * 0.35;

  // Curl shadow position follows the turning page
  const curlShadowX = flipDirection === 'forward'
    ? (1 - flipProgress) * 100
    : flipProgress * 100;

  return (
    <>
      {/* The turning page */}
      <div
        className="turning-page"
        style={{
          transform: `rotateY(${rotation}deg)`,
          left: '50%',
          right: 'auto',
          transformOrigin: 'left center',
        }}
      >
        {/* Front face - current page content */}
        <div className="turning-page-front">
          <div className="page-canvas-container" ref={frontRef} />
        </div>

        {/* Back face - next page content */}
        <div className="turning-page-back">
          <div className="page-canvas-container" ref={backRef} />
        </div>
      </div>

      {/* Curl shadow on the stationary pages */}
      <div
        className="page-curl-shadow"
        style={{
          left: `${curlShadowX}%`,
          opacity: shadowOpacity,
          transform: `translateX(-50%)`,
        }}
      />
    </>
  );
};
