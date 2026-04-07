"use client";

import { useEffect, useState } from "react";
import { useAdminStore } from "@/lib/store/admin";
import { useTheme } from "@/components/layout/ThemeProvider";

export default function SiteBackgroundProvider() {
  const [mounted, setMounted] = useState(false);
  const siteSettings = useAdminStore((s) => s.siteSettings);
  const loadData = useAdminStore((s) => s.loadData);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      void loadData();
    }
  }, [mounted, loadData]);

  useEffect(() => {
    if (!mounted) return;
    const body = document.body;

    // Reset
    body.style.backgroundImage = "";
    body.style.backgroundColor = "";
    body.style.backgroundSize = "";
    body.style.backgroundPosition = "";
    body.style.backgroundAttachment = "";

    // In dark mode, let CSS variables handle the background
    if (theme === "dark") return;

    const { bgMode, bgColor, bgGradient, bgImage } = siteSettings;

    if (bgMode === "color") {
      body.style.backgroundColor = bgColor;
    } else if (bgMode === "gradient") {
      body.style.backgroundImage = bgGradient;
    } else if (bgMode === "image" && bgImage) {
      body.style.backgroundImage = `url(${bgImage})`;
      body.style.backgroundSize = "cover";
      body.style.backgroundPosition = "center";
      body.style.backgroundAttachment = "fixed";
    }

    if (siteSettings.primaryColor) {
      document.documentElement.style.setProperty('--color-primary', siteSettings.primaryColor);
    }
  }, [mounted, siteSettings, theme]);

  return null;
}
