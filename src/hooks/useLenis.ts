import { useCallback } from "react";
import { getLenisInstance } from "../components/LenisProvider";

export const useLenis = () => {
  const scrollToElement = useCallback(
    (
      elementId: string,
      options?: {
        duration?: number;
        easing?: (t: number) => number;
        offset?: number;
      }
    ) => {
      const lenis = getLenisInstance();
      if (!lenis) return;

      const element = document.getElementById(elementId);
      if (!element) return;

      const { duration = 1.0, easing, offset = -80 } = options || {};

      // Calculate target position with offset
      const targetPosition = element.offsetTop + offset;

      // Use Lenis scrollTo with custom easing
      lenis.scrollTo(targetPosition, {
        duration,
        easing:
          easing ||
          ((t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t)), // Quadratic easing
      });
    },
    []
  );

  const scrollTo = useCallback(
    (
      position: number,
      options?: {
        duration?: number;
        easing?: (t: number) => number;
      }
    ) => {
      const lenis = getLenisInstance();
      if (!lenis) return;

      const { duration = 1.0, easing } = options || {};

      lenis.scrollTo(position, {
        duration,
        easing:
          easing ||
          ((t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t)),
      });
    },
    []
  );

  const stop = useCallback(() => {
    const lenis = getLenisInstance();
    if (lenis) {
      lenis.stop();
    }
  }, []);

  const start = useCallback(() => {
    const lenis = getLenisInstance();
    if (lenis) {
      lenis.start();
    }
  }, []);

  return {
    scrollToElement,
    scrollTo,
    stop,
    start,
  };
};
