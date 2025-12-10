'use client';

import { motion } from 'framer-motion';
import useFavoriteStore from '@/stores/favoriteStore';

export default function FavoritesButton({ bookId, className = '' }) {
  const { isFavorite, toggleFavorite } = useFavoriteStore();

  const favorited = isFavorite(bookId);

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={(e) => {
        e.stopPropagation();
        toggleFavorite(bookId);
      }}
      className={`p-2.5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-secondary ${
        favorited
          ? 'text-brand-secondary bg-brand-secondary/10'
          : 'text-brand-muted hover:text-brand-secondary hover:bg-brand-secondary/5'
      } ${className}`}
      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <motion.svg
        className="w-5 h-5"
        fill={favorited ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
        initial={false}
        animate={{ scale: favorited ? [1, 1.3, 1] : 1 }}
        transition={{ duration: 0.3 }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </motion.svg>
    </motion.button>
  );
}

