import { Metadata } from "next";
import { getProductsByCategoryAndBrand } from "@/lib/data/products-db";
import ShopCategorySection from "@/components/home/ShopCategorySection";

export const metadata: Metadata = {
  title: "MacBook | ceepyol",
  description:
    "MacBook Air ve MacBook Pro. Apple M serisi çipler ile olağanüstü performans.",
};

const NAV_ITEMS = [
  "Tüm Modeller",
  "MacBook Air",
  "MacBook Pro",
  "Karşılaştır",
  "Alım Rehberi",
  "Kampanyalar",
  "Aksesuarlar",
];

export default async function MacBookPage() {
  const products = await getProductsByCategoryAndBrand("laptops", "Apple");

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1d1d1f] via-[#2c2c2e] to-[#1d1d1f] py-20 px-4">
        <div className="max-w-screen-xl mx-auto text-center">
          <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-gray-400 mb-4">
            Apple Silicon
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight mb-4">
            MacBook
          </h1>
          <p className="text-lg text-gray-300 max-w-xl mx-auto">
            M serisi çipler. Olağanüstü pil ömrü. Macun büyüsü — her yerde.
          </p>
        </div>
      </section>

      <ShopCategorySection
        products={products}
        title="Shop MacBook"
        buyerCount="350k+ alıcı"
        subtitle="Sana en uygun MacBook'u bul"
        navItems={NAV_ITEMS}
        browseAllHref="/products?category=laptops&brand=Apple"
        browseAllLabel="Tüm MacBook'ları Gör"
      />
    </main>
  );
}
