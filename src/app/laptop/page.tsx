import { Metadata } from "next";
import { getProductsByCategoryAndBrand } from "@/lib/data/products-db";
import ShopCategorySection from "@/components/home/ShopCategorySection";

export const metadata: Metadata = {
  title: "Dizüstü Bilgisayarlar | ceepyol",
  description:
    "Gaming ve yaratıcı iş için en iyi dizüstü bilgisayarlar. MSI, Asus, Lenovo ve daha fazlası.",
};

const NAV_ITEMS = [
  "Tüm Modeller",
  "Gaming Laptop",
  "İş Laptopu",
  "Alım Rehberi",
  "Kampanyalar",
  "Aksesuarlar",
  "Kurulum & Destek",
];

export default async function LaptopPage() {
  const products = await getProductsByCategoryAndBrand("laptops", undefined);
  // Show only non-Apple laptops for this page
  const laptopProducts = products.filter((p) => p.brand !== "Apple");

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 py-20 px-4">
        <div className="max-w-screen-xl mx-auto text-center">
          <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-slate-400 mb-4">
            En Güçlü Laptoplar
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight mb-4">
            Dizüstü Bilgisayarlar
          </h1>
          <p className="text-lg text-slate-300 max-w-xl mx-auto">
            Gaming, yaratıcılık ve üretkenlik için tasarlanmış — gücünüzü
            keşfedin.
          </p>
        </div>
      </section>

      <ShopCategorySection
        products={laptopProducts}
        title="Shop Laptop"
        buyerCount="200k+ alıcı"
        subtitle="Tüm ihtiyaçlarına göre laptop"
        navItems={NAV_ITEMS}
        browseAllHref="/products?category=laptops"
        browseAllLabel="Tüm Laptopları Gör"
      />
    </main>
  );
}
