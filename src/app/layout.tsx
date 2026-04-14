import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBanner from "@/components/layout/AnnouncementBanner";
import SiteBackgroundProvider from "@/components/layout/SiteBackgroundProvider";
import ThemeProvider from "@/components/layout/ThemeProvider";
import PromoBanner from "@/components/ui/PromoBanner";
import MetaPixel from "@/components/layout/MetaPixel";

const manrope = Manrope({
  variable: "--font-headline",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-label",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ceepyol | Premium Teknoloji Mağazası",
    template: "%s | ceepyol",
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  description:
    "Yaşam tarzınız için özenle seçilmiş premium teknoloji. Sertifikalı yenilenmiş ve yeni cihazlarda en iyi fırsatlar.",
  openGraph: {
    title: "ceepyol | Premium Teknoloji Mağazası",
    description:
      "Yaşam tarzınız için özenle seçilmiş premium teknoloji. Sertifikalı yenilenmiş ve yeni cihazlarda en iyi fırsatlar.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${manrope.variable} ${inter.variable} scroll-smooth`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <MetaPixel />
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme');if(t==='dark'){document.documentElement.classList.add('dark')}})()`,
          }}
        />
        <ThemeProvider>
          <SiteBackgroundProvider />
          <AnnouncementBanner />
          <Navbar />
          <main className="flex-1 pt-[104px] md:pt-[152px]">{children}</main>
          <Footer />
          <PromoBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}
