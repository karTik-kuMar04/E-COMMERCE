'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductGrid from '@/components/ui/ProductGrid';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { SectionHeader } from '@/components/ui/UI';
import { homeBooks } from '@/services/books.service.js';
import ProductCarousel from '@/components/ui/ProductCarousel';
import Hero from '@/components/ui/Hero';


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
        console.log(res)
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
    <div className="overflow-hidden">

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Hero></Hero>
      </motion.div>
      
      <div className='px-20 py-10'>
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <SectionHeader lineHeight='gold-line-lg'>New Arrivals</SectionHeader>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <ProductCarousel books={newArrivals} />
          )}
        </motion.section>
      </div>
      <div className="bg-white px-20 py-10">
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <SectionHeader lineHeight='gold-line-xl'>Featured Books</SectionHeader>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <ProductCarousel books={featured} />
          )}
        </motion.section>
      </div>

      
    </div>
  );
}
