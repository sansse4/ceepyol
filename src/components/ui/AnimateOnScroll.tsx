'use client';

import { useRef, useEffect, ReactNode, createElement } from 'react';

interface AnimateOnScrollProps {
  children: ReactNode;
  animation?: string;
  delay?: number;
  threshold?: number;
  className?: string;
  as?: string;
}

export default function AnimateOnScroll({
  children,
  animation = 'animate-fade-in-up',
  delay = 0,
  threshold = 0.1,
  className = '',
  as = 'div',
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Set initial state
    element.style.opacity = '0';
    element.style.transform = 'translateY(32px)';
    element.style.transition = `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
          element.classList.add(animation);
          observer.unobserve(element);
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [animation, delay, threshold]);

  return createElement(
    as,
    { ref, className },
    children
  );
}
