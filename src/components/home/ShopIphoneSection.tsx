"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types/product";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { useTranslation } from "@/lib/i18n/useTranslation";

interface ShopIphoneSectionProps {
  products: Product[];
}


// Locale-independent number formatter — avoids server/client ICU mismatch
const formatNum = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

// Helper to generate deterministic realistic metrics based on product ID
const getMetrics = (id: string) => {
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const buyers = 15000 + (hash % 85000); // 15k to 100k buyers
  const rating = 4.6 + ((hash % 40) / 100); // 4.6 to 4.99
  const reviews = 1200 + (hash % 8000);
  return {
    buyers: formatNum(buyers),
    rating: rating.toFixed(1),
    reviews: formatNum(reviews)
  };
};

export default function ShopIphoneSection({ products }: ShopIphoneSectionProps) {
  const { t } = useTranslation();
  // iPhone 17 Pro Max always first, rest follow in original order
  const displayProducts = [...products]
    .sort((a, b) => {
      if (a.slug === "iphone-17-pro-max") return -1;
      if (b.slug === "iphone-17-pro-max") return 1;
      return 0;
    })
    .slice(0, 8);

  return (
    <section className="py-12 md:py-20 bg-white dark:bg-[#0a0a0a]">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6">
        <AnimateOnScroll animation="animate-fade-in-up">
          {/* Header: Title + Compare link */}
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-black dark:text-white">
              {t("home.shopIphone.title") as string}
            </h2>
            <Link
              href="/products"
              className="text-sm font-medium text-[#0071e3] hover:underline whitespace-nowrap"
            >
              {t("home.shopIphone.nav.0") as string} &rarr;
            </Link>
          </div>
        </AnimateOnScroll>

        {/* Carousel */}
        <div className="flex gap-4 md:gap-6 overflow-x-auto hide-scrollbar pb-8 snap-x snap-mandatory px-1">
          {displayProducts.map((product, i) => {
            const metrics = getMetrics(product.id);
            // Calculate a fake monthly price
            const monthlyPrice = (product.price / 24).toFixed(2);
            
            return (
              <AnimateOnScroll
                key={product.id}
                animation="animate-fade-in-right"
                delay={i * 100}
                className="snap-start shrink-0"
              >
                <div className="w-[240px] sm:w-[280px] md:w-[320px] h-full min-h-[420px] sm:min-h-[480px] bg-white dark:bg-[#151515] rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 flex flex-col shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] dark:shadow-none dark:border dark:border-white/5 transition-all duration-300 relative group cursor-pointer overflow-hidden leading-tight">
                  
                  {/* Text Header */}
                  <div className="text-center mb-6 z-10">
                    <h4 className="text-xl md:text-2xl font-semibold text-black dark:text-white mb-2 line-clamp-2">
                      {product.name}
                    </h4>
                    
                    {/* Realistic Metrics */}
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-1 text-[11px] font-medium text-orange-500">
                        <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        {metrics.rating} <span className="text-gray-400 dark:text-gray-500">({metrics.reviews})</span>
                      </div>
                      <div className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                        <span className="material-symbols-outlined text-[12px] align-text-bottom mr-0.5">shopping_cart</span>
                        {metrics.buyers} {t("home.shopIphone.buyers.label")}
                      </div>
                    </div>
                  </div>

                  {/* Product Image */}
                  <div className="flex-1 w-full relative flex items-center justify-center mb-6 z-10 transition-transform duration-500 group-hover:scale-105">
                    {product.images[0]?.src ? (
                      <div className="relative w-full aspect-[4/5]">
                        <Image
                          src={product.images[0].src}
                          alt={product.name}
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 280px, 320px"
                        />
                      </div>
                    ) : (
                      <div className="w-full aspect-[4/5] bg-gray-100 dark:bg-white/5 rounded-2xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-4xl text-gray-300">image</span>
                      </div>
                    )}
                  </div>

                  {/* Colors */}
                  <div className="flex justify-center gap-1.5 mb-6 z-10">
                    {product.colors && product.colors.slice(0, 5).map((color, idx) => (
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

                  {/* Action Footer */}
                  <div className="flex items-end justify-between mt-auto z-10">
                    <div className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 max-w-[65%]">
                      ₺{formatNum(product.price)}'den başlayan veya 24 ay x ₺{monthlyPrice}/ay*
                    </div>
                    
                    <Link
                      href={`/products/${product.slug}`}
                      className="px-4 py-1.5 bg-[#0071e3] hover:bg-[#0077ED] text-white text-xs font-bold rounded-full transition-colors active:scale-95 shrink-0"
                    >
                      {t("home.shopIphone.buy") as string}
                    </Link>
                  </div>

                </div>
              </AnimateOnScroll>
            );
          })}

          {/* "Explore More" Card matching the screenshot */}
          <AnimateOnScroll
            animation="animate-fade-in-right"
            delay={displayProducts.length * 100}
            className="snap-start shrink-0"
          >
             <div className="w-[240px] sm:w-[280px] md:w-[320px] h-full min-h-[420px] sm:min-h-[480px] bg-[#f5f5f7] dark:bg-[#1a1a1a] rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 flex flex-col justify-between transition-all duration-300 cursor-pointer hover:opacity-90">
                <div className="text-left mb-6">
                  <h4 className="text-xl md:text-2xl font-semibold text-black dark:text-white leading-tight">
                    {t("home.shopIphone.explore")}
                  </h4>
                </div>
                <div className="flex-1 w-full relative flex items-center justify-center">
                   {/* Placeholder illustration for accessories */}
                   <div className="w-full flex justify-center items-center gap-2">
                       <div className="w-16 h-24 bg-pink-100 rounded-xl shadow-sm border border-black/5" />
                       <div className="w-20 h-32 bg-[#424d35] rounded-xl shadow-md border border-black/10 relative">
                         <div className="absolute top-2 right-2 flex gap-1">
                           <div className="w-3 h-3 rounded-full bg-black/40"></div>
                           <div className="w-3 h-3 rounded-full bg-black/40"></div>
                         </div>
                       </div>
                       <div className="w-16 h-28 bg-white/80 backdrop-blur rounded-xl shadow-sm border border-black/10 relative flex justify-center items-center">
                         <div className="w-6 h-6 rounded-full border border-gray-200"></div>
                       </div>
                   </div>
                </div>
             </div>
          </AnimateOnScroll>

        </div>

        {/* Navigation Links + subtitle below carousel */}
        <AnimateOnScroll animation="animate-fade-in-up">
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-white/10">
            <div className="flex gap-6 overflow-x-auto hide-scrollbar text-sm font-medium text-gray-800 dark:text-gray-300 pb-2 mb-4">
              {(["home.shopIphone.nav.1","home.shopIphone.nav.2","home.shopIphone.nav.3","home.shopIphone.nav.4","home.shopIphone.nav.5","home.shopIphone.nav.6"] as const).map((key, idx) => (
                <span key={idx} className="cursor-pointer hover:text-black dark:hover:text-white transition-colors whitespace-nowrap">
                  {t(key)}
                </span>
              ))}
            </div>
            <p className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
              {t("home.shopIphone.subtitle") as string}
            </p>
          </div>
        </AnimateOnScroll>

      </div>
    </section>
  );
}
