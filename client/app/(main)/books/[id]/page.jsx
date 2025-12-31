'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Star, Share2, ShieldCheck, Truck, Zap, Download, 
  CreditCard, Award, Tag, ShoppingCart, ChevronRight 
} from 'lucide-react';
import ImageCarousel from '@/components/ui/ImageCarousel';
import QuantityStepper from '@/components/ui/QuantityStepper'; // Use the new code above
import FavoritesButton from '@/components/ui/FavoritesButton';
import { ProductDetailSkeleton } from '@/components/ui/Skeleton';
import useCartStore from '@/stores/cartStore';
import { formatPrice, formatDate } from '@/utils/format';
import ReactMarkdown from 'react-markdown';
import { getBookById } from '@/services/books.service';
import { ToastContainer } from '@/components/ui/Toast';



const createToast = (message, type = 'info') => ({
  id: crypto?.randomUUID?.() ?? `toast-${Date.now()}`,
  message,
  type
});


export default function BookDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [quantity, setQuantity] = useState(1);
  
  const { addItem, items } = useCartStore();


  const [toasts, setToasts] = useState([]);
  const pushToast = (message, type = "info") => {
    setToasts((prev) => [...prev, createToast(message, type)]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  useEffect(() => {
    if (book?.formats?.length > 0 && !selectedFormat) {
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

  // --- Logic Helpers ---
  const formats = book.formats || [];
  const formatOption = selectedFormat ? formats.find(f => f.format === selectedFormat) : formats[0];
  
  // Images (Using your logic to combine Cover, Back, Interior)
  const images = [
    book.images?.cover,
    book.images?.back,
    ...(book.images?.interior || []),
  ].filter(Boolean);

  const isInCart = items.some(item => item.bookId === book.id && item.format === formatOption?.format);
  const stock = formatOption?.stock || 0;
  const isOutOfStock = stock === 0;
  const maxQuantity = stock ?? 10;
  const price = formatOption?.price || 0;
  const listPrice = formatOption?.list_price;
  const discount = listPrice && listPrice > price ? Math.round(((listPrice - price) / listPrice) * 100) : null;
  const isDigital = ['ebook', 'pdf', 'audiobook', 'kindle'].includes(selectedFormat?.toLowerCase());

  // Filter out "no award" strings if they exist
  const validAwards = book.awards?.filter(a => a.toLowerCase() !== 'no award') || [];

  const handleAddToCart = () => {
    addItem(book, formatOption.format, quantity);
  };

  const handleBuyNow = () => {
    addItem(book, formatOption.format, quantity);
    router.push('/checkout');
  };
   console.log(book)

  return (
    <div className="min-h-screen bg-white pb-24 pt-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* --- MAIN GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* LEFT: CAROUSEL (Sticky) */}
          <div className="md:col-span-5 lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <ImageCarousel images={images} title={book.title} />
              
              {/* Trust Badges */}
              <div className="bg-slate-50 p-4 rounded-xl space-y-3">
                 <div className="flex items-center gap-3 text-xs text-slate-600">
                    <div className="p-2 bg-white rounded-full text-indigo-600 shadow-sm"><ShieldCheck size={16} /></div>
                    <span className="font-medium">Official Publisher Edition</span>
                 </div>
                 <div className="flex items-center gap-3 text-xs text-slate-600">
                    <div className="p-2 bg-white rounded-full text-indigo-600 shadow-sm"><Truck size={16} /></div>
                    <span className="font-medium">Free Shipping {`>`} ₹2000</span>
                 </div>
              </div>
            </div>
          </div>

          {/* RIGHT: DETAILS */}
          <div className="md:col-span-7 lg:col-span-8 space-y-8">
            
            {/* 1. HEADER & TITLE */}
            <div>
              {/* Series & Genre Breadcrumb */}
              <div className="flex flex-wrap items-center gap-2 mb-3 text-sm relative">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  {book.genre}
                </span>
                {book.series && (
                  <>
                    <ChevronRight size={14} className="text-slate-400" />
                    <span className="text-indigo-600 font-bold">{book.series} Series</span>
                  </>
                )}

                <FavoritesButton className='absolute right-0'/>
              </div>

              <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 leading-tight mb-2">
                {book.title}
              </h1>
              {book.subtitle && (
                <p className="text-lg text-slate-500 font-medium mb-4">{book.subtitle}</p>
              )}
              
              <div className="flex flex-wrap items-center gap-6 text-slate-600 border-b border-slate-100 pb-6">
                <div className="flex items-center gap-2">
                   <span className="text-sm">Created by</span>
                   <span className="text-slate-900 font-bold border-b-2 border-indigo-100">{book.authors?.join(', ')}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-amber-50 px-2 py-1 rounded-md">
                  <Star className="fill-amber-400 text-amber-400 w-4 h-4" />
                  <span className="font-bold text-slate-900 text-sm">{book.rating || 4.8}</span>
                </div>
              </div>
            </div>

            {/* 2. TAGS & AWARDS (Using Missing Data) */}
            {(book.tags?.length > 0 || validAwards.length > 0) && (
              <div className="flex flex-wrap gap-3">
                 {/* Awards */}
                 {validAwards.map((award, i) => (
                    <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-lg text-xs font-bold border border-yellow-100">
                       <Award size={14} /> {award}
                    </div>
                 ))}
                 {/* Tags */}
                 {book.tags?.map((tag, i) => (
                    <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-xs font-medium border border-slate-100">
                       <Tag size={12} /> {tag}
                    </div>
                 ))}
              </div>
            )}

            {/* 3. REDESIGNED BUY BOX */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm relative overflow-hidden">
               {/* Background Accent */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-10 -mt-10 opacity-50 pointer-events-none" />

               <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8 relative z-10">
                 <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Total Price</span>
                    <div className="flex items-baseline gap-3">
                      <span className="text-5xl font-bold text-slate-900 tracking-tight">{formatPrice(price)}</span>
                      {discount > 0 && (
                        <span className="text-xl text-rose-500 font-medium line-through opacity-60">
                           {formatPrice(listPrice)}
                        </span>
                      )}
                    </div>
                 </div>

                 {/* Format Selection Pills */}
                 <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                    {formats.map(f => (
                       <button
                         key={f.format}
                         onClick={(e) =>{ 
                          e.preventDefault();
                          setSelectedFormat(f.format);
                         }}
                         className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                            selectedFormat === f.format 
                            ? 'bg-white text-indigo-600 shadow-md ring-1 ring-slate-100' 
                            : 'text-slate-500 hover:text-slate-700'
                         }`}
                       >
                          {f.format}
                       </button>
                    ))}
                 </div>
               </div>

               {/* BUTTON ACTION AREA */}
               {isDigital ? (
                  <button
                  type='button'
                    onClick={() =>
                      pushToast("This feature will come soon", "info")
                    }
                    className="w-full h-14 bg-gradient-to-r from-indigo-600 to-[#7000ff] hover:to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 flex items-center justify-center gap-3 transition-all hover:-translate-y-0.5 active:scale-95"
                  >
                    <Download size={20} />
                    Download Now
                  </button>
               ) : (
                 <div className="flex flex-col gap-4">
                    {/* Top Row: Stepper + Add Cart */}
                    <div className="flex gap-4 h-12">
                       {/* The New Stepper */}
                       <div className="shrink-0">
                          <QuantityStepper 
                             value={quantity} 
                             onChange={setQuantity} 
                             max={maxQuantity} 
                             disabled={isOutOfStock}
                          />
                       </div>

                       {/* Add To Cart */}
                       <button 
                          onClick={handleAddToCart}
                          disabled={isOutOfStock}
                          className={`flex-1 flex items-center justify-center gap-2 font-bold rounded-full border-2 transition-all active:scale-95
                            ${isInCart 
                              ? 'bg-green-50 border-green-500 text-green-700' 
                              : 'bg-white border-[#7000ff] text-[#7000ff] hover:bg-indigo-50'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                       >
                          <ShoppingCart size={20} />
                          {isInCart ? 'Added to Cart' : 'Add to Cart'}
                       </button>
                    </div>

                    {/* Bottom Row: Buy Now */}
                    {stock > 0 && (
                      <button 
                         onClick={handleBuyNow}
                         className="w-full h-12 bg-[#7000ff] hover:bg-[#5a00cc] text-white font-bold rounded-full shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 active:scale-95"
                      >
                         <CreditCard size={20} />
                         Buy Now
                      </button>
                    )}
                 </div>
               )}
            </div>

            {/* 4. SYNOPSIS & BIO */}
            <div className="grid grid-cols-1 gap-10">
               <div className="space-y-4">
                  <h3 className="text-xl font-bold font-serif text-slate-900 border-l-4 border-[#7000ff] pl-3">Synopsis</h3>
                  <div className="prose prose-slate prose-lg text-slate-600 leading-relaxed">
                     <ReactMarkdown>{book.description}</ReactMarkdown>
                  </div>
               </div>

               {book.author_bio && (
                 <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                       About {book.authors?.[0]}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                      {book.author_bio}
                    </p>
                    <div className="text-xs text-slate-400 font-mono">
                       Author Awards: {validAwards.length > 0 ? validAwards.join(', ') : 'N/A'}
                    </div>
                 </div>
               )}
            </div>

            {/* 5. DETAILS TABLE */}
            <div className="border-t border-slate-100 pt-8 mt-4">
               <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Technical Specs</h3>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                  <div className="space-y-1">
                     <span className="block text-slate-500">Publisher</span>
                     <span className="font-medium text-slate-900">{book.publisher}</span>
                  </div>
                  <div className="space-y-1">
                     <span className="block text-slate-500">Release Date</span>
                     <span className="font-medium text-slate-900">{formatDate(book.publication_date)}</span>
                  </div>
                  <div className="space-y-1">
                     <span className="block text-slate-500">ISBN</span>
                     <span className="font-medium text-slate-900">{book.isbn13}</span>
                  </div>
                  <div className="space-y-1">
                     <span className="block text-slate-500">Format</span>
                     <span className="font-medium text-slate-900">{selectedFormat}</span>
                  </div>
               </div>
            </div>
              <ToastContainer toasts={toasts} removeToast={removeToast}/>

          </div>
        </div>
      </div>
    </div>
  );
}