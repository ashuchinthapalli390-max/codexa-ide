"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Opacity-only settle transition.
 * Deliberately avoids transform / filter on the wrapper: either one turns this
 * div into the containing block for every position: fixed descendant, which
 * breaks fixed overlays (scroll progress, chapter rail) and pinned 3D scenes.
 */
export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSettled, setIsSettled] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsSettled(true), 150);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setIsNavigating(true);
    const timer = setTimeout(() => setIsNavigating(false), 220);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div
      className={`min-h-screen w-full transition-opacity duration-300 ease-out ${
        !isSettled ? "opacity-90" : isNavigating ? "opacity-95" : "opacity-100"
      }`}
    >
      {children}
    </div>
  );
}
