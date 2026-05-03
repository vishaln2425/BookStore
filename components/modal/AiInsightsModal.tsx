'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Book } from '../../types/book';

interface AiInsightsModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
}

// Simple markdown parser for basic bold, italic, and paragraphs
const renderMarkdown = (text: string) => {
  // Split by double newlines for paragraphs
  const paragraphs = text.split(/\n\n+/);
  
  return paragraphs.map((p, pIndex) => {
    // Process bold (**text**)
    let htmlContent = p.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Process italic (*text*)
    htmlContent = htmlContent.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    return (
      <p 
        key={pIndex} 
        className={`mb-4 ${pIndex === 0 ? 'drop-cap' : ''}`}
        dangerouslySetInnerHTML={{ __html: htmlContent }} 
      />
    );
  });
};

export const AiInsightsModal: React.FC<AiInsightsModalProps> = ({ book, isOpen, onClose }) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && book && !summary) {
      const fetchInsights = async () => {
        setIsLoading(true);
        setError(null);
        try {
          // Pointing to the backend API
          const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080';
          const response = await axios.post(`${API_BASE}/api/ai/ask`, {
            query: `Provide editorial insights and a short summary for the book "${book.title}". Description: ${book.description}`
          });
          
          if (response.data && response.data.response) {
            setSummary(response.data.response);
          } else {
            setError("The archives returned empty for this tome.");
          }
        } catch (err) {
          console.error("AI Insights Error:", err);
          setError("Our editor encountered a mystical error while consulting the archives.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchInsights();
    }
  }, [isOpen, book, summary]);

  // Reset state when closed
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setSummary(null);
        setError(null);
      }, 300); // Wait for exit animation
    }
  }, [isOpen]);

  if (!book) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6" style={{ perspective: '1200px' }}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink/80 backdrop-blur-sm"
          />

          {/* Modal Panel */}
          <motion.div
            initial={{ opacity: 0, y: 30, rotateX: 10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: 20, rotateX: -5 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            className="relative w-full max-w-2xl bg-parchment shadow-book border border-gold rounded-sm overflow-hidden flex flex-col max-h-[85vh]"
            role="dialog"
          >
            {/* Inner border detail */}
            <div className="absolute inset-2 border border-rule pointer-events-none rounded-sm" />

            {/* Close Button */}
            <motion.button
              whileHover={{ rotate: 90, scale: 1.1 }}
              onClick={onClose}
              className="absolute top-6 right-6 z-50 p-2 text-ink/70 hover:text-ink bg-transparent border-none font-playfair text-3xl leading-none transition-colors"
              aria-label="Close modal"
            >
              ×
            </motion.button>

            {/* Header */}
            <div className="p-8 pb-4 text-center border-b border-rule/50 relative z-10">
              <div className="font-cormorant text-gold font-bold uppercase tracking-[0.2em] text-sm mb-2">
                Editorial Review
              </div>
              <h2 className="text-3xl font-playfair font-bold text-ink italic">
                AI Insights
              </h2>
            </div>

            {/* Content Area */}
            <div className="p-8 overflow-y-auto custom-scrollbar relative z-10 flex-1 flex flex-col min-h-[300px]">
              
              {/* Loading State */}
              <AnimatePresence mode="wait">
                {isLoading && (
                  <motion.div 
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center flex-1 h-full py-12"
                  >
                    {/* Pulsing Gold Star/Diamond Animation */}
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5],
                        rotate: [0, 90, 180]
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                      className="text-gold text-4xl mb-6"
                    >
                      ✦
                    </motion.div>
                    
                    <motion.div
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="font-cormorant italic text-xl text-ink-soft text-center"
                    >
                      Our editor is consulting the archives...
                    </motion.div>
                  </motion.div>
                )}

                {/* Error State */}
                {error && !isLoading && (
                  <motion.div 
                    key="error"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center flex-1 text-center py-12"
                  >
                    <div className="text-ink-muted text-2xl mb-4">📜</div>
                    <p className="font-garamond text-lg text-ink-soft italic">{error}</p>
                  </motion.div>
                )}

                {/* Success/Result State */}
                {summary && !isLoading && !error && (
                  <motion.div 
                    key="result"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="prose prose-lg max-w-none text-ink-soft font-garamond leading-relaxed"
                  >
                    {renderMarkdown(summary)}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
