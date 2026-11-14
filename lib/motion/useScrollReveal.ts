"use client";

import { useEffect, useRef } from "react";
import { getGsap } from "./gsapSetup";
import { MOTION_DURATIONS, MOTION_EASINGS } from "./tokens";
import { useReducedMotion } from "./useReducedMotion";

interface ScrollRevealOptions {
  triggerOffset?: string;
  duration?: number;
  yOffset?: number;
  stagger?: number;
  childSelector?: string;
  once?: boolean;
}

export function useScrollReveal<T extends HTMLElement>(
  options: ScrollRevealOptions = {}
) {
  const containerRef = useRef<T>(null);
  const isReduced = useReducedMotion();

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current || isReduced) return;

    const { gsap, ScrollTrigger } = getGsap();
    const element = containerRef.current;
    const {
      triggerOffset = "top 85%",
      duration = MOTION_DURATIONS.sectionReveal,
      yOffset = 24,
      stagger = 0.08,
      childSelector,
      once = true,
    } = options;

    const targets = childSelector
      ? element.querySelectorAll(childSelector)
      : element;

    if (!targets || (targets instanceof NodeList && targets.length === 0)) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        {
          opacity: 0,
          y: yOffset,
        },
        {
          opacity: 1,
          y: 0,
          duration,
          stagger: childSelector ? stagger : 0,
          ease: MOTION_EASINGS.smoothOut,
          scrollTrigger: {
            trigger: element,
            start: triggerOffset,
            toggleActions: once
              ? "play none none none"
              : "play reverse play reverse",
          },
        }
      );
    }, element);

    return () => {
      ctx.revert();
    };
  }, [options, isReduced]);

  return containerRef;
}

