'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowLeft, ShoppingCart, User, LogOut, Heart } from 'lucide-react';

import useCartStore from '@/stores/cartStore';
import useAuthStore from '@/stores/authStore';

import CartDrawer from '../ui/CartDrawer';
import { Button } from '../ui/UI';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { getItemCount } = useCartStore();
  const { isAuthenticated, init, logout } = useAuthStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    init: state.init,
    logout: state.logout,
  }));

  const itemCount = getItemCount();
  const isHomePage = pathname === '/';
  const isBookPage = pathname === "/books";

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    const handleScroll = () => {
      // Threshold of 10px to trigger the effect
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/books?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b
          ${isScrolled 
            ? 'bg-white/70 backdrop-blur-md shadow-sm border-gray-200 py-2' 
            : 'bg-white border-transparent py-5'
          }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between gap-6">

            
            <div className="flex items-center gap-4 min-w-fit">
              {!isHomePage && (
                <button 
                  onClick={() => router.back()}
                  className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black transition-colors"
                >
                  <ArrowLeft size={22} />
                </button>
              )}

              <Link href="/" className="flex items-center gap-2 group">
                {/* Logo Icon */}
                <div className="w-10 h-10 relative mt-[5px]">
                   {/* Assuming you have this image, otherwise remove img tag */}
                   <img src="/inkverse-logo.png" alt="Logo" className="object-contain w-full h-full" />
                </div>
                
                {/* Typography: Larger, Serif, Bolder */}
                <span className={`font-serif font-black tracking-tighter text-gray-900 group-hover:text-indigo-900 transition-colors
                  ${isScrolled ? 'text-2xl' : 'text-3xl'} duration-300`}
                >
                  InkVerse
                </span>
              </Link>
            </div>

            {/* --- MIDDLE: Search Bar --- */}
            {!isBookPage && (
              <div className="flex-1 max-w-xl hidden md:block">
                <form onSubmit={handleSearch} className="relative group">
                  <div className={`relative flex items-center transition-all duration-300 rounded-full
                    ${isScrolled ? 'bg-gray-100' : 'bg-gray-50 border border-gray-100'} 
                    focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:shadow-lg`}
                  >
                    <Search className="absolute left-4 text-gray-400 group-focus-within:text-indigo-600" size={18} />
                    <input 
                      type="text"
                      placeholder="Search for books..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-transparent rounded-full text-sm outline-none placeholder:text-gray-400 text-gray-800"
                    />
                  </div>
                </form>
              </div>
            )}

            {/* --- RIGHT: Actions --- */}
            <div className="flex items-center gap-2 sm:gap-4">
              
              {isAuthenticated && (
                <Link href="/favorites">
                  <button className="p-2.5 rounded-full text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all">
                    <Heart size={22} />
                  </button>
                </Link>
              )}

              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 text-gray-800 hover:bg-gray-100 rounded-full transition-all group"
              >
                <ShoppingCart size={22} className="group-hover:scale-105 transition-transform" />
                <AnimatePresence>
                  {itemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute top-1 right-1 bg-indigo-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center ring-2 ring-white"
                    >
                      {itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Divider */}
              <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

              {!isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <Link href="/auth/login" className="hidden sm:block">
                    <span className="text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors">
                      Log in
                    </span>
                  </Link>
                  <Link href="/auth/register">
                    <Button className="rounded-full bg-black hover:bg-gray-800 text-white font-medium shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                   <Link href="/account">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-100 to-purple-100 border border-gray-200 flex items-center justify-center text-indigo-700 hover:border-indigo-300 transition-colors cursor-pointer">
                      <User size={18} />
                    </div>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="hidden sm:flex p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </motion.header>

      {/* Spacer to prevent content overlap. 
          Dynamic height logic isn't needed if we just assume the max height. 
          Unscrolled height is approx 88px (20px padding * 2 + 40px icon + borders). 
      */}
      <div className="h-[88px]" />

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}