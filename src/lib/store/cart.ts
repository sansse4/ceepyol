"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "@/lib/types/product";

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, selectedColor?: string, selectedStorage?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedColor?: string, selectedStorage?: string) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) =>
        set((state) => {
          const existing = state.items.find(
            (item) =>
              item.productId === newItem.productId &&
              item.selectedColor === newItem.selectedColor &&
              item.selectedStorage === newItem.selectedStorage
          );
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.productId === newItem.productId &&
                item.selectedColor === newItem.selectedColor &&
                item.selectedStorage === newItem.selectedStorage
                  ? { ...item, quantity: item.quantity + newItem.quantity }
                  : item
              ),
            };
          }
          return { items: [...state.items, newItem] };
        }),

      removeItem: (productId, selectedColor, selectedStorage) =>
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(
                item.productId === productId &&
                item.selectedColor === selectedColor &&
                item.selectedStorage === selectedStorage
              )
          ),
        })),

      updateQuantity: (productId, quantity, selectedColor, selectedStorage) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter(
                  (item) =>
                    !(
                      item.productId === productId &&
                      item.selectedColor === selectedColor &&
                      item.selectedStorage === selectedStorage
                    )
                )
              : state.items.map((item) =>
                  item.productId === productId &&
                  item.selectedColor === selectedColor &&
                  item.selectedStorage === selectedStorage
                    ? { ...item, quantity }
                    : item
                ),
        })),

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

      totalPrice: () =>
        get().items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    }),
    {
      name: "techbay-cart",
    }
  )
);
