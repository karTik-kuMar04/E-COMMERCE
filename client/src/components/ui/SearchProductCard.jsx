'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingCart, Bell, Star, BookOpen } from 'lucide-react';
import { formatPrice } from '@/utils/format';
import FavoritesButton from './FavoritesButton';
import apiClient from '@/lib/apiClient';
import { useToast } from 'src/contexts/ToastContext';
import useCartStore from '@/stores/cartStore';
import { useState } from 'react';
import { useSyncCart } from '@/hooks/useSyncCart';

export default function SearchProductCard({ book, index = 0 }) {
  const items = useCartStore((state) => state.items);
  const syncCart = useSyncCart();
  const { addToast } = useToast();
  const [adding, setAdding] = useState(false);

  /* -----------------------------
     FORMAT SELECTION
  ----------------------------- */
  const defaultFormat =
    book.formats?.find((f) => f.format === 'Paperback') ||
    book.formats?.[0];

  const [selectedFormat, setSelectedFormat] = useState(defaultFormat);

  /* -----------------------------
     DERIVED STATE (FROM SELECTED FORMAT)
  ----------------------------- */
  const price = selectedFormat?.price ?? 0;
  const stockCount = Number(selectedFormat?.stock ?? 0);
  const inStock = stockCount > 0;
  const isNew = book.is_new || false;

  const rating = book.rating || 4.5;
  const reviewCount = book.reviewCount || 120;

  /* -----------------------------
     CART STATE (FORMAT-BASED)
  ----------------------------- */
  const isInCart = items.some(
    (item) => item.formatId === selectedFormat?.formatId
  );

  /* -----------------------------
     ADD TO CART
  ----------------------------- */
  const handleAddToCart = async () => {
    if (!selectedFormat || isInCart || adding) return;

    setAdding(true);
    try {
      const res = await apiClient.post('/user/cart', {
        formatId: selectedFormat.formatId
      });

      if (res.data.success) {
        await syncCart();
        addToast({ type: 'success', message: res.data.message });
      } else {
        addToast({ type: 'warning', message: res.data.message });
      }
    } catch (error) {
      addToast({
        type: 'error',
        message:
          error?.response?.data?.message ||
          'Something went wrong. Please try again'
      });
    } finally {
      setAdding(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group w-full h-full"
    >
      <Link
        href={`/books/${book.id}`}
        className="flex flex-col md:flex-row gap-4 md:gap-6 bg-white p-3 md:p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-[0_8px_30px_rgb(99,102,241,0.12)] transition-all"
      >
        {/* IMAGE */}
        <div className="relative w-full md:w-48 aspect-[3/4] rounded-xl overflow-hidden">
          <Image
            src={book.images?.cover || '/assets/covers/placeholder.jpg'}
            alt={book.title}
            fill
            className={`object-cover ${!inStock ? 'grayscale-[50%]' : ''}`}
          />

          {!inStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                Out of Stock
              </span>
            </div>
          )}

          {inStock && isNew && (
            <span className="absolute top-2 left-2 bg-indigo-600 text-white text-[10px] px-2 py-1 rounded-full">
              New Arrival
            </span>
          )}
        </div>

        {/* CONTENT */}
        <div className="flex-1 flex flex-col justify-between">
          {/* TOP */}
          <div>
            <span className="text-xs font-bold uppercase text-purple-700">
              {book.genre || 'Uncategorized'}
            </span>

            <h3 className="text-xl font-bold mt-1">{book.title}</h3>

            <p className="text-sm text-slate-500">
              by {book.authors?.join(', ') || 'Unknown Author'}
            </p>
          </div>

          {/* RATING */}
          <div className="flex items-center gap-1 text-sm mt-2">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            {rating} ({reviewCount})
          </div>

          {/* FOOTER */}
          <div className="pt-4 border-t mt-4 flex justify-between items-end gap-4">
            <div>
              <p className="text-3xl font-bold">{formatPrice(price)}</p>

              {/* FORMAT SELECTOR */}
              <div className="flex gap-2 mt-2">
                {book.formats.map((f) => (
                  <button
                    key={f.formatId}
                    disabled={f.stock === 0}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedFormat(f);
                    }}
                    className={`px-3 py-1 text-xs rounded-full border ${
                      selectedFormat.formatId === f.formatId
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-gray-700'
                    }`}
                  >
                    {f.format}
                  </button>
                ))}
              </div>
            </div>

            {inStock ? (
              <button
                disabled={isInCart || adding}
                onClick={(e) => {
                  e.preventDefault();
                  handleAddToCart();
                }}
                className={`px-4 py-2 rounded-xl text-sm font-medium ${
                  isInCart
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {isInCart ? 'Added' : 'Add to Cart'}
              </button>
            ) : (
              <button className="px-4 py-2 bg-slate-800 text-white rounded-xl text-sm">
                Notify Me
              </button>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
