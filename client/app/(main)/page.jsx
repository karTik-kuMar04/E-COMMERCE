'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { SectionHeader } from '@/components/ui/UI';
import { homeBooks } from '@/services/books.service.js';
import ProductCarousel from '@/components/ui/ProductCarousel';
import Hero from '@/components/ui/Hero';
import useFavoriteStore from '@/stores/favoriteStore';
import { BugReportModal } from '@/components/ui/BugReport';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [isBugModalOpen, setIsBugModalOpen] = useState(false);
  
  const { fetchFavorites } = useFavoriteStore();

  useEffect(() => {
    fetchFavorites();
    const loadBooks = async () => {
      try {
        setLoading(true);
        const res = await homeBooks();
        if(res?.data) {
            setFeatured(res.data.featured || []);
            setNewArrivals(res.data.latest || []);
        }
      } catch (err) {
        console.log("Error loading", err);
      } finally {
        setLoading(false);
      }
    };
    loadBooks();
  }, []);

  return (
    <div className="overflow-hidden relative">
      
      {/* CRITICAL FIX: 
         The Modal is OUTSIDE the motion.div.
         It is now a direct child of the main div.
      */}
      <BugReportModal 
        isOpen={isBugModalOpen} 
        onClose={() => setIsBugModalOpen(false)}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* Pass the opener function to Hero */}
        <Hero onOpenBugReport={() => setIsBugModalOpen(true)} />
      </motion.div>
      
      <div className='px-20 py-10' id="new-arrivals">
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <SectionHeader lineHeight='gold-line-lg'>New Arrivals</SectionHeader>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : (
            <ProductCarousel books={newArrivals} />
          )}
        </motion.section>
      </div>

      <div className="bg-white px-20 py-10" id="featured-book">
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <SectionHeader lineHeight='gold-line-xl'>Featured Books</SectionHeader>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : (
            <ProductCarousel books={featured} />
          )}
        </motion.section>
      </div>
    </div>
  );
}