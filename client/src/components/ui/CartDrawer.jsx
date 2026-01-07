'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import useCartStore from '@/stores/cartStore';
import { formatPrice } from '@/utils/format';
import QuantityStepper from './QuantityStepper';
import { Button } from './UI';

export default function CartDrawer({ isOpen, onClose }) {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const [isRemoving, setIsRemoving] = useState(null);

  const handleRemove = async (bookId, format) => {
    const key = `${bookId}-${format}`;
    setIsRemoving(key);
    // slight delay for animation
    await new Promise(resolve => setTimeout(resolve, 300));
    removeItem(bookId, format);
    setIsRemoving(null);
  };

  const total = getTotal();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[480px] bg-white shadow-2xl z-50 flex flex-col border-l border-gray-100"
          >
            {/* Decorative Top Line */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-400 via-purple-400 to-teal-400" />

            {/* --- Header --- */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-brand-primary" size={24} />
                <h2 className="text-2xl font-serif font-bold text-gray-900">Your Cart</h2>
                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-full">
                  {items.length}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
              >
                <X size={24} />
              </button>
            </div>

            {/* --- Cart Items --- */}
            <div className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50/30">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-80">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-2">
                    <ShoppingBag size={32} />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Your cart is empty</h3>
                  <p className="text-gray-500 max-w-[250px]">
                    Looks like you haven't added any magical reads to your collection yet.
                  </p>
                  <Link
                    href={'/books'}
                  >
                    <Button
                      variant="primary" 
                      onClick={onClose} 
                      className="mt-4"
                    >
                      Start Browsing
                    </Button>
                  </Link>
                </div>
              ) : (
                <ul className="space-y-6 pb-6">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.li
                        key={`${item.bookId}-${item.format}`}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -50, transition: { duration: 0.2 } }}
                        className={`group relative flex gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow ${
                          isRemoving === `${item.bookId}-${item.format}` ? 'opacity-50 pointer-events-none' : ''
                        }`}
                      >
                        {/* Book Cover */}
                        <div className="relative w-20 aspect-[2/3] flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden shadow-sm">
                          <Image
                            src={item.coverImage || '/assets/covers/placeholder.jpg'}
                            alt={item.bookTitle}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <div className="flex justify-between items-start gap-2">
                              <h3 className="font-serif font-bold text-gray-900 leading-tight line-clamp-2">
                                {item.bookTitle}
                              </h3>
                              <button
                                onClick={() => handleRemove(item.bookId, item.format)}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                title="Remove item"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                            <p className="text-sm text-gray-500 mt-1 capitalize">{item.format}</p>
                          </div>

                          <div className="flex items-end justify-between mt-3">
                            <div className="scale-90 origin-bottom-left">
                                {/* Assuming QuantityStepper handles its own styles, 
                                    but wrapped to fit sizing */}
                                <QuantityStepper
                                  value={item.quantity}
                                  onChange={(qty) => updateQuantity(item.bookId, item.format, qty)}
                                  max={item.stock || Infinity}
                                />
                            </div>
                            <p className="font-bold text-lg text-brand-primary">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* --- Footer / Checkout --- */}
            {items.length > 0 && (
              <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.02)] z-10">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm">Subtotal</span>
                    <span className="text-2xl font-serif font-bold text-gray-900">
                      {formatPrice(total)}
                    </span>
                  </div>
                  
                  <Link href="/checkout" onClick={onClose} className="block">
                    <Button 
                      variant="primary" 
                      size="lg" 
                      className="w-full flex justify-between items-center group py-4 text-base"
                    >
                      <span>Checkout</span>
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  
                  <Link href="/cart" onClick={onClose} className="block text-center">
                    <span className="text-sm text-gray-500 hover:text-brand-primary transition-colors font-medium">
                      View full cart
                    </span>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}