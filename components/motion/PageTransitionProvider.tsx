"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSettled, setIsSettled] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  // Initial page load / refresh blur-settling transition (200-300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSettled(true);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  // Route transition effect
  useEffect(() => {
    setIsNavigating(true);
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 220);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div
      className={`min-h-screen w-full transition-all duration-300 ease-out ${
        !isSettled
          ? "opacity-90 blur-[1px] filter"
          : isNavigating
          ? "opacity-95 translate-y-[2px]"
          : "opacity-100 blur-0 translate-y-0"
      }`}
    >
      {children}
    </div>
  );
}

