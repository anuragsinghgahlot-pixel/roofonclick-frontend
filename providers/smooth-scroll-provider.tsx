"use client";

import * as React from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";

export interface SmoothScrollContextType {
  lenis: Lenis | null;
}

const SmoothScrollContext = React.createContext<SmoothScrollContextType>({ lenis: null });

export function useSmoothScroll() {
  return React.useContext(SmoothScrollContext);
}

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = React.useState<Lenis | null>(null);
  const pathname = usePathname();

  React.useEffect(() => {
    // Do not initialize Lenis on admin or owner pages — dashboards and wizard forms require native scroll
    if (pathname?.startsWith("/admin") || pathname?.startsWith("/owner")) {
      setLenis(null);
      return;
    }

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    // Initialize singleton Lenis instance
    const instance = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.2,
      infinite: false,
    });

    setLenis(instance);

    // Single requestAnimationFrame loop
    let rafId: number;
    function raf(time: number) {
      instance.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    // Observe body height changes so Lenis dynamically recalculates full scroll height
    const resizeObserver = new ResizeObserver(() => {
      instance.resize();
    });

    if (document.body) {
      resizeObserver.observe(document.body);
    }

    const handleWindowResize = () => {
      instance.resize();
    };
    window.addEventListener("resize", handleWindowResize);

    // Observe body style changes to pause Lenis during Modal or Drawer scroll lock
    const styleObserver = new MutationObserver(() => {
      const isLocked = document.body.style.overflow === "hidden";
      if (isLocked) {
        instance.stop();
      } else {
        instance.start();
      }
    });

    styleObserver.observe(document.body, { attributes: true, attributeFilter: ["style"] });

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      styleObserver.disconnect();
      window.removeEventListener("resize", handleWindowResize);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  // Scroll to top on App Router route changes & recalculate full document height
  React.useEffect(() => {
    // Reset body overflow lock unless on admin layout
    if (!pathname?.startsWith("/admin")) {
      document.body.style.overflow = "";
    }

    if (lenis) {
      lenis.start();
      lenis.scrollTo(0, { immediate: true });
      const timer1 = setTimeout(() => lenis.resize(), 100);
      const timer2 = setTimeout(() => lenis.resize(), 500);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, lenis]);

  return (
    <SmoothScrollContext.Provider value={{ lenis }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
