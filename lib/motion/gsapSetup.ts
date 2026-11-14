"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let isInitialized = false;

export function getGsap() {
  if (typeof window !== "undefined" && !isInitialized) {
    gsap.registerPlugin(ScrollTrigger);
    // Configure default GSAP settings for silky 60fps web animation
    gsap.config({
      autoSleep: 60,
      nullTargetWarn: false,
    });
    isInitialized = true;
  }
  return { gsap, ScrollTrigger };
}

export { gsap, ScrollTrigger };

