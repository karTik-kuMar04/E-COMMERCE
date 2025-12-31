'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import useCartStore from '@/stores/cartStore';
import useAuthStore from '@/stores/authStore';

import CartDrawer from '../ui/CartDrawer';
import { Button } from '../ui/UI';



export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { getItemCount } = useCartStore();
  const { isAuthenticated, init, logout } = useAuthStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    init: state.init,
    logout: state.logout,
  }));

  const itemCount = getItemCount();

  // Init auth on load
  useEffect(() => {
    init();
  }, [init]);

  // Header scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`sticky top-0 z-50 transition-all duration-300 border-b-[1px] border-gray-200 ${
          isScrolled
            ? 'bg-brand-surface/40 backdrop-blur-md shadow-premium'
            : 'bg-brand-surface'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-[80px] h-[80px] flex items-center justify-center">
                <img src="/inkverse-logo.png" alt=""/>
              </div>
              <span className="text-display-3 font-serif text-brand-primary relative -top-2">
                InkVerse
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {/* Find Book - Always visible */}
              <Link
                href="/books"
                className={`font-medium transition-colors ${
                  pathname === '/books'
                    ? 'text-brand-primary'
                    : 'text-brand-muted hover:text-brand-primary'
                }`}
              >
                Find Book
              </Link>

              {/* Favorites - Logged in only */}
              {isAuthenticated && (
                <Link
                  href="/favorites"
                  className={`font-medium transition-colors ${
                    pathname === '/favorites'
                      ? 'text-brand-primary'
                      : 'text-brand-muted hover:text-brand-primary'
                  }`}
                >
                  Favorites
                </Link>
              )}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">

              {/* Cart - Always visible */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-3 text-brand-muted hover:text-brand-primary transition-colors rounded-xl"
                aria-label="Open cart"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4
                       M7 13L5.4 5
                       M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17
                       m0 0a2 2 0 100 4
                       m-8 0a2 2 0 11-4 0"
                  />
                </svg>

                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-secondary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Auth Actions */}
              {!isAuthenticated ? (
                <>
                  <Link href="/auth/login">
                    <Button variant="ghost" size="sm">
                      Login
                    </Button>
                  </Link>

                  <Link href="/auth/register">
                    <Button variant="primary" size="sm">
                      Register
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/account">
                    <Button variant="ghost" size="sm">
                      Profile
                    </Button>
                  </Link>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-error"
                  >
                    Logout
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  );
}
