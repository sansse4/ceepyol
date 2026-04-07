import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBanner from "@/components/layout/AnnouncementBanner";
import SiteBackgroundProvider from "@/components/layout/SiteBackgroundProvider";
import ThemeProvider from "@/components/layout/ThemeProvider";

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
    default: "ceepyol | Premium Tech Marketplace",
    template: "%s | ceepyol",
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  description:
    "Premium technology curated for your lifestyle. The best deals on certified refurbished and new devices.",
  openGraph: {
    title: "ceepyol | Premium Tech Marketplace",
    description:
      "Premium technology curated for your lifestyle. The best deals on certified refurbished and new devices.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable} scroll-smooth`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme');if(t==='dark'){document.documentElement.classList.add('dark')}})()`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider>
          <SiteBackgroundProvider />
          <AnnouncementBanner />
          <Navbar />
          <main className="flex-1 pt-[104px] md:pt-[152px]">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
