"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useCartStore } from "@/lib/store/cart";
import { useAuthStore } from "@/lib/store/auth";
import { useWishlistStore } from "@/lib/store/wishlist";
import { useTheme } from "@/components/layout/ThemeProvider";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { useTranslation } from "@/lib/i18n/useTranslation";

export default function Navbar() {
  const { t } = useTranslation();

  const promoMessages = [
    t("nav.promo.0"),
    t("nav.promo.1"),
    t("nav.promo.2"),
  ];

  const categories = [
    { name: t("nav.deals"), href: "/products?category=deals", icon: "local_fire_department", isHot: true },
    { name: t("nav.iphones"), href: "/products?category=iphones", icon: "phone_iphone" },
    { name: "Galaxy", href: "/galaxy", icon: "smartphone" },
    { name: "MacBook", href: "/macbook", icon: "laptop_mac" },
    { name: "Laptop", href: "/laptop", icon: "computer" },
    { name: "AirPods", href: "/airpods", icon: "headphones" },
    { name: t("nav.watches"), href: "/products?category=watches", icon: "watch" },
    { name: t("nav.tablets"), href: "/products?category=tablets", icon: "tablet_mac" },
  ];

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [cartBounce, setCartBounce] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [promoIndex, setPromoIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const cartItems = useCartStore((s) => s.items);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const user = useAuthStore((s) => s.user);
  const initializeAuth = useAuthStore((s) => s.initialize);
  const wishlistItems = useWishlistStore((s) => s.items);
  const loadWishlist = useWishlistStore((s) => s.loadWishlist);
  const wishlistCount = wishlistItems.length;
  const prevCount = useRef(0);
  const { theme, toggleTheme } = useTheme();

  // Compute cart count from items
  const computedCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Track scroll for compact mode
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cart count with bounce animation
  useEffect(() => {
    if (computedCartCount > prevCount.current) {
      setCartBounce(true);
      setTimeout(() => setCartBounce(false), 500);
    }
    prevCount.current = computedCartCount;
    setCartCount(computedCartCount);
  }, [computedCartCount]);

  // Promo rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setPromoIndex((i) => (i + 1) % promoMessages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    void initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (isLoggedIn) {
      void loadWishlist();
    }
  }, [isLoggedIn, loadWishlist]);

  // Focus search on open
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "glass shadow-lg shadow-black/5"
            : "bg-white/90 dark:bg-surface-container-low/90 backdrop-blur-xl"
        }`}
      >
        {/* Promo Banner - Animated */}
        <div
          className={`bg-gradient-to-r from-primary via-rose-600 to-rose-700 overflow-hidden transition-all duration-300 ${
            scrolled ? "h-0 opacity-0" : "h-9"
          }`}
        >
          <div className="h-9 flex items-center justify-center text-[11px] font-bold text-white/95 tracking-wider relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                key={promoIndex}
                className="animate-fade-in-up flex items-center gap-3"
              >
                <span className="material-symbols-outlined text-[14px] text-primary-fixed-dim" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
                {promoMessages[promoIndex]}
                <span className="material-symbols-outlined text-[14px] text-primary-fixed-dim" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
              </span>
            </div>
            {/* Side Links */}
            <div className="absolute right-6 hidden md:flex gap-4 text-white/70">
              <Link href="/about" className="hover:text-white transition-colors">
                {t("nav.about")}
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                {t("nav.help")}
              </Link>
            </div>
          </div>
        </div>

        {/* Main Nav */}
        <nav
          className={`flex justify-between items-center w-full px-6 max-w-screen-2xl mx-auto gap-6 transition-all duration-300 ${
            scrolled ? "py-2.5" : "py-3.5"
          }`}
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0 group"
          >
            <Image
              src="/logo.png"
              alt="ceepyol logo"
              width={110}
              height={60}
              className="transition-all group-hover:scale-105 mix-blend-multiply dark:mix-blend-screen dark:brightness-[2] dark:contrast-125"
              unoptimized
              priority
            />
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl relative group">
            <div className="w-full relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[20px] text-on-surface-variant/50 group-focus-within:text-primary transition-colors">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("nav.search.placeholder")}
                className="w-full bg-surface-container-low/70 border border-transparent rounded-2xl py-2.5 pl-11 pr-24 focus:border-primary/30 focus:bg-white dark:focus:bg-surface-container focus:shadow-lg focus:shadow-primary/5 transition-all text-sm outline-none"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-5 py-1.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-on-primary-fixed-variant transition-all hover:shadow-md hover:shadow-primary/20 active:scale-95"
              >
                {t("nav.search.button")}
              </button>
            </div>
          </form>

          {/* Right Icons */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Mobile Search Toggle */}
            <button
              className="md:hidden w-10 h-10 flex items-center justify-center hover:bg-surface-container-low rounded-xl transition-all active:scale-90"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <span className="material-symbols-outlined text-[22px] text-on-surface-variant">
                {searchOpen ? "close" : "search"}
              </span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="hidden sm:flex w-10 h-10 items-center justify-center hover:bg-surface-container-low rounded-xl transition-all group"
              title={theme === "dark" ? "Açık mod" : "Koyu mod"}
            >
              <span className="material-symbols-outlined text-[22px] text-on-surface-variant group-hover:text-primary transition-colors" style={{ fontVariationSettings: "'FILL' 1" }}>
                {theme === "dark" ? "light_mode" : "dark_mode"}
              </span>
            </button>

            {/* Language Switcher */}
            <div className="hidden sm:flex">
              <LanguageSwitcher />
            </div>


            {/* Wishlist */}
            <Link
              href={isLoggedIn ? "/account" : "/auth/login"}
              className="hidden sm:flex w-10 h-10 items-center justify-center hover:bg-surface-container-low rounded-xl transition-all relative group"
              title="İstek Listesi"
            >
              <span className="material-symbols-outlined text-[22px] text-on-surface-variant group-hover:text-tertiary transition-colors">
                favorite
              </span>
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-tertiary text-white text-[8px] min-w-[14px] h-[14px] px-0.5 rounded-full flex items-center justify-center font-extrabold">
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </Link>

            {/* Account */}
            <Link
              href={isLoggedIn ? "/account" : "/auth/login"}
              className="w-10 h-10 flex items-center justify-center hover:bg-surface-container-low rounded-xl transition-all group relative"
            >
              {isLoggedIn && user ? (
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-white text-[10px] font-extrabold group-hover:scale-110 transition-transform">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              ) : (
                <span className="material-symbols-outlined text-[22px] text-on-surface-variant group-hover:text-primary transition-colors">
                  person
                </span>
              )}
            </Link>

            {/* Admin Link */}
            {isLoggedIn && user?.role === "admin" && (
              <Link
                href="/admin"
                className="hidden sm:flex w-10 h-10 items-center justify-center hover:bg-surface-container-low rounded-xl transition-all relative group"
                title="Yönetim Paneli"
              >
                <span className="material-symbols-outlined text-[22px] text-tertiary group-hover:text-tertiary/80 transition-colors" style={{ fontVariationSettings: "'FILL' 1" }}>
                  admin_panel_settings
                </span>
              </Link>
            )}

            {/* Cart - Enhanced */}
            <Link
              href="/cart"
              className={`relative w-10 h-10 flex items-center justify-center rounded-xl transition-all group ${
                cartCount > 0
                  ? "bg-primary/5 hover:bg-primary/10"
                  : "hover:bg-surface-container-low"
              }`}
            >
              <span
                className={`material-symbols-outlined text-[22px] transition-colors ${
                  cartCount > 0 ? "text-primary" : "text-on-surface-variant group-hover:text-primary"
                } ${cartBounce ? "animate-cart-bounce" : ""}`}
                style={cartCount > 0 ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                shopping_bag
              </span>
              {cartCount > 0 && (
                <>
                  <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-br from-primary to-primary-container text-white text-[9px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center font-extrabold shadow-md shadow-primary/30">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                  {cartBounce && (
                    <span className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] rounded-full bg-primary/40 animate-pulse-ring" />
                  )}
                </>
              )}
            </Link>

            {/* Divider */}
            <div className="w-px h-6 bg-surface-variant mx-1 hidden md:block" />

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden w-10 h-10 flex items-center justify-center hover:bg-surface-container-low rounded-xl transition-all active:scale-90"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="material-symbols-outlined text-[22px] text-on-surface-variant">
                {mobileMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </nav>

        {/* Category Links - Desktop */}
        <div
          className={`border-t border-surface-variant/60 overflow-x-auto hide-scrollbar hidden md:block transition-all duration-300 ${
            scrolled ? "h-0 opacity-0 overflow-hidden border-none" : ""
          }`}
        >
          <div className="flex items-center gap-1 px-6 py-1.5 max-w-screen-2xl mx-auto min-w-max">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all hover:bg-surface-container-low active:scale-95 ${
                  cat.isHot
                    ? "text-tertiary hover:bg-tertiary-fixed/15"
                    : "text-on-surface-variant hover:text-primary"
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[16px] ${cat.isHot ? "" : "opacity-60"}`}
                  style={cat.isHot ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {cat.icon}
                </span>
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Search - Overlay Style */}
        {searchOpen && (
          <div className="md:hidden px-4 py-3 border-t border-surface-variant/60 animate-slide-down">
            <form onSubmit={handleSearch} className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[20px] text-on-surface-variant/50">
                search
              </span>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("nav.search.placeholder")}
                className="w-full bg-surface-container-low border border-transparent rounded-2xl py-3 pl-11 pr-4 focus:border-primary/30 focus:bg-white dark:focus:bg-surface-container focus:shadow-md transition-all text-sm outline-none"
              />
            </form>
          </div>
        )}

        {/* Mobile Menu - Full Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-surface-variant/60 bg-white dark:bg-surface-container-low animate-slide-down">
            <div className="px-4 py-3 space-y-1">
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  href={cat.href}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all active:scale-[0.98] ${
                    cat.isHot
                      ? "text-tertiary bg-tertiary-fixed/10"
                      : "text-on-surface-variant hover:bg-surface-container-low"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span
                    className={`material-symbols-outlined text-[20px] ${cat.isHot ? "" : "opacity-50"}`}
                    style={cat.isHot ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    {cat.icon}
                  </span>
                  {cat.name}
                  <span className="material-symbols-outlined text-[16px] ml-auto opacity-30">
                    chevron_right
                  </span>
                </Link>
              ))}

              {/* Mobile Quick Links */}
              <div className="border-t border-surface-variant/60 mt-2 pt-2 flex gap-2">
                <Link
                  href="/about"
                  className="flex-1 text-center py-3 text-xs font-bold text-on-surface-variant hover:bg-surface-container-low rounded-xl transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("nav.about")}
                </Link>
                <Link
                  href="#"
                  className="flex-1 text-center py-3 text-xs font-bold text-on-surface-variant hover:bg-surface-container-low rounded-xl transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("nav.help")}
                </Link>
                <Link
                  href="/account"
                  className="flex-1 text-center py-3 text-xs font-bold text-on-surface-variant hover:bg-surface-container-low rounded-xl transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("nav.account")}
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Bottom Nav Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-surface-variant/60 safe-area-bottom">
        <div className="flex items-center justify-around py-1.5">
          {[
            { icon: "home", label: "Ana Sayfa", href: "/", fill: pathname === "/" },
            { icon: "grid_view", label: "Mağaza", href: "/products", fill: pathname.startsWith("/products") },
            { icon: "search", label: "Ara", href: "/search", fill: pathname === "/search" },
            { icon: "shopping_bag", label: "Sepet", href: "/cart", fill: pathname === "/cart", badge: cartCount },
            { icon: "person", label: "Hesap", href: "/account", fill: pathname === "/account" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all relative ${
                item.fill ? "text-primary" : "text-on-surface-variant"
              }`}
            >
              <span
                className="material-symbols-outlined text-[22px]"
                style={item.fill ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              <span className="text-[10px] font-semibold">{item.label}</span>
              {item.badge && item.badge > 0 && (
                <span className="absolute top-0.5 right-1 bg-primary text-white text-[8px] min-w-[14px] h-[14px] px-0.5 rounded-full flex items-center justify-center font-extrabold">
                  {item.badge > 9 ? "9+" : item.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
