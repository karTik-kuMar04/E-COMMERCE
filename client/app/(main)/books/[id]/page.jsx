'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import ImageCarousel from '@/components/ui/ImageCarousel';
import QuantityStepper from '@/components/ui/QuantityStepper';
import FavoritesButton from '@/components/ui/FavoritesButton';
import { Button, Card } from '@/components/ui/UI';
import Modal from '@/components/ui/Modal';
import { ProductDetailSkeleton } from '@/components/ui/Skeleton';
import useCartStore from '@/stores/cartStore';
import { formatPrice, formatDate } from '@/utils/format';
import ReactMarkdown from 'react-markdown';
import { getBookById } from '@/services/books.service';

export default function BookDetailPage() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isSampleOpen, setIsSampleOpen] = useState(false);
  const { addItem, items } = useCartStore();

  useEffect(() => {
    if (book?.formats?.length > 0 &&  !selectedFormat) {
      setSelectedFormat(book.formats[0].format);
    }
  }, [book, selectedFormat]);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await getBookById(id);
        setBook(res);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    if (id) fetchBook();
  }, [id]);

  if (loading || !book) return <ProductDetailSkeleton />;

  // Formats
  const formats = book.formats || [];
  const formatOption =
    selectedFormat
      ? formats.find(f => f.format === selectedFormat)
      : formats[0];

  // Images
  const images = [
    book.images?.cover,
    book.images?.back,
    ...(book.images?.interior || []),
  ].filter(Boolean);

  // Cart check
  const isInCart = items.some(
    item => item.bookId === book.id && item.format === formatOption?.format
  );

  const stock = formatOption?.stock;
  const isOutOfStock = stock === 0;
  const maxQuantity = stock ?? Infinity;

  // Price + discount
  const price = formatOption?.price || 0;
  const listPrice = formatOption?.list_price;
  const discount =
    listPrice && listPrice > price
      ? Math.round(((listPrice - price) / listPrice) * 100)
      : null;

  const handleAddToCart = () => {
    addItem(book, formatOption.format, quantity);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-20">

      {/* ---------- TOP SECTION ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* Smaller Image Carousel */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <ImageCarousel
            images={images}
            title={book.title}
            heightClass="h-[380px]"
          />
        </motion.div>

        {/* Price / Formats / Cart */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-2">

          <div>
            <h1 className="text-display-1 font-serif text-brand-primary mb-3">{book.title}</h1>
            {book.subtitle && (
              <p className="text-display-4 text-brand-muted mb-4">{book.subtitle}</p>
            )}
            <p className="text-body-lg text-brand-muted">
              By <span className="font-semibold text-brand-primary">{book.authors?.join(', ')}</span>
            </p>
          </div>

          <Card className="p-8 space-y-6">
            {/* Format Selection */}
            <div>
              <label className="block text-sm font-semibold text-brand-primary mb-4">Format</label>
              <div className="flex gap-3 flex-wrap">
                {formats.map(format => (
                  <motion.button
                    key={format.format}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedFormat(format.format)}
                    className={`px-6 py-3 rounded-xl border-2 font-medium transition-all ${
                      selectedFormat === format.format
                        ? 'border-brand-primary bg-brand-primary text-white shadow'
                        : 'border-brand-border hover:border-brand-primary text-brand-primary'
                    }`}
                  >
                    {format.format}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="pt-4 border-t border-brand-border">
              {listPrice && listPrice > price && (
                <p className="text-caption text-brand-muted line-through">{formatPrice(listPrice)}</p>
              )}

              <p className="text-display-2 font-serif text-brand-primary">
                {formatPrice(price)}
              </p>

              {discount && (
                <p className="text-sm text-success font-semibold">Save {discount}%</p>
              )}
            </div>

            {/* Stock Info */}
            <p className="text-body text-brand-muted">
              Stock:{' '}
              <span className={stock > 0 ? 'text-success font-semibold' : 'text-error font-semibold'}>
                {stock > 0 ? `${stock} available` : 'Out of Stock'}
              </span>
            </p>

            {/* Quantity */}
            <QuantityStepper
              value={quantity}
              onChange={setQuantity}
              min={1}
              max={maxQuantity}
              disabled={isOutOfStock}
            />

            {/* Add to Cart */}
            <Button
              variant="secondary"
              size="lg"
              className="w-full"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
            >
              {isInCart ? 'In Cart' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </Card>
        </motion.div>
      </div>

      {/* ---------- SECTION 1: About This Book ---------- */}
      <Card className="p-10 space-y-10 border border-brand-border/60 shadow-sm rounded-2xl">

        {/* Section Title */}
        <h2 className="text-3xl font-serif text-brand-primary tracking-wide border-b pb-4 border-brand-border">
          About This Book
        </h2>

        {/* Author Bio */}
        <section>
          <h3 className="text-xl font-semibold text-brand-primary mb-3 flex items-center gap-2">
            <span className="w-1 h-6 bg-brand-gold rounded-full"></span>
            About the Author
          </h3>

          <div className="text-body-lg text-brand-muted leading-relaxed pl-3">
            <ReactMarkdown>{book.author_bio || "No author bio available."}</ReactMarkdown>
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-brand-border/40"></div>

        {/* Book Summary */}
        <section>
          <h3 className="text-xl font-semibold text-brand-primary mb-3 flex items-center gap-2">
            <span className="w-1 h-6 bg-brand-gold rounded-full"></span>
            Summary
          </h3>

          <div className="text-body-lg text-brand-muted leading-relaxed pl-3">
            <ReactMarkdown>{book.description || "No description available."}</ReactMarkdown>
          </div>
        </section>

      </Card>


      {/* ---------- SECTION 2: Physical Details ---------- */}
      <Card className="p-10 space-y-8">
        <h2 className="text-display-2 font-serif text-brand-primary">Book Details</h2>

        <table className="w-full text-brand-muted text-body-lg">
          <tbody>
            <tr><td className="py-2 font-semibold text-brand-primary">ISBN-10</td><td>{book.isbn10}</td></tr>
            <tr><td className="py-2 font-semibold text-brand-primary">ISBN-13</td><td>{book.isbn13}</td></tr>
            <tr><td className="py-2 font-semibold text-brand-primary">Publisher</td><td>{book.publisher}</td></tr>
            <tr><td className="py-2 font-semibold text-brand-primary">Publication Date</td><td>{formatDate(book.publication_date)}</td></tr>
            <tr><td className="py-2 font-semibold text-brand-primary">Genre</td><td>{book.genre}</td></tr>
            <tr><td className="py-2 font-semibold text-brand-primary">Edition</td><td>{book.edition}</td></tr>
            <tr><td className="py-2 font-semibold text-brand-primary">Series</td><td>{book.series}</td></tr>
            {formatOption && (
              <>
                <tr><td className="py-2 font-semibold text-brand-primary">Pages</td><td>{formatOption.page_count}</td></tr>
                <tr><td className="py-2 font-semibold text-brand-primary">Format</td><td>{formatOption.format}</td></tr>
              </>
            )}
          </tbody>
        </table>
      </Card>

      {/* ---------- REVIEWS SECTION ---------- */}
      <Card className="p-10 space-y-6">
        <h2 className="text-display-2 font-serif text-brand-primary">Reviews</h2>
        <p className="text-body-lg text-brand-muted italic">Coming soon...</p>
      </Card>

      {/* SAMPLE MODAL */}
      <Modal isOpen={isSampleOpen} onClose={() => setIsSampleOpen(false)} title="Read Sample" size="lg">
        <p className="text-brand-muted">Sample preview content will come here.</p>
      </Modal>

    </motion.div>
  );
}
