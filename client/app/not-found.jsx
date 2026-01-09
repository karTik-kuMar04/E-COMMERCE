'use client';

import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowLeft, Home, Search } from 'lucide-react';
import { useEffect } from 'react';

export default function NotFound() {
  // Mouse tracking logic for the flashlight effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth spring animation for the flashlight
  const mouseX = useSpring(x, { stiffness: 500, damping: 50 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 50 });

  function handleMouseMove({ clientX, clientY }) {
    x.set(clientX);
    y.set(clientY);
  }

  // Effect to center the light initially
  useEffect(() => {
    if (typeof window !== 'undefined') {
        x.set(window.innerWidth / 2);
        y.set(window.innerHeight / 2);
    }
  }, []);

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="relative w-full h-screen bg-slate-950 overflow-hidden flex flex-col items-center justify-center text-center cursor-none" // cursor-none hides the default pointer
    >
      
      {/* 1. BACKGROUND LAYER (Dark & Mysterious) */}
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />

      {/* 2. THE FLASHLIGHT EFFECT (Masking) */}
      <motion.div
        style={{
          left: mouseX,
          top: mouseY,
        }}
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-white rounded-full mix-blend-overlay blur-[100px] opacity-20 z-0"
      />
      
      {/* 3. CONTENT */}
      <div className="relative z-10 px-6 max-w-2xl">
        
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <h1 className="text-[12rem] md:text-[15rem] font-bold text-slate-900 leading-none select-none drop-shadow-2xl relative">
                <span className="absolute inset-0 text-slate-800 blur-sm">404</span>
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-b from-slate-700 to-slate-900">404</span>
            </h1>
        </motion.div>

        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="space-y-6 -mt-10"
        >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-200">
                Chapter Not Found
            </h2>
            <p className="text-slate-400 text-lg max-w-md mx-auto">
                It seems you've wandered into the restricted section. The page you are looking for has been moved, deleted, or never existed in this timeline.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                <Link href="/">
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-3 bg-indigo-600 text-white rounded-full font-medium flex items-center gap-2 hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-900/20"
                    >
                        <Home size={18} />
                        Return Home
                    </motion.button>
                </Link>

                <Link href="/books">
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-3 bg-transparent border border-slate-700 text-slate-300 rounded-full font-medium flex items-center gap-2 hover:bg-slate-800 transition-colors"
                    >
                        <Search size={18} />
                        Browse Books
                    </motion.button>
                </Link>
            </div>
        </motion.div>
      </div>

      {/* 4. CUSTOM CURSOR (Following the light) */}
      <motion.div
        style={{
          left: mouseX,
          top: mouseY,
        }}
        className="pointer-events-none fixed top-0 left-0 w-8 h-8 -ml-4 -mt-4 border-2 border-indigo-500/50 rounded-full z-50 flex items-center justify-center"
      >
        <div className="w-1 h-1 bg-indigo-400 rounded-full" />
      </motion.div>

      {/* Footer / Copyright */}
      <div className="absolute bottom-8 text-slate-600 text-sm">
        Error Code: 404 • The InkVerse Collection
      </div>

    </div>
  );
}