'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen } from 'lucide-react'; 
import { Button, SectionHeader } from '@/components/ui/UI';
import useFavoriteStore from '@/stores/favoriteStore';
import { useToast } from 'src/contexts/ToastContext';
import apiClient from '@/lib/apiClient';

export default function FavoritesPage() {
  const { favorites, removeFavorite } = useFavoriteStore();
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  // Handle individual removal
  const handleRemove = async (e, bookId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      console.log(bookId)
      const res = await apiClient.delete("/user/favorites", {data: {bookId}})

      if (res.data.success){
        addToast({type: "success", message: res.data.message });
      }else{
        addToast({ type: "warning", message: res.data.message });
      }
    } catch (err) {
      addToast({type: "error", message: err?.response?.data?.message})
    }
  };

  return (
    <div className="min-h-screen w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Header - Minimalist */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-baseline gap-3 border-b border-gray-100 pb-4"
      >
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Favorites</h1>
        {!loading && (
          <span className="text-sm text-gray-400 font-medium">
            {favorites.length} {favorites.length === 1 ? 'book' : 'books'}
          </span>
        )}
      </motion.div>

      {loading ? (
        // Skeleton - Adjusted for smaller grid
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8">
          {[...Array(5)].map((_, i) => (
             // Custom smaller skeleton to match new layout
            <div key={i} className="animate-pulse space-y-3">
              <div className="bg-gray-200 aspect-[2/3] rounded-md w-full" />
              <div className="h-3 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : favorites.length === 0 ? (
        // Empty State - Clean & Centered
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-32 text-center"
        >
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-gray-300" />
          </div>
          <h2 className="text-lg font-medium text-gray-900 mb-1">Your collection is empty</h2>
          <p className="text-sm text-gray-500 mb-6">Save items you want to read later.</p>
          <Link href="/books">
            <Button variant="primary" size="sm">Browse Library</Button>
          </Link>
        </motion.div>
      ) : (
        // The "Bookshelf" Grid
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10"
        >
          <AnimatePresence mode="popLayout">
            {favorites.map((book, i) => (
              <motion.div
                key={book.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="group relative flex flex-col"
              >
                <Link href={`/books/${book.id}`} className="block h-full">
                  
                  {/* Image Wrapper */}
                  <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-300 bg-gray-100">
                    <Image
                      src={book.images?.cover}
                      alt={book.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Dark Overlay on Hover (improves text/icon visibility) */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />

                    {/* Remove Button - Top Right, Fade in */}
                    <button
                      onClick={(e) => handleRemove(e, book.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-gray-700 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-50 hover:text-red-600 shadow-sm transform translate-y-[-5px] group-hover:translate-y-0"
                      title="Remove"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  {/* Text Content - Minimalist */}
                  <div className="mt-3 space-y-1">
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-1">
                      {book.authors?.join(", ")}
                    </p>
                    {book.price && (
                         <p className="text-xs font-medium text-gray-900 mt-1">${book.price}</p>
                    )}
                  </div>

                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}