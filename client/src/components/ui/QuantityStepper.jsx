'use client';
import { Minus, Plus } from 'lucide-react';

export default function QuantityStepper({ value, onChange, min = 1, max = 10, disabled = false }) {
  const decrease = () => !disabled && value > min && onChange(value - 1);
  const increase = () => !disabled && value < max && onChange(value + 1);

  return (
    <div className={`flex items-center justify-between bg-slate-100 rounded-full px-1 w-32 h-12 border border-slate-200 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <button 
        onClick={decrease}
        disabled={value <= min || disabled}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-slate-800 shadow-sm hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
      >
        <Minus size={14} strokeWidth={3} />
      </button>

      <span className="font-bold text-slate-900 text-lg w-8 text-center tabular-nums">
        {value}
      </span>

      <button 
        onClick={increase}
        disabled={value >= max || disabled}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-indigo-600 shadow-sm hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
      >
        <Plus size={14} strokeWidth={3} />
      </button>
    </div>
  );
}