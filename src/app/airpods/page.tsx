import { Metadata } from "next";
import { getProductsByCategoryAndBrand } from "@/lib/data/products-db";
import ShopCategorySection from "@/components/home/ShopCategorySection";

export const metadata: Metadata = {
  title: "AirPods | ceepyol",
  description:
    "AirPods Pro, AirPods Max ve AirPods 4. Apple'ın premium ses deneyimi.",
};

const NAV_ITEMS = [
  "Tüm Modeller",
  "AirPods Pro",
  "AirPods Max",
  "AirPods 4",
  "Alım Rehberi",
  "Aksesuarlar",
  "Kurulum",
];

export default async function AirPodsPage() {
  const products = await getProductsByCategoryAndBrand("audio", "Apple");

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1d1d1f] via-[#2c2c2e] to-[#1d1d1f] py-20 px-4">
        <div className="max-w-screen-xl mx-auto text-center">
          <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-gray-400 mb-4">
            Premium Ses
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight mb-4">
            AirPods
          </h1>
          <p className="text-lg text-gray-300 max-w-xl mx-auto">
            Aktif Gürültü Engelleme, Kişiselleştirilmiş Uzamsal Ses ve tüm gün
            pil ömrü.
          </p>
        </div>
      </section>

      <ShopCategorySection
        products={products}
        title="Shop AirPods"
        buyerCount="250k+ alıcı"
        subtitle="Sana en uygun AirPods'u seç"
        navItems={NAV_ITEMS}
        browseAllHref="/products?category=audio"
        browseAllLabel="Tüm AirPods Modellerini Gör"
      />
    </main>
  );
}
