"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "@/lib/store/auth";

interface WishlistStore {
  items: string[]; // product IDs
  loading: boolean;
  loadWishlist: () => Promise<void>;
  addItem: (productId: string) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  toggleItem: (productId: string) => Promise<void>;
  isWishlisted: (productId: string) => boolean;
  clearAll: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      loading: false,
      loadWishlist: async () => {
        // No supabase, local persistence handles it mostly, 
        // but we can clear if no user is signed in to mock real behavior.
        const userId = useAuthStore.getState().user?.id;
        if (!userId) {
          set({ items: [] });
          return;
        }
      },
      addItem: async (productId) => {
        const userId = useAuthStore.getState().user?.id;
        if (!userId) return;
        set((state) => ({
          items: state.items.includes(productId) ? state.items : [...state.items, productId],
        }));
      },
      removeItem: async (productId) => {
        const userId = useAuthStore.getState().user?.id;
        if (!userId) return;
        set((state) => ({ items: state.items.filter((id) => id !== productId) }));
      },
      toggleItem: async (productId) => {
        const { items } = get();
        if (items.includes(productId)) {
          await get().removeItem(productId);
        } else {
          await get().addItem(productId);
        }
      },
      isWishlisted: (productId) => get().items.includes(productId),
      clearAll: () => set({ items: [] }),
    }),
    { name: "techbay-wishlist" }
  )
);
