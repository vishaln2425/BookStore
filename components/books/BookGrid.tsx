import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Book } from '../../types/book';
import { BookCard } from './BookCard';
import { SkeletonCard } from './SkeletonCard';
import { EmptyState } from '../ui/EmptyState';
import clsx from 'clsx';

interface BookGridProps {
  books: Book[];
  isLoading: boolean;
  isEmpty: boolean;
  onBookClick: (book: Book) => void;
}

export const BookGrid: React.FC<BookGridProps> = ({ books, isLoading, isEmpty, onBookClick }) => {
  const [viewMode, setViewMode] = useState<'gallery' | 'list'>('gallery');

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-16">
      
      {/* Section Header */}
      <div className="border-t border-b border-rule py-4 mb-12 flex flex-col md:flex-row items-center justify-between relative">
        <h2 className="font-cormorant font-bold uppercase tracking-[0.25em] text-ink text-xl text-center flex-1">
          This Week's Catalogue
        </h2>
        
        <div className="absolute right-0 flex gap-4 font-cormorant italic tracking-widest text-sm text-ink-muted">
          <button 
            onClick={() => setViewMode('gallery')}
            className={clsx("hover:text-ink transition-colors", viewMode === 'gallery' && "text-ink font-bold")}
          >
            Gallery View
          </button>
          <span>|</span>
          <button 
            onClick={() => setViewMode('list')}
            className={clsx("hover:text-ink transition-colors", viewMode === 'list' && "text-ink font-bold")}
          >
            List View
          </button>
        </div>
      </div>

      {isLoading ? (
        <div>
          {/* Printing press progress indicator */}
          <div className="fixed top-0 left-0 right-0 h-[2px] bg-gold z-50 animate-pulse origin-left scale-x-100" />
          
          <div className={clsx("grid gap-8", viewMode === 'gallery' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1")}>
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
          <p className="text-center font-garamond italic text-ink-muted mt-12 animate-pulse">
            Setting the type… Preparing your edition…
          </p>
        </div>
      ) : isEmpty ? (
        <EmptyState />
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className={clsx(
            "grid gap-8",
            viewMode === 'gallery' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
          )}
        >
          {books.map((book) => (
            <BookCard key={book.book_id} book={book} onClick={onBookClick} viewMode={viewMode} />
          ))}
        </motion.div>
      )}
    </div>
  );
};
