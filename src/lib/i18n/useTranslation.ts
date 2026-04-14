"use client";

import { useEffect, useState } from "react";
import { getDictionary, Locale, Dictionary } from "./index";

export function useTranslation() {
  const [locale, setLocale] = useState<Locale>("tr");
  const [dict, setDict] = useState<Dictionary>(getDictionary("tr"));

  useEffect(() => {
    const readLocale = () => {
      const match = document.cookie.match(new RegExp('(^| )NEXT_LOCALE=([^;]+)'));
      const currentLocale = match ? (match[2] as Locale) : "tr";
      setLocale(currentLocale);
      setDict(getDictionary(currentLocale));
    };

    readLocale();
    window.addEventListener('localechange', readLocale);
    return () => window.removeEventListener('localechange', readLocale);
  }, []);

  const t = (key: keyof Dictionary) => {
    return dict[key] || key;
  };

  return { t, locale };
}
