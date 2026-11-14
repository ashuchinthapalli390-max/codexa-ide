"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { Code2, Sparkles, Layers, Terminal, ArrowRight, Check } from "lucide-react";
import { getGsap } from "@/lib/motion/gsapSetup";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";
import { MOTION_EASINGS } from "@/lib/motion/tokens";

interface CapabilityProduct {
  id: string;
  badge?: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  icon: React.ReactNode;
  isPopular?: boolean;
}

const CAPABILITY_PRODUCTS: CapabilityProduct[] = [
  {
    id: "ide",
    badge: "CORE WORKSTATION",
    title: "CodeXa Studio IDE",
    category: "Development Environment",
    tagline: "Local-first coding engine",
    description: "An ultra-responsive desktop IDE with in-memory AST syntax indexing, multi-cursor navigation, and symbol graphs.",
    features: [
      "In-memory Abstract Syntax Tree cache",
      "Multi-cursor & cross-file symbol graphs",
      "GPU-accelerated terminal matrix",
      "Open VSX extension ecosystem support",
      "Native syntax parsers for 60+ languages",
      "Local workspace state persistence",
    ],
    ctaLabel: "Explore IDE Architecture",
    ctaHref: "/features",
    icon: <Code2 className="w-5 h-5 text-black" />,
  },
  {
    id: "ai",
    badge: "AGENTIC INTELLIGENCE",
    title: "CodeXa AI",
    category: "Multi-Model Orchestration",
    tagline: "Reasoning and code synthesis suite",
    description: "Autonomous dual-agent planning with localized token completion, multi-file atomic diffs, and BYOK keychain integration.",
    features: [
      "Deterministic dual-agent task planner",
      "Localized in-editor inline autocomplete",
      "Bring-Your-Own-Key (BYOK) local keychain",
      "Multi-model orchestration (Astra, Fabel, Gemini)",
      "Zero-telemetry on-device offline mode",
      "Transparent monthly token metering",
    ],
    ctaLabel: "View AI Capabilities",
    ctaHref: "/ai",
    icon: <Sparkles className="w-5 h-5 text-black" />,
    isPopular: true,
  },
  {
    id: "preview",
    title: "Live Preview",
    category: "Runtime Workbench",
    tagline: "Instant DOM & component feedback",
    description: "Instant hot-reload web and native container preview directly inside your active editor layout with split viewports.",
    features: [
      "Synchronized desktop and mobile viewports",
      "Hot-reload container testing runtime",
      "Integrated DOM and console inspector",
      "Zero external browser window dependencies",
      "Visual layout breakpoint debugging",
      "Live touch and pointer emulation",
    ],
    ctaLabel: "Launch Live Preview",
    ctaHref: "/workspace",
    icon: <Layers className="w-5 h-5 text-black" />,
  },
  {
    id: "devtools",
    title: "Developer Tools",
    category: "Engineering Toolchain",
    tagline: "Integrated compiler & git toolchain",
    description: "Unified developer toolchain with visual git branch graphs, atomic hunk staging, diff inspection, and debugger.",
    features: [
      "Visual git branch graph & atomic staging",
      "Line-by-line AST diff inspector",
      "Interactive breakpoint and memory debugger",
      "Cross-package monorepo dependency graph",
      "Configurable themes and Vim keybindings",
      "Automated build and test runner hooks",
    ],
    ctaLabel: "Inspect Developer Tools",
    ctaHref: "/workspace",
    icon: <Terminal className="w-5 h-5 text-black" />,
  },
];

export function ProductCardsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const isReduced = useReducedMotion();

  useEffect(() => {
    if (isReduced) return;

    const { gsap, ScrollTrigger } = getGsap();
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Animate Section Header
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 20 },
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
      }

      // Staggered Cards Entrance
      if (cardsRef.current) {
        const cards = cardsRef.current.children;
        gsap.fromTo(
          cards,
          { opacity: 0, y: 30, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.55,
            stagger: 0.1,
            ease: MOTION_EASINGS.smoothOut,
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 82%",
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isReduced]);

  return (
    <section
      ref={sectionRef}
      id="products"
      className="pt-36 sm:pt-44 pb-24 sm:pb-32 px-4 sm:px-6 lg:px-8 bg-gray-300 select-none"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header matching exact NexCloud reference image */}
        <div ref={headerRef} className="text-center mb-16">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4 block font-sans">
            PURCHASE
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-black font-orbitron">
            Our Products
          </h2>
        </div>

        {/* 4 Cards Grid (Matching exact NexCloud .bg-gray-200 border-gray-300 cards) */}
        <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {CAPABILITY_PRODUCTS.map((card) => (
            <div
              key={card.id}
              className={`group bg-gray-200 border border-gray-300 rounded-xl p-7 flex flex-col justify-between shadow-sm hover:border-gray-400 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-default text-black relative ${
                card.isPopular ? "ring-2 ring-black/20" : ""
              }`}
            >
              {card.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-sans uppercase font-bold tracking-wider px-3.5 py-0.5 rounded-full shadow-sm whitespace-nowrap">
                  {card.badge}
                </div>
              )}

              <div>
                <div className="w-10 h-10 rounded-lg bg-black/10 flex items-center justify-center mb-4 text-black group-hover:scale-105 transition-transform duration-200">
                  {card.icon}
                </div>

                <div className="text-[11px] font-mono uppercase text-gray-500 font-semibold tracking-wider mb-1">
                  {card.category}
                </div>

                <h3 className="text-[20px] font-bold text-black mb-2 tracking-tight">
                  {card.title}
                </h3>

                <p className="text-[13px] text-gray-600 mb-6 font-medium leading-relaxed">
                  {card.description}
                </p>

                {/* Features list */}
                <div className="border-t border-gray-300/80 pt-4 mb-6">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-3">
                    INCLUDED CAPABILITIES
                  </div>
                  <ul className="flex flex-col gap-2.5 text-[12.5px] text-gray-700">
                    {card.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5">
                        <Check className="w-3.5 h-3.5 text-black shrink-0 mt-0.5" />
                        <span className="leading-tight">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <Link
                  href={card.ctaHref}
                  className="w-full py-2.5 px-4 rounded-lg bg-black hover:bg-neutral-800 active:scale-[0.98] text-white text-[13px] font-sans font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <span>{card.ctaLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
