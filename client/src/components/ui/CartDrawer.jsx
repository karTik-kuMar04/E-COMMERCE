'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useCartStore from '@/stores/cartStore';
import { formatPrice } from '@/utils/format';
import QuantityStepper from './QuantityStepper';
import { Button, Card } from './UI';

export default function CartDrawer({ isOpen, onClose }) {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const [isRemoving, setIsRemoving] = useState(null);

  if (!isOpen) return null;

  const handleRemove = async (bookId, format) => {
    setIsRemoving(`${bookId}-${format}`);
    await new Promise(resolve => setTimeout(resolve, 200));
    removeItem(bookId, format);
    setIsRemoving(null);
  };

  const total = getTotal();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full md:w-[480px] bg-brand-surface shadow-premium-lg z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-brand-border">
              <h2 className="text-display-3 font-serif text-brand-primary">Shopping Cart</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="text-brand-muted hover:text-brand-primary transition-colors p-2 rounded-xl hover:bg-brand-bg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                aria-label="Close cart"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-body-lg text-brand-muted mb-6">Your cart is empty</p>
                  <Link href="/books" onClick={onClose}>
                    <Button variant="primary">Browse Books</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        key={`${item.bookId}-${item.format}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className={`premium-card p-4 ${
                          isRemoving === `${item.bookId}-${item.format}` ? 'opacity-50' : ''
                        }`}
                      >
                        <div className="flex gap-4">
                          <div className="relative w-20 h-28 flex-shrink-0 bg-brand-bg rounded-xl overflow-hidden border border-brand-border">
                            <Image
                              src={item.coverImage || '/assets/covers/placeholder.jpg'}
                              alt={item.bookTitle}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm line-clamp-2 text-brand-primary mb-1">{item.bookTitle}</h3>
                            <p className="text-xs text-brand-muted mb-2">{item.format}</p>
                            <p className="text-sm font-bold text-brand-primary mb-3">
                              {formatPrice(item.price)}
                            </p>
                            <div className="flex items-center gap-2">
                              <QuantityStepper
                                value={item.quantity}
                                onChange={(qty) => updateQuantity(item.bookId, item.format, qty)}
                                max={item.stock || Infinity}
                              />
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleRemove(item.bookId, item.format)}
                                className="ml-auto text-error hover:text-error/80 p-1.5 focus:outline-none focus:ring-2 focus:ring-error rounded-lg"
                                aria-label="Remove item"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-brand-border p-6 space-y-4 bg-brand-bg/30">
                <div className="flex justify-between items-center text-display-3 font-serif">
                  <span className="text-brand-primary">Total:</span>
                  <span className="text-brand-primary">{formatPrice(total)}</span>
                </div>
                <Link href="/checkout" onClick={onClose}>
                  <Button variant="secondary" className="w-full" size="lg">
                    Checkout
                  </Button>
                </Link>
                <Link href="/cart" onClick={onClose}>
                  <Button variant="ghost" className="w-full">
                    View Full Cart
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
