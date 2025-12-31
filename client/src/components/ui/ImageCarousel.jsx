'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ImageCarousel({ images, title }) {
  const [[page, direction], setPage] = useState([0, 0]);

  // Fallback if no images
  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-[2/3] bg-slate-100 rounded-2xl flex items-center justify-center border border-slate-200">
        <span className="text-slate-400 font-medium">No Image</span>
      </div>
    );
  }

  // Infinite loop logic
  const imageIndex = Math.abs(page % images.length);

  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
  };

  // Animation Variants
  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95
    })
  };

  return (
    <div className="relative w-full max-w-[340px] mx-auto md:mx-0 group">
      {/* CARD CONTAINER */}
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl shadow-2xl shadow-indigo-100 bg-white border border-slate-100">
        
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={page}
            src={images[imageIndex]}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            alt={`${title} view`}
            className="absolute inset-0 w-full h-full object-cover"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -10000) paginate(1);
              else if (swipe > 10000) paginate(-1);
            }}
          />
        </AnimatePresence>

        {/* CONTROLS (Only show if multiple images) */}
        {images.length > 1 && (
          <>
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full text-slate-800 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-white"
              onClick={() => paginate(-1)}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full text-slate-800 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-white"
              onClick={() => paginate(1)}
            >
              <ChevronRight size={18} />
            </button>
            
            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
              {images.map((_, idx) => (
                <div 
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-all shadow-sm ${idx === imageIndex ? 'bg-white w-3' : 'bg-white/50'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      
      {/* Spine Effect on left edge */}
      <div className="absolute top-[2%] bottom-[2%] left-0 w-[4px] bg-gradient-to-r from-black/20 to-transparent rounded-l-xl pointer-events-none z-20" />
    </div>
  );
}

// Helper for drag physics
const swipePower = (offset, velocity) => {
  return Math.abs(offset) * velocity;
};