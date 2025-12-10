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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div className="space-y-4">
        <Skeleton variant="image" className="w-full aspect-[2/3] rounded-2xl" />
        <div className="grid grid-cols-3 gap-3">
          <Skeleton variant="image" className="aspect-square rounded-xl" />
          <Skeleton variant="image" className="aspect-square rounded-xl" />
          <Skeleton variant="image" className="aspect-square rounded-xl" />
        </div>
      </div>
      <div className="space-y-6">
        <Skeleton variant="title" className="w-full h-10" />
        <Skeleton variant="text" className="w-2/3 h-5" />
        <Skeleton variant="text" className="w-1/2 h-4" />
        <div className="space-y-3 pt-4">
          <Skeleton variant="text" className="w-full h-4" />
          <Skeleton variant="text" className="w-full h-4" />
          <Skeleton variant="text" className="w-3/4 h-4" />
        </div>
        <Skeleton variant="default" className="w-48 h-12 rounded-xl" />
        <Skeleton variant="default" className="w-full h-12 rounded-xl" />
      </div>
    </div>
  );
}

