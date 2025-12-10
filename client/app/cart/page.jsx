'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import useCartStore from '@/stores/cartStore';
import { formatPrice } from '@/utils/format';
import QuantityStepper from '@/components/ui/QuantityStepper';
import { Button, Input, Card } from '@/components/ui/UI';
import { ToastContainer } from '@/components/ui/Toast';
import { SectionHeader } from '@/components/ui/UI';

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const [promoCode, setPromoCode] = useState('');
  const [notes, setNotes] = useState('');
  const [toasts, setToasts] = useState([]);

  const total = getTotal();
  const subtotal = total;
  const shipping = total > 0 ? 5.99 : 0;
  const finalTotal = subtotal + shipping;

  const handleRemove = (item) => {
    const itemData = { ...item };
    removeItem(item.bookId, item.format);
    
    const toastId = Date.now();
    const newToast = {
      id: toastId,
      message: 'Item removed from cart',
      type: 'info',
      action: {
        label: 'Undo',
        onClick: () => {
          useCartStore.getState().addItem(
            { id: itemData.bookId, title: itemData.bookTitle, authors: itemData.bookAuthors, coverImage: itemData.coverImage, formatOptions: [{ format: itemData.format, price: itemData.price, stock: itemData.stock }] },
            itemData.format,
            itemData.quantity
          );
          setToasts(prev => prev.filter(t => t.id !== toastId));
        },
      },
    };
    
    setToasts(prev => [...prev, newToast]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toastId));
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-24"
      >
        <SectionHeader>Your Cart</SectionHeader>
        <p className="text-body-lg text-brand-muted mb-8">Your cart is empty.</p>
        <Link href="/books">
          <Button variant="primary">Browse Books</Button>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12"
    >
      <SectionHeader>Your Cart</SectionHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, index) => (
            <motion.div
              key={`${item.bookId}-${item.format}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex gap-6">
                  <div className="relative w-24 h-32 flex-shrink-0 bg-brand-bg rounded-xl overflow-hidden border border-brand-border">
                    <Image
                      src={item.coverImage || '/assets/covers/placeholder.jpg'}
                      alt={item.bookTitle}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-display-3 text-brand-primary mb-2">{item.bookTitle}</h3>
                    <p className="text-body text-brand-muted mb-4">{item.format}</p>
                    <p className="text-display-3 font-serif text-brand-primary mb-6">
                      {formatPrice(item.price)}
                    </p>
                    
                    <div className="flex items-center gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-brand-primary mb-2">Quantity</label>
                        <QuantityStepper
                          value={item.quantity}
                          onChange={(qty) => updateQuantity(item.bookId, item.format, qty)}
                          max={item.stock || Infinity}
                        />
                      </div>
                      
                      <div className="ml-auto text-right">
                        <p className="text-caption text-brand-muted mb-1">Subtotal</p>
                        <p className="text-display-3 font-serif text-brand-primary">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleRemove(item)}
                        className="text-error hover:text-error/80 p-2 focus:outline-none focus:ring-2 focus:ring-error rounded-xl"
                        aria-label="Remove item"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card className="p-8 space-y-6 sticky top-24">
            <h2 className="text-display-3 font-serif text-brand-primary">Order Summary</h2>
            
            <div className="space-y-3 pb-6 border-b border-brand-border">
              <div className="flex justify-between text-body">
                <span className="text-brand-muted">Subtotal</span>
                <span className="font-semibold text-brand-primary">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-body">
                <span className="text-brand-muted">Shipping</span>
                <span className="font-semibold text-brand-primary">{formatPrice(shipping)}</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-display-2 font-serif pt-4">
              <span className="text-brand-primary">Total</span>
              <span className="text-brand-primary">{formatPrice(finalTotal)}</span>
            </div>

            <div>
              <Input
                label="Promo Code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Enter code"
              />
              <Button variant="ghost" className="w-full mt-2" size="sm">
                Apply
              </Button>
            </div>

            <div>
              <label className="block text-sm font-semibold text-brand-primary mb-2">
                Notes for Seller
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-3 border-2 border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary bg-brand-surface text-brand-primary placeholder:text-brand-muted/50"
                rows={3}
                placeholder="Any special instructions..."
              />
            </div>

            <Link href="/checkout" className="block">
              <Button variant="secondary" className="w-full" size="lg">
                Proceed to Checkout
              </Button>
            </Link>
          </Card>
        </div>
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </motion.div>
  );
}
