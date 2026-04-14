'use client';

import { useRef, useEffect, useState } from 'react';

export default function ScrollVideoPromo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [opacity, setOpacity] = useState(0);

  const targetProgress = useRef(0);
  const currentProgress = useRef(0);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollableDistance = rect.height - windowHeight;
      
      // Calculate progress from 0 to 1 based on how far we've scrolled inside the container
      let progress = -rect.top / totalScrollableDistance;
      targetProgress.current = Math.max(0, Math.min(1, progress));
    };

    const updateVideo = () => {
      // Smooth interpolation (lerp)
      currentProgress.current += (targetProgress.current - currentProgress.current) * 0.1;
      
      // We check if it changed enough to trigger re-renders to save performance
      if (Math.abs(targetProgress.current - currentProgress.current) > 0.001) {
        setOpacity(currentProgress.current);
      }

      if (videoRef.current && videoRef.current.readyState >= 2 && videoRef.current.duration) {
         videoRef.current.currentTime = currentProgress.current * videoRef.current.duration;
      }

      animationFrameId.current = requestAnimationFrame(updateVideo);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    animationFrameId.current = requestAnimationFrame(updateVideo);

    return () => {
       window.removeEventListener('scroll', handleScroll);
       if (animationFrameId.current !== null) {
           cancelAnimationFrame(animationFrameId.current);
       }
    };
  }, []);

  const handleVideoLoaded = () => {
    setVideoLoaded(true);
    // Initialize first frame
    if (videoRef.current) {
        videoRef.current.currentTime = 0;
    }
  };

  return (
    <section 
      ref={containerRef} 
      className="relative w-full h-[200vh] bg-black"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">
        
        <video 
          ref={videoRef}
          src="/videos/promo.mp4" 
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
          muted
          playsInline
          preload="auto"
          onLoadedMetadata={handleVideoLoaded}
        ></video>

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/60" />

        <div 
            className="relative z-10 text-center px-4"
            // Use inline style for performance to not re-render heavy class list
            style={{ opacity: opacity }}
        >
            <p className="text-white/80 text-sm md:text-xl uppercase tracking-[0.3em] mb-4 font-light">
                Muhteşem Keşifler
            </p>
            <h2 className="text-4xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                Sınırlı Süre İndirimi
            </h2>
            <div className="flex items-center justify-center gap-4">
                <button className="px-8 py-3 bg-white text-black rounded-full font-medium hover:scale-105 transition-transform">
                   Fırsatları Keşfet
                </button>
            </div>
        </div>
      </div>
    </section>
  );
}
