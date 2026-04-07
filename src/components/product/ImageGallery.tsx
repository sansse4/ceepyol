"use client";

import Image from "next/image";
import { useState } from "react";

interface ImageGalleryProps {
  images: { src: string; alt: string }[];
  productName: string;
}

export default function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const currentImage = images[selectedIndex] || images[0];

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative bg-surface-container-low rounded-2xl overflow-hidden aspect-square flex items-center justify-center group">
        <Image
          src={currentImage.src}
          alt={currentImage.alt || productName}
          width={500}
          height={500}
          className="w-full max-w-[280px] sm:max-w-xs md:max-w-sm object-contain group-hover:scale-110 transition-transform duration-500"
          unoptimized
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex items-center justify-center bg-surface-container-low ${
                i === selectedIndex
                  ? "border-primary"
                  : "border-transparent hover:border-outline-variant"
              }`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={80}
                height={80}
                className="w-16 object-contain"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
