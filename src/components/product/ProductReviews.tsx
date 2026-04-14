"use client";

import { useState } from "react";
import Image from "next/image";

interface ReviewPhoto {
  src: string;
  alt: string;
}

interface Review {
  id: string;
  name: string;
  initials: string;
  rating: number;
  date: string;
  text: string;
  photos?: ReviewPhoto[];
  verified: boolean;
}

interface ProductReviewsProps {
  reviews: Review[];
  totalReviews: number;
  averageRating: number;
}

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className="material-symbols-outlined text-amber-400"
          style={{
            fontSize: `${size}px`,
            fontVariationSettings: `'FILL' ${rating >= star ? 1 : 0}`,
          }}
        >
          star
        </span>
      ))}
    </div>
  );
}

export default function ProductReviews({
  reviews,
  totalReviews,
  averageRating,
}: ProductReviewsProps) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    pct: (reviews.filter((r) => r.rating === star).length / reviews.length) * 100,
  }));

  return (
    <>
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
          <span className="material-symbols-outlined text-amber-400 text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            reviews
          </span>
          Alıcı Yorumları
        </h2>

        {/* Summary row */}
        <div className="flex flex-col sm:flex-row gap-8 mb-10 p-6 bg-[#f5f5f7] dark:bg-[#1a1a1a] rounded-3xl">
          {/* Average score */}
          <div className="flex flex-col items-center justify-center min-w-[140px]">
            <span className="text-6xl font-black text-on-surface">
              {averageRating.toFixed(1)}
            </span>
            <StarRating rating={Math.round(averageRating)} size={20} />
            <span className="text-sm text-on-surface-variant mt-1">
              {totalReviews.toLocaleString("en-US")} değerlendirme
            </span>
          </div>

          {/* Distribution bars */}
          <div className="flex-1 space-y-2">
            {ratingDistribution.map(({ star, pct }) => (
              <div key={star} className="flex items-center gap-3">
                <span className="text-xs font-semibold text-on-surface-variant w-4 text-right">
                  {star}
                </span>
                <span
                  className="material-symbols-outlined text-amber-400 text-[12px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <div className="flex-1 h-2 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs text-on-surface-variant w-8">
                  {Math.round(pct)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Review cards */}
        <div className="space-y-6">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="p-6 rounded-3xl bg-white dark:bg-[#151515] border border-black/[0.06] dark:border-white/[0.06] shadow-sm"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {review.initials}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Header row */}
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-bold text-on-surface">{review.name}</span>
                    {review.verified && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-500/10 px-2 py-0.5 rounded-full border border-green-200 dark:border-green-500/20">
                        <span
                          className="material-symbols-outlined text-[10px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          verified
                        </span>
                        Doğrulanmış Alıcı
                      </span>
                    )}
                    <span className="text-xs text-on-surface-variant ml-auto">
                      {review.date}
                    </span>
                  </div>

                  <StarRating rating={review.rating} size={14} />

                  <p className="text-sm text-on-surface leading-relaxed mt-3">
                    {review.text}
                  </p>

                  {/* Photos */}
                  {review.photos && review.photos.length > 0 && (
                    <div className="flex gap-2 mt-4 flex-wrap">
                      {review.photos.map((photo, i) => (
                        <button
                          key={i}
                          onClick={() => setLightboxSrc(photo.src)}
                          className="relative w-20 h-20 rounded-xl overflow-hidden border border-black/10 dark:border-white/10 hover:scale-105 transition-transform duration-200 shadow-sm"
                        >
                          <Image
                            src={photo.src}
                            alt={photo.alt}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                          <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-[18px] opacity-0 group-hover:opacity-100">
                              zoom_in
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Lightbox modal */}
      {lightboxSrc && (
        <div
          className="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxSrc(null)}
        >
          <button
            onClick={() => setLightboxSrc(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <span className="material-symbols-outlined text-white text-[20px]">close</span>
          </button>
          <div
            className="relative max-w-2xl w-full max-h-[80vh] aspect-square"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightboxSrc}
              alt="Review photo"
              fill
              className="object-contain rounded-2xl"
              unoptimized
            />
          </div>
        </div>
      )}
    </>
  );
}
