"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAdminStore } from "@/lib/store/admin";

function useCountdown(endsAt: string) {
  const [timeLeft, setTimeLeft] = useState(() => Math.max(0, new Date(endsAt).getTime() - Date.now()));

  useEffect(() => {
    const interval = setInterval(() => {
      const left = Math.max(0, new Date(endsAt).getTime() - Date.now());
      setTimeLeft(left);
    }, 1000);
    return () => clearInterval(interval);
  }, [endsAt]);

  return {
    days: Math.floor(timeLeft / 86400000),
    hours: Math.floor((timeLeft % 86400000) / 3600000),
    mins: Math.floor((timeLeft % 3600000) / 60000),
    secs: Math.floor((timeLeft % 60000) / 1000),
    expired: timeLeft === 0,
  };
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <div className="flex flex-col items-center bg-white/15 backdrop-blur-sm rounded-xl px-3 sm:px-4 py-2 min-w-[52px] sm:min-w-[64px] border border-white/10">
        <span className="text-xl sm:text-3xl font-bold tabular-nums leading-none">
          {String(value).padStart(2, "0")}
        </span>
        <span className="text-[9px] sm:text-[10px] uppercase tracking-widest opacity-60 mt-0.5">
          {label}
        </span>
      </div>
    </div>
  );
}

export default function FlashSaleCountdown() {
  const flashSale = useAdminStore((s) => s.flashSale);
  const { days, hours, mins, secs, expired } = useCountdown(flashSale.endsAt);

  if (!flashSale.active || expired) return null;

  const href = flashSale.productIds.length === 1
    ? `/products`
    : `/products`;

  return (
    <section className="py-10 sm:py-16 px-6 relative overflow-hidden">
      <div
        className="max-w-screen-2xl mx-auto rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden group"
        style={{ background: `linear-gradient(135deg, ${flashSale.bgFrom}, ${flashSale.bgTo})` }}
      >
        {/* Animated background blobs */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-[80px] transition-all duration-1000 group-hover:scale-110 pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-black/10 rounded-full blur-[80px] transition-all duration-1000 group-hover:scale-110 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 text-white">
          {/* Text */}
          <div className="text-center lg:text-left">
            <span className="inline-block px-3 py-1 bg-white/15 rounded-full text-[10px] font-extrabold tracking-widest uppercase mb-3 border border-white/20">
              {flashSale.label}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-[family-name:var(--font-headline)] leading-tight mb-2">
              {flashSale.title}
            </h2>
            <p className="text-white/70 text-base sm:text-lg mb-6 lg:mb-0">
              Save up to{" "}
              <span className="text-white font-extrabold text-xl">{flashSale.discount}%</span>{" "}
              {flashSale.productIds.length === 0 ? "on all products" : `on ${flashSale.productIds.length} selected product${flashSale.productIds.length > 1 ? "s" : ""}`}
            </p>
          </div>

          {/* Timer + CTA */}
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <TimeBlock value={days} label="Days" />
              <span className="text-2xl font-bold opacity-40 -mt-3">:</span>
              <TimeBlock value={hours} label="Hrs" />
              <span className="text-2xl font-bold opacity-40 -mt-3">:</span>
              <TimeBlock value={mins} label="Min" />
              <span className="text-2xl font-bold opacity-40 -mt-3">:</span>
              <TimeBlock value={secs} label="Sec" />
            </div>

            <Link
              href={href}
              className="px-8 py-3.5 bg-white font-extrabold rounded-xl text-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-black/30 active:scale-95"
              style={{ color: flashSale.bgTo }}
            >
              Shop the Sale →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
