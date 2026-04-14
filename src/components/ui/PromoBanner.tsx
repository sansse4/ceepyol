"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import CountdownTimer from "./CountdownTimer";
import { getPromoEndDate } from "@/lib/config/promotions";

const PROMO_PRODUCT_SLUG = "iphone-17-pro-max";
const PROMO_IMAGE = "/images/products/ip17pm-orange.jpg";

export default function PromoBanner() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const wasDismissed = sessionStorage.getItem("promo_dismissed") === "1";
    if (wasDismissed) return;
    const end = getPromoEndDate();
    if (!end || end.getTime() <= Date.now()) return;
    const t = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const handleExpire = useCallback(() => setVisible(false), []);

  const handleDismiss = () => {
    sessionStorage.setItem("promo_dismissed", "1");
    setDismissed(true);
    setTimeout(() => setVisible(false), 400);
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed right-4 bottom-6 z-50 w-[280px] transition-all duration-500 ${
        dismissed
          ? "translate-x-[120%] opacity-0"
          : "translate-x-0 opacity-100"
      }`}
      role="complementary"
      aria-label="Promosyon Afişi"
    >
      {/* Card */}
      <div
        className="relative rounded-2xl overflow-hidden border group"
        style={{
          background: "linear-gradient(160deg, #0d1117 0%, #0a0a0a 60%, #111827 100%)",
          borderColor: "rgba(240,165,0,0.6)",
          boxShadow:
            "0 0 0 1px rgba(240,165,0,0.15), 0 25px 50px rgba(0,0,0,0.6), 0 0 80px rgba(240,165,0,0.05)",
        }}
      >
        {/* Hover glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
          style={{
            boxShadow: "inset 0 0 40px rgba(240,165,0,0.08)",
          }}
        />

        {/* Top ambient light */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Dismiss button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 z-20 w-7 h-7 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
          aria-label="Kapat"
        >
          <span className="material-symbols-outlined text-white/70 text-[15px]">
            close
          </span>
        </button>

        {/* Top badge */}
        <div className="pt-5 px-5 flex items-center gap-2">
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase"
            style={{
              background: "linear-gradient(90deg, #f0a500 0%, #e07b00 100%)",
              color: "#0a0a0a",
            }}
          >
            <span
              className="material-symbols-outlined text-[10px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              bolt
            </span>
            SINIRLI SÜRE
          </div>
          <div className="text-[10px] text-white/40 font-medium">Özel Teklif</div>
        </div>

        {/* Headline */}
        <div className="px-5 pt-3 pb-1">
          <p className="text-white font-black text-lg leading-tight tracking-tight">
            Kaçırma!
          </p>
          <p
            className="font-black text-base leading-snug"
            style={{
              background: "linear-gradient(90deg, #f0a500 0%, #fbbf24 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            iPhone 17 Pro Max&apos;ta %50 İndirim
          </p>
        </div>

        {/* Product image — large and centered */}
        <Link href={`/products/${PROMO_PRODUCT_SLUG}`} className="block px-4 py-2">
          <div className="relative w-full aspect-[3/4] flex items-center justify-center">
            <Image
              src={PROMO_IMAGE}
              alt="iPhone 17 Pro Max"
              fill
              className="object-contain drop-shadow-2xl hover:scale-[1.04] transition-transform duration-500"
              sizes="260px"
              unoptimized
            />
          </div>
        </Link>

        {/* Bottom content */}
        <div className="px-5 pb-5 space-y-3">
          {/* Discount code */}
          <div>
            <p className="text-[10px] text-white/50 font-semibold mb-1.5 uppercase tracking-widest">
              İndirim Kodu:
            </p>
            <div
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl"
              style={{
                background: "linear-gradient(90deg, rgba(240,165,0,0.15) 0%, rgba(240,165,0,0.08) 100%)",
                border: "1px solid rgba(240,165,0,0.35)",
              }}
            >
              <span
                className="material-symbols-outlined text-amber-400 text-[16px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                local_offer
              </span>
              <span
                className="font-black tracking-[0.2em] text-sm"
                style={{ fontFamily: "monospace", color: "#f0a500" }}
              >
                ceep100
              </span>
            </div>
          </div>

          {/* Countdown */}
          <div
            className="rounded-xl p-3"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest mb-2">
              Kampanya Bitimine Kalan Süre:
            </p>
            <CountdownTimer variant="banner" onExpire={handleExpire} />
          </div>

          {/* CTA */}
          <Link
            href={`/products/${PROMO_PRODUCT_SLUG}`}
            className="block w-full py-3 text-center font-black text-sm rounded-xl transition-all duration-200 hover:brightness-110 active:scale-[0.97]"
            style={{
              background: "linear-gradient(90deg, #f0a500 0%, #e07b00 100%)",
              color: "#0a0a0a",
              boxShadow: "0 4px 20px rgba(240,165,0,0.35)",
            }}
          >
            Hemen Al →
          </Link>
        </div>
      </div>
    </div>
  );
}
