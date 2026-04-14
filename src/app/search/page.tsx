import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ProductCard from "@/components/ui/ProductCard";
import { searchProducts } from "@/lib/data/products-db";

export const metadata = {
  title: "Arama",
  description: "ceepyol'da premium teknoloji ürünlerini arayın.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const query = params.q || "";
  const results = query ? await searchProducts(query) : [];

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <Breadcrumb items={[{ label: "Ana Sayfa", href: "/" }, { label: "Arama" }]} />

      <h1 className="text-3xl font-extrabold font-[family-name:var(--font-headline)] mb-2">
        {query ? `"${query}" için sonuçlar` : "Ürün Ara"}
      </h1>
      {query && (
        <p className="text-on-surface-variant mb-8">
          {results.length} ürün bulundu
        </p>
      )}

      {query && results.length === 0 ? (
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-6xl text-on-surface-variant/20 mb-4 block">
            search_off
          </span>
          <h2 className="text-xl font-bold mb-2">Sonuç bulunamadı</h2>
          <p className="text-on-surface-variant mb-6">
            &quot;{query}&quot; ile eşleşen bir şey bulamadık. Farklı bir arama terimi deneyin.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {["iPhone", "MacBook", "Samsung", "Kulaklık", "Saat"].map((suggestion) => (
              <Link
                key={suggestion}
                href={`/search?q=${suggestion}`}
                className="px-4 py-2 bg-surface-container-low rounded-full text-sm font-semibold hover:bg-surface-container transition-colors"
              >
                {suggestion}
              </Link>
            ))}
          </div>
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-6xl text-on-surface-variant/20 mb-4 block">
            search
          </span>
          <h2 className="text-xl font-bold mb-2">Mağazamızda arayın</h2>
          <p className="text-on-surface-variant">
            iPhone, MacBook, Saat ve daha fazlasını bulmak için yukarıdaki arama çubuğunu kullanın.
          </p>
        </div>
      )}
    </div>
  );
}
