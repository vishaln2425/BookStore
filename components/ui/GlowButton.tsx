import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

type GlowButtonProps = HTMLMotionProps<'button'> & {
  variant?: 'violet' | 'sapphire' | 'gold';
  loading?: boolean;
};

export const GlowButton = React.forwardRef<HTMLButtonElement, GlowButtonProps>(
  ({ children, variant = 'violet', loading, className, disabled, ...props }, ref) => {
    const baseStyles = "relative overflow-hidden rounded-xl px-6 py-3 font-semibold transition-all duration-300 group";
    
    const variants = {
      violet: "bg-violet-600 text-white hover:shadow-neon-violet",
      sapphire: "bg-blue-600 text-white hover:shadow-neon-blue",
      gold: "bg-amber-500 text-white hover:shadow-neon-gold text-slate-900",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        disabled={disabled || loading}
        className={twMerge(clsx(baseStyles, variants[variant], disabled && "opacity-50 cursor-not-allowed", className))}
        {...props}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {loading && (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {children as React.ReactNode}
        </span>
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shimmer" />
      </motion.button>
    );
  }
);

GlowButton.displayName = 'GlowButton';
