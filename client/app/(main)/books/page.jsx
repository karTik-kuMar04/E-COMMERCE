'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductGrid from '@/components/ui/ProductGrid';
import { Input, Button, Card } from '@/components/ui/UI';
import { ProductCardSkeleton, SearchSkeleton } from '@/components/ui/Skeleton';
import { getBooks } from '@/services/books.service.js';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { genres } from '@/utils/genres';
import SearchProductCard from '@/components/ui/SearchProductCard';




export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  

  const [query, setQuery] = useState("");

  const getQuery = (value) => {
    setQuery(value);
  }
  const ITEMS_PER_PAGE = 12;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth"})
  }, [page])



  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams({
          page,
          limit: 12,
          search: searchQuery,
        });

        if (selectedGenres.length === 1 && selectedGenres[0] !== 'All Genres') {
          params.append('genre', selectedGenres[0]);
        }

        const res = await getBooks(params.toString());
        setBooks(res.books);
        console.log(books)
        setTotal(res.total);
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

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10">


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
                  />
                  <span className="text-sm">{genre}</span>
                </label>
              ))}
            </div>
          </Card>
        </aside>

        <main className="space-y-8">

          {/* Heading */}
          <div>
            

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

          </div>

          {/* Search */}
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <Input
                value={query}
                onChange={(e) => {
                  getQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by title ...."
              />
            </div>

            <Button onClick={() => setSearchQuery(query)}>Search</Button>
          </div>

          {/* Result Meta */}
          <div className="flex justify-between items-center text-sm text-brand-muted">
            <span>
              {total} results for{' '}
              <strong>{selectedGenres[0] || 'All Books'}</strong>
            </span>
          </div>

          {/* Results */}
          {loading ? (
            <div className="grid grid-col gap-2">
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
          {/* Container: Pill shape with shadow */}
          <div className="flex items-center gap-1 p-2 bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
            
            {/* Previous Button */}
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-500 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1 px-2 border-l border-r border-gray-100 h-6">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                const isActive = page === pageNum;
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className="relative w-8 h-8 flex items-center justify-center text-sm font-medium rounded-full transition-colors z-10"
                  >
                    {/* Active State Background (The sliding circle) */}
                    {isActive && (
                      <motion.div
                        layoutId="activePage"
                        className="absolute inset-0 bg-black rounded-full"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    
                    {/* The Number */}
                    <span className={`relative z-20 ${isActive ? 'text-white' : 'text-gray-600 hover:text-black'}`}>
                      {pageNum}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
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
