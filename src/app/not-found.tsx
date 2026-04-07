import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-screen-md mx-auto px-6 py-20 text-center">
      <span className="material-symbols-outlined text-8xl text-on-surface-variant/20 mb-6 block">
        explore_off
      </span>
      <h1 className="text-5xl font-extrabold font-[family-name:var(--font-headline)] mb-4">404</h1>
      <h2 className="text-xl font-bold mb-3">Page Not Found</h2>
      <p className="text-on-surface-variant mb-8 max-w-md mx-auto">
        The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/"
          className="px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-on-primary-fixed-variant transition-colors shadow-lg shadow-primary/20"
        >
          Go Home
        </Link>
        <Link
          href="/products"
          className="px-8 py-4 font-bold rounded-xl border border-surface-variant hover:bg-surface-container-low transition-colors"
        >
          Browse Products
        </Link>
      </div>
    </div>
  );
}
