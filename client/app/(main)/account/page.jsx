'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Input, Badge, SectionHeader } from '@/components/ui/UI';
import { Skeleton } from '@/components/ui/Skeleton';
import useAuthStore from '@/stores/authStore';
import { useRouter } from 'next/navigation';

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();


  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: '',
    email: ''
  });
  useEffect(() => {
    console.log(user)
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || ''
      });
    }

    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, [isAuthenticated, user, router]);

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <SectionHeader>My Account</SectionHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-8 space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </Card>

          <Card className="p-8 space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-24 w-full" />
          </Card>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12"
    >
      <SectionHeader>My Account</SectionHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Profile Section */}
        <Card className="p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-display-3 font-serif text-brand-primary">Account Details</h2>
              <p className="text-body text-brand-muted">Your profile information.</p>
            </div>
            {user?.isAdmin && <Badge variant="gold">Admin</Badge>}
          </div>

          <Input
            label="Name"
            value={profile.name.toUpperCase()}
            disabled
          />

          <Input
            label="Email Address"
            type="email"
            value={profile.email}
            disabled
          />
        </Card>

        {/* Coming Soon Section */}
        <Card className="p-8 space-y-6">
          <h2 className="text-display-3 font-serif text-brand-primary">Your Books</h2>
          <p className="text-body text-brand-muted">
            Track purchased books, reading progress, and recommendations.
          </p>

          <div className="w-full p-6 rounded-xl border border-dashed border-brand-border text-center">
            <p className="text-body-lg font-semibold text-brand-primary">✨ Coming Soon</p>
            <p className="text-caption text-brand-muted mt-1">
              You will soon be able to view all your books and purchases here.
            </p>
          </div>

          <div className="w-full p-6 rounded-xl border border-dashed border-brand-border text-center">
            <p className="text-body-lg font-semibold text-brand-primary">📚 Wishlist</p>
            <p className="text-caption text-brand-muted mt-1">
              Save books you want to buy later — Coming Soon.
            </p>
          </div>

          <div className="w-full p-6 rounded-xl border border-dashed border-brand-border text-center">
            <p className="text-body-lg font-semibold text-brand-primary">⭐ Reviews</p>
            <p className="text-caption text-brand-muted mt-1">
              Write reviews and rate your books — Coming Soon.
            </p>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
