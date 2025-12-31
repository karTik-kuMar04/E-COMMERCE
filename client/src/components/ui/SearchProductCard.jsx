'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingCart, Bell, Star, BookOpen } from 'lucide-react';
import { formatPrice } from '@/utils/format';
import FavoritesButton from './FavoritesButton';

export default function SearchProductCard({ book, index = 0 }) {
  const price = book.price || 0;
  const stockCount = Number(book.stock ?? 0);
  const inStock = stockCount > 0;
  const isNew = book.is_new || false;
  const rating = book.rating || 4.5;
  const reviewCount = book.reviewCount || 120;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group w-full h-full"
    >
      <Link 
        href={`/books/${book.id}`}
        className="flex flex-col md:flex-row gap-4 md:gap-6 bg-white p-3 md:p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-[0_8px_30px_rgb(99,102,241,0.12)] hover:border-indigo-500/30 transition-all duration-300 relative overflow-hidden h-full"
      >
        
        {/* --- LEFT: IMAGE SECTION --- */}
        <div className="relative w-full md:w-48 md:shrink-0 aspect-[3/4] md:aspect-[3/4.5] rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-slate-100 shadow-inner">
          <Image
            src={book.images?.cover || '/assets/covers/placeholder.jpg'}
            alt={book.title}
            fill
            className={`object-cover transition-transform duration-500 group-hover:scale-105 ${!inStock ? 'grayscale-[50%]' : ''}`}
            sizes="(max-width: 768px) 100vw, 200px"
          />
          
          {!inStock && (
            <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center backdrop-blur-[1px]">
              <span className="bg-red-500/90 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                Out of Stock
              </span>
            </div>
          )}
          {/* REDESIGN: Gradient badge for New Arrivals */}
          {inStock && isNew && (
            <div className="absolute top-2 left-2">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide shadow-md">
                New Arrival
              </span>
            </div>
          )}
        </div>

        {/* --- RIGHT: INFO SECTION --- */}
        <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
          
          {/* Top Row: Category & Fav */}
          <div className="flex justify-between items-start gap-4 mb-2">
            <div className="space-y-1.5 min-w-0 flex-1">
              {/* REDESIGN: Pill shape category badge, softer colors */}
              <div className="flex items-center gap-2">
                 <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider text-purple-700 uppercase bg-purple-100/80 px-2.5 py-1 rounded-full">
                   <BookOpen className="w-3 h-3" />
                  {book.genre || 'Uncategorized'}
                </span>
              </div>
              
              {/* Title - REDESIGN: Warmer slate color, slightly bigger */}
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight group-hover:text-indigo-700 transition-colors line-clamp-2">
                {book.title}
              </h3>
              
              {/* Author - REDESIGN: Slate text */}
              <p className="text-sm font-medium text-slate-500 truncate">
                by <span className="text-slate-800">{book.authors?.length > 0 ? book.authors.join(', ') : 'Unknown Author'}</span>
              </p>
            </div>

            <div className="z-10 shrink-0 pt-1" onClick={(e) => e.preventDefault()}>
               <FavoritesButton bookId={book.id} />
            </div>
          </div>

          {/* Rating & Description */}
          <div className="mb-4 flex-1">
            {/* REDESIGN: Yellow star, slate text */}
            <div className="flex items-center gap-1.5 mb-3 bg-amber-50/50 w-fit px-2 py-0.5 rounded-md">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-bold text-slate-800">{rating}</span>
              <span className="text-xs text-slate-500">({reviewCount} reviews)</span>
            </div>
            
            {/* Description - REDESIGN: Slate text for softer read */}
            <p className="text-sm text-slate-600 line-clamp-2 md:line-clamp-3 leading-relaxed">
              {book.description || "No description available for this book currently."}
            </p>
          </div>

          <div className="mt-auto pt-4 pb-1 border-t border-slate-100 flex flex-wrap items-end justify-between gap-4">
            
            {/* Price - REDESIGN: Warmer colors */}
            <div>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-extrabold text-slate-900">{formatPrice(price)}</p>
                {book.discount > 0 && (
                    <p className="text-sm text-rose-500 line-through font-medium opacity-70">
                    {formatPrice(price * 1.2)}
                    </p>
                )}
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex items-center gap-2.5 z-20 flex-wrap sm:flex-nowrap w-full sm:w-auto">
              {inStock ? (
                <>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      console.log('Added to cart', book.id);
                    }}
                    // REDESIGN: Hover state now introduces brand color instead of just gray
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-slate-200 text-slate-700 font-semibold text-sm hover:border-indigo-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all active:scale-95"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span className="inline">Add to Cart</span>
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      console.log('Buy Now', book.id);
                    }}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#7000ff] to-[#9333ea] text-white font-bold text-sm hover:shadow-lg hover:shadow-purple-200 transition-all hover:-translate-y-0.5 active:scale-95"
                  >
                    Buy Now
                  </button>
                </>
              ) : (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    console.log('Notify', book.id);
                  }}
                  // REDESIGN: Warmer slate button for notify
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-800 text-white font-bold text-sm hover:bg-slate-700 hover:shadow-lg transition-all w-full md:w-auto justify-center active:scale-95"
                >
                  <Bell className="w-4 h-4" />
                  Notify Me
                </button>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}