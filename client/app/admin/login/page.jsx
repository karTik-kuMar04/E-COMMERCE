'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button, Card } from '@/components/ui/UI';


export default function AdminLoginPage() {
  return (
    <div className="max-w-2xl mx-auto mt-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-12 space-y-6">
          <h1 className="text-display-1 font-serif text-brand-primary text-center">Admin Login</h1>
          <p className="text-body text-brand-muted text-center">
            Admin access now uses the main authentication flow. Login with an admin-enabled account to continue.
          </p>
          
          <Link className='' href="/auth/login?next=/admin/products">
            <Button variant="primary" className="w-full" size="lg">
              Go to Login
            </Button>
          </Link>
        </Card>
      </motion.div>
    </div>
  );
}

