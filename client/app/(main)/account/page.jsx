'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Lock, Sparkles, BookOpen, Star, Clock } from 'lucide-react';
import { Card, Input, Badge, SectionHeader, Button } from '@/components/ui/UI'; // Assuming Button exists
import { Skeleton } from '@/components/ui/Skeleton';
import useAuthStore from '@/stores/authStore';
import { useRouter } from 'next/navigation';

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({ name: '', email: '', createdAt: '' });
  console.log(profile)
  // Password State
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        createdAt: user.createdAt
          ? new Date(user.createdAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })
          : ''
      });
    }

    // Simulate a slightly smoother loading experience
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [isAuthenticated, user, router]);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { type: "spring", stiffness: 50, damping: 15 } 
    }
  };

 if (loading) {
    return (
      <div className="space-y-12 max-w-7xl mx-auto mb-10">
        {/* Page Title Skeleton */}
        <SectionHeader>
           <Skeleton variant="title" className="w-48" />
        </SectionHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT SKELETON: Matches Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="overflow-hidden border-none shadow-sm bg-white h-auto pb-8">
              {/* 1. Banner Skeleton */}
              <Skeleton className="h-32 w-full rounded-none" />
              
              {/* 2. Avatar Skeleton (Negative Margin to match design) */}
              <div className="px-8 -mt-12 relative z-10">
                <Skeleton variant="circle" className="w-24 h-24 border-4 border-white" />
              </div>

              {/* 3. Text Details Skeleton */}
              <div className="px-8 mt-4 space-y-4">
                <Skeleton variant="title" className="w-3/4" /> {/* Name */}
                <Skeleton className="h-6 w-1/3" /> {/* Badge */}
                
                <div className="pt-6 space-y-3">
                   <div className="flex gap-3">
                     <Skeleton variant="circle" className="w-8 h-8" />
                     <Skeleton variant="text" className="w-full mt-2" />
                   </div>
                   <div className="flex gap-3">
                     <Skeleton variant="circle" className="w-8 h-8" />
                     <Skeleton variant="text" className="w-2/3 mt-2" />
                   </div>
                </div>
              </div>
            </Card>

            {/* Mini Dashboard Skeletons */}
            <div className="grid grid-cols-2 gap-4">
               <Card className="h-24 p-4 flex flex-col items-center justify-center gap-2">
                  <Skeleton variant="circle" className="w-8 h-8" />
                  <Skeleton variant="text" className="w-16" />
               </Card>
               <Card className="h-24 p-4 flex flex-col items-center justify-center gap-2">
                  <Skeleton variant="circle" className="w-8 h-8" />
                  <Skeleton variant="text" className="w-16" />
               </Card>
            </div>
          </div>

          {/* RIGHT SKELETON: Matches Security Card */}
          <div className="lg:col-span-2">
            <Card className="p-8 h-full space-y-8">
              {/* Header area */}
              <div className="flex gap-4 mb-8">
                <Skeleton className="w-12 h-12 rounded-xl" />
                <div className="space-y-2 w-full">
                  <Skeleton variant="title" className="w-48" />
                  <Skeleton variant="text" className="w-64" />
                </div>
              </div>

              {/* Input Fields */}
              <div className="space-y-6 max-w-lg">
                <div className="space-y-2">
                   <Skeleton variant="text" className="w-24" /> {/* Label */}
                   <Skeleton className="h-12 w-full rounded-lg" /> {/* Input Box */}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-2">
                     <Skeleton variant="text" className="w-24" />
                     <Skeleton className="h-12 w-full rounded-lg" />
                  </div>
                  <div className="space-y-2">
                     <Skeleton variant="text" className="w-24" />
                     <Skeleton className="h-12 w-full rounded-lg" />
                  </div>
                </div>

                {/* Button Area */}
                <div className="pt-6 flex justify-end">
                   <Skeleton className="h-12 w-40 rounded-lg" />
                </div>
              </div>
            </Card>
          </div>

        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12 max-w-7xl mx-auto mb-10 mt-10"
    >

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Profile Identity Card */}
        <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
          <Card className="overflow-hidden border-none shadow-xl bg-white flex flex-col">
            
            {/* 1. Decorative Header Background */}
            <div className="h-32 bg-gradient-to-br from-indigo-600 via-purple-600 to-teal-500 relative shrink-0">
              <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
            </div>

            {/* 2. Avatar Circle (Using Negative Margin to pull it up, but keep it in flow) */}
            <div className="px-8 -mt-12 relative z-10">
              <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg inline-block">
                <div className="w-full h-full rounded-full bg-indigo-50 flex items-center justify-center text-3xl font-serif text-indigo-600 font-bold border-2 border-indigo-100">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>

            {/* 3. Profile Details (Content flows naturally below avatar now) */}
            <div className="px-8 pb-8 pt-4">
              <div>
                <h2 className="text-2xl font-serif text-brand-primary font-bold break-words">
                  {profile.name}
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={user?.isAdmin ? "gold" : "primary"}>
                    {user?.isAdmin ? "Archmage (Admin)" : "Bookworm (Member)"}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3 pt-6 mt-6 border-t border-gray-100">
                <div className="flex items-center gap-3 text-brand-muted">
                  <div className="p-2 rounded-lg bg-indigo-50 text-indigo-500 shrink-0">
                    <Mail size={18} />
                  </div>
                  <span className="text-sm font-medium truncate">{profile.email}</span>
                </div>
                
                <div className="flex items-center gap-3 text-brand-muted">
                  <div className="p-2 rounded-lg bg-teal-50 text-teal-600 shrink-0">
                    <Clock size={18} />
                  </div>
                  <span className="text-sm font-medium">Joined {profile.createdAt}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Mini Dashboard remains the same... */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 flex flex-col items-center justify-center text-center space-y-2 bg-indigo-50/50 border-indigo-100">
              <BookOpen className="text-indigo-400 w-8 h-8" />
              <p className="text-xs font-bold text-indigo-900 uppercase tracking-wider">My Books</p>
              <span className="text-xs text-indigo-500">Coming Soon</span>
            </Card>
            <Card className="p-4 flex flex-col items-center justify-center text-center space-y-2 bg-purple-50/50 border-purple-100">
              <Star className="text-purple-400 w-8 h-8" />
              <p className="text-xs font-bold text-purple-900 uppercase tracking-wider">Wishlist</p>
              <span className="text-xs text-purple-500">Coming Soon</span>
            </Card>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: Security & Settings */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="p-8 h-full bg-white/80 backdrop-blur-sm border-brand-border/50">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-xl bg-teal-50 text-teal-600">
                <Shield size={24} />
              </div>
              <div>
                <h3 className="text-xl font-serif text-brand-primary font-bold">Security Settings</h3>
                <p className="text-sm text-brand-muted">Manage your password and account security.</p>
              </div>
            </div>

            <form className="space-y-6 max-w-lg" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <Input
                  label="Current Password"
                  type="password"
                  placeholder="••••••••"
                  value={passwords.current}
                  onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                  icon={<Lock size={16} />}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <Input
                  label="New Password"
                  type="password"
                  placeholder="New password"
                  value={passwords.new}
                  onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm new password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                />
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-end">
                {/* Assuming you have a Button component, otherwise use standard button with Tailwind */}
                <button 
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Update Password
                </button>
              </div>
            </form>

            {/* Visual Flair / Info Box */}
            <div className="mt-8 p-4 rounded-xl bg-amber-50 border border-amber-100 flex gap-4">
              <Sparkles className="text-amber-500 shrink-0 mt-1" size={20} />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-amber-900">Keep your account safe</h4>
                <p className="text-xs text-amber-700/80">
                  Use a strong password that you don't use on other websites. We recommend using a combination of letters, numbers, and magical symbols.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

      </div>
    </motion.div>
  );
}