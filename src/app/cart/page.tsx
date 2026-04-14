"use client";

import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import CartItemRow from "@/components/cart/CartItemRow";
import OrderSummary from "@/components/cart/OrderSummary";
import { useCartStore } from "@/lib/store/cart";
import { useEffect, useState } from "react";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="animate-shimmer h-8 w-48 rounded-lg mb-8" />
        <div className="animate-shimmer h-64 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <Breadcrumb items={[{ label: "Ana Sayfa", href: "/" }, { label: "Sepet" }]} />

      <h1 className="text-2xl sm:text-3xl font-extrabold font-[family-name:var(--font-headline)] mb-6 sm:mb-8">
        Alışveriş Sepeti
        {items.length > 0 && (
          <span className="text-on-surface-variant font-normal text-lg ml-3">
            ({items.length} ürün)
          </span>
        )}
      </h1>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-7xl text-on-surface-variant/20 mb-6 block">
            shopping_cart
          </span>
          <h2 className="text-2xl font-bold mb-3">Sepetiniz boş</h2>
          <p className="text-on-surface-variant mb-8">
            Henüz hiçbir ürün eklememişsiniz.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-on-primary-fixed-variant transition-colors shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined">storefront</span>
            Alışverişe Başla
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1 space-y-4">
            {items.map((item, i) => (
              <CartItemRow key={`${item.productId}-${item.selectedColor}-${item.selectedStorage}-${i}`} item={item} />
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:w-96 shrink-0">
            <div className="sticky top-[120px] sm:top-[180px]">
              <OrderSummary />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
