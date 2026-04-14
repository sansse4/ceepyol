"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/store/cart";
import { useMemo } from "react";

export default function OrderSummary() {
  const items = useCartStore((s) => s.items);

  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [items]
  );
  const shipping = subtotal >= 100 ? 0 : 9.99;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = subtotal + shipping + tax;

  return (
    <div className="bg-white dark:bg-surface-container rounded-2xl p-6 shadow-sm border border-surface-variant">
      <h3 className="font-bold text-lg mb-6">Sipariş Özeti</h3>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-on-surface-variant">Ara Toplam ({itemCount} ürün)</span>
          <span className="font-semibold">₺{subtotal.toLocaleString('en-US')}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-on-surface-variant">Kargo</span>
          <span className={`font-semibold ${shipping === 0 ? "text-primary" : ""}`}>
            {shipping === 0 ? "ÜCRETSİZ" : `₺${shipping}`}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-on-surface-variant">Tahmini Vergi</span>
          <span className="font-semibold">₺{tax.toFixed(2)}</span>
        </div>

        {shipping > 0 && (
          <p className="text-xs text-primary bg-primary-fixed/10 px-3 py-2 rounded-lg">
            Ücretsiz kargo için ₺{(100 - subtotal).toFixed(2)} daha ekleyin!
          </p>
        )}

        <div className="border-t border-surface-variant pt-3 mt-3">
          <div className="flex justify-between text-lg font-bold">
            <span>Toplam</span>
            <span>₺{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <Link
        href="/checkout"
        className="w-full mt-6 py-4 bg-primary text-white font-bold rounded-xl hover:bg-on-primary-fixed-variant transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2 block text-center"
      >
        <span className="material-symbols-outlined">lock</span>
        Ödemeye Geç
      </Link>

      <Link
        href="/products"
        className="w-full mt-3 py-3 text-sm font-semibold text-primary hover:bg-surface-container-low rounded-xl transition-colors block text-center"
      >
        Alışverişe Devam Et
      </Link>
    </div>
  );
}
