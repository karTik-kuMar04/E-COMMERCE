import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Link from 'next/link';
import { Bug } from 'lucide-react'; // Make sure to import an icon if you want one

// 👇 1. UPDATE: Accept the 'onOpenBugReport' prop here
const Hero = ({ onOpenBugReport }) => {
  const containerRef = useRef(null);

  // Advanced: Mouse tracking for subtle parallax on the image stack
  const mouseX = useSpring(0, { stiffness: 120, damping: 18 });
  const mouseY = useSpring(0, { stiffness: 120, damping: 18 });

  const range = 50;

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set((clientX / innerWidth - 0.5) * range);
    mouseY.set((clientY / innerHeight - 0.5) * range);
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="select-none relative min-h-screen w-full bg-white flex items-center justify-center overflow-hidden px-6 py-20"
    >
      {/* 👇 2. NEW: The Trigger Button (Top Right Corner) */}
      <motion.button
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ delay: 1 }}
        onClick={onOpenBugReport}
        className="absolute top-24 right-6 lg:top-8 lg:right-8  flex items-center gap-3 px-6 py-3 bg-slate-900 hover:bg-indigo-600 text-white rounded-full shadow-xl shadow-indigo-900/20 border border-slate-700 hover:border-indigo-500 transition-all cursor-pointer group"
      >
        {/* The Pinging Dot Effect */}
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-400 group-hover:bg-white transition-colors"></span>
        </span>

        <span className="text-sm font-bold tracking-wide">
          Report Bug
        </span>
      </motion.button>


      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* LEFT CONTENT: Typography & CTA */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-1.5 mb-6 text-sm font-medium tracking-wider text-indigo-600 uppercase bg-indigo-50 rounded-full"
          >
            Est. 2025 • The InkVerse Collection
          </motion.span>
          
          <h1 className="text-6xl md:text-7xl font-bold text-slate-900 leading-[1.1] mb-6">
            Where Stories <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-500">
              Meet Their Next Chapter
            </span>
          </h1>

          <p className="text-lg text-slate-600 mb-10 max-w-lg leading-relaxed">
            Experience a curated digital sanctuary for readers. Architected for 
            seamless discovery, our platform brings the world's finest literature 
            directly to your screen.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link 
              href="/books" 
              className="
                px-8 py-4 text-white rounded-xl font-semibold
                bg-gradient-to-r from-violet-900 via-sky-700 to-teal-500
                bg-[length:300%_300%] bg-left
                transition-all duration-500 ease-out
                hover:bg-right
                transform hover:-translate-y-1
                shadow-lg shadow-slate-200
              "
            >
              Browse Collection
            </Link>
            <Link href="/about" className="px-8 py-4 border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all">
              Our Story
            </Link>
          </div>
        </motion.div>

        {/* RIGHT CONTENT: The Interactive Visual Stack */}
        <motion.div 
          style={{ x: mouseX, y: mouseY }}
          className="relative flex justify-center items-center"
        >
          {/* Main Book Image Placeholder */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative z-10 w-full max-w-[400px] aspect-[3/4] bg-slate-100 rounded-2xl shadow-2xl overflow-hidden"
          >
            <img 
              src="/hero_image.png" 
              alt="Featured Book" 
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Floating Skill Indicators (Floating UI Cards) */}
          <FloatingCard 
            delay={0.5} 
            className="top-10 -left-12 bg-white p-4 shadow-xl rounded-2xl border border-slate-100"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600">✓</div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Availability</p>
                <p className="text-sm font-bold text-slate-800">In Stock Now</p>
              </div>
            </div>
          </FloatingCard>

          <FloatingCard 
            delay={0.7} 
            className="bottom-20 -right-8 bg-white p-4 shadow-xl rounded-2xl border border-slate-100"
          >
            <div className="flex flex-col gap-1">
              <div className="flex text-yellow-400 text-xs">★★★★★</div>
              <p className="text-sm font-bold text-slate-800">4.9/5 Rating</p>
              <p className="text-[10px] text-slate-400">From 2k+ Readers</p>
            </div>
          </FloatingCard>

          {/* Subtle Background Geometric Shape */}
          <div className="absolute -z-10 w-[500px] h-[500px] bg-indigo-50 rounded-full blur-3xl opacity-60" />
        </motion.div>

      </div>
    </section>
  );
};

// Helper component for floating elements
const FloatingCard = ({ children, className, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ 
      delay, 
      duration: 0.8,
      repeat: Infinity,
      repeatType: "reverse",
      duration: 3, // Floating effect
      ease: "easeInOut"
    }}
    className={`absolute z-20 ${className}`}
  >
    {children}
  </motion.div>
);

export default Hero;