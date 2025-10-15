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
      duration: 0.6,
      easing: (t) => t * (2 - t),
      touchMultiplier: 1.2,
      infinite: false,
      lerp: 0.2,
      wheelMultiplier: 0.7,
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
