import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (book, format, quantity = 1) => {
        const items = get().items;
        const existingIndex = items.findIndex(
          item => item.bookId === book.id && item.format === format
        );
        
        if (existingIndex >= 0) {
          const existing = items[existingIndex];
          const newQuantity = existing.quantity + quantity;
          const maxStock = existing.stock !== null ? existing.stock : Infinity;
          
          set({
            items: items.map((item, idx) =>
              idx === existingIndex
                ? { ...item, quantity: Math.min(newQuantity, maxStock) }
                : item
            ),
          });
        } else {
          const formatOption = book.formatOptions.find(f => f.format === format);
          set({
            items: [
              ...items,
              {
                bookId: book.id,
                bookTitle: book.title,
                bookAuthors: book.authors,
                coverImage: book.coverImage,
                format,
                price: formatOption?.price || 0,
                stock: formatOption?.stock,
                quantity: Math.min(quantity, formatOption?.stock || Infinity),
              },
            ],
          });
        }
      },
      
      removeItem: (bookId, format) => {
        set({
          items: get().items.filter(
            item => !(item.bookId === bookId && item.format === format)
          ),
        });
      },
      
      updateQuantity: (bookId, format, quantity) => {
        const items = get().items;
        const item = items.find(
          i => i.bookId === bookId && i.format === format
        );
        
        if (!item) return;
        
        const maxStock = item.stock !== null ? item.stock : Infinity;
        const newQuantity = Math.max(1, Math.min(quantity, maxStock));
        
        set({
          items: items.map(i =>
            i.bookId === bookId && i.format === format
              ? { ...i, quantity: newQuantity }
              : i
          ),
        });
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },
      
      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);

export default useCartStore;


