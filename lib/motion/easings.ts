/**
 * CodeXa Studio IDE — Easing Constants & Curve Helpers
 */

export const EASING_CSS = {
  smoothOut: "cubic-bezier(0.22, 1, 0.36, 1)",
  smoothInOut: "cubic-bezier(0.76, 0, 0.24, 1)",
  accelerate: "cubic-bezier(0.4, 0, 1, 1)",
  decelerate: "cubic-bezier(0, 0, 0.2, 1)",
} as const;

export const GSAP_EASINGS = {
  primary: "power3.out",
  secondary: "power2.out",
  reveal: "expo.out",
  morph: "power2.inOut",
} as const;

