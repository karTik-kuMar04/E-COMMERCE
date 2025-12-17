'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ProductGrid from '@/components/ui/ProductGrid';
import { Button } from '@/components/ui/UI';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { SectionHeader } from '@/components/ui/UI';
import useFavoriteStore from '@/stores/favoriteStore';
import demoBooks from '@/data/demo-books.json';

export default function FavoritesPage() {
  const [loading, setLoading] = useState(true);
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const { favorites, clearFavorites } = useFavoriteStore();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const favoriteList = demoBooks.filter(book => favorites.includes(book.id));
      setFavoriteBooks(favoriteList);
      setLoading(false);
    };
    
    loadData();
  }, [favorites]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12"
    >
      <div className="flex items-center justify-between">
        <SectionHeader>My Favorites</SectionHeader>
        {favoriteBooks.length > 0 && (
          <Button variant="ghost" onClick={clearFavorites}>
            Clear All
          </Button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[...Array(4)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : favoriteBooks.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-body-lg text-brand-muted mb-6">You haven't favorited any books yet.</p>
          <Link href="/books">
            <Button variant="primary">Browse Books</Button>
          </Link>
        </div>
      ) : (
        <ProductGrid books={favoriteBooks} />
      )}
    </motion.div>
  );
}
