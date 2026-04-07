"use client";

import { useState, useEffect } from "react";
import { useAdminStore } from "@/lib/store/admin";
import Link from "next/link";

export default function AnnouncementBanner() {
  const [mounted, setMounted] = useState(false);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const announcements = useAdminStore((s) => s.announcements);
  const loadData = useAdminStore((s) => s.loadData);
  const active = announcements.filter((a) => a.active && !dismissed.includes(a.id));

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const banners = active.filter((a) => a.type === "banner");
  const popups = active.filter((a) => a.type === "popup");
  const bars = active.filter((a) => a.type === "bar");

  // Show popup after a short delay
  useEffect(() => {
    if (popups.length > 0) {
      const t = setTimeout(() => setShowPopup(true), 2000);
      return () => clearTimeout(t);
    }
  }, [popups.length]);

  if (!mounted) return null;
  if (active.length === 0) return null;

  return (
    <>
      {/* Top Banners */}
      {banners.map((ann) => (
        <div key={ann.id} style={{ backgroundColor: ann.bgColor, color: ann.textColor }}
          className="relative flex items-center justify-center px-4 py-2.5 text-sm font-bold animate-fade-in-down">
          {ann.link ? (
            <Link href={ann.link} className="hover:opacity-80 transition-opacity">{ann.text}</Link>
          ) : (
            <span>{ann.text}</span>
          )}
          <button onClick={() => setDismissed([...dismissed, ann.id])} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      ))}

      {/* Bottom Bars */}
      {bars.map((ann) => (
        <div key={ann.id} style={{ backgroundColor: ann.bgColor, color: ann.textColor }}
          className="fixed bottom-0 md:bottom-4 left-0 md:left-4 right-0 md:right-4 z-[60] px-4 py-3 md:rounded-2xl text-sm font-bold flex items-center justify-between shadow-2xl animate-fade-in-up">
          <div className="flex items-center gap-2 flex-1">
            <span className="material-symbols-outlined text-lg">campaign</span>
            {ann.link ? <Link href={ann.link} className="hover:underline">{ann.text}</Link> : <span>{ann.text}</span>}
          </div>
          <button onClick={() => setDismissed([...dismissed, ann.id])} className="opacity-60 hover:opacity-100 ml-3 flex-shrink-0">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      ))}

      {/* Popups */}
      {showPopup && popups.length > 0 && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in-up">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowPopup(false)} />
          <div className="relative bg-surface-container-lowest dark:bg-surface-container rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
            {popups.map((ann) => (
              <div key={ann.id} style={{ backgroundColor: ann.bgColor, color: ann.textColor }} className="p-8 text-center">
                <span className="material-symbols-outlined text-4xl mb-4 block opacity-80">campaign</span>
                <p className="text-xl font-extrabold mb-3">{ann.text}</p>
                {ann.link && (
                  <Link href={ann.link} onClick={() => setShowPopup(false)}
                    className="inline-block mt-2 px-6 py-2.5 bg-white/20 backdrop-blur-sm rounded-xl font-bold text-sm hover:bg-white/30 transition-all">
                    Learn More →
                  </Link>
                )}
              </div>
            ))}
            <button onClick={() => { setShowPopup(false); popups.forEach((p) => setDismissed((d) => [...d, p.id])); }}
              className="absolute top-3 right-3 w-8 h-8 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/30 transition-all">
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
