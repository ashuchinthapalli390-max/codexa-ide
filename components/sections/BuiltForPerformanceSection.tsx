"use client";

import React, { useRef, useEffect } from "react";
import {
  Cpu,
  Zap,
  ShieldCheck,
  HeartPulse,
  Settings,
  BarChart2,
  Globe,
} from "lucide-react";
import { getGsap } from "@/lib/motion/gsapSetup";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";
import { MOTION_EASINGS } from "@/lib/motion/tokens";

interface BentoCard {
  colSpan: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function BuiltForPerformanceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const isReduced = useReducedMotion();

  const cards: BentoCard[] = [
    {
      colSpan: "md:col-span-6",
      icon: <Cpu className="w-4 h-4 text-white" />,
      title: "In-Memory AST Compilation",
      description:
        "In-memory Abstract Syntax Tree compilation indexes project symbol graphs directly on-device without waiting for remote server round-trips.",
    },
    {
      colSpan: "md:col-span-6",
      icon: <Zap className="w-4 h-4 text-white" />,
      title: "Responsive Execution Loop",
      description:
        "Fast typing responsiveness, localized syntax checks, and immediate diff previews keep engineering workflows in an uninterrupted state of creative flow.",
    },
    {
      colSpan: "md:col-span-7",
      icon: <ShieldCheck className="w-4 h-4 text-white" />,
      title: "Configurable Privacy & Offline Mode",
      description:
        "Opt-in cloud features and support for local offline models allow development on proprietary codebases with direct on-device execution.",
    },
    {
      colSpan: "md:col-span-5",
      icon: <HeartPulse className="w-4 h-4 text-white" />,
      title: "Resilient Error Boundaries",
      description:
        "Structured error recovery boundaries prevent workspace lockups and maintain document history during complex multi-file refactoring runs.",
    },
    {
      colSpan: "md:col-span-4",
      icon: <Settings className="w-4 h-4 text-white" />,
      title: "Full Workbench Control",
      description:
        "Configurable editor layouts, multi-tab terminal matrix, and custom keybindings unified under one ergonomic developer workspace.",
    },
    {
      colSpan: "md:col-span-4",
      icon: <BarChart2 className="w-4 h-4 text-white" />,
      title: "Monorepo Scalability",
      description:
        "Engineered to navigate large codebases with multi-package symbol resolution, cross-file reference graphs, and fast project searches.",
    },
    {
      colSpan: "md:col-span-4",
      icon: <Globe className="w-4 h-4 text-white" />,
      title: "Multi-Model Intelligence",
      description:
        "Orchestrate Astra 6, Fabel 5.1, Gemini 3.8 Flash, or local Ollama models depending on your specific development requirements.",
    },
  ];

  useEffect(() => {
    if (isReduced) return;

    const { gsap, ScrollTrigger } = getGsap();
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Header entrance
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

      // Asymmetric Bento Grid Staggered Entrance
      if (gridRef.current) {
        const gridItems = gridRef.current.children;
        gsap.fromTo(
          gridItems,
          { opacity: 0, y: 30, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.07,
            ease: MOTION_EASINGS.smoothOut,
            scrollTrigger: {
              trigger: gridRef.current,
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
      className="pt-24 pb-20 px-4 sm:pt-36 sm:pb-28 sm:px-6 lg:px-8 bg-gray-300 select-none"
    >
      <div className="max-w-[1100px] mx-auto">
        {/* Eyebrow & Title */}
        <div ref={headerRef} className="text-center mb-14">
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 mb-4 block font-sans">
            WHY CHOOSE US
          </span>
          <h2 className="text-4xl sm:text-[2.75rem] font-bold tracking-tight text-black font-orbitron">
            Built for Performance
          </h2>
        </div>

        {/* Asymmetric Bento Grid matching NexCloud */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className={`group bg-gray-200 border border-gray-300 rounded-2xl p-7 flex flex-col shadow-sm hover:border-gray-400 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-default ${card.colSpan}`}
            >
              <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white mb-6 shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-200">
                {card.icon}
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-black mb-2.5 font-sans group-hover:text-neutral-900 transition-colors">
                  {card.title}
                </h3>
                <p className="text-[13px] text-gray-600 font-medium leading-relaxed pr-4 font-sans">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
