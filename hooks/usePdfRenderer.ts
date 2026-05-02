'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { loadPdf, renderPdfPage, prerenderPages, clearPageCache } from '../services/pdfService';

export function usePdfRenderer(pdfUrl: string) {
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100); // percentage
  const [pageCanvases, setPageCanvases] = useState<Map<number, HTMLCanvasElement>>(new Map());
  const pdfRef = useRef<PDFDocumentProxy | null>(null);

  // Load PDF on mount
  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        setIsLoading(true);
        setError(null);
        const { pdf: doc, totalPages: total } = await loadPdf(pdfUrl);
        if (cancelled) return;

        pdfRef.current = doc;
        setPdf(doc);
        setTotalPages(total);

        // Render first two pages
        const scale = (zoom / 100) * 2 * (window.devicePixelRatio || 1);
        const canvases = new Map<number, HTMLCanvasElement>();
        const p1 = await renderPdfPage(doc, 1, scale);
        canvases.set(1, p1);
        if (total >= 2) {
          const p2 = await renderPdfPage(doc, 2, scale);
          canvases.set(2, p2);
        }
        if (!cancelled) {
          setPageCanvases(new Map(canvases));
          setIsLoading(false);
          // Prerender nearby pages in background
          prerenderPages(doc, 1, total, scale, 3);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load PDF');
          setIsLoading(false);
        }
      }
    }

    init();
    return () => {
      cancelled = true;
      clearPageCache();
    };
  }, [pdfUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  // Render pages around current page when it changes
  useEffect(() => {
    if (!pdfRef.current || totalPages === 0) return;
    let cancelled = false;

    async function renderNearby() {
      const doc = pdfRef.current!;
      const scale = (zoom / 100) * 2 * (window.devicePixelRatio || 1);
      const newCanvases = new Map<number, HTMLCanvasElement>();

      // Render pages visible in current spread + neighbors
      const pagesToRender = [];
      for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 3); i++) {
        pagesToRender.push(i);
      }

      for (const pageNum of pagesToRender) {
        try {
          const canvas = await renderPdfPage(doc, pageNum, scale);
          if (!cancelled) newCanvases.set(pageNum, canvas);
        } catch { /* skip failed pages */ }
      }

      if (!cancelled) {
        setPageCanvases((prev) => {
          const merged = new Map(prev);
          newCanvases.forEach((v, k) => merged.set(k, v));
          return merged;
        });
      }
    }

    renderNearby();
    return () => { cancelled = true; };
  }, [currentPage, totalPages, zoom]);

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  const nextPage = useCallback(() => {
    // In spread mode, advance by 2
    setCurrentPage((prev) => Math.min(prev + 2, totalPages));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 2, 1));
  }, []);

  const nextPageSingle = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const prevPageSingle = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }, []);

  return {
    pdf,
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
  };
}
