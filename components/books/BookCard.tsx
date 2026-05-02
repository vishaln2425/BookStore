import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Book } from '../../types/book';

interface BookCardProps {
  book: Book;
  onClick: (book: Book) => void;
  viewMode?: 'gallery' | 'list';
}

export const BookCard: React.FC<BookCardProps> = ({ book, onClick, viewMode = 'gallery' }) => {
  const isList = viewMode === 'list';

  return (
    <motion.div
      onClick={() => onClick(book)}
      variants={{
        hidden: { opacity: 0, y: 50, rotateX: 8 },
        show: { opacity: 1, y: 0, rotateX: 0 }
      }}
      transition={{ type: 'spring', stiffness: 180, damping: 22, mass: 1.2 }}
      whileHover="hover"
      className={`group cursor-pointer bg-parchment border border-rule shadow-paper flex ${isList ? 'flex-row items-center p-6' : 'flex-col h-full p-6'}`}
    >
      {/* Cover Image Area */}
      <motion.div 
        className={`relative shrink-0 ${isList ? 'w-32 h-48 mr-8' : 'w-full h-64 mb-6'}`}
        style={{ perspective: '800px' }}
      >
        <motion.div 
          variants={{
            hover: { rotateY: -12, y: -4 }
          }}
          transition={{ type: 'spring', stiffness: 180, damping: 22 }}
          className="w-full h-full relative" 
          style={{ transform: 'rotateY(-8deg)', transformStyle: 'preserve-3d' }}
        >
          <Image
            src={book.image_url}
            alt={book.title}
            fill
            className="object-cover shadow-book"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-y-0 left-0 w-8 shadow-book-spine pointer-events-none" />
        </motion.div>
      </motion.div>

      {/* Content Area */}
      <div className={`flex flex-col flex-1 relative z-10 ${isList ? '' : 'h-full'}`}>
        {/* Thin gold rule below image in gallery mode */}
        {!isList && (
          <motion.div 
            variants={{ hover: { opacity: 1, backgroundColor: '#B8973A' } }}
            className="w-full h-[1px] bg-rule mb-4 transition-colors" 
          />
        )}
        
        <div className="mb-2">
          <span className="font-cormorant text-gold font-bold uppercase tracking-[0.2em] text-xs">
            {book.genre}
          </span>
        </div>
        
        <h3 className="font-playfair font-bold text-ink text-xl md:text-2xl mb-1 line-clamp-2 leading-tight">
          {book.title}
        </h3>
        <p className="font-libre italic text-ink-muted text-sm mb-4">
          by {book.author}
        </p>

        {isList && (
          <p className="font-garamond text-ink-soft mb-6 line-clamp-2 leading-relaxed">
            {book.description}
          </p>
        )}
        
        <div className="mt-auto pt-4 border-t border-rule flex items-center justify-between">
          <motion.div 
            variants={{ hover: { scale: 1.05 } }}
            className="font-cormorant font-bold text-gold text-lg tracking-widest origin-left"
          >
            ₹{Number(book.price).toFixed(2)}
          </motion.div>
          
          <div className="flex items-center text-ink font-cormorant italic font-bold tracking-widest text-sm">
            <span>Read Review</span>
            <motion.span 
              variants={{ hover: { x: 4 } }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="ml-2"
            >
              →
            </motion.span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
