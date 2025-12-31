'use client';

import clsx from 'clsx';

export function Skeleton({ className = '', variant = 'default' }) {
  const variants = {
    default: 'bg-brand-border animate-pulse rounded-xl',
    text: 'bg-brand-border animate-pulse rounded h-4',
    title: 'bg-brand-border animate-pulse rounded h-8',
    image: 'bg-brand-border animate-pulse rounded-2xl shimmer',
    card: 'bg-brand-border animate-pulse rounded-2xl shimmer',
  };

  return <div className={clsx('shimmer', variants[variant], className)} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="premium-card overflow-hidden">
      <Skeleton variant="image" className="w-full aspect-[2/3]" />
      <div className="p-6 space-y-3">
        <Skeleton variant="title" className="w-3/4 h-6" />
        <Skeleton variant="text" className="w-1/2 h-4" />
        <Skeleton variant="text" className="w-1/4 h-5" />
        <Skeleton variant="default" className="w-full h-10 rounded-xl" />
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-white pb-24 pt-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Main Grid Layout matching the real page */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* --- LEFT COLUMN (Sticky Image) --- */}
          <div className="md:col-span-5 lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              {/* Main Image Aspect Ratio [2/3] */}
              <div className="w-full aspect-[2/3] bg-slate-200 rounded-xl animate-pulse" />
              
              {/* Trust Badges Area */}
              <div className="h-20 bg-slate-50 rounded-xl w-full animate-pulse" />
            </div>
          </div>

          {/* --- RIGHT COLUMN (Details) --- */}
          <div className="md:col-span-7 lg:col-span-8 space-y-8">
            
            {/* 1. Header Section */}
            <div className="space-y-4 animate-pulse">
              {/* Breadcrumb Pills */}
              <div className="flex gap-2">
                <div className="h-5 w-16 bg-slate-200 rounded-full" />
                <div className="h-5 w-24 bg-slate-200 rounded-full" />
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-3">
                <div className="h-10 md:h-12 w-3/4 bg-slate-200 rounded-lg" /> {/* Title */}
                <div className="h-6 w-1/2 bg-slate-200 rounded-lg" /> {/* Subtitle */}
              </div>

              {/* Author & Rating Row */}
              <div className="flex items-center gap-4 py-2 border-b border-slate-100">
                <div className="h-5 w-32 bg-slate-200 rounded" />
                <div className="h-5 w-20 bg-slate-200 rounded" />
              </div>

              {/* Tags/Awards Row */}
              <div className="flex gap-2">
                <div className="h-6 w-20 bg-slate-200 rounded-lg" />
                <div className="h-6 w-20 bg-slate-200 rounded-lg" />
              </div>
            </div>

            {/* 2. The Buy Box Skeleton */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-8 animate-pulse">
               
               {/* Price & Formats Row */}
               <div className="flex justify-between items-end">
                  <div className="space-y-2">
                    <div className="h-4 w-16 bg-slate-200 rounded" />
                    <div className="h-10 w-32 bg-slate-200 rounded-lg" />
                  </div>
                  {/* Format Pills */}
                  <div className="flex gap-2">
                    <div className="h-8 w-20 bg-slate-200 rounded-lg" />
                    <div className="h-8 w-20 bg-slate-200 rounded-lg" />
                  </div>
               </div>

               {/* Buttons Area */}
               <div className="space-y-4">
                  <div className="flex gap-4 h-12">
                     {/* Quantity Stepper Shape */}
                     <div className="w-32 h-full bg-slate-200 rounded-full" />
                     {/* Add to Cart Shape */}
                     <div className="flex-1 h-full bg-slate-200 rounded-full" />
                  </div>
                  {/* Buy Now Shape */}
                  <div className="w-full h-12 bg-slate-200 rounded-full" />
               </div>
            </div>

            {/* 3. Synopsis / Text Content */}
            <div className="space-y-4 animate-pulse">
               <div className="h-6 w-24 bg-slate-200 rounded border-l-4 border-slate-300 pl-3" />
               <div className="space-y-3">
                 <div className="h-4 w-full bg-slate-200 rounded" />
                 <div className="h-4 w-full bg-slate-200 rounded" />
                 <div className="h-4 w-5/6 bg-slate-200 rounded" />
                 <div className="h-4 w-4/6 bg-slate-200 rounded" />
               </div>
            </div>

            {/* 4. Author Bio Box */}
            <div className="h-40 bg-slate-50 rounded-2xl w-full animate-pulse" />

            {/* 5. Technical Specs Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-slate-100 animate-pulse">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                   <div className="h-3 w-16 bg-slate-200 rounded" />
                   <div className="h-4 w-24 bg-slate-200 rounded" />
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}


export function SearchSkeleton() {
  return (
    <div className="w-full bg-white p-4 rounded-2xl border border-gray-100 flex flex-col md:flex-row gap-6 animate-pulse">
      
      {/* --- LEFT: IMAGE SKELETON --- */}
      <div className="relative w-full md:w-48 md:shrink-0 aspect-[3/4.5] bg-slate-200 rounded-xl overflow-hidden">
        {/* Optional: darker shade to simulate image loading */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 opacity-50" />
      </div>

      {/* --- RIGHT: INFO SKELETON --- */}
      <div className="flex-1 flex flex-col justify-between py-1">
        
        {/* Top Section */}
        <div className="space-y-4">
          
          {/* Category Pill & Fav Icon */}
          <div className="flex justify-between items-start">
            <div className="h-6 w-24 bg-slate-200 rounded-full" />
            <div className="h-8 w-8 bg-slate-200 rounded-full" />
          </div>

          {/* Title & Author */}
          <div className="space-y-2">
            <div className="h-7 w-3/4 bg-slate-200 rounded-lg" />
            <div className="h-4 w-1/3 bg-slate-200 rounded-full" />
          </div>

          {/* Rating */}
          <div className="h-6 w-32 bg-slate-200 rounded-md mt-2" />

          {/* Description Lines */}
          <div className="space-y-2 pt-1">
            <div className="h-3 w-full bg-slate-200 rounded-full" />
            <div className="h-3 w-11/12 bg-slate-200 rounded-full" />
            <div className="h-3 w-4/6 bg-slate-200 rounded-full" />
          </div>
        </div>

        {/* Bottom Section: Price & Buttons */}
        <div className="mt-6 pt-4 border-t border-slate-50 flex flex-wrap items-center justify-between gap-4">
          
          {/* Price */}
          <div className="h-9 w-24 bg-slate-200 rounded-lg" />

          {/* Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="h-10 flex-1 sm:w-32 bg-slate-200 rounded-xl" /> {/* Add to Cart */}
            <div className="h-10 flex-1 sm:w-32 bg-slate-200 rounded-xl" /> {/* Buy Now */}
          </div>
        </div>

      </div>
    </div>
  );
}