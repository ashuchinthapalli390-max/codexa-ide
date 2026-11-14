"use client";

import React, { useState, useEffect } from "react";
import { useReducedMotion } from "./useReducedMotion";

export const HERO_ROTATING_PHRASES = [
  "Powered by intelligence.",
  "Built for developers.",
  "Designed for creators.",
  "One workspace. More possibilities.",
] as const;

export function useHeroText(intervalMs = 3200) {
  const [index, setIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isReduced = useReducedMotion();

  useEffect(() => {
    if (isReduced) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % HERO_ROTATING_PHRASES.length);
        setIsTransitioning(false);
      }, 350); // half transition duration
    }, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs, isReduced]);

  return {
    currentPhrase: HERO_ROTATING_PHRASES[index],
    index,
    isTransitioning,
  };
}

