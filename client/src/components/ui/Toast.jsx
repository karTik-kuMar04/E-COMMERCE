'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Toast({
  message,
  type = 'info',
  onClose,
  duration = 5000,
  action,
}) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 250);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const types = {
    info: 'bg-brand-primary text-white',
    success: 'bg-success text-white',
    error: 'bg-error text-white',
    warning: 'bg-warning text-white',
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className={`
            fixed bottom-6 right-6 max-w-[350px] w-full
            rounded-xl shadow-lg flex items-center gap-3
            px-5 py-4 z-[999] ${types[type]}
          `}
        >
          {/* Message */}
          <div className="flex-1 text-sm leading-snug break-words whitespace-normal max-h-[100px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/50 pr-1 pt-[2px]">
            {message}
          </div>


          {/* Action Button */}
          {action && (
            <button
              onClick={action.onClick}
              className="underline text-xs font-semibold hover:opacity-80 transition-opacity mt-[2px]"
            >
              {action.label}
            </button>
          )}

          {/* Close Button */}
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 250);
            }}
            className="opacity-80 hover:opacity-100 p-1 rounded mt-[2px]"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed bottom-6 right-6 z-[999] space-y-3 max-w-full">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            action={toast.action}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
