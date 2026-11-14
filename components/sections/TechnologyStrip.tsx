"use client";

import React, { useRef, useEffect } from "react";
import {
  Monitor,
  Laptop,
  Terminal as TerminalIcon,
  Smartphone,
  Sparkles,
  Cpu,
  Brain,
  GitBranch,
  Layers,
  Code2,
  Key,
  ShieldCheck,
  CheckCircle2,
  Check,
} from "lucide-react";
import { getGsap } from "@/lib/motion/gsapSetup";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";
import { MOTION_EASINGS } from "@/lib/motion/tokens";

export function TechnologyStrip() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isReduced = useReducedMotion();

  useEffect(() => {
    if (isReduced) return;

    const { gsap } = getGsap();
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current!.children,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.1,
          ease: MOTION_EASINGS.smoothOut,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 90%",
            once: true,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isReduced]);

  return (
    <section className="py-10 sm:py-14 bg-[#050608] border-y border-white/[0.06] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div ref={containerRef} className="space-y-6 sm:space-y-8">
          
          {/* GROUP 1: Platform Availability */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#A1A4AE] font-bold">
                01 • PLATFORM AVAILABILITY
              </span>
              <span className="text-[10px] font-mono text-white/40">Official Release Ready</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
              {[
                { name: "Windows", sub: "x64 & ARM64 MSIX", status: "Available Soon", statusVariant: "soon", icon: <Monitor className="w-4 h-4 text-white" /> },
                { name: "macOS", sub: "Apple Silicon & Intel", status: "Available Soon", statusVariant: "soon", icon: <Laptop className="w-4 h-4 text-white" /> },
                { name: "Linux", sub: ".deb, .rpm & AppImage", status: "Available Soon", statusVariant: "soon", icon: <TerminalIcon className="w-4 h-4 text-white" /> },
                { name: "Mobile", sub: "Android Companion Hub", status: "Under Development", statusVariant: "dev", icon: <Smartphone className="w-4 h-4 text-white" /> },
              ].map((plat) => (
                <div
                  key={plat.name}
                  className="p-3 sm:p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-white/20 transition-all flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                    {plat.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white flex items-center gap-1.5 truncate">
                      <span>{plat.name}</span>
                      <span
                        className={`text-[8.5px] font-mono px-1.5 py-0.2 rounded shrink-0 ${
                          plat.statusVariant === "soon"
                            ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                            : "text-amber-400 bg-amber-500/10 border border-amber-500/20"
                        }`}
                      >
                        {plat.status}
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-white/50 truncate mt-0.5">{plat.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* GROUP 2: AI Model Ecosystem (Universal Access) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#A1A4AE] font-bold">
                02 • AI MODEL ECOSYSTEM (ALL PAID PLANS ENABLED)
              </span>
              <span className="text-[10px] font-mono text-emerald-400">Zero Paywalled Models</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
              {[
                { name: "CodeXa Native", sub: "NEXA & AST Engine", status: "Available", statusVariant: "avail" },
                { name: "GPT-6 Astra", sub: "OpenAI Frontier", status: "Available", statusVariant: "avail" },
                { name: "Claude", sub: "Anthropic OPUS & Sonnet", status: "Available", statusVariant: "avail" },
                { name: "Grok", sub: "xAI Reasoning Engine", status: "Planned", statusVariant: "plan" },
                { name: "Gemini", sub: "Google 2.5 & 3.8 Flash", status: "Available", statusVariant: "avail" },
                { name: "BYOK Keyring", sub: "Local OS Keychain", status: "Available", statusVariant: "avail" },
              ].map((m) => (
                <div
                  key={m.name}
                  className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-white/20 transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-white/70" />
                    <span
                      className={`text-[8.5px] font-mono uppercase font-bold px-1.5 py-0.5 rounded ${
                        m.statusVariant === "avail"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-white/10 text-white/70"
                      }`}
                    >
                      {m.status}
                    </span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white leading-tight font-sans truncate">
                      {m.name}
                    </div>
                    <div className="text-[9.5px] font-mono text-white/50 mt-0.5 truncate">
                      {m.sub}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* GROUP 3: Developer Workbench */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#A1A4AE] font-bold">
                03 • DEVELOPER WORKBENCH CAPABILITIES
              </span>
              <span className="text-[10px] font-mono text-white/40">Local-First Desktop Core</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
              {[
                { name: "Source Editor", sub: "Monaco & AST Engine", icon: <Code2 className="w-3.5 h-3.5 text-white" /> },
                { name: "PTY Terminal", sub: "GPU-accelerated", icon: <TerminalIcon className="w-3.5 h-3.5 text-white" /> },
                { name: "Git Engine", sub: "Hunk-level staging", icon: <GitBranch className="w-3.5 h-3.5 text-white" /> },
                { name: "Live Preview", sub: "Dual desktop/mobile", icon: <Monitor className="w-3.5 h-3.5 text-white" /> },
                { name: "Open VSX", sub: "Extension marketplace", icon: <Layers className="w-3.5 h-3.5 text-white" /> },
                { name: "Code Review", sub: "Atomic diff invariant", icon: <ShieldCheck className="w-3.5 h-3.5 text-white" /> },
              ].map((cap) => (
                <div
                  key={cap.name}
                  className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-white/20 transition-all flex items-center gap-2.5"
                >
                  <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                    {cap.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white leading-tight truncate">{cap.name}</div>
                    <div className="text-[9.5px] font-mono text-white/50 truncate mt-0.5">{cap.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
