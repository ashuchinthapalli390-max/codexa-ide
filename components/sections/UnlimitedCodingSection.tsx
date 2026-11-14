"use client";

import React, { useRef, useEffect } from "react";
import { Sparkles, Cpu, Zap, ShieldCheck, ArrowRight, CheckCircle2, Lock } from "lucide-react";
import Link from "next/link";
import { getGsap } from "@/lib/motion/gsapSetup";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";
import { MOTION_EASINGS } from "@/lib/motion/tokens";

export function UnlimitedCodingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const flowRef = useRef<HTMLDivElement>(null);
  const isReduced = useReducedMotion();

  useEffect(() => {
    if (isReduced) return;

    const { gsap } = getGsap();
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (flowRef.current) {
        gsap.fromTo(
          flowRef.current.children,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.12,
            ease: MOTION_EASINGS.smoothOut,
            scrollTrigger: {
              trigger: flowRef.current,
              start: "top 85%",
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
      id="unlimited-coding"
      className="py-16 sm:py-24 bg-[#020204] border-t border-white/[0.06] relative select-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#A1A4AE] font-bold block mb-2">
            AUTONOMOUS DEVELOPER VALUE
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-orbitron tracking-tight text-white">
            Code More. Build More.
          </h2>
          <p className="mt-3 text-base sm:text-lg font-medium text-emerald-400 font-sans">
            Unlimited coding with CodeXa AI.
          </p>
          <p className="mt-2 text-xs sm:text-sm text-white/60 font-sans leading-relaxed max-w-2xl mx-auto">
            On-device NEXA Edge and CodeXa Native AST models never expire and cost zero premium units.
            Premium frontier models are metered transparently with universal access across all paid tiers.
          </p>
        </div>

        {/* Model Flow Visualization (Native Free Path vs Premium Metered Path) */}
        <div
          ref={flowRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-10"
        >
          {/* Card 1: Unlimited Native AI */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#111318] to-[#0A0B0E] border border-emerald-500/30 relative overflow-hidden group shadow-xl">
            <div className="absolute top-0 right-0 px-3 py-1 bg-emerald-500/10 border-b border-l border-emerald-500/30 text-[9.5px] font-mono text-emerald-400 font-bold uppercase rounded-bl-xl">
              0x TOKENS • UNLIMITED FAIR-USE
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-orbitron font-bold text-white">
                  CodeXa Native &amp; NEXA Edge
                </h3>
                <span className="text-[11px] font-mono text-emerald-400">
                  100% On-Device &amp; Air-Gapped
                </span>
              </div>
            </div>

            <p className="text-xs text-white/70 font-sans leading-relaxed mb-4">
              Code completion, inline autocomplete, AST symbol indexing, and local code reviews run directly on your hardware with sub-50ms latency. Zero cloud tokens consumed.
            </p>

            <ul className="space-y-2 text-xs font-mono text-white/80">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>NEXA-8B on-device inference (Ollama / Local runtime)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Realtime AST syntax cache lookup (&lt;0.02ms)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Never deducts from monthly premium allowances</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Universal across Starter, Plus, Pro, and Max</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Metered Premium Frontier Models */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#111318] to-[#0A0B0E] border border-white/10 relative overflow-hidden group shadow-xl">
            <div className="absolute top-0 right-0 px-3 py-1 bg-white/10 border-b border-l border-white/15 text-[9.5px] font-mono text-white/80 font-bold uppercase rounded-bl-xl">
              UNIVERSAL ACCESS • FAIR WEIGHTING
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-orbitron font-bold text-white">
                  Frontier Multi-Model Engines
                </h3>
                <span className="text-[11px] font-mono text-white/60">
                  GPT-6 Astra • Claude • Gemini • Fabel
                </span>
              </div>
            </div>

            <p className="text-xs text-white/70 font-sans leading-relaxed mb-4">
              Deep architectural planning, multi-file refactoring runs, and formal verification. Access every supported frontier model on any paid subscription tier.
            </p>

            <ul className="space-y-2 text-xs font-mono text-white/80">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>250k (Starter), 750k (Plus), 2M (Pro), 5M (Max) allowances</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>No tier gatekeeping — GPT-6 Astra accessible from ₹328/mo</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Deterministic token weighting based on model compute</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Local OS Keychain BYOK pass-through supported</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Action Link to Model Catalogue */}
        <div className="flex items-center justify-center">
          <Link
            href="/models"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white text-white hover:text-black font-mono text-xs font-semibold transition-all border border-white/15"
          >
            <span>Inspect All Model Multipliers &amp; Weightings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </section>
  );
}
