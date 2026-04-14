"use client";

import { useEffect, useState } from "react";

export default function LanguageSwitcher() {
  const [locale, setLocale] = useState<"tr" | "en">("tr");

  useEffect(() => {
    const match = document.cookie.match(new RegExp('(^| )NEXT_LOCALE=([^;]+)'));
    if (match) {
      setLocale(match[2] as "tr" | "en");
    }
  }, []);

  const toggleLocale = () => {
    const newLocale = locale === "tr" ? "en" : "tr";
    setLocale(newLocale);
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
    window.dispatchEvent(new Event('localechange'));
  };

  return (
    <button
      onClick={toggleLocale}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-surface-variant/30 hover:bg-surface-variant/60 text-on-surface transition-all active:scale-95"
      title={locale === "tr" ? "Switch to English" : "Türkçe'ye Geç"}
    >
      <span className="material-symbols-outlined text-[16px]">language</span>
      {locale.toUpperCase()}
    </button>
  );
}
