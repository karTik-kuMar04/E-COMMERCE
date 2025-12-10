'use client';

import ProductCard from './ProductCard';
import { ProductCardSkeleton } from './Skeleton';

export default function ProductGrid({ books, loading = false, showQuantity = false }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {[...Array(8)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!books || books.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="text-brand-muted text-body-lg">No books found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {books.map((book, index) => (
        <ProductCard key={book.id} book={book} showQuantity={showQuantity} index={index} />
      ))}
    </div>
  );
}
