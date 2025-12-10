'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ToastContainer } from '../ui/Toast';

export default function Footer() {
  const [toasts, setToast] = useState([]);

  const showToast = (message, type = "success") => {
    const id  = Date.now();
    setToast((prev) => [...prev, {id, message, type}]);
  
    setTimeout(() => {
      setToast((prev) => prev.filter((t) => t.id !== id));
    }, 2000)
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text)
    .then(() => showToast("Email copied to clipboard!", "success"))
    .catch((err) => showToast("Failed to copy email!", err))
  }

  return (
    <footer className="bg-brand-primary text-white mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-brand-gold rounded-lg flex items-center justify-center">
                <span className="text-brand-primary font-serif text-xl font-bold">B</span>
              </div>
              <span className="text-display-3 font-serif">BookStore</span>
            </div>
            <p className="text-brand-bg/80 text-body leading-relaxed max-w-md">
              Your trusted source for great books. Discover your next favorite read in our curated collection of timeless classics and modern masterpieces.
            </p>
          </div>
          
          <div>
            <h3 className="text-display-3 font-serif mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/books" className="text-brand-bg/80 hover:text-brand-gold transition-colors">
                  Browse Books
                </Link>
              </li>
              <li>
                <Link href="/favorites" className="text-brand-bg/80 hover:text-brand-gold transition-colors">
                  My Favorites
                </Link>
              </li>
              <li>
                <Link href="/account" className="text-brand-bg/80 hover:text-brand-gold transition-colors">
                  My Account
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-display-3 font-serif mb-6">Contact</h3>
            <ul className="space-y-3 text-brand-bg/80">
              <li className='flex gap-2 text-center'>Email: <p className='hover:underline cursor-pointer' onClick={(e) => copyText(e.target.innerText)}>kartik.k2639@gmail.com</p></li>
              <li>Phone: +91 - 88263 95569</li>
              
            </ul>
          </div>
        </div>
        
        <div className="border-t border-brand-primary/20 mt-12 pt-8 text-center text-brand-bg/60">
          <p>&copy; {new Date().getFullYear()} BookStore. All rights reserved.</p>
        </div>
      </div>
      <ToastContainer toasts={toasts}/>

    </footer>
  );
}
