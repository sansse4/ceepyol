"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { DictionaryKeys } from "@/lib/i18n/index";

const shopLinks: { nameKey: DictionaryKeys; href: string }[] = [
  { nameKey: "footer.shop.deals", href: "/products?category=deals" },
  { nameKey: "footer.shop.iphones", href: "/products?category=iphones" },
  { nameKey: "footer.shop.samsung", href: "/products?category=samsung" },
  { nameKey: "footer.shop.watches", href: "/products?category=watches" },
  { nameKey: "footer.shop.laptops", href: "/products?category=laptops" },
  { nameKey: "footer.shop.tablets", href: "/products?category=tablets" },
];

const companyLinks: { nameKey: DictionaryKeys; href: string }[] = [
  { nameKey: "footer.company.about", href: "/about" },
  { nameKey: "footer.company.careers", href: "#" },
  { nameKey: "footer.company.sustainability", href: "#" },
  { nameKey: "footer.company.press", href: "#" },
];

const supportLinks: { nameKey: DictionaryKeys; href: string }[] = [
  { nameKey: "footer.support.help", href: "#" },
  { nameKey: "footer.support.contact", href: "#" },
  { nameKey: "footer.support.returns", href: "#" },
  { nameKey: "footer.support.warranty", href: "#" },
  { nameKey: "footer.support.faq", href: "#" },
];

const socials = [
  { icon: "camera_alt", label: "Instagram" },
  { icon: "tag", label: "Twitter" },
  { icon: "thumb_up", label: "Facebook" },
  { icon: "play_arrow", label: "YouTube" },
];

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="w-full bg-inverse-surface text-inverse-on-surface pb-24 md:pb-8">
      {/* Newsletter Band */}
      <div className="bg-gradient-to-r from-primary via-rose-600 to-rose-700 py-12 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white/5 rounded-full blur-3xl animate-float-delayed" />
        </div>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6 relative">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-extrabold text-white font-[family-name:var(--font-headline)]">
              {t("footer.newsletter.title")}
            </h3>
            <p className="text-rose-100 text-sm mt-1">{t("footer.newsletter.subtitle")}</p>
          </div>
          <form className="flex w-full md:w-auto gap-2" action="#">
            <input
              type="email"
              placeholder={t("footer.newsletter.placeholder")}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 flex-1 md:w-64 transition-all"
              required
            />
            <button className="px-6 py-3 bg-white text-primary font-bold rounded-xl text-sm hover:bg-rose-50 transition-all duration-300 shadow-lg active:scale-95 hover:shadow-xl hover:-translate-y-0.5">
              {t("footer.newsletter.subscribe")}
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-8 sm:pb-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 sm:gap-10">
          {/* Brand */}
          <div className="col-span-2 pr-6">
            <div className="flex items-center gap-2 mb-5 group">
              <Image
                src="/logo.png"
                alt="ceepyol logo"
                width={100}
                height={54}
                className="transition-transform duration-300 group-hover:scale-105 mix-blend-screen brightness-150"
                unoptimized
              />
            </div>
            <p className="text-sm text-inverse-on-surface/60 mb-6 leading-relaxed max-w-sm">
              {t("footer.brand.desc")}
            </p>
            <div className="flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  className="w-10 h-10 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center text-inverse-on-surface/50 hover:text-primary-fixed-dim hover:bg-white/15 hover:border-primary-fixed-dim/30 transition-all duration-300 hover:scale-110 hover:-translate-y-0.5 active:scale-95"
                  href="#"
                  title={s.label}
                >
                  <span className="material-symbols-outlined text-[20px]">{s.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-bold text-inverse-on-surface mb-5 uppercase tracking-wider text-xs">
              {t("footer.shop")}
            </h4>
            <ul className="space-y-3 text-sm">
              {shopLinks.map((link) => (
                <li key={link.nameKey}>
                  <Link className="text-inverse-on-surface/50 hover:text-primary-fixed-dim transition-all duration-200 hover:translate-x-1 inline-block" href={link.href}>
                    {t(link.nameKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-inverse-on-surface mb-5 uppercase tracking-wider text-xs">
              {t("footer.company")}
            </h4>
            <ul className="space-y-3 text-sm">
              {companyLinks.map((link) => (
                <li key={link.nameKey}>
                  <Link className="text-inverse-on-surface/50 hover:text-primary-fixed-dim transition-all duration-200 hover:translate-x-1 inline-block" href={link.href}>
                    {t(link.nameKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-inverse-on-surface mb-5 uppercase tracking-wider text-xs">
              {t("footer.support")}
            </h4>
            <ul className="space-y-3 text-sm">
              {supportLinks.map((link) => (
                <li key={link.nameKey}>
                  <Link className="text-inverse-on-surface/50 hover:text-primary-fixed-dim transition-all duration-200 hover:translate-x-1 inline-block" href={link.href}>
                    {t(link.nameKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/8">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-5 sm:py-6 flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
          <div className="flex flex-wrap justify-center gap-4 text-[11px] font-semibold text-inverse-on-surface/40">
            <Link href="#" className="hover:text-primary-fixed-dim transition-colors duration-200">{t("footer.legal.privacy")}</Link>
            <span className="opacity-30">|</span>
            <Link href="#" className="hover:text-primary-fixed-dim transition-colors duration-200">{t("footer.legal.terms")}</Link>
            <span className="opacity-30">|</span>
            <Link href="#" className="hover:text-primary-fixed-dim transition-colors duration-200">{t("footer.legal.cookies")}</Link>
          </div>
          <p className="text-inverse-on-surface/30 text-[11px] font-semibold">
            {t("footer.legal.copyright")}
          </p>
          <div className="flex gap-2">
            {[
              { name: "VISA", color: "from-blue-600 to-blue-800" },
              { name: "MC", color: "from-red-500 to-orange-500" },
              { name: "APPLE", color: "from-gray-600 to-gray-800" },
              { name: "PAYPAL", color: "from-blue-500 to-cyan-500" },
            ].map((method) => (
              <div
                key={method.name}
                className={`bg-gradient-to-r ${method.color} rounded-lg px-3 py-1.5 text-[9px] font-extrabold text-white tracking-wider shadow-sm transition-all duration-200 hover:scale-110 hover:shadow-md cursor-default`}
              >
                {method.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
