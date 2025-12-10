'use client';

import { motion } from 'framer-motion';
import { Button } from './UI';

export default function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = Infinity,
  disabled = false,
}) {
  const handleDecrease = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrease = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleDecrease}
        disabled={disabled || value <= min}
        className="w-10 h-10 rounded-xl border-2 border-brand-border flex items-center justify-center hover:border-brand-primary hover:bg-brand-bg disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all"
        aria-label="Decrease quantity"
      >
        <svg className="w-4 h-4 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      </motion.button>
      <span className="w-16 text-center font-semibold text-brand-primary text-lg">{value}</span>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleIncrease}
        disabled={disabled || value >= max}
        className="w-10 h-10 rounded-xl border-2 border-brand-border flex items-center justify-center hover:border-brand-primary hover:bg-brand-bg disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all"
        aria-label="Increase quantity"
      >
        <svg className="w-4 h-4 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </motion.button>
    </div>
  );
}
