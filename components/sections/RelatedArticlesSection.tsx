"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { getGsap } from "@/lib/motion/gsapSetup";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";
import { MOTION_EASINGS } from "@/lib/motion/tokens";

interface ArticleItem {
  category: string;
  readTime: string;
  title: string;
  excerpt: string;
  date: string;
  href: string;
}

const ARTICLES: ArticleItem[] = [
  {
    category: "COMPILER BENCHMARKS",
    readTime: "4 min read",
    title: "Optimizing Local AST Indexing for 500k+ Monorepos",
    excerpt:
      "A technical investigation into in-memory abstract syntax tree generation, memory layout optimizations, and local caching strategies in CodeXa Studio.",
    date: "10 Nov 2026",
    href: "/docs/ast-indexing-architecture",
  },
  {
    category: "SECURITY & KEYCHAIN",
    readTime: "6 min read",
    title: "Zero-Telemetry Development: The Architecture of Local Keychains",
    excerpt:
      "How CodeXa stores personal provider API keys strictly inside on-device cryptographic keychains without external proxy transit.",
    date: "04 Nov 2026",
    href: "/docs/zero-telemetry-byok",
  },
  {
    category: "AI ORCHESTRATION",
    readTime: "5 min read",
    title: "Deterministic Dual-Agent Task Decomposition",
    excerpt:
      "Comparing synchronous prompt pipelines against autonomous dual-agent planner-synthesizer topologies for multi-file refactoring runs.",
    date: "28 Oct 2026",
    href: "/docs/dual-agent-task-planner",
  },
];

export function RelatedArticlesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const isReduced = useReducedMotion();

  useEffect(() => {
    if (isReduced) return;

    const { gsap, ScrollTrigger } = getGsap();
    if (!gridRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        gridRef.current!.children,
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.1,
          ease: MOTION_EASINGS.smoothOut,
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [isReduced]);

  return (
    <section ref={sectionRef} className="w-full bg-gray-300 border-t border-black/10 py-16 sm:py-24 select-none">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <span className="text-gray-500 text-[10px] font-bold tracking-widest uppercase mb-2 block font-sans">
            KNOWLEDGE BASE
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-black tracking-tight font-orbitron">
            Related Articles
          </h2>
          <p className="text-gray-600 text-sm mt-3 font-sans max-w-xl mx-auto">
            Technical deep dives, compiler benchmarks, and architecture guides from the CodeXa Agency engineering team.
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ARTICLES.map((art, idx) => (
            <Link
              key={idx}
              href={art.href}
              className="bg-gray-200 border border-gray-300 rounded-xl p-7 flex flex-col shadow-sm hover:border-gray-400 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group text-black cursor-pointer"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-4">
                <span className="px-2.5 py-1 rounded bg-black/5 text-gray-700 tracking-wider text-[10px] uppercase font-bold">
                  {art.category}
                </span>
                <span className="flex items-center gap-1 text-[11px]">
                  <Clock className="w-3 h-3 text-gray-400" />
                  {art.readTime}
                </span>
              </div>

              <h3 className="text-[17px] font-bold text-black leading-snug mb-3 group-hover:text-neutral-800 transition-colors">
                {art.title}
              </h3>

              <p className="text-[13px] text-gray-600 leading-relaxed font-sans flex-1 mb-6">
                {art.excerpt}
              </p>

              <div className="flex items-center justify-between border-t border-gray-300/80 pt-4 mt-auto text-xs font-semibold text-black group-hover:text-neutral-900">
                <span className="text-[12px] text-gray-500">{art.date}</span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Read Article
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
