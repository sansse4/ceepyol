"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const params = useSearchParams();
  const orderNumber = params.get("order") || `TB-${Date.now().toString(36).toUpperCase()}`;
  const isQrProof = params.get("proof") === "1";

  return (
    <div className="max-w-screen-md mx-auto px-6 py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
        <span
          className="material-symbols-outlined text-5xl text-primary"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          check_circle
        </span>
      </div>

      <h1 className="text-3xl font-extrabold font-[family-name:var(--font-headline)] mb-3">
        {isQrProof ? "Siparişiniz Alındı!" : "Siparişiniz Onaylandı!"}
      </h1>

      <p className="text-on-surface-variant text-lg mb-2">
        {isQrProof
          ? "Siparişiniz için teşekkür ederiz. Ödeme kanıtınız başarıyla alındı."
          : "Satın aldığınız için teşekkür ederiz. Siparişiniz başarıyla oluşturuldu."}
      </p>

      <p className="text-sm text-on-surface-variant mb-6">
        Sipariş numaranız:{" "}
        <span className="font-bold text-on-surface">{orderNumber}</span>
      </p>

      {/* QR proof notice */}
      {isQrProof && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-5 mb-6 text-left">
          <div className="flex items-start gap-3">
            <span
              className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-[22px] shrink-0 mt-0.5"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              schedule
            </span>
            <div>
              <p className="font-bold text-amber-800 dark:text-amber-300 mb-1">
                Ödeme Doğrulanması Bekleniyor
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-400 leading-relaxed">
                Siparişiniz alındı. Ödemeniz 24 saat içinde doğrulanacak ve sizinle iletişime geçilecektir.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-surface-container rounded-2xl p-8 shadow-sm border border-surface-variant mb-8 text-left">
        <h3 className="font-bold mb-4">Bundan Sonra Ne Olacak?</h3>
        <div className="space-y-4">
          {(isQrProof
            ? [
                { icon: "verified", title: "Ödeme Doğrulama", desc: "Ekibimiz yüklenen ödeme kanıtını 24 saat içinde inceleyecektir." },
                { icon: "inventory_2", title: "Sipariş Hazırlığı", desc: "Onay sonrasında cihazınız özenle hazırlanacaktır." },
                { icon: "local_shipping", title: "Kargo", desc: "Siparişiniz 1-2 iş günü içinde takip numarası ile kargoya verilecektir." },
              ]
            : [
                { icon: "mail", title: "Onay E-postası", desc: "Sipariş detaylarınızı içeren bir e-posta alacaksınız." },
                { icon: "inventory_2", title: "Hazırlık", desc: "Cihazınızı özenle kontrol edip hazırlayacağız." },
                { icon: "local_shipping", title: "Kargo", desc: "Siparişiniz 1-2 iş günü içinde takip numarası ile kargoya verilecek." },
              ]
          ).map((step) => (
            <div key={step.title} className="flex gap-4">
              <span className="material-symbols-outlined text-primary shrink-0">{step.icon}</span>
              <div>
                <p className="font-bold text-sm">{step.title}</p>
                <p className="text-sm text-on-surface-variant">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/products"
          className="px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-on-primary-fixed-variant transition-colors shadow-lg shadow-primary/20"
        >
          Alışverişe Devam Et
        </Link>
        <Link
          href="/"
          className="px-8 py-4 font-bold rounded-xl border border-surface-variant hover:bg-surface-container-low transition-colors"
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-screen-md mx-auto px-6 py-20 text-center">
          <div className="animate-shimmer h-20 w-20 rounded-full mx-auto mb-6" />
          <div className="animate-shimmer h-8 w-64 rounded-lg mx-auto mb-4" />
          <div className="animate-shimmer h-4 w-48 rounded mx-auto" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
