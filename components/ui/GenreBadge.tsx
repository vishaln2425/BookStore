import React from 'react';
import { GENRE_COLORS } from '../../constants/genres';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface GenreBadgeProps {
  genre: string;
  className?: string;
}

export const GenreBadge: React.FC<GenreBadgeProps> = ({ genre, className }) => {
  const colorClasses = GENRE_COLORS[genre] || GENRE_COLORS['default'];

  return (
    <span 
      className={twMerge(
        clsx(
          "px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full border bg-surface/50 backdrop-blur-sm",
          colorClasses,
          className
        )
      )}
    >
      {genre}
    </span>
  );
};
