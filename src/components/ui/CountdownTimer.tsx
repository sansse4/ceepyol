"use client";

import { useEffect, useState } from "react";
import { getPromoEndDate } from "@/lib/config/promotions";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

function calcTimeLeft(endDate: Date): TimeLeft {
  const diff = endDate.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  const totalSec = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSec / 86400),
    hours: Math.floor((totalSec % 86400) / 3600),
    minutes: Math.floor((totalSec % 3600) / 60),
    seconds: totalSec % 60,
    expired: false,
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

interface CountdownTimerProps {
  /** Called once when the promotion expires */
  onExpire?: () => void;
  /** Visual variant */
  variant?: "banner" | "compact" | "product";
}

export default function CountdownTimer({
  onExpire,
  variant = "compact",
}: CountdownTimerProps) {
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false,
  });

  // Initialise end date from localStorage (client-only)
  useEffect(() => {
    const d = getPromoEndDate();
    setEndDate(d);
  }, []);

  // Tick every second
  useEffect(() => {
    if (!endDate) return;
    const update = () => {
      const left = calcTimeLeft(endDate);
      setTimeLeft(left);
      if (left.expired) onExpire?.();
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [endDate, onExpire]);

  if (timeLeft.expired) return null;

  // ── Variants ──────────────────────────────────────────────────────
  if (variant === "banner") {
    return (
      <div className="flex items-center justify-center gap-1.5 mt-2">
        {[
          { v: timeLeft.days, label: "Gün" },
          { v: timeLeft.hours, label: "Saat" },
          { v: timeLeft.minutes, label: "Dk" },
          { v: timeLeft.seconds, label: "Sn" },
        ].map((seg, i) => (
          <div key={seg.label} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-white/60 font-bold text-sm mb-3">:</span>}
            <div className="flex flex-col items-center">
              <span className="bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1 text-white font-bold text-lg leading-none tabular-nums min-w-[36px] text-center">
                {pad(seg.v)}
              </span>
              <span className="text-[9px] text-white/70 mt-0.5 font-medium">{seg.label}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "product") {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <span className="material-symbols-outlined text-[16px] text-red-500">timer</span>
        <span className="text-xs font-bold text-red-500">Fırsat bitiyor:</span>
        <div className="flex items-center gap-1 font-mono font-bold text-sm tabular-nums">
          <span className="bg-red-500/10 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded">{pad(timeLeft.days)}g</span>
          <span className="text-red-400">:</span>
          <span className="bg-red-500/10 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded">{pad(timeLeft.hours)}s</span>
          <span className="text-red-400">:</span>
          <span className="bg-red-500/10 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded">{pad(timeLeft.minutes)}d</span>
          <span className="text-red-400">:</span>
          <span className="bg-red-500/10 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded">{pad(timeLeft.seconds)}sn</span>
        </div>
      </div>
    );
  }

  // compact (default)
  return (
    <div className="flex items-center gap-1 font-mono font-bold text-xs tabular-nums">
      <span>{pad(timeLeft.days)}</span>
      <span className="opacity-50">:</span>
      <span>{pad(timeLeft.hours)}</span>
      <span className="opacity-50">:</span>
      <span>{pad(timeLeft.minutes)}</span>
      <span className="opacity-50">:</span>
      <span>{pad(timeLeft.seconds)}</span>
    </div>
  );
}
