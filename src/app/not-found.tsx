import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-screen-md mx-auto px-6 py-20 text-center">
      <span className="material-symbols-outlined text-8xl text-on-surface-variant/20 mb-6 block">
        explore_off
      </span>
      <h1 className="text-5xl font-extrabold font-[family-name:var(--font-headline)] mb-4">404</h1>
      <h2 className="text-xl font-bold mb-3">Sayfa Bulunamadı</h2>
      <p className="text-on-surface-variant mb-8 max-w-md mx-auto">
        Aradığınız sayfa mevcut değil veya taşınmış olabilir. Sizi doğru yola yönlendirelim.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/"
          className="px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-on-primary-fixed-variant transition-colors shadow-lg shadow-primary/20"
        >
          Ana Sayfaya Dön
        </Link>
        <Link
          href="/products"
          className="px-8 py-4 font-bold rounded-xl border border-surface-variant hover:bg-surface-container-low transition-colors"
        >
          Ürünlere Göz At
        </Link>
      </div>
    </div>
  );
}
