import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useFavoriteStore = create(
  persist(
    (set, get) => ({
      favorites: [],
      
      toggleFavorite: (bookId) => {
        const favorites = get().favorites;
        if (favorites.includes(bookId)) {
          set({ favorites: favorites.filter(id => id !== bookId) });
        } else {
          set({ favorites: [...favorites, bookId] });
        }
      },
      
      isFavorite: (bookId) => {
        return get().favorites.includes(bookId);
      },
      
      removeFavorite: (bookId) => {
        set({
          favorites: get().favorites.filter(id => id !== bookId),
        });
      },
      
      clearFavorites: () => set({ favorites: [] }),
    }),
    {
      name: 'favorite-storage',
    }
  )
);

export default useFavoriteStore;


