/**
 * CodeXa Studio IDE — Motion Design Tokens
 * Calibrated against NexCloud visual motion reference.
 */

export const MOTION_DURATIONS = {
  micro: 0.16, // 160ms for button clicks, icons, small indicators
  buttonHover: 0.22, // 220ms for button hover and borders
  dropdownReveal: 0.28, // 280ms for dropdowns and mega menus
  cardEntrance: 0.45, // 450ms for cards and content tiles
  sectionReveal: 0.65, // 650ms for major section containers
  panelMorph: 0.55, // 550ms for IDE panel and preview shifts
  heroIntro: 1.1, // 1100ms for first-load hero choreography
} as const;

export const MOTION_EASINGS = {
  // Premium cubic-bezier curves matching high-end developer SaaS
  smoothOut: "power3.out", // GSAP: [0.22, 1, 0.36, 1]
  smoothInOut: "power2.inOut", // GSAP: [0.76, 0, 0.24, 1]
  expoOut: "expo.out",
  snappy: "back.out(1.2)", // Controlled subtle overshoot
  bezierStandard: [0.22, 1, 0.36, 1] as [number, number, number, number],
  bezierSnappy: [0.76, 0, 0.24, 1] as [number, number, number, number],
} as const;

export const MOTION_STAGGERS = {
  rapid: 0.04, // 40ms for character and word reveals
  cards: 0.08, // 80ms for card grids
  navItems: 0.05, // 50ms for menu items
  tableRows: 0.03, // 30ms for matrix rows
} as const;

