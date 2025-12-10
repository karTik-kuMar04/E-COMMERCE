'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import useCartStore from '@/stores/cartStore';
import useAuthStore from '@/stores/authStore';
import CartDrawer from '../ui/CartDrawer';
import { Button } from '../ui/UI';

export default function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();
  const { getItemCount } = useCartStore();
  
  const { user, isAuthenticated, init, logout } = useAuthStore((state) => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    init: state.init,
    logout: state.logout,
  }));

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const itemCount = getItemCount();
  const isAdminRoute = pathname?.startsWith('/admin');
  const displayName = user?.displayName || user?.name || '';
  const avatarInitial = displayName ? displayName.charAt(0).toUpperCase() : 'B';

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    router.push('/');
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`sticky top-0 z-30 transition-all duration-300 ${
          isScrolled
            ? 'bg-brand-surface/95 backdrop-blur-md shadow-premium'
            : 'bg-brand-surface'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-10 h-10 bg-brand-primary rounded-lg flex items-center justify-center"
              >
                <span className="text-brand-gold font-serif text-xl font-bold">B</span>
              </motion.div>
              <span className="text-display-3 font-serif text-brand-primary group-hover:text-brand-primary/80 transition-colors">
                BookStore
              </span>
            </Link>

            {/* Navigation (Hidden if user NOT logged in) */}
            {isAuthenticated && (
              <nav className="hidden md:flex items-center gap-8">
                <Link
                  href="/books"
                  className={`relative font-medium transition-colors ${
                    pathname === '/books'
                      ? 'text-brand-primary'
                      : 'text-brand-muted hover:text-brand-primary'
                  }`}
                >
                  Books
                  {pathname === '/books' && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand-gold rounded-full"
                    />
                  )}
                </Link>

                <Link
                  href="/favorites"
                  className={`relative font-medium transition-colors ${
                    pathname === '/favorites'
                      ? 'text-brand-primary'
                      : 'text-brand-muted hover:text-brand-primary'
                  }`}
                >
                  Favorites
                  {pathname === '/favorites' && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand-gold rounded-full"
                    />
                  )}
                </Link>

                <Link
                  href="/account"
                  className={`relative font-medium transition-colors ${
                    pathname === '/account'
                      ? 'text-brand-primary'
                      : 'text-brand-muted hover:text-brand-primary'
                  }`}
                >
                  Account
                  {pathname === '/account' && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand-gold rounded-full"
                    />
                  )}
                </Link>

                {user?.isAdmin && (
                  <Link
                    href="/admin/products"
                    className={`relative font-medium transition-colors ${
                      isAdminRoute
                        ? 'text-brand-primary'
                        : 'text-brand-muted hover:text-brand-primary'
                    }`}
                  >
                    Admin
                  </Link>
                )}
              </nav>
            )}

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              {/* Cart (Hidden if NOT authenticated) */}
              {isAuthenticated && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-3 text-brand-muted hover:text-brand-primary transition-colors rounded-xl hover:bg-brand-bg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  aria-label="Open cart"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {itemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-brand-secondary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-premium"
                    >
                      {itemCount}
                    </motion.span>
                  )}
                </motion.button>
              )}

              {/* Auth Buttons / Profile Dropdown */}
              {isAuthenticated ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsMenuOpen((prev) => !prev)}
                    className="flex items-center gap-3 px-3 py-2 rounded-2xl hover:bg-brand-bg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    aria-label="Open user menu"
                  >
                    <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-serif text-lg">
                      {avatarInitial}
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-caption text-brand-muted">Welcome back</p>
                      <p className="font-semibold text-brand-primary">{displayName}</p>
                    </div>
                    <svg
                      className={`w-4 h-4 text-brand-muted transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isMenuOpen && (
                    <div className="absolute right-0 mt-3 w-60 bg-brand-surface border border-brand-border rounded-2xl shadow-premium-lg p-4 space-y-2">
                      <p className="text-caption text-brand-muted uppercase">Account</p>

                      <Link
                        href="/account"
                        className="flex items-center gap-2 text-body text-brand-primary hover:text-brand-primary/80 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span>Profile</span>
                      </Link>

                      <Link
                        href="/favorites"
                        className="flex items-center gap-2 text-body text-brand-primary hover:text-brand-primary/80 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span>Favorites</span>
                      </Link>

                      <Link
                        href="/account#orders"
                        className="flex items-center gap-2 text-body text-brand-primary hover:text-brand-primary/80 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span>Orders</span>
                      </Link>

                      {user?.isAdmin && (
                        <Link
                          href="/admin/products"
                          className="flex items-center gap-2 text-body text-brand-primary hover:text-brand-primary/80 transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <span>Admin</span>
                        </Link>
                      )}

                      <div className="pt-2 border-t border-brand-border">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left text-error font-semibold hover:text-error/80 transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
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
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
