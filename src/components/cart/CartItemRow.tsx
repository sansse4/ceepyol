"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CartItem } from "@/lib/types/product";
import { useCartStore } from "@/lib/store/cart";

export default function CartItemRow({ item }: { item: CartItem }) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const [isRemoving, setIsRemoving] = useState(false);

  const lineTotal = item.unitPrice * item.quantity;

  function handleRemove() {
    setIsRemoving(true);
    setTimeout(() => {
      removeItem(item.productId, item.selectedColor, item.selectedStorage);
    }, 300);
  }

  return (
    <div
      className={`bg-white dark:bg-surface-container rounded-2xl p-4 sm:p-6 shadow-sm border border-surface-variant flex gap-3 sm:gap-6 transition-all duration-300 hover:shadow-md hover:border-primary/10 ${
        isRemoving ? "opacity-0 scale-95 -translate-x-4" : "opacity-100 scale-100 translate-x-0"
      }`}
    >
      {/* Image */}
      <Link
        href={`/products/${item.productSlug}`}
        className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 bg-surface-container-low rounded-xl flex items-center justify-center overflow-hidden group"
      >
        <Image
          src={item.productImage || ""}
          alt={item.productName}
          width={80}
          height={80}
          className="w-16 object-contain transition-transform duration-500 group-hover:scale-110"
          unoptimized
        />
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-4">
          <div>
            <Link
              href={`/products/${item.productSlug}`}
              className="font-bold text-base hover:text-primary transition-colors duration-200 line-clamp-1"
            >
              {item.productName}
            </Link>
            <div className="text-xs text-on-surface-variant mt-1 space-x-3">
              {item.selectedColor && (
                <span className="inline-flex items-center gap-1">
                  {item.selectedColor}
                </span>
              )}
              {item.selectedStorage && <span>Depolama: {item.selectedStorage}</span>}
            </div>
          </div>
          <button
            onClick={handleRemove}
            className="p-1.5 hover:bg-error-container/30 rounded-lg transition-all duration-200 text-on-surface-variant hover:text-error shrink-0 hover:scale-110 active:scale-90"
          >
            <span className="material-symbols-outlined text-[20px]">delete</span>
          </button>
        </div>

        <div className="flex items-center justify-between mt-4">
          {/* Quantity */}
          <div className="flex items-center gap-1 bg-surface-container-low rounded-lg overflow-hidden">
            <button
              onClick={() =>
                updateQuantity(item.productId, item.quantity - 1, item.selectedColor, item.selectedStorage)
              }
              className="w-9 h-9 flex items-center justify-center hover:bg-surface-container rounded-l-lg transition-all duration-200 active:scale-90 active:bg-surface-container-high"
            >
              <span className="material-symbols-outlined text-[18px]">remove</span>
            </button>
            <span className="w-8 text-center text-sm font-bold tabular-nums">{item.quantity}</span>
            <button
              onClick={() =>
                updateQuantity(item.productId, item.quantity + 1, item.selectedColor, item.selectedStorage)
              }
              className="w-9 h-9 flex items-center justify-center hover:bg-surface-container rounded-r-lg transition-all duration-200 active:scale-90 active:bg-surface-container-high"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
            </button>
          </div>

          {/* Price */}
          <div className="text-right">
            <div className="font-bold text-lg tabular-nums">₺{lineTotal.toLocaleString('tr-TR')}</div>
            {item.quantity > 1 && (
              <div className="text-xs text-on-surface-variant">₺{item.unitPrice.toLocaleString('tr-TR')} / adet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
