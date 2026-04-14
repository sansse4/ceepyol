import { Metadata } from "next";
import { getProductsByCategoryAndBrand } from "@/lib/data/products-db";
import ShopCategorySection from "@/components/home/ShopCategorySection";

export const metadata: Metadata = {
  title: "Samsung Galaxy | ceepyol",
  description:
    "Galaxy S serisi, Z Fold, Z Flip ve Galaxy Watch. Samsung'un en iyi cihazları.",
};

const NAV_ITEMS = [
  "Tüm Modeller",
  "Galaxy S Serisi",
  "Galaxy Z Fold",
  "Galaxy Z Flip",
  "Galaxy Watch",
  "Galaxy AI",
  "Aksesuarlar",
];

export default async function GalaxyPage() {
  const samsungProducts = await getProductsByCategoryAndBrand("samsung");
  const watchProducts = (
    await getProductsByCategoryAndBrand("watches", "Samsung")
  );
  const allGalaxy = [...samsungProducts, ...watchProducts];

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1428A0] via-[#1e3a8a] to-[#0f172a] py-20 px-4">
        <div className="max-w-screen-xl mx-auto text-center">
          <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-blue-300 mb-4">
            Galaxy AI
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight mb-4">
            Samsung Galaxy
          </h1>
          <p className="text-lg text-blue-100 max-w-xl mx-auto">
            Galaxy AI ile geleceği bugün yaşa. S Pen, katlanabilir ekranlar ve
            çok daha fazlası.
          </p>
        </div>
      </section>

      <ShopCategorySection
        products={allGalaxy}
        title="Shop Galaxy"
        buyerCount="400k+ alıcı"
        subtitle="Galaxy ekosistemini keşfet"
        navItems={NAV_ITEMS}
        browseAllHref="/products?category=samsung"
        browseAllLabel="Tüm Galaxy Ürünlerini Gör"
      />
    </main>
  );
}
