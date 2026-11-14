"use client";

import { useEffect, useRef, useState } from "react";
import { getGsap } from "./gsapSetup";
import { useReducedMotion } from "./useReducedMotion";

interface CountUpOptions {
  start?: number;
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}

export function useCountUp(options: CountUpOptions) {
  const { start = 0, end, duration = 1.6, suffix = "", prefix = "", decimals = 0 } = options;
  const [displayValue, setDisplayValue] = useState<string>(
    `${prefix}${start.toFixed(decimals)}${suffix}`
  );
  const elementRef = useRef<HTMLDivElement>(null);
  const isReduced = useReducedMotion();

  useEffect(() => {
    if (isReduced) {
      setDisplayValue(`${prefix}${end.toFixed(decimals)}${suffix}`);
      return;
    }

    if (typeof window === "undefined" || !elementRef.current) return;

    const { gsap, ScrollTrigger } = getGsap();
    const el = elementRef.current;
    const targetObj = { val: start };

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        once: true,
        onEnter: () => {
          gsap.to(targetObj, {
            val: end,
            duration,
            ease: "power2.out",
            onUpdate: () => {
              const formatted = decimals > 0 
                ? targetObj.val.toFixed(decimals)
                : Math.round(targetObj.val).toLocaleString();
              setDisplayValue(`${prefix}${formatted}${suffix}`);
            },
          });
        },
      });
    }, el);

    return () => {
      ctx.revert();
    };
  }, [start, end, duration, prefix, suffix, decimals, isReduced]);

  return { ref: elementRef, value: displayValue };
}

