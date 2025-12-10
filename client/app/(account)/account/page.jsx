'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { formatPrice, formatDate } from '@/utils/format';
import { Button, Input, Card, Badge, SectionHeader } from '@/components/ui/UI';
import { Skeleton } from '@/components/ui/Skeleton';
import useAuthGuard from '@/hooks/useAuthGuard';

export default function AccountPage() {
  const { user, isChecking, isReady } = useAuthGuard();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) return;
    setProfile((prev) => ({
      ...prev,
      name: prev.name || user.name || '',
      email: prev.email || user.email || '',
    }));
  }, [user]);

  useEffect(() => {
    const loadOrders = async () => {
      await new Promise(resolve => setTimeout(resolve, 400));
      setOrders([
        {
          id: 'ORD-1234567890-ABC123',
          date: '2024-01-15',
          items: 3,
          total: 45.97,
          status: 'Delivered',
        },
        {
          id: 'ORD-1234567891-DEF456',
          date: '2024-01-20',
          items: 2,
          total: 28.98,
          status: 'Shipped',
        },
      ]);
    };
    loadOrders();
  }, []);

  if (isChecking) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
        <SectionHeader>My Account</SectionHeader>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-8 space-y-4">
            <Skeleton variant="title" className="w-1/2" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </Card>
          <Card className="p-8 space-y-4">
            <Skeleton variant="title" className="w-3/4" />
            <Skeleton className="h-32 w-full" />
          </Card>
        </div>
      </motion.div>
    );
  }

  if (!isReady) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12"
    >
      <SectionHeader>My Account</SectionHeader>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-display-3 font-serif text-brand-primary">Profile Information</h2>
              <p className="text-body text-brand-muted">Manage your personal details and contact info.</p>
            </div>
            {user?.isAdmin && <Badge variant="gold">Admin</Badge>}
          </div>
          <Input
            label="Name"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />
          <Input
            label="Phone"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            placeholder="(555) 123-4567"
          />
          <Button variant="primary">Save Changes</Button>
        </Card>

        <Card className="p-8 space-y-6">
          <h2 className="text-display-3 font-serif text-brand-primary">Order History</h2>
          {orders.length === 0 ? (
            <p className="text-body text-brand-muted">No orders yet.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-semibold text-body-lg text-brand-primary">{order.id}</p>
                      <p className="text-caption text-brand-muted">{formatDate(order.date)}</p>
                    </div>
                    <Badge variant={order.status === 'Delivered' ? 'default' : 'gold'}>
                      {order.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-body mb-4">
                    <span className="text-brand-muted">{order.items} items</span>
                    <span className="font-semibold text-brand-primary">{formatPrice(order.total)}</span>
                  </div>
                  <div className="pt-4 border-t border-brand-border">
                    <div className="flex items-center gap-3 text-caption text-brand-muted">
                      <div className="flex-1 h-1.5 bg-brand-border rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            order.status === 'Delivered' ? 'bg-success' : 'bg-brand-gold'
                          }`}
                          style={{ width: order.status === 'Delivered' ? '100%' : '66%' }}
                        />
                      </div>
                      <span>
                        {order.status === 'Delivered' ? 'Delivered' : 'In Transit'}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>
      </div>
    </motion.div>
  );
}

