'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Plus, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/utils/format';
import FavoritesButton from './FavoritesButton';

export default function ProductCard({ book, index = 0 }) {
  const price = book.price || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.23, 1, 0.32, 1] }}
      className="group relative w-full border-2 border-slate-200 hover:border-indigo-300 px-5 py-2 rounded-lg"
    >
      <Link href={`/books/${book.id}`} className="block relative">
        {/* --- IMAGE SECTION --- */}
        <div className="relative aspect-[3/4.5] w-full overflow-hidden rounded-xl">
          {/* Book Image */}
          <motion.div 
            className="relative h-full w-full p-5 z-10 flex items-center justify-center"
          >
            <div className="relative w-full h-full rounded-xl">
              <Image
                src={book.images?.cover || '/assets/covers/placeholder.jpg'}
                alt={book.title}
                fill
                className="object-cover rounded-xl"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>
          </motion.div>


          <div className="absolute top-6 left-6 z-30">
            <div className="bg-gradient-to-r from-indigo-200 to-teal-200 border border-indigo-200 px-3 py-1.5 rounded-full">
              <span className="text-xs font-bold tracking-widest text-indigo-700 uppercase">
                {formatPrice(price)}
              </span>
            </div>
          </div>

          
         
            
        </div>

        {/* --- INFO SECTION --- */}
        <div className="mt-6 space-y-2">
          <div className="flex items-center gap-2">
             <span className="h-[1px] w-6 bg-[#7000ff] transition-all duration-500 group-hover:w-12" />
             <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#7000ff]">
               {book.category || 'Original Edition'}
             </p>
          </div>

          <div className="absolute top-6 right-6 z-30">
            <FavoritesButton bookId={book.id} />
          </div>
          
          <h3 className="text-2xl font-light tracking-tight text-gray-900 leading-[1.1] transition-all duration-300">
            {book.title.split(' ').map((word, i) => (
              <span key={i} className={i === 0 ? "font-black block text-3xl" : "inline-block mr-1 opacity-70 group-hover:opacity-100"}>
                {word}
              </span>
            ))}
          </h3>

          <div className="flex justify-between items-center pt-2">
            <p className="text-sm font-medium text-gray-400">
              {book.authors?.join(', ')}
            </p>

          </div>
        </div>
      </Link>
    </motion.div>
  );
}