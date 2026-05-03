'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Book } from '../../types/book';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface SwipeAiWidgetProps {
  books: Book[];
  selectedBook?: Book | null;
  onBookClick?: (book: Book) => void;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080';

const SUGGESTION_CHIPS = [
  'Recommend a book like...',
  'What is this book about?',
  'Find books by this author',
  'Compare two authors',
];

const OPENING_MESSAGE: Message = {
  id: 'opening',
  role: 'ai',
  content: "Good day. I've read everything on these shelves. What are you looking for?",
  timestamp: new Date(),
};

// Simple inline markdown: **bold** and *italic*
function renderMessageContent(text: string) {
  let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
  return html;
}

export const SwipeAiWidget: React.FC<SwipeAiWidgetProps> = ({
  books,
  selectedBook,
  onBookClick,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [messages, setMessages] = useState<Message[]>([OPENING_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded) {
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [isExpanded]);

  // Re-appear pill 2s after dismiss
  useEffect(() => {
    if (isDismissed) {
      const timer = setTimeout(() => setIsDismissed(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isDismissed]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await axios.post(`${API_BASE}/api/ai/ask`, {
        query: text.trim(),
      });

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        role: 'ai',
        content: (typeof response.data === 'string' ? response.data : response.data.response || response.data.summary) || 'I seem to have lost my place. Could you ask that again?',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const errMsg: Message = {
        id: `err-${Date.now()}`,
        role: 'ai',
        content: 'The archives appear to be momentarily unreachable. Do try again in a moment.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  }, [books, selectedBook]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleChipClick = (chipText: string) => {
    let finalText = chipText;
    if (chipText === 'What is this book about?' && selectedBook) {
      finalText = `What is ${selectedBook.title} about?`;
    } else if (chipText === 'Find books by this author' && selectedBook) {
      finalText = `Find books by ${selectedBook.author}`;
    } else if (chipText === 'Recommend a book like...' && selectedBook) {
      finalText = `Recommend a book like ${selectedBook.title}`;
    }
    sendMessage(finalText);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    if (diffMs < 60000) return 'just now';
    if (diffMs < 3600000) return `${Math.floor(diffMs / 60000)}m ago`;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const hasConversation = messages.length > 1;

  if (isDismissed) return null;

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 150 }}>
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          /* ── Collapsed Pill ── */
          <motion.button
            key="pill"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsExpanded(true)}
            style={{
              width: 160,
              height: 44,
              background: '#1A1610',
              border: '1px solid #B8973A',
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              transition: 'box-shadow 0.2s, transform 0.2s',
            }}
            whileHover={{
              y: -2,
              boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
              borderColor: '#E8D5A3',
            }}
          >
            {/* Pulsing ornament */}
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              style={{ color: '#B8973A', fontSize: '0.85rem' }}
            >
              ✦
            </motion.span>
            <span
              style={{
                fontFamily: 'var(--font-cormorant), serif',
                fontVariant: 'small-caps',
                color: '#B8973A',
                fontSize: '0.85rem',
                letterSpacing: '0.15em',
                fontWeight: 600,
              }}
            >
              Ask SwipeAI
            </span>
          </motion.button>
        ) : (
          /* ── Expanded Panel ── */
          <motion.div
            key="panel"
            initial={{ height: 44, opacity: 0.8 }}
            animate={{ height: 520, opacity: 1 }}
            exit={{ height: 44, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{
              width: 380,
              maxWidth: 'calc(100vw - 32px)',
              background: '#1A1610',
              border: '1px solid #B8973A',
              borderRadius: 6,
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* ── Header ── */}
            <div
              style={{
                minHeight: 68,
                background: '#221C14',
                borderBottom: '1px solid #B8973A',
                padding: '10px 16px 8px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: '#B8973A', fontSize: '0.85rem' }}>✦</span>
                  <span
                    style={{
                      fontFamily: 'var(--font-cormorant), serif',
                      fontVariant: 'small-caps',
                      color: '#B8973A',
                      fontSize: '0.9rem',
                      letterSpacing: '0.2em',
                      fontWeight: 600,
                    }}
                  >
                    SwipeAI
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {/* Minimize */}
                  <button
                    onClick={() => setIsExpanded(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#FDFAF4',
                      fontSize: 16,
                      cursor: 'pointer',
                      padding: '4px 6px',
                      opacity: 0.7,
                      lineHeight: 1,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#B8973A'; e.currentTarget.style.opacity = '1'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#FDFAF4'; e.currentTarget.style.opacity = '0.7'; }}
                    aria-label="Minimize"
                  >
                    ─
                  </button>
                  {/* Close */}
                  <button
                    onClick={() => { setIsExpanded(false); setIsDismissed(true); }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#FDFAF4',
                      fontSize: 16,
                      cursor: 'pointer',
                      padding: '4px 6px',
                      opacity: 0.7,
                      lineHeight: 1,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#B8973A'; e.currentTarget.style.opacity = '1'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#FDFAF4'; e.currentTarget.style.opacity = '0.7'; }}
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-garamond), serif',
                  fontStyle: 'italic',
                  color: '#8B7355',
                  fontSize: '0.7rem',
                  marginLeft: 24,
                  marginTop: 2,
                }}
              >
                Your Literary Companion
              </span>
            </div>

            {/* ── Conversation Area ── */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px',
                scrollbarWidth: 'thin',
                scrollbarColor: '#B8973A transparent',
              }}
              className="custom-scrollbar"
            >
              {!hasConversation ? (
                /* ── Empty State ── */
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    gap: 20,
                  }}
                >
                  <motion.span
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ color: '#B8973A', fontSize: '1.5rem' }}
                  >
                    ✦
                  </motion.span>
                  <p
                    style={{
                      fontFamily: 'var(--font-playfair), serif',
                      fontStyle: 'italic',
                      color: '#FDFAF4',
                      fontSize: '1.1rem',
                      textAlign: 'center',
                      lineHeight: 1.5,
                      maxWidth: 200,
                    }}
                  >
                    &ldquo;What shall we explore today?&rdquo;
                  </p>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: 8,
                      width: '100%',
                      maxWidth: 300,
                      marginTop: 8,
                    }}
                  >
                    {SUGGESTION_CHIPS.map((chip) => (
                      <button
                        key={chip}
                        onClick={() => handleChipClick(chip)}
                        style={{
                          background: 'transparent',
                          border: '1px solid rgba(184,151,58,0.3)',
                          borderRadius: 4,
                          padding: '10px 8px',
                          fontFamily: 'var(--font-cormorant), serif',
                          fontVariant: 'small-caps',
                          fontSize: '0.7rem',
                          color: '#B8973A',
                          letterSpacing: '0.1em',
                          cursor: 'pointer',
                          textAlign: 'center',
                          lineHeight: 1.4,
                          transition: 'background 0.15s, border-color 0.15s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(184,151,58,0.08)';
                          e.currentTarget.style.borderColor = 'rgba(184,151,58,0.6)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.borderColor = 'rgba(184,151,58,0.3)';
                        }}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* ── Messages ── */
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {messages.map((msg, i) => (
                    <React.Fragment key={msg.id}>
                      {msg.role === 'user' ? (
                        /* User Message */
                        <div style={{ textAlign: 'right', marginBottom: 16 }}>
                          <div
                            style={{
                              fontFamily: 'var(--font-cormorant), serif',
                              fontStyle: 'italic',
                              color: '#FDFAF4',
                              fontSize: '0.95rem',
                              lineHeight: 1.6,
                              borderRight: '2px solid #B8973A',
                              paddingRight: 12,
                              display: 'inline-block',
                              textAlign: 'right',
                              maxWidth: '85%',
                            }}
                            dangerouslySetInnerHTML={{ __html: renderMessageContent(msg.content) }}
                          />
                          <div
                            style={{
                              fontFamily: 'var(--font-garamond), serif',
                              color: '#8B7355',
                              fontSize: '0.65rem',
                              marginTop: 4,
                              paddingRight: 14,
                            }}
                          >
                            {formatTime(msg.timestamp)}
                          </div>
                        </div>
                      ) : (
                        /* AI Message */
                        <div style={{ marginBottom: 16, maxWidth: '92%' }}>
                          <div style={{ lineHeight: 1.7 }}>
                            <span style={{ color: '#B8973A', marginRight: 6, fontSize: '0.8rem' }}>✦</span>
                            <span
                              style={{
                                fontFamily: 'var(--font-garamond), serif',
                                color: '#FDFAF4',
                                fontSize: '0.9rem',
                              }}
                              dangerouslySetInnerHTML={{ __html: renderMessageContent(msg.content) }}
                            />
                          </div>
                        </div>
                      )}
                      {/* Separator between exchanges */}
                      {msg.role === 'ai' && i < messages.length - 1 && (
                        <div
                          style={{
                            height: 1,
                            background: 'rgba(184,151,58,0.2)',
                            margin: '4px 0 16px',
                          }}
                        />
                      )}
                    </React.Fragment>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 16 }}>
                      <span style={{ color: '#B8973A', marginRight: 6, fontSize: '0.8rem' }}>✦</span>
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          animate={{ opacity: [0.2, 1, 0.2] }}
                          transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            delay: i * 0.4,
                            ease: 'easeInOut',
                          }}
                          style={{ color: '#B8973A', fontSize: '1.2rem', lineHeight: 1 }}
                        >
                          ·
                        </motion.span>
                      ))}
                    </div>
                  )}

                  <div ref={chatEndRef} />
                </div>
              )}
            </div>

            {/* ── Input Area ── */}
            <div
              style={{
                minHeight: 56,
                borderTop: '1px solid rgba(184,151,58,0.2)',
                background: '#1A1610',
                display: 'flex',
                alignItems: 'center',
                padding: '0 12px',
                gap: 8,
              }}
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about any book…"
                rows={1}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  resize: 'none',
                  fontFamily: 'var(--font-garamond), serif',
                  fontStyle: 'italic',
                  color: '#FDFAF4',
                  fontSize: '0.95rem',
                  lineHeight: 1.5,
                  padding: '14px 0',
                  caretColor: '#B8973A',
                }}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim()}
                style={{
                  background: 'none',
                  border: 'none',
                  fontFamily: 'var(--font-cormorant), serif',
                  color: '#B8973A',
                  fontSize: '1.2rem',
                  cursor: input.trim() ? 'pointer' : 'default',
                  opacity: input.trim() ? 1 : 0.3,
                  padding: '4px 4px',
                  transition: 'transform 0.1s',
                  lineHeight: 1,
                }}
                onMouseEnter={(e) => { if (input.trim()) e.currentTarget.style.transform = 'translateX(2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; }}
                onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.9)'; }}
                onMouseUp={(e) => { e.currentTarget.style.transform = 'none'; }}
                aria-label="Send message"
              >
                ↵
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Placeholder style for textarea */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #B8973A; border-radius: 2px; }
        div[style*="bottom: 24"] textarea::placeholder {
          color: rgba(184,151,58,0.4);
          font-style: italic;
        }
        @media (max-width: 768px) {
          div[style*="bottom: 24"] > div[style*="width: 380px"] {
            width: calc(100vw - 32px) !important;
            height: 70vh !important;
          }
          div[style*="bottom: 24"] > div[style*="width: 380px"] > div:last-child {
            min-height: 64px !important;
          }
        }
      `}</style>
    </div>
  );
};
