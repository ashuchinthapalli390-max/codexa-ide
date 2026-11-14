"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Terminal,
  Cpu,
  ShieldCheck,
  Boxes,
  Lock,
  ArrowRight,
} from "lucide-react";

export function FeatureShowcaseSection() {
  const [activeCategory, setActiveCategory] = useState<"core" | "ai" | "security" | "workflow">("core");

  return (
    <section id="features" className="py-24 sm:py-32 bg-[#000000] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <span className="text-xs sm:text-sm font-sans font-medium uppercase tracking-[2px] text-[#9CA3AF] block">
            ARCHITECTURAL ENGINEERING
          </span>

          <h2 className="text-3xl sm:text-[44px] font-orbitron font-bold tracking-[-1.1px] text-white leading-tight">
            Precision tooling. <br />
            <span>Engineered for software craftsmen.</span>
          </h2>

          <p className="text-[14px] font-sans font-normal text-white/70 leading-[22.75px]">
            Every subsystem within CodeXa Studio IDE is optimized for local-first execution, deep context reasoning, and deterministic control. No gimmicks, no bloat.
          </p>
        </div>

        {/* Feature Category Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1 rounded-xl bg-[#121316] border border-white/10 text-[13px] font-sans font-semibold">
            {[
              { id: "core", label: "Core Workbench" },
              { id: "ai", label: "Agentic & Models" },
              { id: "security", label: "Local-First & Auth" },
              { id: "workflow", label: "Git & Terminals" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-4 py-2 rounded-[8px] transition-all ${
                  activeCategory === cat.id
                    ? "bg-white/10 text-white font-bold shadow-sm"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bento-Style High-Impact Grid (NexCloud #121316 cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Large Editorial Bento (spans 2 cols) */}
          <div className="md:col-span-2 rounded-2xl bg-[#121316] border border-white/10 p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden group hover:border-white/20 transition-colors">
            <div className="space-y-4 max-w-xl">
              <div className="w-12 h-12 rounded-xl bg-[#18181D] border border-white/10 flex items-center justify-center text-white">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-orbitron font-bold text-white">
                Zero-Latency Abstract Syntax Tree Indexing
              </h3>
              <p className="text-sm text-white/70 font-sans leading-relaxed">
                CodeXa computes and maintains incremental syntax graphs in memory as you type. Refactors that traverse thousands of files complete in milliseconds without blocking the UI thread.
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono text-white/60">
                <span className="px-2.5 py-1 rounded bg-[#18181D] border border-white/5">
                  Incremental AST Cache
                </span>
                <span className="px-2.5 py-1 rounded bg-[#18181D] border border-white/5">
                  Sub-50ms Type Resolution
                </span>
                <span className="px-2.5 py-1 rounded bg-[#18181D] border border-white/5">
                  Cross-File Symbol Graph
                </span>
              </div>
            </div>

            {/* Visual technical annotation snippet */}
            <div className="mt-8 pt-6 border-t border-white/5 font-mono text-xs text-white/50 flex items-center justify-between">
              <span>Benchmark: 120,000 LOC parsed in 18ms</span>
              <span className="text-[#22C55E] font-bold">&bull; Realtime</span>
            </div>
          </div>

          {/* Card 2: Local-First Privacy (1 col) */}
          <div className="rounded-2xl bg-[#121316] border border-white/10 p-8 flex flex-col justify-between hover:border-white/20 transition-colors">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#18181D] border border-white/10 flex items-center justify-center text-white">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-orbitron font-bold text-white">
                100% Local-First Security
              </h3>
              <p className="text-sm text-white/70 font-sans leading-relaxed">
                Your proprietary source code stays on your physical workstation. Model queries strip identifying tokens, or run fully offline using the on-device NEXA engine.
              </p>
            </div>

            <div className="pt-6 border-t border-white/5 text-xs font-mono text-white/70 flex items-center gap-2">
              <Lock className="w-3.5 h-3.5" /> Zero Cloud Telemetry by Default
            </div>
          </div>

          {/* Card 3: Multi-Session Pseudo-Terminal (1 col) */}
          <div className="rounded-2xl bg-[#121316] border border-white/10 p-8 flex flex-col justify-between hover:border-white/20 transition-colors">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#18181D] border border-white/10 flex items-center justify-center text-white">
                <Terminal className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-orbitron font-bold text-white">
                Integrated Multiplex Terminal
              </h3>
              <p className="text-sm text-white/70 font-sans leading-relaxed">
                Native PowerShell, Bash, and Zsh shell environments with split views, command synthesis, and environment variable sandboxing.
              </p>
            </div>

            <div className="pt-6 border-t border-white/5 text-xs font-mono text-white/50">
              Multi-split panes &bull; PTY Process Isolation
            </div>
          </div>

          {/* Card 4: Model Context Protocol (MCP) Integration (2 cols) */}
          <div className="md:col-span-2 rounded-2xl bg-[#121316] border border-white/10 p-8 sm:p-10 flex flex-col justify-between hover:border-white/20 transition-colors">
            <div className="space-y-4 max-w-xl">
              <div className="w-12 h-12 rounded-xl bg-[#18181D] border border-white/10 flex items-center justify-center text-white">
                <Boxes className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-orbitron font-bold text-white">
                Model Context Protocol (MCP) &amp; Extensibility
              </h3>
              <p className="text-sm text-white/70 font-sans leading-relaxed">
                Connect external databases, REST APIs, Supabase clusters, and internal agency sidecars directly into the AI runtime using standardized MCP server definitions.
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono text-white/60">
                <span className="px-2.5 py-1 rounded bg-[#18181D] border border-white/5">
                  Standardized MCP Handshakes
                </span>
                <span className="px-2.5 py-1 rounded bg-[#18181D] border border-white/5">
                  Supabase &amp; Postgres Tools
                </span>
                <span className="px-2.5 py-1 rounded bg-[#18181D] border border-white/5">
                  Custom Agency Connectors
                </span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 text-xs font-mono text-white/50 flex items-center justify-between">
              <span>Compatible with RFC-compliant tool servers</span>
              <span className="text-white font-bold">Standard v1.32</span>
            </div>
          </div>
        </div>

        {/* Feature Documentation CTA */}
        <div className="mt-16 text-center">
          <Button
            variant="secondary"
            size="md"
            href="/features"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Explore Complete Feature Architecture
          </Button>
        </div>
      </div>
    </section>
  );
}
