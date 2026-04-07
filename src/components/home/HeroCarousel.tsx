"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

const slides = [
  {
    tag: "IPHONES",
    tagColor: "text-amber-800 bg-amber-100",
    title: "iPhone 17 Pro.",
    highlight: "Ultimate Performance.",
    highlightColor: "text-amber-600",
    description: "Innovative design for ultimate performance and battery life.",
    btnText: "Bay",
    btnClass: "bg-amber-600 text-white shadow-lg",
    bgClass: "bg-gradient-to-br from-[#fdfbf7] to-[#f4eee1]",
    glowColor: "bg-amber-500/10",
    image: "/images/products/iphone-17-pro.jpg",
    imageAlt: "iPhone 17 Pro",
    imgClass: "w-80 rounded-3xl shadow-2xl animate-float object-contain",
    href: "/products/iphone-17-pro",
  },
  {
    tag: "LAPTOPS",
    tagColor: "text-on-primary-container bg-primary-container/20",
    title: "MacBook Pro.",
    highlight: "14” and 16”.",
    highlightColor: "text-primary",
    description: "The most advanced Mac laptops for demanding tasks.",
    btnText: "Bay",
    btnClass: "bg-gradient-to-br from-primary to-primary-container text-white shadow-lg shadow-primary/20",
    bgClass: "bg-gradient-to-br from-[#F8F9FA] to-[#E8F5E9]",
    glowColor: "bg-primary/5",
    image: "/images/products/macbook-pro-14-and-16.jpg",
    imageAlt: "MacBook Pro 14” and 16”",
    imgClass: "w-96 rounded-3xl shadow-2xl animate-float object-contain",
    href: "/products/macbook-pro-14-and-16",
  },
  {
    tag: "TABLETS",
    tagColor: "text-purple-800 bg-purple-200",
    title: "iPad Pro.",
    highlight: "Advanced.",
    highlightColor: "text-purple-700",
    description: "Experience the advanced new iPad Pro.",
    btnText: "Bay",
    btnClass: "bg-purple-700 text-white shadow-lg",
    bgClass: "bg-gradient-to-br from-[#F3E5F5] to-[#E1BEE7]",
    glowColor: "bg-purple-500/10",
    image: "/images/products/ipad-pro-b15908d8a.png",
    imageAlt: "iPad Pro",
    imgClass: "w-80 rounded-xl shadow-2xl animate-float-delayed object-contain",
    href: "/products/ipad-pro-b15908d8a",
  },
  {
    tag: "WATCHES",
    tagColor: "text-blue-800 bg-blue-100",
    title: "Apple Watch.",
    highlight: "Ultra 3.",
    highlightColor: "text-blue-600",
    description: "The ultimate sports and adventure watch.",
    btnText: "Bay",
    btnClass: "bg-blue-600 text-white shadow-lg",
    bgClass: "bg-gradient-to-br from-[#F5FBFF] to-[#E3F2FD]",
    glowColor: "bg-blue-500/10",
    image: "/images/products/apple-watch-ultra-3.png",
    imageAlt: "Apple Watch Ultra 3",
    imgClass: "w-64 rounded-3xl shadow-2xl animate-float-delayed object-contain",
    href: "/products/apple-watch-ultra-3",
  },
  {
    tag: "AUDIO",
    tagColor: "text-[#0D7377] bg-white",
    title: "AirPods Max 2.",
    highlight: "Ultimate Sound.",
    highlightColor: "text-rose-300",
    description: "The ultimate over‑ear personal listening experience.",
    btnText: "Bay",
    btnClass: "bg-white text-[#1B5E20] shadow-lg",
    bgClass: "bg-gradient-to-r from-[#0D7377] to-[#1B5E20]",
    glowColor: "",
    textWhite: true,
    image: "/images/products/airpods-max-2.png",
    imageAlt: "AirPods Max 2",
    imgClass: "w-72 rounded-3xl shadow-2xl animate-float object-contain",
    href: "/products/airpods-max-2",
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);

  const goTo = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent(index);
    setProgress(0);
    setTimeout(() => setIsTransitioning(false), 700);
  }, [isTransitioning]);

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, goTo]);

  // Auto-advance with progress bar
  useEffect(() => {
    const duration = 5000;
    const interval = 50;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += interval;
      setProgress((elapsed / duration) * 100);
      if (elapsed >= duration) {
        next();
        elapsed = 0;
        setProgress(0);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [current, next]);

  return (
    <section className="relative overflow-hidden min-h-[480px] sm:min-h-[600px] lg:min-h-[819px] flex items-center bg-surface group">
      {/* Slides */}
      <div
        className="absolute inset-0 flex transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`w-full h-full flex-shrink-0 relative overflow-hidden flex items-center px-4 sm:px-6 ${slide.bgClass}`}
          >
            {/* Dark mode overlay */}
            <div className="absolute inset-0 bg-surface/80 hidden dark:block pointer-events-none z-0" />
            <div className="max-w-screen-2xl mx-auto grid grid-cols-[3fr_2fr] sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-8 lg:gap-12 items-center w-full relative z-10">
              <div className={`z-10 text-left ${slide.textWhite ? "text-white" : ""}`}>
                <span
                  className={`inline-block px-3 py-1 sm:px-4 sm:py-1.5 mb-2 sm:mb-6 text-[10px] sm:text-sm font-[family-name:var(--font-label)] font-bold tracking-wider ${slide.tagColor} rounded-full transition-all duration-700 ${
                    i === current ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                  style={{ transitionDelay: "100ms" }}
                >
                  {slide.tag}
                </span>
                <h2
                  className={`text-xl sm:text-4xl lg:text-7xl font-extrabold font-[family-name:var(--font-headline)] leading-tight ${
                    slide.textWhite ? "text-white" : "text-on-background dark:text-on-surface"
                  } mb-2 sm:mb-6 transition-all duration-700 ${
                    i === current ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                  }`}
                  style={{ transitionDelay: "200ms" }}
                >
                  {slide.title}
                  <br />
                  <span className={slide.highlightColor}>{slide.highlight}</span>
                </h2>
                <p
                  className={`hidden sm:block text-xl ${
                    slide.textWhite ? "text-rose-100" : "text-on-surface-variant"
                  } mb-6 sm:mb-10 max-w-lg transition-all duration-700 ${
                    i === current ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                  }`}
                  style={{ transitionDelay: "350ms" }}
                >
                  {slide.description}
                </p>
                <div
                  className={`flex gap-3 sm:gap-4 justify-start transition-all duration-700 ${
                    i === current ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                  }`}
                  style={{ transitionDelay: "500ms" }}
                >
                  <Link
                    href={slide.href}
                    className={`px-4 py-2.5 sm:px-8 sm:py-4 text-sm sm:text-base font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 hover:scale-105 hover:shadow-2xl active:scale-95 w-max ${slide.btnClass}`}
                  >
                    {slide.btnText}{" "}
                    <span className="material-symbols-outlined text-[18px] sm:text-[24px] transition-transform duration-300 group-hover:translate-x-1">arrow_forward</span>
                  </Link>
                </div>
              </div>
              <div className={`relative h-[160px] sm:h-[380px] lg:h-[600px] perspective-1000 transition-all duration-1000 ${
                i === current ? "opacity-100 scale-100" : "opacity-0 scale-90"
              }`}
              style={{ transitionDelay: "300ms" }}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    alt={slide.imageAlt}
                    className={`${slide.imgClass} transition-all duration-700`}
                    src={slide.image}
                    width={400}
                    height={500}
                    style={{ maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto" }}
                    unoptimized
                  />
                  {slide.glowColor && (
                    <div
                      className={`absolute inset-0 ${slide.glowColor} blur-[120px] rounded-full -z-10 animate-pulse-slow`}
                    ></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Dots */}
      <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-40 bg-black/10 backdrop-blur-md px-4 py-2.5 rounded-full">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="relative w-3 h-3 rounded-full overflow-hidden transition-all duration-300"
          >
            <span className={`absolute inset-0 rounded-full transition-all duration-300 ${
              i === current ? "bg-white/30" : "bg-white/60 hover:bg-white"
            }`} />
            {i === current && (
              <span
                className="absolute inset-0 rounded-full bg-primary origin-left transition-none"
                style={{ transform: `scaleX(${progress / 100})` }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Prev/Next - Enhanced */}
      <button
        onClick={prev}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white/50 backdrop-blur-md flex items-center justify-center text-slate-800 shadow-lg opacity-60 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 z-40 hover:bg-white hover:scale-110 hover:shadow-xl active:scale-95"
      >
        <span className="material-symbols-outlined">chevron_left</span>
      </button>
      <button
        onClick={next}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white/50 backdrop-blur-md flex items-center justify-center text-slate-800 shadow-lg opacity-60 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 z-40 hover:bg-white hover:scale-110 hover:shadow-xl active:scale-95"
      >
        <span className="material-symbols-outlined">chevron_right</span>
      </button>

      {/* Slide Counter */}
      <div className="absolute bottom-10 right-6 z-40 bg-black/10 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-white/80 hidden lg:block">
        {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
      </div>
    </section>
  );
}
