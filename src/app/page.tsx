import Image from "next/image";
import Link from "next/link";
import HeroCarousel from "@/components/home/HeroCarousel";
import FlashSaleCountdown from "@/components/home/FlashSaleCountdown";
import ProductCard from "@/components/ui/ProductCard";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import ScrollVideoPromo from "@/components/ui/ScrollVideoPromo";
import ShopIphoneSection from "@/components/home/ShopIphoneSection";
import { getFeaturedProducts, getProductsByCategory } from "@/lib/data/products-db";

const categories = [
  {
    name: "Smartphones",
    href: "/products?category=iphones",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCk9Bei4Lqu4w74QMvzaVQUo8y6G9DYGEX_hps3NfJzGUeucQsO60tTnXSIhmRyKdGpGlKegYm846ZbjQHybmu2W7_mOQ8lr0TI4kT6EnMqGzkDDt-FTclGIcUiSMOHUiBBkaZoO94tJ78G96L8DD_QuVa6y38Ip2Yy7HJnRDb6FrPHYmJmJbPV8BjXYU3J3lcU3bJSJ60TkCG57LEztCaimzFvPewCuC-LRG7S-gZag5Q7FxPfPdvMBiVLKxSBkxpQlZTOcKpPjHs",
  },
  {
    name: "Laptops",
    href: "/products?category=laptops",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBzBIMEODAp1bY9bjpN2yQlGIuEnY36_2Eup_idGpVjwTO4jJiEtvE8VYdn_nc0J5NQ1otKnQJS9mb3JlijjrI-j5G1qSg1sHAh9t7dS4H41rCn5ALCRRNT5y4LMiD3g7okm67FGm4nHPQ5f8PkjnnHzGQ9vVUDvacwXECJSctjs3J7lwThLK2iG8ZdQUDanBFlwz-rNBi-fksm7K15V6iqPZ9DglOpHOOE-xeZFhygDQlOt6TOZ4bKukPUy7NTfAajvKJlBIeFwp0",
  },
  {
    name: "Audio",
    href: "/products?category=audio",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDKtq3FWpQ1pjXeiWXiEx6kamFaYe4LGhrM3-8ojzGEDX4Ycwr8Lhaog2RuyVvxNbv28sqX9xnCRAjm48OJZlH_gsOyjS36fxTi5V3crYwPnycTXJGiWK9T_YE8qn1UnT9sFB_2P0S637eeRVn6upV8oLIAxMwm608SDBkQ4f-ab7LZVaXb2TBX9mJWyaKl4PlvayS4Xdtyo9MIpiY2_MeVeYYorQAJH0SQv0PNxMxDfm1m-CDyxvnkX6PurlHR3ZxAzXpYOia87fk",
  },
  {
    name: "Wearables",
    href: "/products?category=watches",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBgzQtyPTYbS3wVha3Ck1tjt0hKq9MAVAEkAlt0UlDPowC9h4XdFUeBoHiTgG6fpqQfgnsFFpv5Bz2THPQD5i9AXAKCYKdnnD8kZr8SzijjtTlw01gE5Ibu5jfl4beVjz1JyXvEhXLn0cuhhMB1dYgJcECDhDfzc8gE2AIKDk5FE-4nltdlwcGQdQM_d69q3MW3Xq17-ymtN0G1ztbnGDPYbLpNQ5QCq0RIfj9rwZELnE_SxaI1quPg0s4OSdKfK8zJOlIuEsCDAkU",
  },
  {
    name: "Tablets",
    href: "/products?category=tablets",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCjWuD-UMSx2Qzy8mdfXVGG6ziIJNkmkNZJBAAunmArjjprr8ZJKY0an_kI0lrRsjUKaeVeP8G9bGtZt6r4qGSdhPEMpVQPxpS4bZouMSHeHtcP-7qNTMX7JNvoim5cL7zZSdzoVGA6M0xlSuCZXj5DbTN6QLWyuxqpIiAIdXGh_QuUR8ipQ_v3-SK0zPKN_JLMSkBH5zAfw9AWNrdFWBLMpPruaNE4xnw_DYKrBJDu5v0siOIEArU6E1unsVO0sw8rL1OfA8lJriQ",
  },
  { name: "Gaming", href: "/products?category=gaming", icon: "videogame_asset" },
  { name: "Cameras", href: "/products?category=cameras", icon: "camera" },
  { name: "Accessories", href: "/products?category=accessories", icon: "cable" },
];

const trustBadges = [
  { icon: "verified", title: "12-Month", subtitle: "Warranty" },
  { icon: "local_shipping", title: "Free", subtitle: "Shipping" },
  { icon: "lock", title: "30-Day", subtitle: "Returns" },
  { icon: "recycling", title: "Certified", subtitle: "Refurbished" },
];

const reviews = [
  {
    name: "James Dalton",
    initials: "JD",
    text: '"ceepyol has completely changed how I shop for gadgets. The shipping was incredibly fast, and the MacBook I bought looked brand new!"',
  },
  {
    name: "Sarah K.",
    initials: "SK",
    text: '"Great customer service. I had an issue with my order and they resolved it in less than an hour. Highly recommended."',
  },
  {
    name: "Marcus Reed",
    initials: "MR",
    text: '"Unbeatable prices indeed. Found my favorite headphones for 40% less than anywhere else. Will definitely be back."',
  },
];

const impactStats = [
  { icon: "public", value: "5+ Tons", label: "e-waste saved" },
  { icon: "park", value: "486K+", label: "Trees planted" },
  { icon: "water_drop", value: "48.7M+", label: "Litres water saved" },
  { icon: "group", value: "500K+", label: "Happy Customers" },
];

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();
  const iphoneProducts = await getProductsByCategory("iphones");

  return (
    <>
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Trust Badges */}
      <AnimateOnScroll animation="animate-fade-in-up" className="py-8 sm:py-12 bg-surface-container-low border-y border-surface-variant">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-between sm:items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-3 group cursor-default">
            <div className="flex text-rose-500 bg-primary text-white px-2 py-1 rounded transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <span
                className="material-symbols-outlined text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
            </div>
            <div className="text-sm">
              <div className="font-bold flex items-center gap-1">
                4.8/5{" "}
                <span className="bg-rose-500 rounded-full w-2 h-2 inline-block animate-pulse"></span>{" "}
                Trustpilot
              </div>
              <div className="text-on-surface-variant text-xs">Based on 70,000+ reviews</div>
            </div>
          </div>

          {trustBadges.map((badge, i) => (
            <div key={i} className="flex items-center gap-3 group cursor-default">
              {i > 0 && (
                <div className="hidden md:block w-px h-10 bg-outline-variant/30 -ml-3"></div>
              )}
              <span className="material-symbols-outlined text-primary text-3xl transition-all duration-300 group-hover:scale-110 group-hover:text-primary-container">{badge.icon}</span>
              <div className="font-bold text-sm">
                {badge.title}
                <br />
                {badge.subtitle}
              </div>
            </div>
          ))}
        </div>
      </AnimateOnScroll>

      {/* Popular Categories */}
      <section className="py-10 md:py-16 max-w-screen-2xl mx-auto px-4 sm:px-6">
        <AnimateOnScroll animation="animate-fade-in-up">
          <h2 className="text-2xl font-extrabold font-[family-name:var(--font-headline)] mb-8 text-on-background">
            Popular Categories
          </h2>
        </AnimateOnScroll>
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4">
          {categories.map((cat, index) => (
            <AnimateOnScroll key={cat.name} animation="animate-fade-in-up" delay={index * 80}>
              <Link
                href={cat.href}
                className="flex flex-col items-center min-w-[120px] group"
              >
                <div className="w-24 h-24 rounded-full bg-surface-container dark:bg-surface-container-high flex items-center justify-center transition-all duration-500 overflow-hidden mb-3 group-hover:ring-2 group-hover:ring-primary group-hover:shadow-lg group-hover:shadow-primary/10 group-hover:-translate-y-2">
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      width={80}
                      height={80}
                      className="h-20 object-contain transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
                      unoptimized
                    />
                  ) : (
                    <span className="material-symbols-outlined text-4xl text-primary transition-all duration-500 group-hover:scale-125">
                      {cat.icon}
                    </span>
                  )}
                </div>
                <span className="font-semibold text-sm transition-colors duration-300 group-hover:text-primary">{cat.name}</span>
              </Link>
            </AnimateOnScroll>
          ))}
        </div>
      </section>

      {/* Shop iPhone Section */}
      <ShopIphoneSection products={iphoneProducts} />

      {/* Flash Sale Countdown — dynamic, controlled from Admin */}
      <FlashSaleCountdown />

      {/* Promotional Banner with Scroll Video */}
      <ScrollVideoPromo />

      {/* Why Choose ceepyol */}
      <section className="py-14 md:py-24 bg-surface-container-low border-b border-surface-variant">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6">
          <AnimateOnScroll animation="animate-fade-in-up">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-2xl sm:text-3xl font-extrabold font-[family-name:var(--font-headline)] mb-4">
                Why Choose ceepyol
              </h2>
              <p className="text-on-surface-variant">
                We&apos;re on a mission to make premium tech accessible, sustainable, and reliable.
              </p>
            </div>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center bg-surface-container-lowest dark:bg-surface-container rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 shadow-sm">
            {[
              {
                icon: "handshake",
                title: "Handpicked Sellers",
                desc: "We work exclusively with certified, trusted refurbishers who value quality as much as we do.",
              },
              {
                icon: "fact_check",
                title: "Quality & Transparency",
                desc: "Every device undergoes a rigorous 70+ point quality check to ensure optimal performance.",
              },
              {
                icon: "shield_locked",
                title: "Buyer Protection",
                desc: "Shop with peace of mind. Free shipping, 12-month warranty, and 30-day hassle-free returns.",
              },
            ].map((item, i) => (
              <AnimateOnScroll key={i} animation="animate-fade-in-up" delay={i * 150}>
                <div className="flex flex-col items-center group cursor-default">
                  <div className="w-16 h-16 rounded-full bg-primary/10 dark:bg-primary/20 text-primary flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/15 group-hover:bg-primary group-hover:text-white">
                    <span className="material-symbols-outlined text-3xl transition-transform duration-500 group-hover:rotate-6">{item.icon}</span>
                  </div>
                  <h3 className="font-bold text-xl mb-3 transition-colors duration-300 group-hover:text-primary">{item.title}</h3>
                  <p className="text-on-surface-variant">{item.desc}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-14 md:py-24 max-w-screen-2xl mx-auto px-4 sm:px-6">
        <AnimateOnScroll animation="animate-fade-in-up">
          <h2 className="text-2xl sm:text-3xl font-extrabold font-[family-name:var(--font-headline)] mb-8 sm:mb-12 text-center">
            Verified Experiences
          </h2>
        </AnimateOnScroll>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
            <AnimateOnScroll key={i} animation="animate-fade-in-up" delay={i * 120}>
              <div className="bg-surface-container-lowest dark:bg-surface-container p-5 sm:p-8 rounded-2xl shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-2 hover:shadow-primary/5 group border border-surface-variant/40 hover:border-primary/20">
                <div className="flex text-amber-400 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <span
                      key={j}
                      className="material-symbols-outlined transition-transform duration-300 hover:scale-125"
                      style={{
                        fontVariationSettings: "'FILL' 1",
                        transitionDelay: `${j * 50}ms`,
                      }}
                    >
                      star
                    </span>
                  ))}
                </div>
                <p className="text-on-surface italic mb-6 leading-relaxed">{review.text}</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center font-bold text-primary transition-all duration-300 group-hover:scale-110 group-hover:shadow-md group-hover:shadow-primary/20">
                    {review.initials}
                  </div>
                  <div>
                    <div className="font-bold transition-colors duration-300 group-hover:text-primary">{review.name}</div>
                    <div className="text-xs text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-primary text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                      Verified Buyer
                    </div>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </section>

      {/* Sustainability Impact */}
      <section className="py-14 md:py-24 bg-gradient-to-br from-primary to-rose-900 text-white overflow-hidden relative">
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 right-20 w-48 h-48 bg-white/5 rounded-full blur-3xl animate-float-delayed" />
        </div>
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 text-center relative">
          <AnimateOnScroll animation="animate-fade-in-up">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-[family-name:var(--font-headline)] mb-4">
              Our Planet Impact
            </h2>
            <p className="text-rose-100 mb-8 sm:mb-16 max-w-xl mx-auto">
              By choosing refurbished tech, together we are reducing e-waste and building a more
              sustainable future.
            </p>
          </AnimateOnScroll>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {impactStats.map((stat, i) => (
              <AnimateOnScroll key={i} animation="animate-fade-in-up" delay={i * 150}>
                <div
                  className={`flex flex-col items-center group cursor-default ${
                    i > 0 ? "lg:border-l border-rose-700" : ""
                  }`}
                >
                  <span
                    className="text-3xl sm:text-5xl mb-3 sm:mb-4 text-rose-300 material-symbols-outlined transition-all duration-500 group-hover:scale-125 group-hover:text-white group-hover:-translate-y-1"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {stat.icon}
                  </span>
                  <span className="text-2xl sm:text-4xl font-extrabold mb-2 text-white tabular-nums">{stat.value}</span>
                  <span className="text-rose-200 font-semibold tracking-wide uppercase text-xs sm:text-sm transition-colors duration-300 group-hover:text-white">
                    {stat.label}
                  </span>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-14 md:py-24 bg-surface-container-high">
        <AnimateOnScroll animation="animate-fade-in-up" className="max-w-screen-xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold font-[family-name:var(--font-headline)] mb-4">
            Stay Updated
          </h2>
          <p className="text-on-surface-variant mb-10 max-w-lg mx-auto">
            Subscribe to our newsletter and be the first to know about new deals and exclusive tech
            launches.
          </p>
          <form
            className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto"
            action="#"
          >
            <input
              className="flex-1 px-6 py-4 rounded-xl border border-surface-variant bg-surface-container-lowest dark:bg-surface-container focus:ring-2 focus:ring-primary shadow-sm outline-none transition-all duration-300 focus:shadow-lg focus:shadow-primary/10 focus:-translate-y-0.5 text-on-surface placeholder:text-on-surface-variant/50"
              placeholder="Enter your email address"
              type="email"
            />
            <button className="px-10 py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-on-primary-fixed-variant transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:scale-95 active:translate-y-0">
              Subscribe
            </button>
          </form>
        </AnimateOnScroll>
      </section>
    </>
  );
}
