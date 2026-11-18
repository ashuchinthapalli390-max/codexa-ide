/**
 * Narrative content for the scroll-driven homepage experience.
 * Product facts (models, plans, releases) are NOT duplicated here — sections
 * read them from lib/ai/models, lib/pricing/plans and lib/releases/manifest.
 */

export interface Chapter {
  id: string;
  label: string;
}

export const HOME_CHAPTERS: Chapter[] = [
  { id: "top", label: "Intro" },
  { id: "overview", label: "Overview" },
  { id: "workflow", label: "Workflow" },
  { id: "architecture", label: "Architecture" },
  { id: "models", label: "Models" },
  { id: "calculator", label: "Usage" },
  { id: "pricing", label: "Pricing" },
  { id: "compare", label: "Compare" },
  { id: "availability", label: "Platforms" },
  { id: "faq", label: "FAQ" },
];

export const MANIFESTO =
  "Most AI editors bolt a chatbot onto a text box. CodeXa Studio was built the other way around: an AST-native core that understands your whole repository, a router that sends every task to the right model, and a verification gate that checks each diff before it ever reaches your branch. Local first. Private by default. Fast enough to disappear.";

export type StageVisual = "tree" | "plan" | "code" | "verify" | "preview" | "git";

export interface WorkflowStage {
  id: string;
  step: string;
  title: string;
  kicker: string;
  model: string;
  description: string;
  metricLabel: string;
  metricValue: string;
  points: string[];
  visual: StageVisual;
}

export const WORKFLOW_STAGES: WorkflowStage[] = [
  {
    id: "index",
    step: "01",
    title: "Index",
    kicker: "Understand the repository",
    model: "CodeXa Models · AST Core",
    description:
      "Every file is parsed into a symbol graph held in memory, so the assistant reasons about functions, types and imports instead of raw text.",
    metricLabel: "AST indexing",
    metricValue: "<50ms",
    points: ["Deterministic syntax graph", "Cross-file symbol resolution", "Runs locally, zero tokens"],
    visual: "tree",
  },
  {
    id: "plan",
    step: "02",
    title: "Plan",
    kicker: "Decompose the task",
    model: "GPT-6 Astra",
    description:
      "The dual-agent planner breaks your request into ordered, reviewable steps and shows exactly which files each step will touch.",
    metricLabel: "Planning context",
    metricValue: "256k",
    points: ["Architectural decomposition", "File-level impact preview", "You approve before anything runs"],
    visual: "plan",
  },
  {
    id: "generate",
    step: "03",
    title: "Generate",
    kicker: "Write the change",
    model: "Router · best model per step",
    description:
      "Each step is routed to the model that fits it — fast Flash models for edits, frontier models for refactors, NEXA Edge when you are offline.",
    metricLabel: "Models in the router",
    metricValue: "9",
    points: ["Atomic unified diffs", "Type-safe patch synthesis", "Inline suggest stays on-device"],
    visual: "code",
  },
  {
    id: "verify",
    step: "04",
    title: "Verify",
    kicker: "Prove it compiles",
    model: "Fabel 5.1 Verification",
    description:
      "Before a diff is offered, the verification model checks type soundness and compiler invariants, then the test runner confirms behaviour.",
    metricLabel: "Gate before commit",
    metricValue: "100%",
    points: ["Type-soundness checks", "Linter invariant gate", "Tests run in the terminal matrix"],
    visual: "verify",
  },
  {
    id: "preview",
    step: "05",
    title: "Preview",
    kicker: "See it live",
    model: "Live runtime",
    description:
      "A synchronized desktop and mobile viewport renders the change as it is written — no ports to open, no separate browser tab.",
    metricLabel: "Viewports in sync",
    metricValue: "2",
    points: ["Zero-port local runtime", "Desktop + mobile split", "Hot-sync visual inspection"],
    visual: "preview",
  },
  {
    id: "ship",
    step: "06",
    title: "Ship",
    kicker: "Commit with confidence",
    model: "Visual Git",
    description:
      "Stage hunks visually, read the generated commit summary and push. Every AI edit stays traceable in your history.",
    metricLabel: "Staging granularity",
    metricValue: "Hunk",
    points: ["Visual branch graph", "Hunk-level staging", "Readable AI commit summaries"],
    visual: "git",
  },
];

export interface ArchitectureLayer {
  id: string;
  name: string;
  tag: string;
  summary: string;
  details: string[];
  stat: { label: string; value: string };
  hue: string;
}

/** Ordered top (closest to you) → bottom (closest to the machine). */
export const ARCHITECTURE_LAYERS: ArchitectureLayer[] = [
  {
    id: "shell",
    name: "Workspace Shell",
    tag: "What you touch",
    summary: "Monaco-grade editor, multi-tab workbench, integrated terminal matrix and visual Git in one window.",
    details: ["PowerShell, Bash and Zsh sessions", "Visual branch graph and hunk staging", "Command palette and theme engine"],
    stat: { label: "Shells", value: "3" },
    hue: "#FFFFFF",
  },
  {
    id: "router",
    name: "Intelligence Router",
    tag: "Who answers",
    summary: "Sends each request to the right model, meters premium units by model weight and fails over automatically.",
    details: ["Weighted unit metering (tokens × weight)", "Automatic fallback when a model retires", "Free local models never consume units"],
    stat: { label: "Models routed", value: "9" },
    hue: "#7DD3FC",
  },
  {
    id: "agents",
    name: "Agent Runtime",
    tag: "What does the work",
    summary: "Dual-agent planner and autonomous loops that read, edit and run commands inside a sandboxed workspace.",
    details: ["Deterministic task planner", "Multi-turn terminal operations", "Custom MCP server configurations"],
    stat: { label: "Concurrent requests (Max)", value: "25" },
    hue: "#C4B5FD",
  },
  {
    id: "verify",
    name: "Verification Gate",
    tag: "What keeps it safe",
    summary: "Fabel 5.1 checks every synthesized diff against type constraints and compiler invariants before you see it.",
    details: ["Type-soundness proofs", "Linter invariant gate", "Rejects diffs that break the build"],
    stat: { label: "Diffs gated", value: "All" },
    hue: "#FCD34D",
  },
  {
    id: "core",
    name: "Local Core",
    tag: "What stays yours",
    summary: "On-device NEXA Edge inference, in-memory AST cache and an OS keychain vault for your own API keys.",
    details: ["100% air-gapped offline mode", "Zero cloud telemetry by default", "BYOK keys stay in WinCred / Keychain / libsecret"],
    stat: { label: "Cloud telemetry", value: "0" },
    hue: "#22C55E",
  },
];

export const HERO_MARQUEE = [
  "AST-native core",
  "Multi-model router",
  "Fabel verification gate",
  "Offline NEXA Edge",
  "Live dual viewport",
  "Visual Git",
  "BYOK keychain vault",
  "INR billing via UPI",
];
