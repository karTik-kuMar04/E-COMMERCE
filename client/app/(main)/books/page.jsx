'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductGrid from '@/components/ui/ProductGrid';
import { Input, Button, Card } from '@/components/ui/UI';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { SectionHeader } from '@/components/ui/UI';
import { getBooks } from '@/services/books.service.js';

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);

  // Temporary static genres (replace later with API)
  const genres = ['Fiction', 'Non-Fiction', 'Fantasy', 'Sci-Fi'];

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams({
          page,
          limit: 12,
          search: searchQuery,
        });

        // Backend supports single genre
        if (selectedGenres.length === 1) {
          params.append('genre', selectedGenres[0]);
        }

        const res = await getBooks(params.toString());
        const { books, total } = res;

        setBooks(books);
        setTotal(total);
      } catch (err) {
        console.error('Error fetching books:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [page, searchQuery, selectedGenres]);

  // Force single genre selection
  const toggleGenre = (genre) => {
    setSelectedGenres((prev) =>
      prev[0] === genre ? [] : [genre]
    );
  };

  return (
    <div className="space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <SectionHeader>Browse Our Collection</SectionHeader>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 space-y-6"
        >
          <Card className="p-6">
            <Input
              label="Search Books"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by title, author..."
            />
          </Card>

          <Card className="p-6">
            <h3 className="font-serif text-display-3 text-brand-primary mb-4">
              Genre
            </h3>
            <div className="space-y-3">
              {genres.map((genre) => (
                <label
                  key={genre}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={selectedGenres.includes(genre)}
                    onChange={() => toggleGenre(genre)}
                    className="w-5 h-5 rounded border-2 border-brand-border text-brand-primary focus:ring-brand-primary focus:ring-2"
                  />
                  <span className="text-body text-brand-muted group-hover:text-brand-primary transition-colors">
                    {genre}
                  </span>
                </label>
              ))}
            </div>
          </Card>

          {(selectedGenres.length > 0 || searchQuery) && (
            <Button
              variant="ghost"
              onClick={() => {
                setSelectedGenres([]);
                setSearchQuery('');
                setPage(1);
              }}
              className="w-full"
            >
              Clear Filters
            </Button>
          )}
        </motion.aside>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-body text-brand-muted">
              Showing{' '}
              <span className="font-semibold text-brand-primary">
                {books.length}
              </span>{' '}
              of {total} books
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <ProductGrid books={books} />
          )}
        </div>
      </div>
    </div>
  );
}
