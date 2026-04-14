import { Suspense } from "react";
import ProductCard from "@/components/ui/ProductCard";
import ProductFilters from "@/components/products/ProductFilters";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { filterProducts, getAllCategories, getAllBrands } from "@/lib/data/products-db";

const categoryLabels: Record<string, string> = {
  iphones: "iPhone'lar",
  samsung: "Samsung",
  laptops: "Dizüstü",
  audio: "Ses",
  watches: "Saatler",
  tablets: "Tabletler",
  accessories: "Aksesuarlar",
  gaming: "Oyun",
  deals: "Fırsatlar",
};

export const metadata = {
  title: "Ürünler",
  description: "Premium teknoloji cihazlarımızın özenle seçilmiş koleksiyonuna göz atın.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const category = params.category || "";
  const brand = params.brand || "";
  const condition = params.condition || "";
  const sort = params.sort as "price-asc" | "price-desc" | "rating" | "newest" | undefined;

  const [filtered, categories, brands] = await Promise.all([
    filterProducts({ category, brand, condition, sort }),
    getAllCategories(),
    getAllBrands(),
  ]);

  const breadcrumbs: { label: string; href?: string }[] = [
    { label: "Ana Sayfa", href: "/" },
    { label: "Ürünler", href: category ? "/products" : undefined },
  ];
  if (category) {
    breadcrumbs.push({ label: categoryLabels[category] || category });
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <Breadcrumb items={breadcrumbs} />

      <div className="flex items-end justify-between mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-[family-name:var(--font-headline)]">
            {category ? categoryLabels[category] || "Ürünler" : "Tüm Ürünler"}
          </h1>
          <p className="text-on-surface-variant mt-1">
            {filtered.length} ürün bulundu
          </p>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-[180px] bg-white dark:bg-surface-container rounded-2xl p-6 shadow-sm border border-surface-variant">
            <Suspense>
              <ProductFilters categories={categories} brands={brands} />
            </Suspense>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Mobile Filters */}
          <div className="lg:hidden mb-6">
            <details className="bg-white dark:bg-surface-container rounded-2xl shadow-sm border border-surface-variant">
              <summary className="px-6 py-4 font-bold text-sm cursor-pointer flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">tune</span>
                Filtreler ve Sıralama
              </summary>
              <div className="px-6 pb-6">
                <Suspense>
                  <ProductFilters categories={categories} brands={brands} />
                </Suspense>
              </div>
            </details>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-6xl text-on-surface-variant/30 mb-4 block">
                search_off
              </span>
              <h3 className="text-xl font-bold mb-2">Ürün bulunamadı</h3>
              <p className="text-on-surface-variant">
                Filtrelerinizi değiştirmeyi deneyin veya tüm ürünlere göz atın.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
