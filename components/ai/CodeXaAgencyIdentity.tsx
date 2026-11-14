"use client";

import React from "react";
import Image from "next/image";
import { ShieldCheck, Cpu, Terminal, ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface CodeXaAgencyIdentityProps {
  className?: string;
}

export function CodeXaAgencyIdentity({ className = "" }: CodeXaAgencyIdentityProps) {
  return (
    <div
      className={`flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-[#090A0D]/75 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)] select-none ${className}`}
    >
      <div>
        {/* Eyebrow & Ecosystem Tag */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48]" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-300 font-bold">
              HOST ECOSYSTEM
            </span>
          </div>
          <span className="text-[10px] font-mono text-neutral-400">
            CodeXa v2.4
          </span>
        </div>

        {/* Agency Logo & Title */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#000000] border border-white/15 shadow-md flex items-center justify-center p-1.5 flex-shrink-0 group">
            <Image
              src="/assets/brand/codexa-logo.png"
              alt="CodeXa Agency Official Logo"
              width={48}
              height={48}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              priority
            />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-orbitron font-extrabold text-white tracking-tight leading-tight">
              CodeXa Agency
            </h3>
            <div className="text-xs font-mono text-neutral-400">
              IDE Architecture &amp; Core
            </div>
          </div>
        </div>

        {/* Supporting Narrative */}
        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans mb-5">
          CodeXa Agency orchestrates multi-agent coding workflows, local in-memory AST symbol caching, and universal access across frontier AI model families without vendor lock-in.
        </p>

        {/* Core Architectural Pillars */}
        <div className="space-y-2 mb-5">
          <div className="flex items-start gap-2.5 p-2 rounded-lg bg-white/[0.02] border border-white/5">
            <Cpu className="w-4 h-4 text-[#E11D48] mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-xs font-semibold text-white">Dual-Agent Planner</div>
              <div className="text-[11px] text-neutral-400">Deterministic code synthesis with atomic hunk review</div>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2 rounded-lg bg-white/[0.02] border border-white/5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-xs font-semibold text-white">Zero Telemetry BYOK</div>
              <div className="text-[11px] text-neutral-400">Direct encrypted endpoints with local OS Keychain storage</div>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2 rounded-lg bg-white/[0.02] border border-white/5">
            <Terminal className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-xs font-semibold text-white">In-Memory AST Index</div>
              <div className="text-[11px] text-neutral-400">Sub-millisecond monorepo navigation &amp; rename propagation</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Link */}
      <div className="pt-4 border-t border-white/10 flex items-center justify-between">
        <span className="text-[11px] text-neutral-400 font-sans">
          Agency Runtime
        </span>
        <Link
          href="/docs/ast-indexing-architecture"
          className="inline-flex items-center gap-1 text-xs text-[#E11D48] hover:text-white font-semibold transition-colors flex-shrink-0"
        >
          <span>Architecture Docs</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}