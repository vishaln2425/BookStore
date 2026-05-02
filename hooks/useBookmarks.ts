'use client';

import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY_PREFIX = 'swipebooks_bookmarks_';

export function useBookmarks(bookId: string) {
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${bookId}`);
      if (stored) setBookmarks(JSON.parse(stored));
    } catch { /* ignore parse errors */ }
  }, [bookId]);

  const persist = useCallback((updated: number[]) => {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${bookId}`, JSON.stringify(updated));
    } catch { /* storage full — ignore */ }
  }, [bookId]);

  const toggleBookmark = useCallback((pageNum: number) => {
    setBookmarks((prev) => {
      const next = prev.includes(pageNum)
        ? prev.filter((p) => p !== pageNum)
        : [...prev, pageNum].sort((a, b) => a - b);
      persist(next);
      return next;
    });
  }, [persist]);

  const isBookmarked = useCallback((pageNum: number) => {
    return bookmarks.includes(pageNum);
  }, [bookmarks]);

  return { bookmarks, toggleBookmark, isBookmarked };
}
