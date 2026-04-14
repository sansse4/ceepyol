"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/lib/store/auth";
import { useAdminStore } from "@/lib/store/admin";
import { useProducts } from "@/lib/hooks/useProducts";
import { Product } from "@/lib/types/product";
import AddProductForm from "@/components/admin/AddProductForm";
import AnnouncementsManager from "@/components/admin/AnnouncementsManager";
import DiscountCodesManager from "@/components/admin/DiscountCodesManager";
import SiteSettingsManager from "@/components/admin/SiteSettingsManager";
import FlashSaleManager from "@/components/admin/FlashSaleManager";

type Section = "products" | "announcements" | "discounts" | "settings" | "flashsale";

const NAV_ITEMS: { id: Section; label: string; icon: string }[] = [
  { id: "products", label: "Ürünler", icon: "inventory_2" },
  { id: "flashsale", label: "Flaş İndirim", icon: "timer" },
  { id: "announcements", label: "Duyurular", icon: "campaign" },
  { id: "discounts", label: "İndirim Kodları", icon: "confirmation_number" },
  { id: "settings", label: "Site Ayarları", icon: "settings" },
];

export default function AdminPage() {
  const [section, setSection] = useState<Section>("products");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { announcements, discountCodes, flashSale, loadData } = useAdminStore();
  const { products } = useProducts();
  const activeAnnouncements = announcements.filter((a) => a.active).length;
  const activeCodes = discountCodes.filter((c) => c.active).length;

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const stats = [
    { label: "Ürünler", value: products.length, icon: "inventory_2", color: "emerald" },
    { label: "Flaş İndirim", value: flashSale.active ? "AÇIK" : "KAPALI", icon: "timer", color: flashSale.active ? "emerald" : "amber" },
    { label: "Duyurular", value: activeAnnouncements, icon: "campaign", color: "blue" },
    { label: "İndirim Kodları", value: activeCodes, icon: "confirmation_number", color: "purple" },
  ];

  return (
    <div className="min-h-screen bg-[#0f1117] text-white flex">
      {/* Sidebar Overlay - Mobile */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-[#14161e] border-r border-white/5 z-50 flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        {/* Logo */}
        <div className="p-5 border-b border-white/5">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <span className="text-white font-extrabold text-sm">TB</span>
            </div>
            <div>
              <span className="font-extrabold text-sm">ceepy<span className="text-emerald-400">ol</span></span>
              <p className="text-[10px] text-white/30 font-medium">Yönetim Paneli</p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <button key={item.id} onClick={() => { setSection(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                section === item.id ? "bg-emerald-500/10 text-emerald-400" : "text-white/40 hover:text-white/70 hover:bg-white/5"}`}>
              <span className="material-symbols-outlined text-lg" style={section === item.id ? { fontVariationSettings: "'FILL' 1" } : undefined}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-xs font-extrabold">
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-white/30 truncate">{user?.email}</p>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <Link href="/" className="flex-1 py-2 bg-white/5 rounded-lg text-[10px] font-bold text-white/40 text-center hover:bg-white/10 hover:text-white/60 transition-all">
              Mağazayı Gör
            </Link>
            <button onClick={async () => { await logout(); window.location.href = "/"; }} className="flex-1 py-2 bg-red-500/10 rounded-lg text-[10px] font-bold text-red-400 text-center hover:bg-red-500/20 transition-all">
              Çıkış
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-[#0f1117]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all">
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div>
              <h1 className="text-lg font-bold">{NAV_ITEMS.find((n) => n.id === section)?.label}</h1>
              <p className="text-xs text-white/30">Mağazanızı yönetin</p>
            </div>
          </div>
          <Link href="/" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl text-xs font-bold text-white/50 hover:bg-white/10 hover:text-white/70 transition-all">
            <span className="material-symbols-outlined text-sm">open_in_new</span>Mağazayı Gör
          </Link>
        </header>

        {/* Content */}
        <div className="p-6 max-w-5xl">
          {/* Stats */}
          {section === "products" && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
              {stats.map((s, i) => (
                <div key={i} className="bg-[#14161e] rounded-2xl p-4 border border-white/5">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`material-symbols-outlined text-lg ${s.color === "emerald" ? "text-emerald-400" : s.color === "blue" ? "text-blue-400" : s.color === "purple" ? "text-purple-400" : "text-amber-400"}`}>{s.icon}</span>
                  </div>
                  <p className="text-2xl font-extrabold">{s.value}</p>
                  <p className="text-[10px] text-white/30 font-bold uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
          )}

          {section === "products" && <ProductsSection />}
          {section === "flashsale" && <FlashSaleManager />}
          {section === "announcements" && <AnnouncementsManager />}
          {section === "discounts" && <DiscountCodesManager />}
          {section === "settings" && <SiteSettingsManager />}
        </div>
      </div>
    </div>
  );
}

/* ========== Products Section ========== */
function ProductsSection() {
  const { addProduct, deleteProduct, restoreProduct, setPriceOverride, deletedProductIds } = useAdminStore();
  const { products: dbProducts } = useProducts();
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState("all");
  const [editPriceId, setEditPriceId] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState("");
  const [newOrigPrice, setNewOrigPrice] = useState("");

  const products = dbProducts;
  const filtered = filter === "all" ? products : products.filter((p) => p.category === filter);
  const categories = ["all", ...Array.from(new Set(products.map((p) => p.category)))];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-lg font-bold text-white">Ürünler</h3>
          <p className="text-xs text-white/40">{filtered.length} ürün{filter !== "all" ? ` - ${filter}` : ""}</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold rounded-xl text-sm flex items-center gap-2 hover:shadow-lg hover:shadow-emerald-500/25 transition-all">
          <span className="material-symbols-outlined text-lg">{showAdd ? "close" : "add"}</span>
          {showAdd ? "İptal" : "Ürün Ekle"}
        </button>
      </div>

      {showAdd && <AddProductForm onAdd={(p) => { addProduct(p); setShowAdd(false); }} onCancel={() => setShowAdd(false)} />}

      {/* Category Filter */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 hide-scrollbar">
        {categories.map((cat) => (
          <button key={cat} onClick={() => setFilter(cat)} className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${filter === cat ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5 text-white/30 hover:text-white/50"}`}>
            {cat === "all" ? "Tümü" : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Deleted Products */}
      {deletedProductIds.length > 0 && (
        <div className="bg-red-500/5 rounded-xl p-3 border border-red-500/10">
          <p className="text-[10px] font-bold text-red-400 mb-2">Silinenler ({deletedProductIds.length})</p>
          <div className="flex flex-wrap gap-2">
            {deletedProductIds.map((id) => (
              <button key={id} onClick={() => restoreProduct(id)} className="text-[10px] bg-red-500/10 px-2.5 py-1.5 rounded-lg border border-red-500/10 text-red-400 font-semibold flex items-center gap-1 hover:bg-red-500/20 transition-all">
                <span className="material-symbols-outlined text-xs">restore</span>Geri Yükle #{id}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Product List */}
      <div className="space-y-2">
        {filtered.map((product) => (
          <div key={product.id} className="bg-[#14161e] rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                {product.images[0]?.src ? (
                  <Image src={product.images[0].src} alt={product.name} width={48} height={48} unoptimized className="w-12 h-12 object-contain" />
                ) : (
                  <span className="material-symbols-outlined text-white/20 text-2xl">image</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-white truncate">{product.name}</h4>
                <div className="flex items-center gap-2 text-[10px] text-white/30 mt-1 flex-wrap">
                  <span className="px-1.5 py-0.5 bg-white/5 rounded">{product.brand}</span>
                  <span className="px-1.5 py-0.5 bg-white/5 rounded">{product.category}</span>
                  <span className={`px-1.5 py-0.5 rounded font-bold ${product.inStock ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                    {product.inStock ? "Stokta" : "Tükendi"}
                  </span>
                  <span className="text-white/20">{product.images.length} görsel</span>
                  <span className="text-white/20">{product.colors.length} renk</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                {editPriceId === product.id ? (
                  <div className="flex items-center gap-2">
                    <input type="number" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} className="w-20 px-2 py-1 bg-[#1a1d27] border border-white/10 rounded-lg text-xs text-white outline-none focus:border-emerald-500/50" placeholder="Fiyat" />
                    <input type="number" value={newOrigPrice} onChange={(e) => setNewOrigPrice(e.target.value)} className="w-20 px-2 py-1 bg-[#1a1d27] border border-white/10 rounded-lg text-xs text-white/50 outline-none focus:border-emerald-500/50" placeholder="Eski" />
                    <button onClick={() => { if (newPrice) setPriceOverride(product.id, Number(newPrice), newOrigPrice ? Number(newOrigPrice) : undefined); setEditPriceId(null); }}
                      className="text-emerald-400"><span className="material-symbols-outlined text-lg">check</span></button>
                    <button onClick={() => setEditPriceId(null)} className="text-white/30"><span className="material-symbols-outlined text-lg">close</span></button>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-extrabold text-white">₺{product.price.toLocaleString()}</p>
                    {product.originalPrice && <p className="text-[10px] text-white/20 line-through">₺{product.originalPrice.toLocaleString()}</p>}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setEditPriceId(product.id); setNewPrice(product.price.toString()); setNewOrigPrice(product.originalPrice?.toString() || ""); }}
                  className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center transition-all" title="Edit Price">
                  <span className="material-symbols-outlined text-sm text-white/40">edit</span>
                </button>
                <button onClick={() => deleteProduct(product.id)} className="w-8 h-8 rounded-lg hover:bg-red-500/10 flex items-center justify-center transition-all" title="Delete">
                  <span className="material-symbols-outlined text-sm text-red-400/60">delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
