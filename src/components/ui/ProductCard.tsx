"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Product } from "@/lib/types/product";
import { useCartStore } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const wishlistItems = useWishlistStore((s) => s.items);
  const toggleItem = useWishlistStore((s) => s.toggleItem);
  const router = useRouter();
  const wishlisted = wishlistItems.includes(product.id);
  const [isAdding, setIsAdding] = useState(false);
  const [wishlistPop, setWishlistPop] = useState(false);

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    const storageAdd = product.storage?.[0]?.priceAdd || 0;
    addItem({
      productId: product.id,
      quantity: 1,
      selectedColor: product.colors[0]?.name,
      selectedStorage: product.storage?.[0]?.label,
      unitPrice: product.price + storageAdd,
      productName: product.name,
      productImage: product.images[0]?.src || "",
      productSlug: product.slug,
    });
    setTimeout(() => {
      router.push("/cart");
    }, 600);
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setWishlistPop(true);
    toggleItem(product.id);
    setTimeout(() => setWishlistPop(false), 400);
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="min-w-[260px] bg-surface-container-lowest dark:bg-surface-container-low rounded-2xl p-4 shadow-sm border border-surface-variant/60 group snap-start relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/8 hover:-translate-y-2 hover:border-primary/20"
    >
      {/* Hover glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

      {/* Discount Badge */}
      {discount > 0 && (
        <span className="absolute top-3 left-3 bg-tertiary text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg z-10 shadow-lg shadow-tertiary/30 animate-pulse-subtle">
          -{discount}%
        </span>
      )}

      {/* Wishlist Button */}
      <button
        onClick={handleWishlist}
        className={`absolute top-3 right-3 w-9 h-9 bg-surface-container-lowest/90 dark:bg-surface-container/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md z-10 transition-all duration-300 active:scale-75 ${
          wishlistPop ? "scale-125" : "hover:scale-110 hover:shadow-lg"
        }`}
      >
        <span
          className={`material-symbols-outlined text-[20px] transition-all duration-300 ${
            wishlisted ? "text-tertiary scale-110" : "text-on-surface-variant/40 group-hover:text-tertiary/60"
          } ${wishlistPop ? "animate-heartbeat" : ""}`}
          style={wishlisted ? { fontVariationSettings: "'FILL' 1" } : undefined}
        >
          favorite
        </span>
      </button>

      <div className="relative bg-surface-container-low/50 rounded-xl overflow-hidden aspect-square mb-4 flex items-center justify-center">
        <span className="absolute top-2 left-2 bg-inverse-surface text-inverse-on-surface text-[9px] uppercase font-bold px-2 py-1 rounded-lg z-10 tracking-wider">
          {product.condition}
        </span>
        <Image
          alt={product.images[0]?.alt || product.name}
          className="w-full h-full p-4 transition-all duration-700 ease-out object-contain group-hover:scale-[1.15] group-hover:rotate-2"
          src={product.images[0]?.src || ""}
          width={300}
          height={300}
          unoptimized
        />

        {/* Quick Add Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-400 flex items-end justify-center p-3 backdrop-blur-[1px]">
          <button
            onClick={handleQuickAdd}
            disabled={isAdding}
            className={`w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg transition-all duration-300 transform translate-y-0 sm:translate-y-4 sm:group-hover:translate-y-0 ${
              isAdding
                ? "bg-primary text-white scale-95"
                : "bg-surface-container-lowest dark:bg-surface-container text-primary hover:bg-primary hover:text-white active:scale-95"
            }`}
          >
            <span
              className={`material-symbols-outlined text-[18px] transition-transform duration-300 ${
                isAdding ? "animate-spin-once" : ""
              }`}
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {isAdding ? "check_circle" : "shopping_bag"}
            </span>
            {isAdding ? "Eklendi!" : "Sepete Ekle"}
          </button>
        </div>
      </div>

      <div className="text-[10px] text-on-surface-variant font-bold mb-1 uppercase tracking-widest transition-all duration-300 group-hover:text-primary/60 group-hover:tracking-[0.2em]">
        {product.brand}
      </div>
      <h3 className="font-bold text-[15px] mb-1.5 line-clamp-1 transition-colors duration-300 group-hover:text-primary">
        {product.name}
      </h3>
      <div className="flex items-center gap-1 mb-1 text-xs">
        <span
          className="material-symbols-outlined text-amber-400 text-sm"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          star
        </span>
        <span className="font-bold">{product.rating}</span>
        <span className="text-on-surface-variant">({product.reviewCount.toLocaleString('en-US')})</span>
      </div>
      {product.buyerCount && product.buyerCount > 0 && (
        <div className="flex items-center gap-1 mb-2.5 text-[10px] text-on-surface-variant">
          <span className="material-symbols-outlined text-[12px]">shopping_cart</span>
          <span className="font-semibold">{product.buyerCount.toLocaleString('en-US')} satın aldı</span>
        </div>
      )}
      <div className="flex items-baseline gap-2">
        <span className="text-on-surface font-extrabold text-lg transition-all duration-300 group-hover:text-primary">
          ₺{product.price.toLocaleString('en-US')}
        </span>
        {product.originalPrice && (
          <span className="text-on-surface-variant text-xs line-through">
            ₺{product.originalPrice.toLocaleString('en-US')}
          </span>
        )}
      </div>

      {/* Color dots preview */}
      {product.colors.length > 1 && (
        <div className="flex gap-1.5 mt-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-500 translate-y-0 sm:translate-y-2 sm:group-hover:translate-y-0">
          {product.colors.slice(0, 4).map((color) => (
            <span
              key={color.name}
              className="w-4 h-4 rounded-full ring-1 ring-black/10 transition-transform hover:scale-125"
              style={{ backgroundColor: color.hex }}
              title={color.name}
            />
          ))}
          {product.colors.length > 4 && (
            <span className="text-[10px] text-on-surface-variant font-semibold self-center">
              +{product.colors.length - 4}
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
