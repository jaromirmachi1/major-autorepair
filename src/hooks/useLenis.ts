import { useEffect, useRef } from "react";
import Lenis from "lenis";

// Global Lenis instance
let lenisInstance: Lenis | null = null;

export const useLenis = () => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Get the global Lenis instance
    lenisRef.current = lenisInstance;
  }, []);

  const scrollTo = (target: string | number | HTMLElement, options?: any) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, options);
    }
  };

  const scrollToElement = (elementId: string, options?: any) => {
    const element = document.getElementById(elementId);
    if (element && lenisRef.current) {
      lenisRef.current.scrollTo(element, options);
    }
  };

  return {
    lenis: lenisRef.current,
    scrollTo,
    scrollToElement,
  };
};

// Function to set the global Lenis instance
export const setLenisInstance = (lenis: Lenis) => {
  lenisInstance = lenis;
};
