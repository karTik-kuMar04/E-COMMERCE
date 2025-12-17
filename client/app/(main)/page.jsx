'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductGrid from '@/components/ui/ProductGrid';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { SectionHeader } from '@/components/ui/UI';
import { homeBooks } from '@/services/books.service.js';


export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [popular, setPopular] = useState([]);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);

        const res = await homeBooks();
        const latestBooks = res.latest
        const featuredBooks = res.featured

        setFeatured(featuredBooks);
        setNewArrivals(latestBooks);
        setPopular(data.popular);

      } catch (err) {
        console.log("Error loading", err);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, []);


  return (
    <div className="space-y-24 pb-16">
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
         
      </motion.div>
      
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <SectionHeader>Featured Books</SectionHeader>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <ProductGrid books={featured} />
        )}
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-brand-bg/50 rounded-3xl p-12 -mx-6"
      >
        <SectionHeader>New Arrivals</SectionHeader>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <ProductGrid books={newArrivals} />
        )}
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <SectionHeader>Most Popular</SectionHeader>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <ProductGrid books={popular} />
        )}
      </motion.section>
    </div>
  );
}
