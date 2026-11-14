import React from "react";
import type { Metadata } from "next";
import { AIShowcaseSection } from "@/components/ai/AIShowcaseSection";
import { Button } from "@/components/ui/Button";
import { Download } from "lucide-react";

export const metadata: Metadata = {
  title: "Multi-Model AI Intelligence",
  description:
    "Explore CodeXa AI's Chat, Plan, Agent, and Debug workflows across configurable models like Astra 6, Fabel 5.1, and NEXA.",
};

export default function AIPage() {
  return (
    <div className="pt-28 pb-20 bg-[#000000]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs sm:text-sm font-sans font-medium uppercase tracking-[2px] text-[#9CA3AF] block">
            AGENTIC REASONING ENGINE
          </span>
          <h1 className="text-4xl sm:text-6xl font-orbitron font-bold tracking-tight text-white leading-tight">
            Intelligence Grounded in <span className="text-white">Deterministic Code.</span>
          </h1>
          <p className="text-base text-white/70 font-sans leading-relaxed">
            CodeXa AI is not an isolated chat wrapper. It connects into your workspace's compilation graph, generates verifiable diffs, and executes atomic steps with rollback guarantees.
          </p>
        </div>
      </div>

      <AIShowcaseSection />

      {/* Model Architecture Comparison Table */}
      <section className="py-20 border-t border-white/5 bg-[#020202]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-orbitron font-bold text-white">
              Model Lineup &amp; Compute Profiles
            </h2>
            <p className="text-sm text-white/70 font-sans mt-1">
              Configure model routing based on task complexity, latency thresholds, and privacy requirements.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#121316]">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#18181D] text-white/50 uppercase text-[10px] border-b border-white/10">
                <tr>
                  <th className="py-4 px-6">Model</th>
                  <th className="py-4 px-6">Context</th>
                  <th className="py-4 px-6">Primary Specialty</th>
                  <th className="py-4 px-6">Execution Location</th>
                  <th className="py-4 px-6">Telemetry</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-white/70">
                <tr className="hover:bg-white/[0.02]">
                  <td className="py-4 px-6 font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-white" /> Astra 6 (Default)
                  </td>
                  <td className="py-4 px-6 text-white font-bold">1M Tokens</td>
                  <td className="py-4 px-6 font-sans">Autonomous task breakdown &amp; full-stack diff synthesis</td>
                  <td className="py-4 px-6 text-white/90">Agency Accelerated Cloud</td>
                  <td className="py-4 px-6 text-emerald-400">Zero Code Retention</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="py-4 px-6 font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400" /> Fabel 5.1
                  </td>
                  <td className="py-4 px-6 text-white font-bold">512K Tokens</td>
                  <td className="py-4 px-6 font-sans">Formal type verification &amp; compiler invariants</td>
                  <td className="py-4 px-6">High-Performance Cluster</td>
                  <td className="py-4 px-6 text-emerald-400">Zero Code Retention</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="py-4 px-6 font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400" /> GPT 5.6 SOL
                  </td>
                  <td className="py-4 px-6 text-white font-bold">2M Tokens</td>
                  <td className="py-4 px-6 font-sans">Cross-repository multi-file refactoring</td>
                  <td className="py-4 px-6">Agency Cloud Fabric</td>
                  <td className="py-4 px-6 text-emerald-400">Zero Code Retention</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="py-4 px-6 font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" /> GPT 6.1 SOL
                  </td>
                  <td className="py-4 px-6 text-white font-bold">4M Tokens</td>
                  <td className="py-4 px-6 font-sans">Deep context enterprise monorepo comprehension</td>
                  <td className="py-4 px-6">Dedicated Compute Pool</td>
                  <td className="py-4 px-6 text-emerald-400">Air-Gap Eligible</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="py-4 px-6 font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" /> OPUS 5.5
                  </td>
                  <td className="py-4 px-6 text-white font-bold">1M Tokens</td>
                  <td className="py-4 px-6 font-sans">Recursive multi-agent validation loops &amp; testing</td>
                  <td className="py-4 px-6">Enterprise Tier</td>
                  <td className="py-4 px-6 text-emerald-400">Zero Code Retention</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="py-4 px-6 font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" /> NEXA (Local Engine)
                  </td>
                  <td className="py-4 px-6 text-white font-bold">128K Tokens</td>
                  <td className="py-4 px-6 font-sans">Edge on-device NPU/GPU execution with zero latency</td>
                  <td className="py-4 px-6 text-emerald-400 font-bold">Local Physical Hardware</td>
                  <td className="py-4 px-6 text-emerald-400 font-bold">100% Offline (Zero Network)</td>
                </tr>
              </tbody>
            </table>
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
