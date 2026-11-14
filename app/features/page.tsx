import React from "react";
import type { Metadata } from "next";
import { FeatureShowcaseSection } from "@/components/sections/FeatureShowcaseSection";
import { ThemeExplorerSection } from "@/components/sections/ThemeExplorerSection";
import { Button } from "@/components/ui/Button";
import { Download, Cpu, ShieldCheck, Terminal, Boxes, Zap, GitBranch } from "lucide-react";

export const metadata: Metadata = {
  title: "Features & Architecture",
  description:
    "Explore the architectural capabilities of CodeXa Studio IDE: local-first AST caching, unified terminal multiplexing, and MCP server integrations.",
};

export default function FeaturesPage() {
  return (
    <div className="pt-28 pb-20 bg-[#000000]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs sm:text-sm font-sans font-medium uppercase tracking-[2px] text-[#9CA3AF] block">
            TECHNICAL ARCHITECTURE
          </span>
          <h1 className="text-4xl sm:text-6xl font-orbitron font-bold tracking-tight text-white leading-tight">
            Engineered for <span className="text-white">Uncompromising Velocity.</span>
          </h1>
          <p className="text-base text-white/70 font-sans leading-relaxed">
            CodeXa Studio IDE is built from the ground up for software architects and full-stack builders who demand instant local responsiveness, deep symbol understanding, and zero cloud dependency.
          </p>
        </div>
      </div>

      <FeatureShowcaseSection />
      <ThemeExplorerSection />

      {/* Deep-Dive Architectural Grid */}
      <section className="py-20 border-t border-white/5 bg-[#020202]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-orbitron font-bold text-white">
              Under the Hood: Subsystem Specifications
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-xs">
            <div className="p-6 rounded-2xl bg-[#121316] border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-white font-bold uppercase text-[11px]">
                <Cpu className="w-4 h-4 text-[#22C55E]" /> 01. In-Memory AST Indexer
              </div>
              <p className="text-white/70 font-sans leading-relaxed text-sm">
                Parses syntax trees on dedicated worker isolates, providing instant jump-to-definition and symbol dependency lookups across millions of lines of code.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#121316] border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-white font-bold uppercase text-[11px]">
                <ShieldCheck className="w-4 h-4 text-[#22C55E]" /> 02. Local-First Isolation
              </div>
              <p className="text-white/70 font-sans leading-relaxed text-sm">
                No code indexing telemetry is transmitted outside your physical machine. Air-gapped compliance is built directly into the kernel.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#121316] border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-white font-bold uppercase text-[11px]">
                <Boxes className="w-4 h-4 text-[#22C55E]" /> 03. Model Context Protocol
              </div>
              <p className="text-white/70 font-sans leading-relaxed text-sm">
                Integrate external Postgres databases, Redis clusters, and agency APIs into the AI reasoning loop with standard MCP tool definitions.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#121316] border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-white font-bold uppercase text-[11px]">
                <Terminal className="w-4 h-4 text-[#22C55E]" /> 04. Multiplex Virtual Terminal
              </div>
              <p className="text-white/70 font-sans leading-relaxed text-sm">
                Run concurrent shell sessions (PowerShell, Bash, Zsh) with AI command synthesis and auto-fix recommendations on non-zero exit codes.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#121316] border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-white font-bold uppercase text-[11px]">
                <GitBranch className="w-4 h-4 text-[#22C55E]" /> 05. Visual Git Staging
              </div>
              <p className="text-white/70 font-sans leading-relaxed text-sm">
                Hunk-by-hunk commit staging, 3-way merge resolution, and AI-generated commit messages grounded in unified diff AST analysis.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#121316] border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-white font-bold uppercase text-[11px]">
                <Zap className="w-4 h-4 text-[#22C55E]" /> 06. Hardware Acceleration
              </div>
              <p className="text-white/70 font-sans leading-relaxed text-sm">
                Direct DirectX/Vulkan/Metal canvas rasterization ensures smooth 120 FPS cursor tracking and instantaneous editor split repositioning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 text-center">
        <Button variant="primary" size="lg" href="/download" leftIcon={<Download className="w-4 h-4" />}>
          Download CodeXa Studio Preview
        </Button>
      </div>
    </div>
  );
}
