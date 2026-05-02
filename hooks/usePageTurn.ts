'use client';

import { useState, useCallback, useRef } from 'react';

export type FlipDirection = 'forward' | 'back';

export function usePageTurn(onForward: () => void, onBack: () => void) {
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<FlipDirection>('forward');
  const [flipProgress, setFlipProgress] = useState(0); // 0 to 1
  const animationRef = useRef<number | null>(null);

  const turnForward = useCallback(() => {
    if (isFlipping) return;
    setIsFlipping(true);
    setFlipDirection('forward');
    setFlipProgress(0);

    // Animate progress from 0 to 1 over 600ms
    const start = performance.now();
    const duration = 600;

    function animate(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic for natural feel
      const eased = 1 - Math.pow(1 - progress, 3);
      setFlipProgress(eased);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsFlipping(false);
        setFlipProgress(0);
        onForward();
      }
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [isFlipping, onForward]);

  const turnBack = useCallback(() => {
    if (isFlipping) return;
    setIsFlipping(true);
    setFlipDirection('back');
    setFlipProgress(0);

    const start = performance.now();
    const duration = 600;

    function animate(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setFlipProgress(eased);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsFlipping(false);
        setFlipProgress(0);
        onBack();
      }
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [isFlipping, onBack]);

  return { isFlipping, flipDirection, flipProgress, turnForward, turnBack };
}
