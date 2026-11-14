"use client";

import React, { useEffect, useRef, useState } from "react";
import { IDEContinuousDemo } from "@/components/hero/IDEContinuousDemo";
import { IDEWorkbench } from "@/components/workspace/IDEWorkbench";
import { getGsap } from "@/lib/motion/gsapSetup";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";
import { MOTION_EASINGS } from "@/lib/motion/tokens";
import { Play, Sliders } from "lucide-react";

export function HeroIDEShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<"demo" | "interactive">("demo");
  const isReduced = useReducedMotion();

  useEffect(() => {
    if (isReduced) return;

    const { gsap, ScrollTrigger } = getGsap();
    if (!containerRef.current || !frameRef.current) return;

    const frame = frameRef.current;

    const ctx = gsap.context(() => {
      // 1. Initial Assembly sequence
      gsap.fromTo(
        frame,
        {
          opacity: 0,
          y: 40,
          scale: 0.96,
          rotateX: 4,
          transformPerspective: 1200,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          duration: 0.9,
          delay: 0.25,
          ease: MOTION_EASINGS.smoothOut,
        }
      );

      // 2. Scroll-linked interactive elevation
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 60%",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          if (!frame) return;
          const p = self.progress;
          gsap.set(frame, {
            y: p * -15,
            scale: 1 + p * 0.01,
          });
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isReduced]);

  return (
    <div ref={containerRef} className="mt-12 sm:mt-16 w-full perspective-[1400px]">
      <div className="flex items-center justify-end mb-3 gap-2">
        <span className="text-[11px] font-mono text-white/50">Showcase View:</span>
        <button
          onClick={() => setViewMode("demo")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-mono transition-all ${
            viewMode === "demo"
              ? "bg-white text-black font-bold shadow-sm"
              : "bg-white/5 text-white/60 hover:text-white"
          }`}
        >
          <Play className="w-3 h-3" />
          <span>Autoplay Demo</span>
        </button>
        <button
          onClick={() => setViewMode("interactive")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-mono transition-all ${
            viewMode === "interactive"
              ? "bg-white text-black font-bold shadow-sm"
              : "bg-white/5 text-white/60 hover:text-white"
          }`}
        >
          <Sliders className="w-3 h-3" />
          <span>Manual Workbench</span>
        </button>
      </div>

      <div
        ref={frameRef}
        className="w-full rounded-2xl bg-[#15151A] border border-[rgba(255,255,255,0.12)] shadow-[rgba(255,255,255,0.03)_0px_0px_0px_8px,rgba(0,0,0,0.52)_0px_38px_110px_0px] overflow-hidden transition-shadow duration-500"
      >
        {viewMode === "demo" ? (
          <div className="p-3 sm:p-5 bg-[#0A0B0E]">
            <IDEContinuousDemo />
          </div>
        ) : (
          <div className="w-full h-[620px] sm:h-[680px] bg-[#0E0F12]">
            <IDEWorkbench />
          </div>
        )}
      </div>
    </div>
  );
}