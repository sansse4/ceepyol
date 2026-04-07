"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: "user" | "admin";
  createdAt: string;
}

interface AuthStore {
  user: User | null;
  isLoggedIn: boolean;
  initializing: boolean;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      initializing: false,

      initialize: async () => {
        set({ initializing: false });
      },

      login: async (email, password) => {
        // Mock Login
        if (password.length > 0) {
          const mockUser: User = {
            id: `user-${Date.now()}`,
            name: email.split("@")[0] || "User",
            email: email,
            role: email.includes("admin") ? "admin" : "user",
            createdAt: new Date().toISOString(),
          };
          set({ user: mockUser, isLoggedIn: true });
          return { success: true };
        }
        return { success: false, error: "Invalid credentials" };
      },

      register: async (name, email, password) => {
        // Mock Register
        if (email && password.length >= 6) {
          const mockUser: User = {
            id: `user-${Date.now()}`,
            name: name,
            email: email,
            role: email.includes("admin") ? "admin" : "user",
            createdAt: new Date().toISOString(),
          };
          set({ user: mockUser, isLoggedIn: true });
          return { success: true };
        }
        return { success: false, error: "Password too short" };
      },

      logout: async () => {
        set({ user: null, isLoggedIn: false });
      },

      updateProfile: async (data) => {
        const { user } = get();
        if (!user) return;
        set({ user: { ...user, ...data } });
      },
    }),
    { name: "techbay-auth" }
  )
);
