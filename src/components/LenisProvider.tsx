import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { setLenisInstance } from "../hooks/useLenis";

interface LenisProviderProps {
  children: React.ReactNode;
}

const LenisProvider: React.FC<LenisProviderProps> = ({ children }) => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis
    lenisRef.current = new Lenis({
      duration: 0.8, // Even faster for 240fps feel
      easing: (t) => t * (2 - t), // Linear ease-out for maximum smoothness
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      mouseMultiplier: 1.5, // Balanced for smoothness
      smoothTouch: true,
      touchMultiplier: 1.2, // Smooth touch
      infinite: false,
      lerp: 0.25, // Much higher lerp for 240fps smoothness
      wheelMultiplier: 1.5, // Balanced wheel sensitivity
      normalizeWheel: false,
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
