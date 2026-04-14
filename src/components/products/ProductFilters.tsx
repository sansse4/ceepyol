"use client";

import { useRouter, useSearchParams } from "next/navigation";

const categoryLabels: Record<string, string> = {
  iphones: "iPhone'lar",
  samsung: "Samsung",
  laptops: "Dizüstü",
  audio: "Ses",
  watches: "Saatler",
  tablets: "Tabletler",
  accessories: "Aksesuarlar",
  gaming: "Oyun",
  deals: "Fırsatlar",
};

const conditions = ["Yeni", "Yeni Gibi", "Sertifikalı Yenilenmiş"];
const sortOptions = [
  { value: "", label: "Varsayılan" },
  { value: "price-asc", label: "Fiyat: Düşükten Yükseğe" },
  { value: "price-desc", label: "Fiyat: Yüksekten Düşüğe" },
  { value: "rating", label: "En Yüksek Puan" },
];

export default function ProductFilters({
  categories,
  brands,
}: {
  categories: string[];
  brands: string[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "";
  const currentBrand = searchParams.get("brand") || "";
  const currentCondition = searchParams.get("condition") || "";
  const currentSort = searchParams.get("sort") || "";

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/products?${params.toString()}`);
  }

  function clearFilters() {
    router.push("/products");
  }

  const hasFilters = currentCategory || currentBrand || currentCondition || currentSort;

  return (
    <div className="space-y-6">
      {/* Sort - Mobile friendly */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2 block">
          Sırala
        </label>
        <select
          value={currentSort}
          onChange={(e) => updateFilter("sort", e.target.value)}
          className="w-full bg-surface-container-low rounded-xl py-2.5 px-4 text-sm border-none outline-none focus:ring-2 focus:ring-primary"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Category */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3 block">
          Kategori
        </label>
        <div className="space-y-2">
          <button
            onClick={() => updateFilter("category", "")}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              !currentCategory ? "bg-primary text-white font-bold" : "hover:bg-surface-container-low"
            }`}
          >
            Tüm Ürünler
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => updateFilter("category", cat)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                currentCategory === cat
                  ? "bg-primary text-white font-bold"
                  : "hover:bg-surface-container-low"
              }`}
            >
              {categoryLabels[cat] || cat}
            </button>
          ))}
        </div>
      </div>

      {/* Brand */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3 block">
          Marka
        </label>
        <div className="space-y-2">
          <button
            onClick={() => updateFilter("brand", "")}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              !currentBrand ? "bg-primary text-white font-bold" : "hover:bg-surface-container-low"
            }`}
          >
            Tüm Markalar
          </button>
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => updateFilter("brand", brand)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                currentBrand === brand
                  ? "bg-primary text-white font-bold"
                  : "hover:bg-surface-container-low"
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* Condition */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3 block">
          Durum
        </label>
        <div className="space-y-2">
          <button
            onClick={() => updateFilter("condition", "")}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              !currentCondition ? "bg-primary text-white font-bold" : "hover:bg-surface-container-low"
            }`}
          >
            Tüm Durumlar
          </button>
          {conditions.map((cond) => (
            <button
              key={cond}
              onClick={() => updateFilter("condition", cond)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                currentCondition === cond
                  ? "bg-primary text-white font-bold"
                  : "hover:bg-surface-container-low"
              }`}
            >
              {cond}
            </button>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {hasFilters && (
        <button
          onClick={clearFilters}
          className="w-full py-2.5 text-sm font-bold text-error hover:bg-error-container/30 rounded-xl transition-colors"
        >
          Tüm Filtreleri Temizle
        </button>
      )}
    </div>
  );
}
