"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/lib/types/product";
import localProducts from "@/lib/data/local-products.json";

/* ============ Types ============ */

export interface Announcement {
  id: string;
  text: string;
  type: "banner" | "popup" | "bar";
  bgColor: string;
  textColor: string;
  link?: string;
  active: boolean;
  createdAt: string;
}

export interface DiscountCode {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minOrder: number;
  maxUses: number;
  usedCount: number;
  active: boolean;
  expiresAt: string;
  createdAt: string;
}

export interface SiteSettings {
  bgColor: string;
  bgGradient: string;
  bgImage: string;
  bgMode: "color" | "gradient" | "image";
  primaryColor: string;
  promoText: string;
  siteName: string;
  accentColor: string;
}

export interface FlashSale {
  active: boolean;
  title: string;
  label: string;
  discount: number;
  endsAt: string;
  productIds: string[];
  bgFrom: string;
  bgTo: string;
}

/* ============ Helpers ============ */

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/* ============ Store ============ */

interface AdminStore {
  loadData: () => Promise<void>;
  loading: boolean;

  // Products
  products: Product[];
  deletedProductIds: string[];
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  restoreProduct: (id: string) => Promise<void>;
  getAllProducts: () => Product[];
  setPriceOverride: (id: string, price: number, originalPrice?: number) => Promise<void>;

  // Announcements
  announcements: Announcement[];
  addAnnouncement: (ann: Omit<Announcement, "id" | "createdAt">) => Promise<void>;
  updateAnnouncement: (id: string, updates: Partial<Announcement>) => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;
  getActiveAnnouncements: () => Announcement[];

  // Discount Codes
  discountCodes: DiscountCode[];
  addDiscountCode: (code: Omit<DiscountCode, "id" | "createdAt" | "usedCount">) => Promise<void>;
  updateDiscountCode: (id: string, updates: Partial<DiscountCode>) => Promise<void>;
  deleteDiscountCode: (id: string) => Promise<void>;
  applyDiscountCode: (code: string, orderTotal: number) => { valid: boolean; discount: number; error?: string };

  // Site Settings
  siteSettings: SiteSettings;
  updateSiteSettings: (settings: Partial<SiteSettings>) => Promise<void>;

  // Flash Sale
  flashSale: FlashSale;
  updateFlashSale: (sale: Partial<FlashSale>) => void;
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      loading: false,

      /* ===== loadData — tries Supabase, falls back to local state ===== */
      loadData: async () => {
        set({ loading: true });
        
        // If the store is empty, initialize products from local JSON
        if (get().products.length === 0) {
           set({ products: localProducts as Product[] });
        }

        set({ loading: false });
      },

      /* ===== Products ===== */
      products: [],
      deletedProductIds: [],

      addProduct: async (product) => {
        set((state) => ({ products: [product, ...state.products] }));
      },

      updateProduct: async (id, updates) => {
        set((state) => ({
          products: state.products.map((p) => p.id === id ? { ...p, ...updates } : p),
        }));
      },

      deleteProduct: async (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
          deletedProductIds: [...state.deletedProductIds, id],
        }));
      },

      restoreProduct: async (id) => {
        set((state) => ({
          deletedProductIds: state.deletedProductIds.filter((did) => did !== id),
        }));
      },

      getAllProducts: () => get().products,

      setPriceOverride: async (id, price, originalPrice) => {
        await get().updateProduct(id, { price, originalPrice });
      },

      /* ===== Announcements ===== */
      announcements: [],

      addAnnouncement: async (ann) => {
        const newAnn: Announcement = { ...ann, id: uid(), createdAt: new Date().toISOString() };
        set((state) => ({ announcements: [newAnn, ...state.announcements] }));
      },

      updateAnnouncement: async (id, updates) => {
        set((state) => ({
          announcements: state.announcements.map((a) => a.id === id ? { ...a, ...updates } : a),
        }));
      },

      deleteAnnouncement: async (id) => {
        set((state) => ({ announcements: state.announcements.filter((a) => a.id !== id) }));
      },

      getActiveAnnouncements: () => get().announcements.filter((a) => a.active),

      /* ===== Discount Codes ===== */
      discountCodes: [],

      addDiscountCode: async (code) => {
        const newCode: DiscountCode = { ...code, id: uid(), usedCount: 0, createdAt: new Date().toISOString() };
        set((state) => ({ discountCodes: [newCode, ...state.discountCodes] }));
      },

      updateDiscountCode: async (id, updates) => {
        set((state) => ({
          discountCodes: state.discountCodes.map((c) => c.id === id ? { ...c, ...updates } : c),
        }));
      },

      deleteDiscountCode: async (id) => {
        set((state) => ({ discountCodes: state.discountCodes.filter((c) => c.id !== id) }));
      },

      applyDiscountCode: (code, orderTotal) => {
        const dc = get().discountCodes.find((c) => c.code.toLowerCase() === code.toLowerCase() && c.active);
        if (!dc) return { valid: false, discount: 0, error: "Invalid discount code" };
        if (new Date(dc.expiresAt) < new Date()) return { valid: false, discount: 0, error: "Code has expired" };
        if (dc.maxUses > 0 && dc.usedCount >= dc.maxUses) return { valid: false, discount: 0, error: "Code usage limit reached" };
        if (orderTotal < dc.minOrder) return { valid: false, discount: 0, error: `Minimum order ₺${dc.minOrder} required` };

        const discount = dc.type === "percentage" ? Math.round((orderTotal * dc.value) / 100 * 100) / 100 : Math.min(dc.value, orderTotal);
        set((state) => ({ discountCodes: state.discountCodes.map((c) => c.id === dc.id ? { ...c, usedCount: c.usedCount + 1 } : c) }));
        return { valid: true, discount };
      },

      /* ===== Site Settings ===== */
      siteSettings: {
        bgColor: "#f8f9ff",
        bgGradient: "linear-gradient(135deg, #f8f9ff 0%, #ffeaf0 100%)",
        bgImage: "",
        bgMode: "color",
        primaryColor: "#f7004d",
        accentColor: "#be0037",
        promoText: "UP TO 70% OFF  --  FREE EXPRESS SHIPPING ON ORDERS OVER ₺3000",
        siteName: "ceepyol",
      },

      updateSiteSettings: async (settings) => {
        const next = { ...get().siteSettings, ...settings };
        set({ siteSettings: next });
      },

      /* ===== Flash Sale ===== */
      flashSale: {
        active: false,
        title: "Spring Sale Event",
        label: "LIMITED TIME OFFER",
        discount: 30,
        endsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        productIds: [],
        bgFrom: "#ff2a6d",
        bgTo: "#9e0031",
      },

      updateFlashSale: (sale) => {
        set((state) => ({ flashSale: { ...state.flashSale, ...sale } }));
      },
    }),
    { name: "ceepyol-admin-v2" }
  )
);
