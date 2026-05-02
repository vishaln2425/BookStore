'use client';

import { useEffect } from 'react';

interface KeyboardActions {
  onNextPage: () => void;
  onPrevPage: () => void;
  onToggleBookmark: () => void;
  onToggleToc: () => void;
  onClose: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleShortcuts: () => void;
  enabled?: boolean;
}

export function useReaderKeyboard({
  onNextPage,
  onPrevPage,
  onToggleBookmark,
  onToggleToc,
  onClose,
  onZoomIn,
  onZoomOut,
  onToggleShortcuts,
  enabled = true,
}: KeyboardActions) {
  useEffect(() => {
    if (!enabled) return;

    function handleKeyDown(e: KeyboardEvent) {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          e.preventDefault();
          onNextPage();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          onPrevPage();
          break;
        case 'b':
        case 'B':
          e.preventDefault();
          onToggleBookmark();
          break;
        case 't':
        case 'T':
          e.preventDefault();
          onToggleToc();
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        case '+':
        case '=':
          e.preventDefault();
          onZoomIn();
          break;
        case '-':
        case '_':
          e.preventDefault();
          onZoomOut();
          break;
        case '?':
          e.preventDefault();
          onToggleShortcuts();
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, onNextPage, onPrevPage, onToggleBookmark, onToggleToc, onClose, onZoomIn, onZoomOut, onToggleShortcuts]);
}
