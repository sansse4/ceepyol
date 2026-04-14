"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types/product";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";

interface ShopCategorySectionProps {
  products: Product[];
  title: string;
  buyerCount: string;
  subtitle: string;
  navItems: string[];
  browseAllHref: string;
  browseAllLabel?: string;
  accentColor?: string;
}

const formatNum = (n: number) =>
  String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const getMetrics = (id: string) => {
  const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const buyers = 15000 + (hash % 85000);
  const rating = 4.6 + ((hash % 40) / 100);
  const reviews = 1200 + (hash % 8000);
  return {
    buyers: formatNum(buyers),
    rating: rating.toFixed(1),
    reviews: formatNum(reviews),
  };
};

export default function ShopCategorySection({
  products,
  title,
  buyerCount,
  subtitle,
  navItems,
  browseAllHref,
  browseAllLabel = "Tümünü Gör",
}: ShopCategorySectionProps) {
  const displayProducts = [...products].slice(0, 8);

  return (
    <section className="py-12 md:py-20 bg-white dark:bg-[#0a0a0a]">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6">
        <AnimateOnScroll animation="animate-fade-in-up">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-black dark:text-white">
                  {title}
                </h2>
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 rounded-full text-xs font-bold border border-green-200 dark:border-green-500/20">
                  <span className="material-symbols-outlined text-[14px]">
                    groups
                  </span>
                  {buyerCount}
                </div>
              </div>
            </div>
            <Link
              href={browseAllHref}
              className="text-sm font-semibold text-[#0071e3] hover:underline flex items-center gap-1 shrink-0"
            >
              {browseAllLabel}
              <span className="material-symbols-outlined text-[16px]">
                arrow_forward
              </span>
            </Link>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-6 overflow-x-auto hide-scrollbar text-sm font-medium text-gray-800 dark:text-gray-300 mb-10 pb-2 border-b border-gray-100 dark:border-white/10">
            {navItems.map((item, idx) => (
              <span
                key={idx}
                className={`cursor-pointer whitespace-nowrap transition-colors pb-2 ${
                  idx === 0
                    ? "text-black dark:text-white border-b-2 border-black dark:border-white -mb-[2px]"
                    : "hover:text-black dark:hover:text-white"
                }`}
              >
                {item}
              </span>
            ))}
          </div>

          <div className="mb-8">
            <h3 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
              {subtitle}
            </h3>
          </div>
        </AnimateOnScroll>

        {/* Carousel */}
        <div className="flex gap-4 md:gap-6 overflow-x-auto hide-scrollbar pb-8 snap-x snap-mandatory px-1">
          {displayProducts.map((product, i) => {
            const metrics = getMetrics(product.id);
            const monthlyPrice = (product.price / 24).toFixed(0);

            return (
              <AnimateOnScroll
                key={product.id}
                animation="animate-fade-in-right"
                delay={i * 100}
                className="snap-start shrink-0"
              >
                <div className="w-[240px] sm:w-[280px] md:w-[320px] h-full min-h-[420px] sm:min-h-[480px] bg-white dark:bg-[#151515] rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 flex flex-col shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] dark:shadow-none dark:border dark:border-white/5 transition-all duration-300 relative group cursor-pointer overflow-hidden leading-tight">
                  {/* Header */}
                  <div className="text-center mb-6 z-10">
                    <h4 className="text-xl md:text-2xl font-semibold text-black dark:text-white mb-2 line-clamp-2">
                      {product.name}
                    </h4>
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-1 text-[11px] font-medium text-orange-500">
                        <span
                          className="material-symbols-outlined text-[12px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                        {metrics.rating}{" "}
                        <span className="text-gray-400 dark:text-gray-500">
                          ({metrics.reviews})
                        </span>
                      </div>
                      <div className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                        <span className="material-symbols-outlined text-[12px] align-text-bottom mr-0.5">
                          shopping_cart
                        </span>
                        {metrics.buyers} alıcı
                      </div>
                    </div>
                  </div>

                  {/* Image */}
                  <div className="flex-1 w-full relative flex items-center justify-center mb-6 z-10 transition-transform duration-500 group-hover:scale-105">
                    {product.images[0]?.src ? (
                      <div className="relative w-full aspect-[4/5]">
                        <Image
                          src={product.images[0].src}
                          alt={product.name}
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 280px, 320px"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="w-full aspect-[4/5] bg-gray-100 dark:bg-white/5 rounded-2xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-4xl text-gray-300">
                          image
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Color dots */}
                  <div className="flex justify-center gap-1.5 mb-6 z-10">
                    {product.colors?.slice(0, 5).map((color, idx) => (
                      <div
                        key={idx}
                        className="w-3.5 h-3.5 rounded-full border border-gray-200 dark:border-gray-700 shadow-inner"
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    ))}
                    {product.colors && product.colors.length > 5 && (
                      <div className="w-3.5 h-3.5 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[8px] text-gray-500">
                        +
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-end justify-between mt-auto z-10">
                    <div className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 max-w-[65%]">
                      ₺{formatNum(product.price)}&apos;den başlayan veya 24 ay
                      × ₺{monthlyPrice}/ay*
                    </div>
                    <Link
                      href={`/products/${product.slug}`}
                      className="px-4 py-1.5 bg-[#0071e3] hover:bg-[#0077ED] text-white text-xs font-bold rounded-full transition-colors active:scale-95 shrink-0"
                    >
                      Satın Al
                    </Link>
                  </div>
                </div>
              </AnimateOnScroll>
            );
          })}

          {/* Explore More card */}
          <AnimateOnScroll
            animation="animate-fade-in-right"
            delay={displayProducts.length * 100}
            className="snap-start shrink-0"
          >
            <Link href={browseAllHref}>
              <div className="w-[240px] sm:w-[280px] md:w-[320px] h-full min-h-[420px] sm:min-h-[480px] bg-[#f5f5f7] dark:bg-[#1a1a1a] rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 flex flex-col justify-between transition-all duration-300 cursor-pointer hover:opacity-90">
                <div className="text-left">
                  <h4 className="text-xl md:text-2xl font-semibold text-black dark:text-white leading-tight">
                    {browseAllLabel}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Tüm modelleri keşfet →
                  </p>
                </div>
                <div className="flex-1 flex items-center justify-center py-8">
                  <span
                    className="material-symbols-outlined text-7xl text-gray-300 dark:text-gray-600"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    grid_view
                  </span>
                </div>
              </div>
            </Link>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
