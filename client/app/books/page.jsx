'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import ProductGrid from '@/components/ui/ProductGrid';
import { Input, Button, Card, Badge } from '@/components/ui/UI';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { SectionHeader } from '@/components/ui/UI';
import demoBooks from '@/data/demo-books.json';

export default function BooksPage() {
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedFormats, setSelectedFormats] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setBooks(demoBooks);
      setLoading(false);
    };
    loadData();
  }, []);

  const genres = useMemo(() => {
    const genreSet = new Set();
    demoBooks.forEach(book => {
      if (book.genre) genreSet.add(book.genre);
    });
    return Array.from(genreSet).sort();
  }, []);

  const filteredBooks = useMemo(() => {
    let filtered = [...books];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        book =>
          book.title?.toLowerCase().includes(query) ||
          book.authors?.some(a => a.toLowerCase().includes(query)) ||
          book.description?.toLowerCase().includes(query)
      );
    }

    if (selectedGenres.length > 0) {
      filtered = filtered.filter(book => selectedGenres.includes(book.genre));
    }

    if (selectedFormats.length > 0) {
      filtered = filtered.filter(book =>
        book.formatOptions?.some(fo => selectedFormats.includes(fo.format))
      );
    }

    if (priceRange[0] > 0 || priceRange[1] < 100) {
      filtered = filtered.filter(book => {
        const minPrice = Math.min(...(book.formatOptions?.map(f => f.price) || [0]));
        return minPrice >= priceRange[0] && minPrice <= priceRange[1];
      });
    }

    return filtered;
  }, [books, searchQuery, selectedGenres, selectedFormats, priceRange]);

  const toggleGenre = (genre) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const toggleFormat = (format) => {
    setSelectedFormats(prev =>
      prev.includes(format) ? prev.filter(f => f !== format) : [...prev, format]
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
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 space-y-6"
        >
          <Card className="p-6">
            <Input
              label="Search Books"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, author..."
            />
          </Card>

          <Card className="p-6">
            <h3 className="font-serif text-display-3 text-brand-primary mb-4">Genre</h3>
            <div className="space-y-3">
              {genres.map(genre => (
                <label key={genre} className="flex items-center gap-3 cursor-pointer group">
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

          <Card className="p-6">
            <h3 className="font-serif text-display-3 text-brand-primary mb-4">Format</h3>
            <div className="space-y-3">
              {['Paperback', 'Hardcover', 'eBook'].map(format => (
                <label key={format} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedFormats.includes(format)}
                    onChange={() => toggleFormat(format)}
                    className="w-5 h-5 rounded border-2 border-brand-border text-brand-primary focus:ring-brand-primary focus:ring-2"
                  />
                  <span className="text-body text-brand-muted group-hover:text-brand-primary transition-colors">
                    {format}
                  </span>
                </label>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-serif text-display-3 text-brand-primary mb-4">Price Range</h3>
            <div className="space-y-4">
              <input
                type="range"
                min="0"
                max="100"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full h-2 bg-brand-border rounded-lg appearance-none cursor-pointer accent-brand-primary"
              />
              <div className="flex justify-between text-caption text-brand-muted">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </Card>

          {(selectedGenres.length > 0 || selectedFormats.length > 0 || priceRange[1] < 100) && (
            <Button
              variant="ghost"
              onClick={() => {
                setSelectedGenres([]);
                setSelectedFormats([]);
                setPriceRange([0, 100]);
              }}
              className="w-full"
            >
              Clear Filters
            </Button>
          )}
        </motion.aside>

        <div className="lg:col-span-3">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-body text-brand-muted">
              Showing <span className="font-semibold text-brand-primary">{filteredBooks.length}</span> of {books.length} books
            </p>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <ProductGrid books={filteredBooks} />
          )}
        </div>
      </div>
    </div>
  );
}
