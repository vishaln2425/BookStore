import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Book } from '../../types/book';
import { AiInsightsModal } from './AiInsightsModal';

interface BookModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onReadPdf?: (book: Book) => void;
}

export const BookModal: React.FC<BookModalProps> = ({ book, isOpen, onClose, onReadPdf }) => {
  const [isAiModalOpen, setIsAiModalOpen] = React.useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!book) return null;

  return (
    <>
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12" style={{ perspective: '1200px' }}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink/60 backdrop-blur-[2px]"
          />

          {/* Modal Panel - Page Turn Effect */}
          <motion.div
            initial={{ opacity: 0, rotateY: 90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: -90 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 1.5 }}
            style={{ transformOrigin: 'left center' }}
            className="relative w-full max-w-4xl bg-ivory shadow-book flex flex-col max-h-full border border-rule overflow-hidden"
            role="dialog"
            aria-modal="true"
          >
            {/* Close Button */}
            <motion.button
              whileHover={{ rotate: 90, opacity: 0.7 }}
              onClick={onClose}
              className="absolute top-6 right-6 z-50 p-2 text-ink hover:text-ink-soft bg-transparent border-none font-playfair text-3xl leading-none"
              aria-label="Close modal"
            >
              ×
            </motion.button>

            <div className="flex flex-col md:flex-row h-full overflow-y-auto custom-scrollbar relative z-10">
              {/* Left Column - Cover Image */}
              <div className="w-full md:w-5/12 p-8 md:p-12 flex flex-col items-center border-b md:border-b-0 md:border-r border-rule bg-ivory/50">
                <div className="w-full aspect-[2/3] relative mb-6" style={{ perspective: '800px' }}>
                  <div className="w-full h-full relative" style={{ transform: 'rotateY(-8deg)', transformStyle: 'preserve-3d' }}>
                    <Image
                      src={book.image_url}
                      alt={book.title}
                      fill
                      className="object-cover shadow-book"
                      sizes="(max-width: 768px) 100vw, 40vw"
                    />
                    <div className="absolute inset-y-0 left-0 w-8 shadow-book-spine pointer-events-none" />
                  </div>
                </div>
                <div className="font-cormorant text-gold font-bold uppercase tracking-[0.2em] text-sm text-center">
                  {book.genre}
                </div>
              </div>

              {/* Right Column - Content spread */}
              <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col h-full bg-ivory">
                <div className="mb-8 border-b border-rule pb-6">
                  <h2 className="text-4xl md:text-5xl font-playfair font-bold text-ink mb-4 leading-[1.1] tracking-tight">
                    {book.title}
                  </h2>
                  <p className="text-xl text-ink-muted font-libre italic">
                    by {book.author}
                  </p>
                </div>

                <div className="prose prose-lg max-w-none mb-10 text-ink-soft font-garamond leading-[1.8]">
                  <p className="drop-cap">
                    {book.description}
                  </p>
                </div>

                <div className="mt-auto pt-6 border-t border-rule">
                  <div className="flex items-center justify-between mb-8">
                    <span className="font-cormorant font-bold text-gold text-2xl tracking-widest">
                      ₹{Number(book.price).toFixed(2)}
                    </span>
                    <div className="flex items-center gap-6 font-cormorant text-xs text-ink-muted uppercase tracking-[0.15em]">
                      <span>Pub: {new Date(book.published_date).toLocaleDateString()}</span>
                      <span>ISBN: {book.isbn}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                      onClick={() => {
                        if (onReadPdf && book.pdf_url && book.pdf_url !== '#') {
                          onClose();
                          setTimeout(() => onReadPdf(book), 350);
                        } else {
                          window.open(book.pdf_url, '_blank');
                        }
                      }}
                      className="flex-1 px-6 py-3 border border-ink text-ink font-dmsans uppercase tracking-widest text-sm font-bold hover:bg-ink hover:text-ivory transition-colors duration-300 rounded-sm"
                    >
                      Read PDF ↗
                    </button>
                    
                    <div className="flex-1 relative group">
                      <button 
                        onClick={() => setIsAiModalOpen(true)}
                        className="w-full px-6 py-3 border border-gold text-gold font-cormorant italic text-lg tracking-wider hover:bg-gold/10 transition-colors duration-300 rounded-sm"
                      >
                        ✦ AI Insights
                      </button>
                      
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-4 py-2 bg-parchment text-ink-soft border border-rule shadow-paper opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-50 font-garamond text-sm italic">
                        Our editor is consulting the archives…
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-parchment" />
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-rule -z-10 mt-[1px]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    <AiInsightsModal 
      book={book} 
      isOpen={isAiModalOpen} 
      onClose={() => setIsAiModalOpen(false)} 
    />
    </>
  );
};
