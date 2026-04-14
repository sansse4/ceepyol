"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/types/product";
import { useCartStore } from "@/lib/store/cart";
import { useTranslation } from "@/lib/i18n/useTranslation";
import Link from "next/link";
import CountdownTimer from "@/components/ui/CountdownTimer";

const formatPrice = (n: number) =>
  String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export default function ProductPageClient({ product }: { product: Product }) {
  const { t } = useTranslation();
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);

  const [selectedColor, setSelectedColor] = useState(product.colors[0] || null);
  const [selectedStorage, setSelectedStorage] = useState(
    product.storage?.[0]?.label || ""
  );
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Derive active image: if selected color has its own image, show that; else use gallery
  const colorImage = selectedColor?.image || null;
  const galleryImages = product.images;
  const activeImage = colorImage
    ? { src: colorImage, alt: `${product.name} - ${selectedColor?.name}` }
    : galleryImages[activeImageIndex] || galleryImages[0];

  const storageAdd =
    product.storage?.find((s) => s.label === selectedStorage)?.priceAdd || 0;
  const totalPrice = product.price + storageAdd;

  function handleColorSelect(color: (typeof product.colors)[0]) {
    setSelectedColor(color);
    setActiveImageIndex(0);
  }

  function handleAddToCart() {
    setAdding(true);
    addItem({
      productId: product.id,
      quantity,
      selectedColor: selectedColor?.name || "",
      selectedStorage,
      unitPrice: totalPrice,
      productName: product.name,
      productImage: activeImage.src,
      productSlug: product.slug,
    });
    setTimeout(() => router.push("/cart"), 600);
  }

  function handleBuyNow() {
    setBuyingNow(true);
    addItem({
      productId: product.id,
      quantity,
      selectedColor: selectedColor?.name || "",
      selectedStorage,
      unitPrice: totalPrice,
      productName: product.name,
      productImage: activeImage.src,
      productSlug: product.slug,
    });
    setTimeout(() => router.push("/checkout"), 300);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-16">
      {/* LEFT: Image Gallery */}
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative bg-[#f5f5f7] dark:bg-[#1a1a1a] rounded-3xl overflow-hidden aspect-square flex items-center justify-center group">
          <Image
            key={activeImage.src}
            src={activeImage.src}
            alt={activeImage.alt}
            width={600}
            height={600}
            className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-500"
            unoptimized
            priority
          />
          {/* Zoom hint */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="w-8 h-8 bg-black/20 dark:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[16px]">zoom_in</span>
            </div>
          </div>
        </div>

        {/* Gallery Thumbnails */}
        {galleryImages.length > 1 && !colorImage && (
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
            {galleryImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImageIndex(i)}
                className={`shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-200 bg-[#f5f5f7] dark:bg-[#1a1a1a] flex items-center justify-center ${
                  i === activeImageIndex
                    ? "border-primary shadow-md shadow-primary/20"
                    : "border-transparent hover:border-outline-variant"
                }`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={80}
                  height={80}
                  className="w-16 h-16 object-contain"
                  unoptimized
                />
              </button>
            ))}
          </div>
        )}

        {/* Color image thumbnails */}
        {colorImage && galleryImages.length > 1 && (
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
            {galleryImages.map((img, i) => (
              <button
                key={i}
                onClick={() => {
                  setSelectedColor({ ...selectedColor!, image: undefined });
                  setActiveImageIndex(i);
                }}
                className="shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 border-transparent hover:border-outline-variant transition-all duration-200 bg-[#f5f5f7] dark:bg-[#1a1a1a] flex items-center justify-center"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={80}
                  height={80}
                  className="w-16 h-16 object-contain"
                  unoptimized
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT: Product Info */}
      <div className="space-y-6">
        {/* Header */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
            {product.brand}
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mt-1 text-on-surface">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className="material-symbols-outlined text-[16px] text-amber-400"
                  style={{
                    fontVariationSettings: `'FILL' ${product.rating >= star ? 1 : 0}`,
                  }}
                >
                  star
                </span>
              ))}
            </div>
            <span className="text-sm font-semibold">{product.rating}</span>
            <span className="text-sm text-on-surface-variant">
              ({formatPrice(product.reviewCount)} reviews)
            </span>
            <span className="inline-block bg-on-surface/8 text-on-surface text-[10px] uppercase font-bold px-2.5 py-1 rounded-full">
              {product.condition}
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="bg-gradient-to-br from-surface-container-low to-surface-container rounded-2xl p-5">
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="text-3xl font-bold text-on-surface">
              ₺{formatPrice(totalPrice)}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-lg text-on-surface-variant line-through">
                  ₺{formatPrice(product.originalPrice)}
                </span>
                <span className="text-sm font-bold text-white bg-green-600 px-2.5 py-0.5 rounded-full">
                  -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </span>
              </>
            )}
          </div>
          {product.originalPrice && (
            <p className="text-sm font-semibold text-green-600 dark:text-green-400 mt-1.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>savings</span>
              ₺{formatPrice(product.originalPrice - product.price)} tasarruf
            </p>
          )}
          {product.monthlyPrice && (
            <p className="text-sm text-on-surface-variant mt-1">
              veya 18 ay ×{" "}
              <span className="font-semibold">₺{product.monthlyPrice}/ay</span>
            </p>
          )}
          <div className="mt-3">
            <CountdownTimer variant="product" />
          </div>
        </div>

        {/* Description */}
        <p className="text-on-surface-variant leading-relaxed text-sm">
          {product.description}
        </p>

        {/* Badges */}
        {product.badges.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {product.badges.map((badge) => (
              <span
                key={badge}
                className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full border border-primary/20"
              >
                {badge}
              </span>
            ))}
          </div>
        )}

        {/* Color Selector */}
        {product.colors.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold">Renk</span>
              <span className="text-sm font-medium text-on-surface-variant transition-all duration-300">
                {selectedColor?.name}
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => handleColorSelect(color)}
                  title={color.name}
                  className={`relative transition-all duration-200 ${
                    selectedColor?.name === color.name
                      ? "scale-110"
                      : "hover:scale-110"
                  }`}
                >
                  {/* Color circle */}
                  <div
                    className={`w-10 h-10 rounded-full border-2 transition-all duration-200 shadow-sm ${
                      selectedColor?.name === color.name
                        ? "border-primary ring-2 ring-primary/30 shadow-lg"
                        : "border-outline-variant/40 hover:border-outline-variant"
                    }`}
                    style={{ backgroundColor: color.hex }}
                  >
                    {selectedColor?.name === color.name && (
                      <span
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <span
                          className="material-symbols-outlined text-[14px] drop-shadow"
                          style={{
                            color:
                              parseInt(color.hex.slice(1), 16) > 0x888888
                                ? "#000"
                                : "#fff",
                          }}
                        >
                          check
                        </span>
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Storage Selector */}
        {product.storage && product.storage.length > 0 && (
          <div>
            <span className="text-sm font-semibold block mb-3">Depolama</span>
            <div className="flex flex-wrap gap-2">
              {product.storage.map((option) => (
                <button
                  key={option.label}
                  onClick={() => setSelectedStorage(option.label)}
                  className={`px-5 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all duration-200 ${
                    selectedStorage === option.label
                      ? "border-primary bg-primary/8 text-primary shadow-sm"
                      : "border-outline-variant/50 bg-surface hover:border-outline-variant hover:shadow-sm"
                  }`}
                >
                  {option.label}
                  {option.priceAdd > 0 && (
                    <span className="text-on-surface-variant text-xs ml-1.5">
                      +₺{formatPrice(option.priceAdd)}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold">Adet</span>
          <div className="flex items-center bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant/30">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-11 h-11 flex items-center justify-center hover:bg-surface-container transition-colors active:scale-90"
            >
              <span className="material-symbols-outlined text-[20px]">remove</span>
            </button>
            <span className="w-12 text-center font-bold tabular-nums">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-11 h-11 flex items-center justify-center hover:bg-surface-container transition-colors active:scale-90"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
            </button>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleAddToCart}
            disabled={adding}
            className={`w-full py-4 rounded-2xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-2 ${
              adding
                ? "bg-green-600 text-white scale-[0.98]"
                : "bg-primary text-white hover:bg-on-primary-fixed-variant shadow-lg shadow-primary/25 hover:-translate-y-0.5 active:scale-[0.97]"
            }`}
          >
            <span
              className={`material-symbols-outlined text-[20px] ${adding ? "" : ""}`}
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {adding ? "check_circle" : "shopping_bag"}
            </span>
            {adding ? "Eklendi! Sepete gidiliyor..." : "Sepete Ekle"}
          </button>

          <button
            onClick={handleBuyNow}
            disabled={buyingNow}
            className={`w-full py-4 rounded-2xl font-bold text-base border-2 border-primary transition-all duration-300 flex items-center justify-center gap-2 ${
              buyingNow
                ? "bg-primary/10 text-primary scale-[0.98]"
                : "text-primary hover:bg-primary hover:text-white active:scale-[0.97]"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">bolt</span>
            {buyingNow ? "Yönlendiriliyor..." : "Hemen Satın Al"}
          </button>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-outline-variant/30">
          {[
            { icon: "local_shipping", title: "Ücretsiz Kargo", sub: "Tüm siparişlerde" },
            { icon: "verified_user", title: "12 Ay Garanti", sub: "Resmi garanti" },
            { icon: "autorenew", title: "30 Gün İade", sub: "Kolay iade" },
          ].map((b) => (
            <div
              key={b.title}
              className="flex flex-col items-center gap-1.5 text-center py-3 px-2 rounded-2xl bg-surface-container-low/50 group hover:bg-surface-container transition-colors duration-200"
            >
              <span
                className="material-symbols-outlined text-[22px] text-primary group-hover:scale-110 transition-transform duration-200"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {b.icon}
              </span>
              <span className="text-[11px] font-bold text-on-surface leading-tight">{b.title}</span>
              <span className="text-[9px] text-on-surface-variant">{b.sub}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
