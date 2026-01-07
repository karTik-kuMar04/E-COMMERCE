'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'; // <--- 1. Import this
import { motion } from 'framer-motion';
import ProductGrid from '@/components/ui/ProductGrid';
import { Input, Button, Card } from '@/components/ui/UI';
import { ProductCardSkeleton, SearchSkeleton } from '@/components/ui/Skeleton';
import { getBooks } from '@/services/books.service.js';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { genres } from '@/utils/genres';

export default function BooksPage() {
  const searchParams = useSearchParams(); // <--- 2. Initialize hook
  
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  
  // State for the actual API call
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for the Input field UI
  const [query, setQuery] = useState("");
  
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const ITEMS_PER_PAGE = 12;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  // --- 3. NEW EFFECT: Sync URL Params with State ---
  useEffect(() => {
    const searchFromUrl = searchParams.get('search');
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl);
      setQuery(searchFromUrl); // Keep input in sync
      setPage(1)
    } else {
      // Optional: Clear search if URL param is removed
      setSearchQuery('');
      setQuery('');
      setPage(1)
    }
  }, [searchParams]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth"})
  }, [page]);

  // Fetch Data
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams({
          page,
          limit: 12,
          search: searchQuery, // This now gets populated by the URL effect above
        });

        
        if (selectedGenres.length === 1 && selectedGenres[0] !== 'All Genres') {
          params.append('genre', selectedGenres[0]);
        }

        const res = await getBooks(params.toString());
        setBooks(res.data.books);
        setTotal(res.data.total);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [page, searchQuery, selectedGenres]);

  const toggleGenre = (genre) => {
    setSelectedGenres([genre]);
    setPage(1);
  };

  const handleManualSearch = () => {
    setSearchQuery(query);
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10">

        {/* SIDEBAR */}
        <aside className="hidden lg:block space-y-6">
          <Card className="p-6 sticky top-24">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              Refine Results
            </h2>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scroll">
              <p className="text-sm text-brand-muted uppercase tracking-wide">
                Categories
              </p>

              {genres.map((genre) => (
                <label
                  key={genre}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    checked={selectedGenres[0] === genre}
                    onChange={() => toggleGenre(genre)}
                    className="text-brand-primary focus:ring-brand-primary"
                  />
                  <span className="text-sm">{genre}</span>
                </label>
              ))}
            </div>
          </Card>
        </aside>

        <main className="space-y-8">

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mt-6">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? 'Hide Categories' : 'Show Categories'}
            </Button>
          </div>

          {/* Mobile Categories (Inline Expand) */}
          <div
            className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
              showFilters ? 'max-h-screen mt-6' : 'max-h-0'
            }`}
          >
            <Card className="p-6">
              <h3 className="text-sm font-semibold mb-4 uppercase tracking-wide">
                Categories
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scroll">
                {genres.map((genre) => (
                  <label
                    key={genre}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      checked={selectedGenres[0] === genre}
                      onChange={() => {
                        toggleGenre(genre);
                        setShowFilters(false);
                      }}
                    />
                    <span className="text-sm">{genre}</span>
                  </label>
                ))}
              </div>
            </Card>
          </div>

          {/* Page Internal Search Bar */}
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <Input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  // Optional: Reset page when typing? Usually better to wait for search click
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleManualSearch()}
                placeholder="Search by title ...."
              />
            </div>
            <Button onClick={handleManualSearch}>Search</Button>
          </div>

          {/* Result Meta */}
          <div className="flex justify-between items-center text-sm text-brand-muted">
            <span>
              {total} results for{' '}
              <strong>{selectedGenres[0] || (searchQuery ? `"${searchQuery}"` : 'All Books')}</strong>
            </span>
          </div>

          {/* Results Grid */}
          {loading ? (
            <div className="grid grid-col gap-4">
              {[...Array(4)].map((_, i) => (
                <SearchSkeleton key={i} />
              ))}
            </div>
          ) : (
            <ProductGrid books={books} />
          )}
        </main>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-12">
          <div className="flex items-center gap-1 p-2 bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
            
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-500 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex items-center gap-1 px-2 border-l border-r border-gray-100 h-6">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                const isActive = page === pageNum;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className="relative w-8 h-8 flex items-center justify-center text-sm font-medium rounded-full transition-colors z-10"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activePage"
                        className="absolute inset-0 bg-black rounded-full"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className={`relative z-20 ${isActive ? 'text-white' : 'text-gray-600 hover:text-black'}`}>
                      {pageNum}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-500 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}