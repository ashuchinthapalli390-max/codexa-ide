"use client";

import React, { useRef, useEffect } from "react";
import {
  Code2,
  Sparkles,
  GitBranch,
  Layers,
  Key,
  Terminal,
  Cpu,
  Laptop,
} from "lucide-react";
import { getGsap } from "@/lib/motion/gsapSetup";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";
import { MOTION_EASINGS } from "@/lib/motion/tokens";

interface WorkflowCard {
  tag: string;
  title: string;
  highlight: string;
  description: string;
  icon: React.ReactNode;
}

const WORKFLOWS_ROW_1: WorkflowCard[] = [
  {
    tag: "AUTONOMOUS SYNTHESIS",
    title: "Build with AI",
    highlight: "Deterministic Dual-Agent Execution",
    description: "Orchestrate multi-step refactoring workflows with localized task planning, automated file dependency tracking, and atomic diff reviews.",
    icon: <Sparkles className="w-5 h-5 text-black" />,
  },
  {
    tag: "AST INTELLIGENCE",
    title: "Explore Complex Projects",
    highlight: "In-Memory Symbol Resolution",
    description: "Navigate million-line codebases with instant cross-file reference graphs, fast type definitions, and zero-latency symbol lookups.",
    icon: <Code2 className="w-5 h-5 text-black" />,
  },
  {
    tag: "GIT INTEGRATION",
    title: "Review Suggested Changes",
    highlight: "Visual Atomic Diff Inspection",
    description: "Inspect multi-file synthesized patches side-by-side with line-by-line acceptance, atomic hunk staging, and direct local commits.",
    icon: <GitBranch className="w-5 h-5 text-black" />,
  },
  {
    tag: "RUNTIME RUNNER",
    title: "Live Container Viewports",
    highlight: "Instant DOM & Mobile Previews",
    description: "Verify frontend component styling and reactive state changes instantly inside an integrated container without leaving the editor.",
    icon: <Layers className="w-5 h-5 text-black" />,
  },
];

const WORKFLOWS_ROW_2: WorkflowCard[] = [
  {
    tag: "LOCAL SECURITY",
    title: "Bring Your Own Key",
    highlight: "Zero-Telemetry Key Vault",
    description: "Store personal API keys in your system's native keychain. Run proprietary engineering code with complete offline air-gap safety.",
    icon: <Key className="w-5 h-5 text-black" />,
  },
  {
    tag: "MULTI-MODEL",
    title: "Orchestrate AI Models",
    highlight: "Gemini • Astra • Fabel • Ollama",
    description: "Route architectural tasks to high-reasoning models and fast inline completions to sub-50ms streaming models on demand.",
    icon: <Cpu className="w-5 h-5 text-black" />,
  },
  {
    tag: "CROSS-PLATFORM",
    title: "Unified Development",
    highlight: "Windows • macOS • Linux • Android",
    description: "Seamless workspace state synchronization across desktop workstations and mobile companion apps for code reviews on the move.",
    icon: <Laptop className="w-5 h-5 text-black" />,
  },
  {
    tag: "SHELL MATRIX",
    title: "Embedded Terminal Grid",
    highlight: "GPU-Accelerated Shell",
    description: "Multi-tab terminal with split-pane layouts, persistent sessions, and direct shell integrations for build, test, and container scripts.",
    icon: <Terminal className="w-5 h-5 text-black" />,
  },
];

export function ReviewsMarqueeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const isReduced = useReducedMotion();

  useEffect(() => {
    if (isReduced) return;

    const { gsap, ScrollTrigger } = getGsap();
    if (!headerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: MOTION_EASINGS.smoothOut,
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [isReduced]);

  return (
    <section ref={sectionRef} id="workflows" className="w-full bg-gray-300 py-24 sm:py-32 border-t border-gray-300 overflow-hidden select-none">
      <div ref={headerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4 block font-sans">
          COMMUNITY REVIEWS
        </span>
        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-black font-orbitron">
          Loved by Developers
        </h2>
        <p className="mt-4 text-[14px] text-gray-600 max-w-2xl mx-auto font-sans leading-relaxed">
          Explore real-world engineering workflows, multi-model synthesis patterns, and local development capabilities engineered into CodeXa Studio IDE.
        </p>
      </div>

      {/* Row 1: Leftward infinite scroll */}
      <div className="flex gap-6 whitespace-nowrap animate-scroll-left hover:[animation-play-state:paused] py-2">
        {WORKFLOWS_ROW_1.concat(WORKFLOWS_ROW_1).concat(WORKFLOWS_ROW_1).map((card, idx) => (
          <div
            key={idx}
            className="bg-gray-200 border border-gray-300 rounded-2xl p-6 w-[360px] sm:w-[400px] shrink-0 text-black shadow-sm flex flex-col justify-between whitespace-normal hover:border-gray-400 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-default"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-0.5 rounded-full bg-black/10 text-black text-[10px] font-mono font-bold tracking-wider uppercase">
                  {card.tag}
                </span>
                <div className="w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center text-black">
                  {card.icon}
                </div>
              </div>

              <h3 className="text-lg font-bold text-black font-orbitron mb-1 tracking-tight">
                {card.title}
              </h3>

              <div className="text-xs font-bold text-gray-700 font-sans mb-3">
                {card.highlight}
              </div>

              <p className="text-[13px] text-gray-600 font-sans leading-relaxed">
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Row 2: Rightward infinite scroll */}
      <div className="flex gap-6 whitespace-nowrap animate-scroll-right hover:[animation-play-state:paused] py-3 mt-4">
        {WORKFLOWS_ROW_2.concat(WORKFLOWS_ROW_2).concat(WORKFLOWS_ROW_2).map((card, idx) => (
          <div
            key={idx}
            className="bg-gray-200 border border-gray-300 rounded-2xl p-6 w-[360px] sm:w-[400px] shrink-0 text-black shadow-sm flex flex-col justify-between whitespace-normal hover:border-gray-400 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-default"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-0.5 rounded-full bg-black/10 text-black text-[10px] font-mono font-bold tracking-wider uppercase">
                  {card.tag}
                </span>
                <div className="w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center text-black">
                  {card.icon}
                </div>
              </div>

              <h3 className="text-lg font-bold text-black font-orbitron mb-1 tracking-tight">
                {card.title}
              </h3>

              <div className="text-xs font-bold text-gray-700 font-sans mb-3">
                {card.highlight}
              </div>

              <p className="text-[13px] text-gray-600 font-sans leading-relaxed">
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
