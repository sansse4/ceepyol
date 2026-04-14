"use client";

import Image from "next/image";
import Link from "next/link";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { useTranslation } from "@/lib/i18n/useTranslation";

const categoryConfig = [
  { key: "home.cat.smartphones" as const, href: "/products?category=iphones", image: "/images/products/ip17pm-orange.jpg" },
  { key: "home.cat.laptops" as const, href: "/products?category=laptops", image: "/images/products/macbook-pro-16-featured.jpg" },
  { key: "home.cat.audio" as const, href: "/products?category=audio", image: "/images/products/airpods-pro-3-featured.jpg" },
  { key: "home.cat.wearables" as const, href: "/products?category=watches", image: "/images/products/apple-watch-se-3.png" },
  { key: "home.cat.tablets" as const, href: "/products?category=tablets", image: "/images/products/apple-ipad-air-13-m4.jpg" },
  { key: "home.cat.gaming" as const, href: "/products?category=gaming", image: "/images/products/ps5.webp" },
  { key: "home.cat.cameras" as const, href: "/products?category=cameras", icon: "camera" },
  { key: "home.cat.accessories" as const, href: "/products?category=accessories", icon: "cable" },
];

const whyItems = [
  { icon: "handshake", titleKey: "home.why.0.title" as const, descKey: "home.why.0.desc" as const },
  { icon: "fact_check", titleKey: "home.why.1.title" as const, descKey: "home.why.1.desc" as const },
  { icon: "shield_locked", titleKey: "home.why.2.title" as const, descKey: "home.why.2.desc" as const },
];

const reviewKeys = [
  { textKey: "home.reviews.0.text" as const, nameKey: "home.reviews.0.name" as const, initialsKey: "home.reviews.0.initials" as const },
  { textKey: "home.reviews.1.text" as const, nameKey: "home.reviews.1.name" as const, initialsKey: "home.reviews.1.initials" as const },
  { textKey: "home.reviews.2.text" as const, nameKey: "home.reviews.2.name" as const, initialsKey: "home.reviews.2.initials" as const },
];

const impactConfig = [
  { icon: "public", valueKey: "home.sustainability.ewaste.value" as const, labelKey: "home.sustainability.ewaste" as const },
  { icon: "park", valueKey: "home.sustainability.trees.value" as const, labelKey: "home.sustainability.trees" as const },
  { icon: "water_drop", valueKey: "home.sustainability.water.value" as const, labelKey: "home.sustainability.water" as const },
  { icon: "group", valueKey: "home.sustainability.customers.value" as const, labelKey: "home.sustainability.customers" as const },
];

const trustConfig = [
  { icon: "verified", titleKey: "home.trust.warranty.title" as const, subtitleKey: "home.trust.warranty.subtitle" as const },
  { icon: "local_shipping", titleKey: "home.trust.shipping.title" as const, subtitleKey: "home.trust.shipping.subtitle" as const },
  { icon: "lock", titleKey: "home.trust.returns.title" as const, subtitleKey: "home.trust.returns.subtitle" as const },
  { icon: "recycling", titleKey: "home.trust.certified.title" as const, subtitleKey: "home.trust.certified.subtitle" as const },
];

interface HomeStaticSectionsProps {
  afterCategories?: React.ReactNode;
}

export default function HomeStaticSections({ afterCategories }: HomeStaticSectionsProps) {
  const { t } = useTranslation();

  return (
    <>
      {/* Trust Badges */}
      <AnimateOnScroll animation="animate-fade-in-up" className="py-8 sm:py-12 bg-surface-container-low border-y border-surface-variant">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-between sm:items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-3 group cursor-default">
            <div className="flex text-rose-500 bg-primary text-white px-2 py-1 rounded transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            </div>
            <div className="text-sm">
              <div className="font-bold flex items-center gap-1">
                4.8/5{" "}
                <span className="bg-rose-500 rounded-full w-2 h-2 inline-block animate-pulse"></span>{" "}
                Trustpilot
              </div>
              <div className="text-on-surface-variant text-xs">{t("home.trust.trustpilot")}</div>
            </div>
          </div>
          {trustConfig.map((badge, i) => (
            <div key={i} className="flex items-center gap-3 group cursor-default">
              {i > 0 && <div className="hidden md:block w-px h-10 bg-outline-variant/30 -ml-3"></div>}
              <span className="material-symbols-outlined text-primary text-3xl transition-all duration-300 group-hover:scale-110 group-hover:text-primary-container">{badge.icon}</span>
              <div className="font-bold text-sm">
                {t(badge.titleKey)}<br />{t(badge.subtitleKey)}
              </div>
            </div>
          ))}
        </div>
      </AnimateOnScroll>

      {/* Popular Categories */}
      <section className="py-10 md:py-16 max-w-screen-2xl mx-auto px-4 sm:px-6">
        <AnimateOnScroll animation="animate-fade-in-up">
          <h2 className="text-2xl font-extrabold font-[family-name:var(--font-headline)] mb-8 text-on-background">
            {t("home.popular")}
          </h2>
        </AnimateOnScroll>
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4">
          {categoryConfig.map((cat, index) => (
            <AnimateOnScroll key={cat.key} animation="animate-fade-in-up" delay={index * 80}>
              <Link href={cat.href} className="flex flex-col items-center min-w-[130px] group">
                <div className="w-28 h-28 rounded-full bg-surface-container dark:bg-surface-container-high flex items-center justify-center transition-all duration-500 overflow-hidden mb-3 group-hover:ring-2 group-hover:ring-primary group-hover:shadow-lg group-hover:shadow-primary/10 group-hover:-translate-y-2">
                  {"image" in cat && cat.image ? (
                    <Image src={cat.image} alt={t(cat.key)} width={112} height={112} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" unoptimized />
                  ) : (
                    <span className="material-symbols-outlined text-4xl text-primary transition-all duration-500 group-hover:scale-125">{"icon" in cat ? cat.icon : ""}</span>
                  )}
                </div>
                <span className="font-semibold text-sm transition-colors duration-300 group-hover:text-primary">{t(cat.key)}</span>
              </Link>
            </AnimateOnScroll>
          ))}
        </div>
      </section>

      {afterCategories}

      {/* Why Choose ceepyol */}
      <section className="py-14 md:py-24 bg-surface-container-low border-b border-surface-variant">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6">
          <AnimateOnScroll animation="animate-fade-in-up">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-2xl sm:text-3xl font-extrabold font-[family-name:var(--font-headline)] mb-4">
                {t("home.why.title")}
              </h2>
              <p className="text-on-surface-variant">{t("home.why.subtitle")}</p>
            </div>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center bg-surface-container-lowest dark:bg-surface-container rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 shadow-sm">
            {whyItems.map((item, i) => (
              <AnimateOnScroll key={i} animation="animate-fade-in-up" delay={i * 150}>
                <div className="flex flex-col items-center group cursor-default">
                  <div className="w-16 h-16 rounded-full bg-primary/10 dark:bg-primary/20 text-primary flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/15 group-hover:bg-primary group-hover:text-white">
                    <span className="material-symbols-outlined text-3xl transition-transform duration-500 group-hover:rotate-6">{item.icon}</span>
                  </div>
                  <h3 className="font-bold text-xl mb-3 transition-colors duration-300 group-hover:text-primary">{t(item.titleKey)}</h3>
                  <p className="text-on-surface-variant">{t(item.descKey)}</p>
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
            {t("home.reviews.title")}
          </h2>
        </AnimateOnScroll>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviewKeys.map((review, i) => (
            <AnimateOnScroll key={i} animation="animate-fade-in-up" delay={i * 120}>
              <div className="bg-surface-container-lowest dark:bg-surface-container p-5 sm:p-8 rounded-2xl shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-2 hover:shadow-primary/5 group border border-surface-variant/40 hover:border-primary/20">
                <div className="flex text-amber-400 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="material-symbols-outlined transition-transform duration-300 hover:scale-125" style={{ fontVariationSettings: "'FILL' 1", transitionDelay: `${j * 50}ms` }}>star</span>
                  ))}
                </div>
                <p className="text-on-surface italic mb-6 leading-relaxed">{t(review.textKey)}</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center font-bold text-primary transition-all duration-300 group-hover:scale-110 group-hover:shadow-md group-hover:shadow-primary/20">
                    {t(review.initialsKey)}
                  </div>
                  <div>
                    <div className="font-bold transition-colors duration-300 group-hover:text-primary">{t(review.nameKey)}</div>
                    <div className="text-xs text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-primary text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                      {t("home.reviews.verified")}
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
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 right-20 w-48 h-48 bg-white/5 rounded-full blur-3xl animate-float-delayed" />
        </div>
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 text-center relative">
          <AnimateOnScroll animation="animate-fade-in-up">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-[family-name:var(--font-headline)] mb-4">
              {t("home.sustainability.title")}
            </h2>
            <p className="text-rose-100 mb-8 sm:mb-16 max-w-xl mx-auto">
              {t("home.sustainability.subtitle")}
            </p>
          </AnimateOnScroll>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {impactConfig.map((stat, i) => (
              <AnimateOnScroll key={i} animation="animate-fade-in-up" delay={i * 150}>
                <div className={`flex flex-col items-center group cursor-default ${i > 0 ? "lg:border-l border-rose-700" : ""}`}>
                  <span className="text-3xl sm:text-5xl mb-3 sm:mb-4 text-rose-300 material-symbols-outlined transition-all duration-500 group-hover:scale-125 group-hover:text-white group-hover:-translate-y-1" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {stat.icon}
                  </span>
                  <span className="text-2xl sm:text-4xl font-extrabold mb-2 text-white tabular-nums">{t(stat.valueKey)}</span>
                  <span className="text-rose-200 font-semibold tracking-wide uppercase text-xs sm:text-sm transition-colors duration-300 group-hover:text-white">
                    {t(stat.labelKey)}
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
            {t("home.newsletter.title")}
          </h2>
          <p className="text-on-surface-variant mb-10 max-w-lg mx-auto">
            {t("home.newsletter.subtitle")}
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto" action="#">
            <input
              className="flex-1 px-6 py-4 rounded-xl border border-surface-variant bg-surface-container-lowest dark:bg-surface-container focus:ring-2 focus:ring-primary shadow-sm outline-none transition-all duration-300 focus:shadow-lg focus:shadow-primary/10 focus:-translate-y-0.5 text-on-surface placeholder:text-on-surface-variant/50"
              placeholder={t("home.newsletter.placeholder")}
              type="email"
            />
            <button className="px-10 py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-on-primary-fixed-variant transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:scale-95 active:translate-y-0">
              {t("home.newsletter.button")}
            </button>
          </form>
        </AnimateOnScroll>
      </section>
    </>
  );
}
