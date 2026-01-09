'use client'; 

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bug, X, Send, CheckCircle, AlertCircle, Sparkles, Layout } from 'lucide-react';
import apiClient from '@/lib/apiClient';
import { useToast } from 'src/contexts/ToastContext';

export const BugReportModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState('input');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('visual'); // visual, functional, content
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
        // You can now send the category too if your backend supports it
        const res = await apiClient.post("/api/system/report-bug", { message, category });
        if (res.data.success){
            setStep('success');
            setTimeout(() => {
                onClose();
                setTimeout(() => { 
                    setStep('input'); 
                    setMessage('');
                    setCategory('visual');
                }, 500);
            }, 2500);
        }
    } catch (err) {
        addToast({ type: "error", message: "Failed to send report" });
    } finally {
        setIsSubmitting(false);
    }
  };

  const categories = [
    { id: 'visual', label: 'Visual', icon: Layout },
    { id: 'functional', label: 'Broken', icon: AlertCircle },
    { id: 'idea', label: 'Idea', icon: Sparkles },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            
            {/* Dark Backdrop with Blur */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />

            {/* The Floating Card */}
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative w-full max-w-lg bg-slate-900 border border-slate-800 shadow-2xl shadow-black/50 rounded-2xl overflow-hidden"
            >
                {/* Header Gradient Line */}
                <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="p-8">
                    {step === 'input' ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            
                            {/* Header */}
                            <div className="space-y-1">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <Bug className="text-indigo-400" /> Report an Issue
                                </h2>
                                <p className="text-slate-400 text-sm">
                                    Help us polish the InkVerse experience.
                                </p>
                            </div>

                            {/* Category Selector */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</label>
                                <div className="flex gap-2">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            onClick={() => setCategory(cat.id)}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all border ${
                                                category === cat.id 
                                                ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300' 
                                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750 hover:border-slate-600'
                                            }`}
                                        >
                                            <cat.icon size={16} />
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Text Area */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Details</label>
                                <textarea
                                    required
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Tell us what happened..."
                                    className="w-full h-32 bg-slate-950/50 border border-slate-800 rounded-xl p-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none text-sm leading-relaxed"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                disabled={isSubmitting || message.length < 3}
                                type="submit"
                                className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-indigo-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <span className="animate-pulse">Sending...</span>
                                ) : (
                                    <>Submit Report <Send size={16} className="text-indigo-600" /></>
                                )}
                            </button>

                        </form>
                    ) : (
                        // Success State
                        <div className="py-12 flex flex-col items-center text-center space-y-4">
                            <motion.div 
                                initial={{ scale: 0, rotate: -45 }} 
                                animate={{ scale: 1, rotate: 0 }} 
                                transition={{ type: "spring", bounce: 0.5 }}
                                className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center border border-green-500/30"
                            >
                                <CheckCircle size={40} />
                            </motion.div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Report Sent!</h3>
                                <p className="text-slate-400 text-sm mt-1 max-w-[200px] mx-auto">
                                    Thanks for helping us squash those bugs.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};