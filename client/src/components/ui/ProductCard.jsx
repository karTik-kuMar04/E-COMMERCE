'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';
import useCartStore from '@/stores/cartStore';
import { formatPrice } from '@/utils/format';
import FavoritesButton from './FavoritesButton';
import QuantityStepper from './QuantityStepper';
import { Button, Card, Badge } from './UI';

export default function ProductCard({ book, showQuantity = false, index = 0 }) {
  const [isAdding, setIsAdding] = useState(false);
  const { addItem, removeItem, items, updateQuantity } = useCartStore();
  

  const price = book.min_price || 0;
  const stock = book.total_stock;
  const isOutOfStock = stock !== null && stock === 0;
  
  const cartItem = items.find(
    item => item.bookId === book.id && item.format === defaultFormat?.format
  );
  const inCart = !!cartItem;
  

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!defaultFormat) return;
    
    setIsAdding(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    addItem(book, defaultFormat.format, 1);
    setIsAdding(false);
  };

  const handleRemoveFromCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (defaultFormat) {
      removeItem(book.id, defaultFormat.format);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (defaultFormat) {
      updateQuantity(book.id, defaultFormat.format, newQuantity);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link href={`/books/${book.id}`}>
        <Card hover className="group overflow-hidden h-full flex flex-col">
          <div className="relative aspect-[2/3] bg-brand-bg overflow-hidden">
            <Image
              src={book.images.cover || '/assets/covers/placeholder.jpg'}
              alt={`${book.title} by ${book.authors?.join(', ') || 'Unknown'}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                <Badge variant="error" className="bg-error/90 text-white px-4 py-2">
                  Out of Stock
                </Badge>
              </div>
            )}
            <div className="absolute top-4 right-4 z-10">
              <FavoritesButton bookId={book.id} />
            </div>
            {book.genre && (
              <div className="absolute top-4 left-4 z-10">
                <Badge variant="gold">{book.genre}</Badge>
              </div>
            )}
          </div>
          
          <div className="p-6 flex-1 flex flex-col">
            <h3 className="font-serif text-display-3 text-brand-primary mb-2 line-clamp-2 group-hover:text-brand-primary/80 transition-colors">
              {book.title}
            </h3>
            <p className="text-sm text-brand-muted mb-4 line-clamp-1">
              {book.authors?.join(', ') || 'Unknown Author'}
            </p>
            
            <div className="mt-auto space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-brand-primary">
                  {formatPrice(price)}
                </span>
              </div>
              
              {inCart && showQuantity ? (
                <div className="flex items-center gap-3">
                  <QuantityStepper
                    value={cartItem.quantity}
                    onChange={handleQuantityChange}
                    max={cartItem.stock || Infinity}
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleRemoveFromCart}
                    className="text-error hover:text-error/80 p-2 focus:outline-none focus:ring-2 focus:ring-error rounded-xl"
                    aria-label="Remove from cart"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </motion.button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant={isOutOfStock ? 'ghost' : 'primary'}
                  disabled={isOutOfStock || isAdding}
                  onClick={handleAddToCart}
                  className="w-full"
                >
                  {isAdding ? 'Adding...' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </Button>
              )}
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
