import React, { useEffect, useRef } from "react";
import Lenis from "lenis";

interface LenisProviderProps {
  children: React.ReactNode;
}

// Global Lenis instance for useLenis hook
let lenisInstance: Lenis | null = null;

export const setLenisInstance = (instance: Lenis | null) => {
  lenisInstance = instance;
};

export const getLenisInstance = () => lenisInstance;

const LenisProvider: React.FC<LenisProviderProps> = ({ children }) => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis with ultra-smooth wheel scrolling
    lenisRef.current = new Lenis({
      duration: 0.6, // Slightly faster for better responsiveness
      easing: (t) => t * (2 - t), // Linear ease-out for maximum smoothness
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      mouseMultiplier: 0.9, // Slightly increased for faster response
      smoothTouch: true,
      touchMultiplier: 1.2, // Smooth touch
      infinite: false,
      lerp: 0.2, // Slightly higher lerp for faster interpolation
      wheelMultiplier: 0.7, // Slightly higher for faster wheel steps
      normalizeWheel: true, // Enable wheel normalization for consistency
    });

    // Set global instance
    setLenisInstance(lenisRef.current);

    // Optimized animation frame function for 240fps feel
    let rafId: number;
    function raf(time: number) {
      lenisRef.current?.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    // Cleanup
    return () => {
      cancelAnimationFrame(rafId);
      lenisRef.current?.destroy();
    };
  }, []);

  return <>{children}</>;
};

export default LenisProvider;
