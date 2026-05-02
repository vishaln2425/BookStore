'use client';

import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';

let pdfjsLib: typeof import('pdfjs-dist') | null = null;
let workerInitialized = false;

async function getPdfJs() {
  if (!pdfjsLib) {
    pdfjsLib = await import('pdfjs-dist');
  }
  if (!workerInitialized && typeof window !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
    workerInitialized = true;
  }
  return pdfjsLib;
}

export interface PdfDocument {
  pdf: PDFDocumentProxy;
  totalPages: number;
}

const pageCache = new Map<string, HTMLCanvasElement>();

function getCacheKey(url: string, pageNum: number, scale: number): string {
  return `${url}__p${pageNum}__s${scale}`;
}

export async function loadPdf(url: string): Promise<PdfDocument> {
  const lib = await getPdfJs();
  const loadingTask = lib.getDocument({
    url,
    cMapUrl: `https://unpkg.com/pdfjs-dist@${lib.version}/cmaps/`,
    cMapPacked: true,
  });
  const pdf = await loadingTask.promise;
  return { pdf, totalPages: pdf.numPages };
}

export async function renderPdfPage(
  pdf: PDFDocumentProxy,
  pageNum: number,
  scale: number = 2
): Promise<HTMLCanvasElement> {
  const cacheKey = getCacheKey('_loaded_', pageNum, scale);
  const cached = pageCache.get(cacheKey);
  if (cached) return cached;

  const page: PDFPageProxy = await pdf.getPage(pageNum);
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);

  await page.render({ canvasContext: ctx, viewport, canvas } as any).promise;

  pageCache.set(cacheKey, canvas);
  return canvas;
}

export async function prerenderPages(
  pdf: PDFDocumentProxy,
  currentPage: number,
  totalPages: number,
  scale: number = 2,
  range: number = 2
): Promise<void> {
  const pagesToRender: number[] = [];
  for (let i = Math.max(1, currentPage - range); i <= Math.min(totalPages, currentPage + range); i++) {
    const key = getCacheKey('_loaded_', i, scale);
    if (!pageCache.has(key)) {
      pagesToRender.push(i);
    }
  }
  await Promise.all(pagesToRender.map((p) => renderPdfPage(pdf, p, scale)));
}

export function clearPageCache(): void {
  pageCache.clear();
}
