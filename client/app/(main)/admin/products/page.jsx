'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button, Card, Badge, SectionHeader } from '@/components/ui/UI';
import Modal from '@/components/ui/Modal';
import AdminProductForm from '@/components/ui/AdminProductForm';
import { formatPrice } from '@/utils/format';
import useAuthGuard from '@/hooks/useAuthGuard';
import demoBooks from '@/data/demo-books.json';

export default function AdminProductsPage() {
  const { isChecking, isReady, isDenied } = useAuthGuard({ requireAdmin: true });
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBook, setEditingBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!isReady) return;
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 400));
      setBooks(demoBooks);
      setLoading(false);
    };

    loadData();
  }, [isReady]);

  const handleEdit = (book) => {
    setEditingBook(book);
    setIsModalOpen(true);
  };

  const handleSave = (updatedBook) => {
    setBooks(books.map(b => b.id === updatedBook.id ? updatedBook : b));
    setIsModalOpen(false);
    setEditingBook(null);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingBook(null);
  };

  if (isChecking) {
    return (
      <div className="text-center py-24">
        <p className="text-body-lg text-brand-muted">Loading...</p>
      </div>
    );
  }

  if (isDenied) {
    return (
      <div className="max-w-xl mx-auto text-center space-y-6">
        <SectionHeader>Admin Access Required</SectionHeader>
        <p className="text-body text-brand-muted">
          You need an admin-enabled account to manage products. Login with the demo admin credential or register a new admin-enabled account.
        </p>
        <Link href="/auth/login?next=/admin/products">
          <Button variant="primary">Go to Login</Button>
        </Link>
      </div>
    );
  }

  if (!isReady) {
    return null;
  }

  if (loading) {
    return (
      <div className="text-center py-24">
        <p className="text-body-lg text-brand-muted">Loading...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12"
    >
      <div className="flex items-center justify-between">
        <SectionHeader>Admin - Products</SectionHeader>
        <Link href="/">
          <Button variant="ghost">Back to Store</Button>
        </Link>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-brand-bg">
              <tr>
                <th className="px-8 py-4 text-left text-caption font-semibold text-brand-primary uppercase tracking-wider">
                  Cover
                </th>
                <th className="px-8 py-4 text-left text-caption font-semibold text-brand-primary uppercase tracking-wider">
                  Title
                </th>
                <th className="px-8 py-4 text-left text-caption font-semibold text-brand-primary uppercase tracking-wider">
                  Author
                </th>
                <th className="px-8 py-4 text-left text-caption font-semibold text-brand-primary uppercase tracking-wider">
                  Price
                </th>
                <th className="px-8 py-4 text-left text-caption font-semibold text-brand-primary uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-8 py-4 text-left text-caption font-semibold text-brand-primary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-brand-surface divide-y divide-brand-border">
              {books.map((book, index) => {
                const defaultFormat = book.formatOptions?.[0];
                return (
                  <motion.tr
                    key={book.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-brand-bg/30 transition-colors"
                  >
                    <td className="px-8 py-6 whitespace-nowrap">
                      <img
                        src={book.coverImage || '/assets/covers/placeholder.jpg'}
                        alt={book.title}
                        className="w-20 h-28 object-cover rounded-xl border border-brand-border"
                      />
                    </td>
                    <td className="px-8 py-6">
                      <div className="font-serif text-display-3 text-brand-primary">{book.title}</div>
                      {book.subtitle && (
                        <div className="text-body text-brand-muted">{book.subtitle}</div>
                      )}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="text-body text-brand-muted">
                        {book.authors?.join(', ') || 'Unknown'}
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="font-semibold text-body-lg text-brand-primary">
                        {formatPrice(defaultFormat?.price || 0)}
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="text-body text-brand-muted">
                        {defaultFormat?.stock !== null
                          ? defaultFormat.stock
                          : 'Unlimited'}
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(book)}
                      >
                        Edit
                      </Button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCancel}
        title="Edit Product"
        size="xl"
      >
        {editingBook && (
          <AdminProductForm
            book={editingBook}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}
      </Modal>
    </motion.div>
  );
}
