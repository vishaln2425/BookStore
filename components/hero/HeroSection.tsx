'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { FloatingBooks3D } from './FloatingBooks3D';
import Image from 'next/image';
import { Book } from '../../types/book';

interface HeroSectionProps {
  books?: Book[];
  onBookClick?: (book: Book) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ books = [], onBookClick }) => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-ivory">
      {/* Background 3D Book Rain */}
      <FloatingBooks3D />

      {/* Foreground Editorial Panel */}
      <div className="relative z-10 w-full max-w-5xl mx-6 my-12 bg-ivory/90 backdrop-blur-sm border border-rule shadow-book flex flex-col">
        
        {/* Panel Header */}
        <div className="flex justify-between items-end px-8 py-4 border-b-2 border-ink">
          <h2 className="font-playfair font-bold text-ink text-2xl tracking-widest uppercase">
            The Swipe Books Editorial
          </h2>
          <div className="font-cormorant text-ink-muted uppercase tracking-[0.2em] text-sm">
            Vol. I, No. 1
          </div>
        </div>

        {/* Panel Content Grid */}
        <div className="flex flex-col md:flex-row">
          
          {/* Left Column */}
          <div className="w-full md:w-1/4 p-6 md:p-8 border-b md:border-b-0 md:border-r border-rule flex flex-col justify-center">
            <h3 className="font-playfair text-3xl italic text-ink leading-tight mb-6">
              "Every Page <br/>A New World"
            </h3>
            <p className="font-garamond text-ink-soft leading-relaxed text-lg">
              Discover the finest literary works, meticulously curated for the discerning reader. Our digital shelves house the extraordinary.
            </p>
          </div>

          {/* Center Column - Featured */}
          <div className="w-full md:w-2/4 p-6 md:p-8 border-b md:border-b-0 md:border-r border-rule flex flex-col items-center justify-center">
            <div className="w-full max-w-[240px] aspect-[2/3] relative mb-8" style={{ perspective: '800px' }}>
              <div className="w-full h-full relative" style={{ transform: 'rotateY(-8deg)', transformStyle: 'preserve-3d' }}>
                <Image 
                  src="https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=800&q=80"
                  alt="Featured Book"
                  fill
                  className="object-cover shadow-book"
                />
                <div className="absolute inset-y-0 left-0 w-8 shadow-book-spine pointer-events-none" />
              </div>
            </div>
            
            <div className="w-full border-t border-rule pt-4 text-center">
              <div className="font-cormorant font-bold uppercase tracking-[0.2em] text-gold mb-2 text-sm">Editor's Choice</div>
              <h4 className="font-playfair text-2xl text-ink font-bold mb-1">The Art of the Novel</h4>
              <p className="font-libre italic text-ink-muted text-sm">by Milan Kundera</p>
            </div>
          </div>

          {/* Right Column - Today's Picks */}
          <div className="w-full md:w-1/4 p-6 md:p-8 flex flex-col">
            <h4 className="font-cormorant font-bold uppercase tracking-[0.1em] text-ink border-b border-rule pb-2 mb-4">
              Today's Picks
            </h4>
            
            <div className="flex flex-col gap-6">
              {books.filter(b => String(b.book_id) === '1' || String(b.book_id) === '2').slice(0, 2).map((book) => (
                <div 
                  key={book.book_id} 
                  className="group cursor-pointer"
                  onClick={() => onBookClick && onBookClick(book)}
                >
                  <h5 className="font-playfair text-ink text-lg leading-tight group-hover:text-gold transition-colors">
                    {book.title}
                  </h5>
                  <p className="font-libre italic text-ink-muted text-xs mt-1">
                    by {book.author}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-8">
              <div className="border-l-2 border-gold pl-4 py-1">
                <p className="font-playfair italic text-ink-soft text-lg leading-snug">
                  "Reading is the finest journey with no ticket required."
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
