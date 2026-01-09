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
import { useSyncCart } from '@/hooks/useSyncCart';
import apiClient from '@/lib/apiClient';
import { useToast } from 'src/contexts/ToastContext';
import { checkoutCartApi } from "@/services/checkout.service";
import { useRouter } from 'next/navigation';



export default function CartDrawer({ isOpen, onClose }) {
  const router = useRouter();
  const { items, getTotal } = useCartStore();
  const [isRemoving, setIsRemoving] = useState(null);
  const { addToast } = useToast();
  const syncCart = useSyncCart();

  const handleRemove = async (formatId) => {
    try {
      await apiClient.delete(`/user/cart/${formatId}`);
      await syncCart();
    } catch (err) {
      addToast({type: "error", message: err?.response?.data?.message || "something went wrong"});
      console.log(err)
    }
  };

  const handleQuantityChange = async (formatId, qty) => {
    if (!formatId) return;

    try {
      await apiClient.patch("/user/cart", {
        format_id: formatId,
        quantity: qty
      });

      await syncCart();
    } catch (err) {
      addToast({
        type: "error",
        message:
          err?.response?.data?.message ||
          "Failed to update quantity"
      });
    }
  };


  const handleCheckout = async () => {
    try {
      const res = await checkoutCartApi();
      if (res.data.success) {
        await syncCart();
        onClose();
        router.push(`/order-success?orderId=${res.data.orderId}`);
      }
    } catch (err) {
      addToast({ type: "error", message: "Checkout failed" });
    }
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
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[480px] bg-white shadow-2xl z-50 flex flex-col border-l"
          >
            {/* Top gradient */}
            <div className="h-1 bg-gradient-to-r from-indigo-400 via-purple-400 to-teal-400" />

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b">
              <div className="flex items-center gap-3">
                <ShoppingBag size={22} />
                <h2 className="text-xl font-bold">Your Cart</h2>
                <span className="bg-gray-100 text-xs font-bold px-2 py-1 rounded-full">
                  {items.length}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={22} />
              </button>
            </div>

            {/* Cart items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50/40">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                    <ShoppingBag size={30} />
                  </div>
                  <h3 className="text-lg font-medium">Your cart is empty</h3>
                  <p className="text-gray-500 max-w-[260px]">
                    Add some books to see them here.
                  </p>
                  <Link href="/books" onClick={onClose}>
                    <Button className="mt-3">Start Browsing</Button>
                  </Link>
                </div>
              ) : (
                <ul className="space-y-5 pb-6">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.li
                        key={item.formatId}
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        className={`flex gap-4 p-4 bg-white rounded-2xl border shadow-sm ${
                          isRemoving === item.formatId
                            ? 'opacity-50 pointer-events-none'
                            : ''
                        }`}
                      >
                        {/* Cover */}
                        <div className="relative w-20 aspect-[2/3] rounded-lg overflow-hidden bg-gray-200">
                          <Image
                            src={item.images?.cover || '/assets/covers/placeholder.jpg'}
                            alt={item.title}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <div className="flex justify-between items-start gap-2">
                              <h3 className="font-semibold leading-tight line-clamp-2">
                                {item.title}
                              </h3>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleRemove(item.formatId);
                                }}
                                className="text-gray-400 hover:text-red-500"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>

                            {item.authors?.length > 0 && (
                              <p className="text-sm text-gray-500 mt-1">
                                {item.authors.join(', ')}
                              </p>
                            )}
                            <p className="text-xs text-gray-500">
                              Format: {item.format}
                            </p>

                          </div>

                          <div className="flex items-end justify-between mt-3">
                            <QuantityStepper
                              value={item.quantity}
                              onChange={(qty) =>
                                handleQuantityChange(item.formatId, qty)
                              }
                            />

                            <p className="font-bold text-lg">
                              {item.price
                                ? formatPrice(item.price * item.quantity)
                                : '—'}
                            </p>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t bg-white">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-500 text-sm">Subtotal</span>
                  <span className="text-2xl font-bold">
                    {formatPrice(total)}
                  </span>
                </div>

                
                  <Button onClick={handleCheckout} className="w-full flex justify-between items-center py-4">
                    <span>Checkout</span>
                    <ArrowRight size={18} />
                  </Button>


                <Link
                  href="/cart"
                  onClick={onClose}
                  className="block text-center mt-3 text-sm text-gray-500 hover:text-black"
                >
                  View full cart
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
