"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { IDEWorkbench } from "@/components/workspace/IDEWorkbench";
import { CodeXaLogo } from "@/components/ui/CodeXaLogo";
import { Badge } from "@/components/ui/Badge";
import { Sparkles, Terminal, ChevronDown, Layers, Cpu, ShieldCheck } from "lucide-react";

export function SignatureScrollReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollable = rect.height - windowHeight;

      if (totalScrollable <= 0) return;

      // Calculate progress between 0 and 1
      const progress = Math.min(
        1,
        Math.max(0, -rect.top / totalScrollable)
      );
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Determine stage based on scroll progress (0 to 1)
  // Stage 1: 0 - 0.20 (Identity Emblem)
  // Stage 2: 0.20 - 0.40 (Geometric framing)
  // Stage 3: 0.40 - 0.65 (Window construction)
  // Stage 4: 0.65 - 0.85 (Workspace assembly)
  // Stage 5: 0.85 - 1.0 (Interactive IDE)
  const currentStage =
    scrollProgress < 0.2
      ? 1
      : scrollProgress < 0.4
      ? 2
      : scrollProgress < 0.65
      ? 3
      : scrollProgress < 0.85
      ? 4
      : 5;

  // Jump to stage via progress click
  const setStage = (stageNum: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY + rect.top;
    const windowHeight = window.innerHeight;
    const totalScrollable = containerRef.current.offsetHeight - windowHeight;

    const targets = [0, 0.1, 0.3, 0.55, 0.75, 0.95];
    const targetScroll = scrollTop + totalScrollable * targets[stageNum];
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  return (
    <div
      ref={containerRef}
      id="scroll-reveal"
      className="relative w-full max-w-full overflow-hidden min-h-[340vh] bg-[#08090B] border-t border-[#1F2127]"
    >
      {/* Sticky presentation viewport */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between overflow-hidden px-4 sm:px-6 lg:px-8 py-8">
        {/* Background ambient lighting */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div
            className="w-[700px] h-[700px] rounded-full blur-[140px] transition-all duration-700 pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(217, 53, 77, 0.08) 0%, transparent 70%)",
              opacity: scrollProgress > 0.1 ? 0.7 : 0.3,
              transform: `scale(${1 + scrollProgress * 0.4})`,
            }}
          />
        </div>

        {/* Top Annotation Bar */}
        <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#71737D]">
              Signature Scroll Transition
            </span>
            <span className="text-[#282A31]">&bull;</span>
            <Badge variant="accent" size="sm">
              Stage 0{currentStage} / 05
            </Badge>
          </div>

          {/* Interactive Stage scrubber pills */}
          <div className="flex items-center gap-1 sm:gap-1.5 bg-[#13151A]/80 p-1 rounded-xl border border-[#282A31] backdrop-blur-md overflow-x-auto max-w-full">
            {[
              { id: 1, label: "Identity" },
              { id: 2, label: "Geometry" },
              { id: 3, label: "Shell" },
              { id: 4, label: "Panels" },
              { id: 5, label: "Interactive" },
            ].map((stg) => (
              <button
                key={stg.id}
                onClick={() => setStage(stg.id)}
                className={`px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider rounded-lg transition-all ${
                  currentStage === stg.id
                    ? "bg-[#D9354D] text-white font-bold shadow-sm"
                    : "text-[#71737D] hover:text-[#A5A6AE]"
                }`}
              >
                {stg.label}
              </button>
            ))}
          </div>
        </div>

        {/* Center Canvas: Dynamic Morph between Logo Emblem & Full IDE */}
        <div className="relative z-10 flex-1 flex items-center justify-center max-w-6xl mx-auto w-full my-auto">
          {/* STAGE 1: Central Identity Emblem */}
          {scrollProgress < 0.35 && (
            <div
              className="flex flex-col items-center justify-center text-center transition-all duration-500"
              style={{
                opacity: Math.max(0, 1 - scrollProgress * 3),
                transform: `scale(${1 - scrollProgress * 0.5}) translateY(${scrollProgress * 20}px)`,
              }}
            >
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full border-2 border-[#D9354D]/50 bg-[#0D0E11] p-3 flex items-center justify-center shadow-[0_0_60px_rgba(217,53,77,0.25)]">
                <Image
                  src="/assets/brand/codexa-logo.png"
                  alt="CodeXa Studio IDE Emblem"
                  width={150}
                  height={150}
                  className="w-full h-full object-cover rounded-full"
                  priority
                />
                {/* Thin rotating subtle ring */}
                <div className="absolute -inset-2 rounded-full border border-dashed border-[#D9354D]/30 animate-[spin_24s_linear_infinite]" />
              </div>

              <div className="mt-8 space-y-2">
                <h3 className="text-xl sm:text-2xl font-orbitron font-extrabold tracking-wider text-white">
                  THE ARCHITECTURAL EMBLEM
                </h3>
                <p className="text-xs font-mono text-[#A5A6AE] max-w-md">
                  Scroll forward to witness the geometric crystallization of CodeXa Studio IDE.
                </p>
                <div className="pt-4 flex items-center justify-center gap-1.5 text-xs font-mono text-[#EB465D] animate-bounce">
                  <span>Scroll to Expand</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>
          )}

          {/* STAGES 2 to 5: Geometric Framing into Final Workbench */}
          {scrollProgress >= 0.15 && (
            <div
              className="w-full transition-all duration-500 ease-out"
              style={{
                opacity: Math.min(1, (scrollProgress - 0.15) * 4),
                transform: isReducedMotion
                  ? "none"
                  : `scale(${0.88 + Math.min(0.12, (scrollProgress - 0.15) * 0.16)}) translateY(${
                      Math.max(0, (0.7 - scrollProgress) * 40)
                    }px)`,
              }}
            >
              {/* Wireframe border guides for stage 2 & 3 */}
              {scrollProgress < 0.65 && (
                <div className="absolute -inset-4 border border-[#D9354D]/30 rounded-3xl pointer-events-none transition-all duration-300">
                  <div className="absolute top-0 left-10 -translate-y-1/2 px-2 bg-[#08090B] text-[10px] font-mono text-[#D9354D]">
                    AST BOUNDING RECT // SYNCHRONIZING
                  </div>
                  <div className="absolute bottom-0 right-10 translate-y-1/2 px-2 bg-[#08090B] text-[10px] font-mono text-[#71737D]">
                    WINDOW SHELL FORMING
                  </div>
                </div>
              )}

              {/* The Real Interactive IDE Workbench Component */}
              <IDEWorkbench
                compact={false}
                initialMode={currentStage >= 4 ? "agent" : "chat"}
                showWindowControls={true}
                className="w-full"
              />
            </div>
          )}
        </div>

        {/* Bottom Status / Timeline Progress */}
        <div className="relative z-10 max-w-7xl mx-auto w-full pt-4 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#71737D] border-t border-[#1F2127]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D9354D]" />
            <span>Scroll Scrubbed Reversible Pipeline</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-64 mt-2 sm:mt-0">
            <span className="text-[10px]">Progress</span>
            <div className="flex-1 h-1.5 bg-[#13151A] rounded-full overflow-hidden border border-[#282A31]">
              <div
                className="h-full bg-[#D9354D] transition-all duration-150"
                style={{ width: `${Math.round(scrollProgress * 100)}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-[#F5F5F6]">
              {Math.round(scrollProgress * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
