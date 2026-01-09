import { create } from "zustand";
import { persist } from "zustand/middleware";
import apiClient from "@/lib/apiClient"; // axios instance

const useFavoriteStore = create(
  persist(
    (set, get) => ({
      favorites: [],
      loading: false,

      fetchFavorites: async () => {
        try {
          set({ loading: true });

          const res = await apiClient.get("/user/favorites");

          if (res.data.success) {
            set({ favorites: res.data.favorites });
          }

        } catch (error) {
          console.error("Failed to fetch favorites", error);
        } finally {
          set({ loading: false });
        }
      },

      toggleFavorite: async (bookId) => {
        try {
          const res = await apiClient.post("/user/favorites", { bookId });

          if (res.data.success) {
            // refresh favorites after update
            await get().fetchFavorites();
          }

        } catch (error) {
          console.error("Toggle favorite failed", error);
        }
      },

      // ✅ Check if favorite
      isFavorite: (bookId) => {
        return get().favorites.some(book => book.id === bookId);
      },

      // ✅ Clear on logout
      clearFavorites: () => set({ favorites: [] }),

    }),
    {
      name: "favorite-storage",
      partialize: (state) => ({ favorites: state.favorites })
    }
  )
);

export default useFavoriteStore;
