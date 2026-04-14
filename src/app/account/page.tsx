"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/lib/store/auth";
import { useWishlistStore } from "@/lib/store/wishlist";
import { useOrdersStore } from "@/lib/store/orders";
import { useCartStore } from "@/lib/store/cart";
import { useAdminStore } from "@/lib/store/admin";
import { useProducts } from "@/lib/hooks/useProducts";
import { Product } from "@/lib/types/product";

type Tab = "profile" | "orders" | "wishlist" | "admin";

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [mounted, setMounted] = useState(false);
  const { user, isLoggedIn, logout, updateProfile, initialize } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      void initialize();
    }
  }, [mounted, initialize]);

  useEffect(() => {
    if (mounted && !isLoggedIn) {
      router.push("/auth/login");
    }
  }, [mounted, isLoggedIn, router]);

  if (!mounted || !isLoggedIn || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <span className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const isAdmin = user.role === "admin";

  const tabs: { id: Tab; label: string; icon: string; adminOnly?: boolean }[] = [
    { id: "profile", label: "Profil", icon: "person" },
    { id: "orders", label: "Siparişler", icon: "receipt_long" },
    { id: "wishlist", label: "İstek Listesi", icon: "favorite" },
    ...(isAdmin ? [{ id: "admin" as Tab, label: "Yönetim Paneli", icon: "admin_panel_settings", adminOnly: true }] : []),
  ];

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-primary/20">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-on-surface font-[family-name:var(--font-headline)]">
              {user.name}
            </h1>
            <p className="text-sm text-on-surface-variant">{user.email}</p>
            {isAdmin && (
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-white bg-tertiary px-2 py-0.5 rounded-md mt-1">
                <span className="material-symbols-outlined text-[12px]">shield</span>
                ADMIN
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => {
            void logout();
            router.push("/");
          }}
          className="px-5 py-2.5 border-2 border-error/20 text-error font-bold rounded-xl text-sm hover:bg-error/5 transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          Çıkış Yap
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-container-low rounded-2xl p-1.5 mb-8 overflow-x-auto hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? tab.adminOnly
                  ? "bg-tertiary text-white shadow-md"
                  : "bg-white dark:bg-surface-container-high text-primary shadow-md"
                : "text-on-surface-variant hover:text-on-surface hover:bg-white/50 dark:hover:bg-surface-container-high/50"
            }`}
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={activeTab === tab.id ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {tab.icon}
            </span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in-up">
        {activeTab === "profile" && <ProfileTab user={user} updateProfile={updateProfile} />}
        {activeTab === "orders" && <OrdersTab userId={user.id} />}
        {activeTab === "wishlist" && <WishlistTab />}
        {activeTab === "admin" && isAdmin && (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-[64px] text-tertiary mb-4 block" style={{ fontVariationSettings: "'FILL' 1" }}>admin_panel_settings</span>
            <h3 className="text-lg font-bold mb-2">Yönetim Paneli</h3>
            <p className="text-sm text-on-surface-variant mb-6">Ürünleri, duyuruları, indirim kodlarını ve site ayarlarını yönetin</p>
            <a href="/admin" className="inline-flex items-center gap-2 px-8 py-3 bg-tertiary text-white font-bold rounded-xl text-sm hover:bg-tertiary/90 transition-all shadow-lg shadow-tertiary/20">
              <span className="material-symbols-outlined text-[18px]">open_in_new</span>
              Yönetim Panelini Aç
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============ PROFILE TAB ============ */
function ProfileTab({
  user,
  updateProfile,
}: {
  user: NonNullable<ReturnType<typeof useAuthStore.getState>["user"]>;
  updateProfile: (data: Partial<typeof user>) => Promise<void>;
}) {
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone || "");
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    await updateProfile({ name, phone });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-lg">
      <h2 className="text-lg font-extrabold mb-6">Kişisel Bilgiler</h2>
      <div className="space-y-5">
        <div>
          <label className="text-sm font-bold text-on-surface mb-1.5 block">Ad Soyad</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 bg-surface-container-low/50 border border-surface-variant rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
          />
        </div>
        <div>
          <label className="text-sm font-bold text-on-surface mb-1.5 block">E-posta</label>
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full px-4 py-3 bg-surface-container-low/30 border border-surface-variant rounded-xl text-sm text-on-surface-variant"
          />
        </div>
        <div>
          <label className="text-sm font-bold text-on-surface mb-1.5 block">Telefon</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 (555) 000-0000"
            className="w-full px-4 py-3 bg-surface-container-low/50 border border-surface-variant rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
          />
        </div>
        <div>
          <label className="text-sm font-bold text-on-surface mb-1.5 block">Üyelik Tarihi</label>
          <p className="text-sm text-on-surface-variant">
            {new Date(user.createdAt).toLocaleDateString("tr-TR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <button
          onClick={handleSave}
          className={`px-8 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
            saved
              ? "bg-primary-container text-on-primary-container"
              : "bg-primary text-white hover:bg-on-primary-fixed-variant shadow-lg shadow-primary/20"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {saved ? "check_circle" : "save"}
          </span>
          {saved ? "Kaydedildi!" : "Değişiklikleri Kaydet"}
        </button>
      </div>
    </div>
  );
}

/* ============ ORDERS TAB ============ */
function OrdersTab({ userId }: { userId: string }) {
  const allOrders = useOrdersStore((s) => s.orders);
  const fetchOrders = useOrdersStore((s) => s.fetchOrders);
  const orders = useMemo(() => allOrders.filter((o) => o.userId === userId), [allOrders, userId]);

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  const statusConfig: Record<string, { color: string; icon: string }> = {
    pending: { color: "bg-amber-100 text-amber-800", icon: "schedule" },
    processing: { color: "bg-blue-100 text-blue-800", icon: "sync" },
    shipped: { color: "bg-purple-100 text-purple-800", icon: "local_shipping" },
    delivered: { color: "bg-green-100 text-green-800", icon: "check_circle" },
    cancelled: { color: "bg-red-100 text-red-800", icon: "cancel" },
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <span className="material-symbols-outlined text-[64px] text-on-surface-variant/20 mb-4 block">
          receipt_long
        </span>
        <h3 className="text-lg font-bold text-on-surface-variant mb-2">Henüz sipariş yok</h3>
        <p className="text-sm text-on-surface-variant/70 mb-6">Sipariş geçmişiniz burada görünecek</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl text-sm hover:bg-on-primary-fixed-variant transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
          Alışverişe Başla
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-extrabold mb-2">Sipariş Geçmişi</h2>
      {orders.map((order) => {
        const cfg = statusConfig[order.status] || statusConfig.pending;
        return (
          <div
            key={order.id}
            className="bg-white dark:bg-surface-container rounded-2xl border border-surface-variant/60 p-5 shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div>
                <span className="text-xs font-bold text-on-surface-variant">SİPARİŞ</span>
                <p className="font-extrabold text-on-surface">{order.id}</p>
              </div>
              <span className={`px-3 py-1 rounded-lg text-xs font-extrabold flex items-center gap-1 ${cfg.color}`}>
                <span className="material-symbols-outlined text-[14px]">{cfg.icon}</span>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
            <div className="flex flex-wrap gap-3 mb-3">
              {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 bg-surface-container-low/50 rounded-xl px-3 py-2">
                    <Image
                      src={item.productImage || ""}
                      alt={item.productName || "Product"}
                      width={32}
                      height={32}
                      unoptimized
                      className="w-8 h-8 object-contain"
                    />
                    <span className="text-xs font-semibold">{item.productName || "Product"} x{item.quantity}</span>
                  </div>
                ))}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-on-surface-variant">
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
              <span className="font-extrabold text-on-surface">₺{order.total.toFixed(2)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ============ WISHLIST TAB ============ */
function WishlistTab() {
  const { items, removeItem, loadWishlist } = useWishlistStore();
  const addToCart = useCartStore((s) => s.addItem);
  const router = useRouter();
  const { products } = useProducts();

  useEffect(() => {
    void loadWishlist();
  }, [loadWishlist]);

  const wishlistProducts = products.filter((p) => items.includes(p.id));

  if (wishlistProducts.length === 0) {
    return (
      <div className="text-center py-16">
        <span className="material-symbols-outlined text-[64px] text-on-surface-variant/20 mb-4 block">
          favorite
        </span>
        <h3 className="text-lg font-bold text-on-surface-variant mb-2">İstek listeniz boş</h3>
        <p className="text-sm text-on-surface-variant/70 mb-6">Daha sonra almak istediğiniz ürünleri kaydedin</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl text-sm hover:bg-on-primary-fixed-variant transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">explore</span>
          Ürünlere Göz At
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-extrabold mb-4">
        İstek Listem <span className="text-on-surface-variant font-normal">({wishlistProducts.length})</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {wishlistProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white dark:bg-surface-container rounded-2xl border border-surface-variant/60 p-4 shadow-sm group"
          >
            <div className="relative bg-surface-container-low/50 rounded-xl overflow-hidden aspect-square mb-3 flex items-center justify-center">
              <Link href={`/products/${product.slug}`}>
                <Image
                  src={product.images[0]?.src || ""}
                  alt={product.name}
                  width={160}
                  height={160}
                  unoptimized
                  className="w-32 group-hover:scale-110 transition-transform duration-500 object-contain"
                />
              </Link>
              <button
                onClick={() => void removeItem(product.id)}
                className="absolute top-2 right-2 w-8 h-8 bg-white dark:bg-surface-container-high rounded-full flex items-center justify-center shadow-md hover:bg-error/10 transition-all"
              >
                <span className="material-symbols-outlined text-[18px] text-error">close</span>
              </button>
            </div>
            <Link href={`/products/${product.slug}`}>
              <h3 className="font-bold text-sm mb-1 hover:text-primary transition-colors">{product.name}</h3>
            </Link>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="font-extrabold">₺{product.price.toLocaleString('tr-TR')}</span>
              {product.originalPrice && (
                <span className="text-xs text-on-surface-variant line-through">
                  ₺{product.originalPrice.toLocaleString('tr-TR')}
                </span>
              )}
            </div>
            <button
              onClick={() => {
                const storageAdd = product.storage?.[0]?.priceAdd || 0;
                addToCart({
                  productId: product.id,
                  quantity: 1,
                  selectedColor: product.colors[0]?.name,
                  selectedStorage: product.storage?.[0]?.label,
                  unitPrice: product.price + storageAdd,
                  productName: product.name,
                  productImage: product.images[0]?.src || "",
                  productSlug: product.slug,
                });
                router.push("/cart");
              }}
              className="w-full py-2.5 bg-primary text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-on-primary-fixed-variant transition-all active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                shopping_bag
              </span>
              Sepete Ekle
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============ ADMIN TAB ============ */
function AdminTab() {
  const [adminSection, setAdminSection] = useState<"products" | "site">("products");

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <span className="material-symbols-outlined text-tertiary text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
          admin_panel_settings
        </span>
        <h2 className="text-lg font-extrabold">Yönetim Paneli</h2>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setAdminSection("products")}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            adminSection === "products"
              ? "bg-tertiary text-white"
              : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
          }`}
        >
          Ürünleri Yönet
        </button>
        <button
          onClick={() => setAdminSection("site")}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            adminSection === "site"
              ? "bg-tertiary text-white"
              : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
          }`}
        >
          Site Ayarları
        </button>
      </div>

      {adminSection === "products" && <AdminProducts />}
      {adminSection === "site" && <AdminSiteSettings />}
    </div>
  );
}

/* ============ ADMIN PRODUCTS ============ */
function AdminProducts() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const adminStore = useAdminStore();

  useEffect(() => {
    adminStore.loadData();
  }, []);

  const allProducts = adminStore.products;
  const deletedIds = adminStore.deletedProductIds;

  const handleDelete = (id: string) => {
    adminStore.deleteProduct(id);
  };

  const handleRestore = (id: string) => {
    adminStore.restoreProduct(id);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-on-surface-variant">{allProducts.length} ürün</p>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-primary text-white font-bold rounded-xl text-sm flex items-center gap-2 hover:bg-on-primary-fixed-variant transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">{showAddForm ? "close" : "add"}</span>
          {showAddForm ? "İptal" : "Ürün Ekle"}
        </button>
      </div>

      {showAddForm && (
        <AddProductForm
          onAdd={(product) => {
            adminStore.addProduct(product);
            setShowAddForm(false);
          }}
        />
      )}

      {/* Deleted products (restorable) */}
      {deletedIds.length > 0 && (
        <div className="mb-4 p-3 bg-error-container/20 rounded-xl">
          <p className="text-xs font-bold text-error mb-2">Silinen Ürünler ({deletedIds.length})</p>
          <div className="flex flex-wrap gap-2">
            {deletedIds.map((id) => (
              <button
                key={id}
                onClick={() => handleRestore(id)}
                className="text-xs bg-white dark:bg-surface-container-low px-3 py-1.5 rounded-lg border border-error/20 text-error font-semibold flex items-center gap-1 hover:bg-error/5 transition-all"
              >
                <span className="material-symbols-outlined text-[14px]">restore</span>
                Geri Yükle {id}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Product List */}
      <div className="space-y-3">
        {allProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white dark:bg-surface-container rounded-2xl border border-surface-variant/60 p-4 shadow-sm"
          >
            {editingId === product.id ? (
              <EditProductForm
                product={product}
                onSave={(updated) => {
                  adminStore.updateProduct(updated.id, updated);
                  setEditingId(null);
                }}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-surface-container-low rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <Image
                    src={product.images[0]?.src || ""}
                    alt={product.name}
                    width={48}
                    height={48}
                    unoptimized
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm truncate">{product.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                    <span>{product.brand}</span>
                    <span>-</span>
                    <span className="font-bold text-on-surface">${product.price}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold ${
                      product.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {product.inStock ? "Stokta" : "Tükendi"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setEditingId(product.id)}
                    className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-surface-container-low transition-all"
                    title="Edit"
                  >
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant">edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-error/10 transition-all"
                    title="Delete"
                  >
                    <span className="material-symbols-outlined text-[18px] text-error">delete</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============ ADD PRODUCT FORM ============ */
function AddProductForm({ onAdd }: { onAdd: (product: Product) => void }) {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [category, setCategory] = useState<Product["category"]>("iphones");
  const [condition, setCondition] = useState<Product["condition"]>("New");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const product: Product = {
      id: `custom-${Date.now()}`,
      slug: name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      name,
      brand,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      category,
      condition,
      description,
      images: imageUrl ? [{ src: imageUrl, alt: name }] : [],
      colors: [{ name: "Default", hex: "#888888" }],
      specs: [],
      badges: [],
      inStock: true,
      rating: 5.0,
      reviewCount: 0,
    };
    onAdd(product);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-primary/5 rounded-2xl p-5 mb-4 space-y-4 border border-primary/10">
      <h3 className="font-bold text-sm flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-[18px]">add_box</span>
        Yeni Ürün
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ürün Adı *"
          required
          className="px-3 py-2.5 bg-white dark:bg-surface-container-low border border-surface-variant rounded-xl dark:text-on-surface text-sm outline-none focus:border-primary transition-all"
        />
        <input
          type="text"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          placeholder="Marka *"
          required
          className="px-3 py-2.5 bg-white dark:bg-surface-container-low border border-surface-variant rounded-xl dark:text-on-surface text-sm outline-none focus:border-primary transition-all"
        />
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Fiyat *"
          required
          className="px-3 py-2.5 bg-white dark:bg-surface-container-low border border-surface-variant rounded-xl dark:text-on-surface text-sm outline-none focus:border-primary transition-all"
        />
        <input
          type="number"
          value={originalPrice}
          onChange={(e) => setOriginalPrice(e.target.value)}
          placeholder="Orijinal Fiyat (isteğe bağlı)"
          className="px-3 py-2.5 bg-white dark:bg-surface-container-low border border-surface-variant rounded-xl dark:text-on-surface text-sm outline-none focus:border-primary transition-all"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Product["category"])}
          className="px-3 py-2.5 bg-white dark:bg-surface-container-low border border-surface-variant rounded-xl dark:text-on-surface text-sm outline-none focus:border-primary transition-all"
        >
          <option value="iphones">iPhones</option>
          <option value="samsung">Samsung</option>
          <option value="laptops">Laptops</option>
          <option value="tablets">Tablets</option>
          <option value="watches">Watches</option>
          <option value="audio">Audio</option>
          <option value="accessories">Accessories</option>
        </select>
        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value as Product["condition"])}
          className="px-3 py-2.5 bg-white dark:bg-surface-container-low border border-surface-variant rounded-xl dark:text-on-surface text-sm outline-none focus:border-primary transition-all"
        >
          <option value="New">New</option>
          <option value="Like New">Like New</option>
          <option value="Certified Refurbished">Certified Refurbished</option>
        </select>
      </div>
      <input
        type="url"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="Görsel URL (isteğe bağlı)"
        className="w-full px-3 py-2.5 bg-white dark:bg-surface-container-low border border-surface-variant rounded-xl dark:text-on-surface text-sm outline-none focus:border-primary transition-all"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Açıklama"
        rows={2}
        className="w-full px-3 py-2.5 bg-white dark:bg-surface-container-low border border-surface-variant rounded-xl dark:text-on-surface text-sm outline-none focus:border-primary transition-all resize-none"
      />
      <button
        type="submit"
        className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl text-sm flex items-center gap-2 hover:bg-on-primary-fixed-variant transition-all"
      >
        <span className="material-symbols-outlined text-[18px]">check</span>
        Ürün Ekle
      </button>
    </form>
  );
}

/* ============ EDIT PRODUCT FORM ============ */
function EditProductForm({
  product,
  onSave,
  onCancel,
}: {
  product: Product;
  onSave: (product: Product) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price.toString());
  const [description, setDescription] = useState(product.description);

  return (
    <div className="space-y-3">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-3 py-2 bg-surface-container-low border border-surface-variant rounded-xl text-sm outline-none focus:border-primary transition-all"
      />
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-full px-3 py-2 bg-surface-container-low border border-surface-variant rounded-xl text-sm outline-none focus:border-primary transition-all"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
        className="w-full px-3 py-2 bg-surface-container-low border border-surface-variant rounded-xl text-sm outline-none focus:border-primary transition-all resize-none"
      />
      <div className="flex gap-2">
        <button
          onClick={() =>
            onSave({ ...product, name, price: Number(price), description })
          }
          className="px-4 py-2 bg-primary text-white font-bold rounded-xl text-xs flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[16px]">check</span>
          Kaydet
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-surface-container-low text-on-surface-variant font-bold rounded-xl text-xs"
        >
          İptal
        </button>
      </div>
    </div>
  );
}

/* ============ ADMIN SITE SETTINGS ============ */
function AdminSiteSettings() {
  const adminStore = useAdminStore();
  const { siteSettings } = adminStore;
  const [siteName, setSiteName] = useState(siteSettings.siteName);
  const [promoText, setPromoText] = useState(siteSettings.promoText);
  const [primaryColor, setPrimaryColor] = useState(siteSettings.primaryColor);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSiteName(siteSettings.siteName);
    setPromoText(siteSettings.promoText);
    setPrimaryColor(siteSettings.primaryColor);
  }, [siteSettings]);

  const handleSave = async () => {
    await adminStore.updateSiteSettings({ siteName, promoText, primaryColor });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-lg space-y-5">
      <h3 className="font-bold text-sm flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-tertiary text-[18px]">settings</span>
        Site Yapılandırması
      </h3>

      <div>
        <label className="text-sm font-bold text-on-surface mb-1.5 block">Site Adı</label>
        <input
          type="text"
          value={siteName}
          onChange={(e) => setSiteName(e.target.value)}
          className="w-full px-4 py-3 bg-surface-container-low/50 border border-surface-variant rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
        />
      </div>

      <div>
        <label className="text-sm font-bold text-on-surface mb-1.5 block">Promosyon Banner Metni</label>
        <textarea
          value={promoText}
          onChange={(e) => setPromoText(e.target.value)}
          rows={2}
          className="w-full px-4 py-3 bg-surface-container-low/50 border border-surface-variant rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none"
        />
      </div>

      <div>
        <label className="text-sm font-bold text-on-surface mb-1.5 block">Ana Renk</label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={primaryColor}
            onChange={(e) => setPrimaryColor(e.target.value)}
            className="w-12 h-12 rounded-xl border border-surface-variant cursor-pointer"
          />
          <input
            type="text"
            value={primaryColor}
            onChange={(e) => setPrimaryColor(e.target.value)}
            className="flex-1 px-4 py-3 bg-surface-container-low/50 border border-surface-variant rounded-xl text-sm outline-none focus:border-primary transition-all font-mono"
          />
        </div>
      </div>

      <div className="bg-surface-container-low/50 rounded-xl p-4 border border-surface-variant">
        <p className="text-xs font-bold text-on-surface-variant mb-2">Hızlı İstatistikler</p>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <p className="text-2xl font-extrabold text-primary">{adminStore.products.length}</p>
            <p className="text-[10px] text-on-surface-variant font-bold">Ürünler</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-extrabold text-secondary">0</p>
            <p className="text-[10px] text-on-surface-variant font-bold">Bugünkü Siparişler</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-extrabold text-tertiary">₺0</p>
            <p className="text-[10px] text-on-surface-variant font-bold">Gelir</p>
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        className={`px-8 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
          saved
            ? "bg-primary-container text-on-primary-container"
            : "bg-tertiary text-white hover:bg-tertiary/90 shadow-lg shadow-tertiary/20"
        }`}
      >
        <span className="material-symbols-outlined text-[18px]">
          {saved ? "check_circle" : "save"}
        </span>
        {saved ? "Ayarlar Kaydedildi!" : "Ayarları Kaydet"}
      </button>
    </div>
  );
}
