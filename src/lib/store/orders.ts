"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "@/lib/types/product";
import { useAuthStore } from "@/lib/store/auth";

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentMethod: "credit_card" | "crypto" | "wise";
  paymentStatus: "pending" | "confirmed" | "failed";
  shippingAddress: string;
  createdAt: string;
}

interface OrdersStore {
  orders: Order[];
  loading: boolean;
  fetchOrders: () => Promise<void>;
  addOrder: (order: Omit<Order, "id" | "createdAt">) => Promise<string>;
  getUserOrders: (userId: string) => Order[];
  updateOrderStatus: (orderId: string, status: Order["status"]) => Promise<void>;
}

export const useOrdersStore = create<OrdersStore>()(
  persist(
    (set, get) => ({
      orders: [],
      loading: false,
      fetchOrders: async () => {
        // Orders are already in local storage via persist
        set({ loading: false });
      },
      addOrder: async (order) => {
        const id = `order-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
        const newOrder: Order = {
          ...order,
          id,
          paymentMethod: order.paymentMethod || "credit_card",
          paymentStatus: order.paymentStatus || "pending",
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          orders: [newOrder, ...state.orders],
        }));

        return id;
      },
      getUserOrders: (userId) => get().orders.filter((o) => o.userId === userId),
      updateOrderStatus: async (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
        }));
      },
    }),
    { name: "techbay-orders" }
  )
);
