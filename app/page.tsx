'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '../components/navbar/Navbar';
import { HeroSection } from '../components/hero/HeroSection';
import { BookGrid } from '../components/books/BookGrid';
import { BookModal } from '../components/modal/BookModal';
import { ReaderScene } from '../components/reader/ReaderScene';
import { SwipeAiWidget } from '../components/swipeai/SwipeAiWidget';
import { useBooks } from '../hooks/useBooks';
import { Book } from '../types/book';

export default function Home() {
  const {
    books,
    filteredBooks,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    activeGenre,
    setActiveGenre
  } = useBooks();

  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Reader state
  const [readerBook, setReaderBook] = useState<Book | null>(null);
  const [isReaderOpen, setIsReaderOpen] = useState(false);

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedBook(null), 300);
  };

  const handleReadPdf = useCallback((book: Book) => {
    setReaderBook(book);
    setIsReaderOpen(true);
  }, []);

  const handleCloseReader = useCallback(() => {
    setIsReaderOpen(false);
    setTimeout(() => setReaderBook(null), 800);
  }, []);

  return (
    <>
      {/* Bookstore Content — slides away when reader opens */}
      <AnimatePresence>
        {!isReaderOpen && (
          <motion.div
            initial={{ x: 0, opacity: 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100vw', opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            <Navbar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              activeGenre={activeGenre}
              setActiveGenre={setActiveGenre}
              isLoading={isLoading}
            />

            <HeroSection books={books} onBookClick={handleBookClick} />

            <main id="library" className="relative z-20 bg-ivory min-h-screen pb-20">
              {error && (
                <div className="w-full max-w-7xl mx-auto px-6 py-12">
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
                    <p className="text-red-400 font-medium">{error}</p>
                  </div>
                </div>
              )}

              <BookGrid
                books={filteredBooks}
                isLoading={isLoading}
                isEmpty={!isLoading && filteredBooks.length === 0 && !error}
                onBookClick={handleBookClick}
              />
            </main>

            <footer className="w-full py-8 px-6 text-center text-ink-muted font-garamond text-sm border-t border-rule bg-ivory relative z-20">
              <p>Made By VISHAL RAJENDRA NIKAM (SEBCOMP56) and PRAJWAL MAHADEV NIKAS (SEBCOMP57) for DBMS Microproject, KJ college of Engineering Management &amp; Research, Pune.</p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Book Modal */}
      <BookModal
        book={selectedBook}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onReadPdf={handleReadPdf}
      />

      {/* Immersive 3D Book Reader */}
      {readerBook && (
        <ReaderScene
          book={readerBook}
          isOpen={isReaderOpen}
          onClose={handleCloseReader}
        />
      )}

      {/* SwipeAI Literary Companion */}
      {!isReaderOpen && (
        <SwipeAiWidget
          books={books}
          selectedBook={selectedBook}
          onBookClick={handleBookClick}
        />
      )}
    </>
  );
}
