'use client';

import Link from 'next/link';
import { useState } from 'react';
import { 
  Mail, 
  Phone, 
  Twitter, 
  Linkedin,
  Github,
  ArrowRight, 
  Copy, 
  Check 
} from 'lucide-react';
import { ToastContainer } from '../ui/Toast';

export default function Footer() {
  const [toasts, setToast] = useState([]);
  const [copied, setCopied] = useState(false);

  const showToast = (message, type = "success") => {
    const id  = Date.now();
    // @ts-ignore
    setToast((prev) => [...prev, {id, message, type}]);
  
    setTimeout(() => {
      // @ts-ignore
      setToast((prev) => prev.filter((t) => t.id !== id));
    }, 2000)
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text)
    .then(() => {
        showToast("Email copied to clipboard!", "success");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    })
    .catch((err) => showToast("Failed to copy email!", "error"))
  }

  const socialLinks = [
    { icon: Github, link: "https://github.com/karTik-kuMar04" },
    { icon: Linkedin, link: "https://www.linkedin.com/in/kartik-kumar-2264662a9/" },
    { icon: Twitter, link: "https://x.com/" }
  ]

  return (
    <footer className="relative bg-[#050505] text-gray-300 overflow-hidden">
        {/* Decorative Top Gradient Line */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-500" />
        
        {/* Background Glow Effect */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* --- Column 1: Brand --- */}
          <div className="space-y-6">
            {/* ALIGNMENT FIX: 
                1. Used 'flex items-center gap-3' for horizontal alignment.
                2. Reduced logo container to 'w-12 h-12' to match text height.
                3. Added 'object-contain' to image.
            */}
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-12 h-12 flex-shrink-0">
                <img 
                    src="/inkverse-logo.png" 
                    alt="InkVerse Logo" 
                    className="w-full h-full object-contain drop-shadow-lg" 
                />
              </div>
               <span className="text-3xl font-serif font-bold text-white tracking-tight leading-none pt-1">
                 InkVerse
               </span>
            </Link>

            <p className="text-gray-400 leading-relaxed text-sm pr-4">
              Step into a world of stories. From timeless classics to modern masterpieces, we curate the finest collection for every reader.
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center gap-4 pt-2">
                {socialLinks.map((SL, i) => (
                    <Link
                        key={i}
                        href={SL.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 border border-white/5 hover:border-white/20"
                    >
                        <SL.icon size={18} />
                    </Link>
                ))}
            </div>
          </div>
          
          {/* --- Column 2: Quick Links --- */}
          <div>
            <h3 className="text-white font-serif text-lg font-semibold mb-6">Explore</h3>
            <ul className="space-y-4">
              {[{name: 'Featured Books', link: "featured-book"}, {name: 'New Arrivals', link: "new-arrivals"}].map((item) => (
                <li key={item}>
                    <Link href={`/#${item.link}`} className="text-sm text-gray-400 hover:text-indigo-400 hover:pl-2 transition-all duration-300 inline-block">
                        {item.name}
                    </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* --- Column 3: Account --- */}
           <div>
            <h3 className="text-white font-serif text-lg font-semibold mb-6">My Account</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/cart" className="text-sm text-gray-400 hover:text-indigo-400 transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link href="/account" className="text-sm text-gray-400 hover:text-indigo-400 transition-colors">
                  Profile Settings
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-sm text-gray-400 hover:text-indigo-400 transition-colors">
                  Order History
                </Link>
              </li>
            </ul>
          </div>
          
          {/* --- Column 4: Contact & Newsletter --- */}
          <div>
            <h3 className="text-white font-serif text-lg font-semibold mb-6">Stay Connected</h3>
            
            {/* Interactive Contact */}
            <ul className="space-y-4 mb-8">
              <li>
                 <div 
                    onClick={() => copyText("kartik.k2639@gmail.com")}
                    className="group flex items-center gap-3 cursor-pointer p-3 rounded-lg bg-white/5 border border-white/5 hover:border-indigo-500/50 hover:bg-white/10 transition-all duration-300"
                 >
                    <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-md group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                        {copied ? <Check size={16} /> : <Mail size={16} />}
                    </div>
                    <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Email Us</p>
                        <p className="text-sm text-gray-200 group-hover:text-white">kartik.k2639@gmail.com</p>
                    </div>
                    <Copy size={14} className="opacity-0 group-hover:opacity-50 text-gray-400" />
                 </div>
              </li>
              <li className="flex items-center gap-3 pl-2">
                 <Phone size={18} className="text-indigo-500" />
                 <span className="text-sm text-gray-400 hover:text-white transition-colors">+91 - 88263 95569</span>
              </li>
            </ul>

            {/* Visual Newsletter Input */}
            <div className="relative">
                <input 
                    type="email" 
                    placeholder="Enter email for updates" 
                    className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-4 pr-12 text-sm focus:outline-none focus:border-indigo-500/50 text-gray-300 placeholder:text-gray-600 transition-all"
                />
                <button className="absolute right-1 top-1 p-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-full text-white transition-colors">
                    <ArrowRight size={16} />
                </button>
            </div>
          </div>
        </div>
        
        {/* --- Bottom Bar --- */}
        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} InkVerse. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
             <Link href="/privacy" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Privacy Policy</Link>
             <Link href="/terms" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Terms of Service</Link>
             <Link href="/cookies" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Cookie Settings</Link>
          </div>
        </div>
      </div>
      
      <ToastContainer toasts={toasts}/>
    </footer>
  );
}