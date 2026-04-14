"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/types/product";
import { useCartStore } from "@/lib/store/cart";

export default function ProductOptions({ product }: { product: Product }) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || "");
  const [selectedStorage, setSelectedStorage] = useState(product.storage?.[0]?.label || "");
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();

  const storageAdd = product.storage?.find((s) => s.label === selectedStorage)?.priceAdd || 0;
  const totalPrice = product.price + storageAdd;

  function handleAddToCart() {
    setAdding(true);
    addItem({
      productId: product.id,
      quantity,
      selectedColor,
      selectedStorage,
      unitPrice: totalPrice,
      productName: product.name,
      productImage: product.images[0]?.src || "",
      productSlug: product.slug,
    });
    setTimeout(() => {
      router.push("/cart");
    }, 600);
  }

  function handleBuyNow() {
    setBuyingNow(true);
    addItem({
      productId: product.id,
      quantity,
      selectedColor,
      selectedStorage,
      unitPrice: totalPrice,
      productName: product.name,
      productImage: product.images[0]?.src || "",
      productSlug: product.slug,
    });
    setTimeout(() => {
      router.push("/checkout");
    }, 300);
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Price */}
      <div className="bg-surface-container-low/50 rounded-2xl p-5 transition-all duration-300 hover:shadow-sm">
        <div className="flex items-baseline gap-3">
          <span className="text-2xl sm:text-3xl font-extrabold text-on-surface">₺{totalPrice.toLocaleString('en-US')}</span>
          {product.originalPrice && (
            <span className="text-lg text-on-surface-variant line-through">
              ₺{product.originalPrice.toLocaleString('en-US')}
            </span>
          )}
          {product.originalPrice && (
            <span className="text-sm font-bold text-white bg-tertiary px-2.5 py-0.5 rounded-lg animate-pulse-subtle">
              -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </span>
          )}
        </div>
        {product.originalPrice && (
          <p className="text-sm font-bold text-primary mt-1.5 flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>savings</span>
            ₺{(product.originalPrice - product.price).toLocaleString('en-US')} tasarruf edin
          </p>
        )}
        {product.monthlyPrice && (
          <p className="text-sm text-on-surface-variant mt-1">
            veya 18 ay x <span className="font-semibold">₺{product.monthlyPrice}/ay</span>
          </p>
        )}
      </div>

      {/* Colors */}
      {product.colors.length > 0 && (
        <div>
          <label className="text-sm font-bold mb-3 block">
            Renk: <span className="font-normal text-on-surface-variant transition-all duration-300">{selectedColor}</span>
          </label>
          <div className="flex gap-3">
            {product.colors.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color.name)}
                title={color.name}
                className={`w-11 h-11 rounded-full transition-all duration-300 relative ${
                  selectedColor === color.name
                    ? "ring-2 ring-primary ring-offset-2 scale-110 shadow-lg"
                    : "ring-1 ring-outline-variant/40 hover:scale-110 hover:ring-outline-variant hover:shadow-md"
                }`}
                style={{ backgroundColor: color.hex }}
              >
                {selectedColor === color.name && (
                  <span className="absolute inset-0 flex items-center justify-center animate-scale-in">
                    <span
                      className="material-symbols-outlined text-[16px] drop-shadow-md"
                      style={{
                        color: parseInt(color.hex.slice(1), 16) > 0x888888 ? "#000" : "#fff",
                      }}
                    >
                      check
                    </span>
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Storage */}
      {product.storage && product.storage.length > 0 && (
        <div>
          <label className="text-sm font-bold mb-3 block">Depolama</label>
          <div className="flex flex-wrap gap-2">
            {product.storage.map((option) => (
              <button
                key={option.label}
                onClick={() => setSelectedStorage(option.label)}
                className={`px-5 py-3 rounded-xl border-2 text-sm font-semibold transition-all duration-300 ${
                  selectedStorage === option.label
                    ? "border-primary bg-primary/5 text-primary shadow-md shadow-primary/10 scale-105"
                    : "border-surface-variant hover:border-outline-variant bg-white dark:bg-surface-container-low hover:shadow-sm hover:scale-[1.02]"
                }`}
              >
                {option.label}
                {option.priceAdd > 0 && (
                  <span className="text-on-surface-variant text-xs ml-1.5">+₺{Math.round(option.priceAdd * 34)}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div>
        <label className="text-sm font-bold mb-3 block">Adet</label>
        <div className="flex items-center bg-surface-container-low rounded-xl w-fit overflow-hidden">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-11 h-11 flex items-center justify-center hover:bg-surface-container transition-all duration-200 active:scale-90"
          >
            <span className="material-symbols-outlined text-[20px]">remove</span>
          </button>
          <span className="w-12 text-center font-bold text-base tabular-nums">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-11 h-11 flex items-center justify-center hover:bg-surface-container transition-all duration-200 active:scale-90"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={adding}
          className={`w-full py-4 rounded-2xl font-bold text-base transition-all duration-400 flex items-center justify-center gap-2 ${
            adding
              ? "bg-primary-container text-on-primary-container scale-[0.98]"
              : "bg-primary text-white hover:bg-on-primary-fixed-variant shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:scale-[0.97] active:translate-y-0"
          }`}
        >
          <span
            className={`material-symbols-outlined text-[20px] transition-all duration-300 ${
              adding ? "animate-spin-once" : ""
            }`}
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {adding ? "check_circle" : "shopping_bag"}
          </span>
          {adding ? "Eklendi! Sepete gidiliyor..." : "Sepete Ekle"}
        </button>

        {/* Buy Now */}
        <button
          onClick={handleBuyNow}
          disabled={buyingNow}
          className={`w-full py-4 rounded-2xl font-bold text-base border-2 border-primary transition-all duration-300 flex items-center justify-center gap-2 ${
            buyingNow
              ? "bg-primary/10 text-primary scale-[0.98]"
              : "text-primary hover:bg-primary hover:text-white active:scale-[0.97]"
          }`}
        >
          <span className={`material-symbols-outlined text-[20px] transition-transform duration-300 ${buyingNow ? "" : "group-hover:scale-110"}`}>
            bolt
          </span>
          {buyingNow ? "Yönlendiriliyor..." : "Hemen Satın Al"}
        </button>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-surface-variant/60">
        {[
          { icon: "local_shipping", text: "Ücretsiz Kargo" },
          { icon: "verified", text: "12 Ay Garanti" },
          { icon: "lock", text: "30 Gün İade" },
        ].map((badge) => (
          <div
            key={badge.text}
            className="flex flex-col items-center gap-1.5 text-center py-2 group cursor-default transition-all duration-300 hover:-translate-y-1"
          >
            <span
              className="material-symbols-outlined text-[20px] text-primary transition-all duration-300 group-hover:scale-125"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {badge.icon}
            </span>
            <span className="text-[10px] font-bold text-on-surface-variant leading-tight">{badge.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
