"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Sparkles,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getGsap } from "@/lib/motion/gsapSetup";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";
import { MOTION_EASINGS } from "@/lib/motion/tokens";
import {
  InteractiveParticleCanvas,
  SceneId,
} from "@/components/ai/InteractiveParticleCanvas";
import { CodeXaAgencyIdentity } from "@/components/ai/CodeXaAgencyIdentity";
import { CodeXaXCenterpiece } from "@/components/ai/CodeXaXCenterpiece";
import { ProviderSceneDetails } from "@/components/ai/ProviderSceneDetails";
import { UnifiedWorkspacePreview } from "@/components/ai/UnifiedWorkspacePreview";
import { FlagshipModelCatalogue } from "@/components/ai/FlagshipModelCatalogue";

interface SceneOption {
  id: SceneId;
  label: string;
  badge: string;
}

const SCENE_OPTIONS: SceneOption[] = [
  { id: "intro", label: "00 Intro", badge: "CodeXa Unified" },
  { id: "openai", label: "01 OpenAI", badge: "Astra Spiral" },
  { id: "anthropic", label: "02 Claude", badge: "Cosmic Horizon" },
  { id: "gemini", label: "03 Gemini", badge: "Hydrogen Fluid" },
  { id: "grok", label: "04 Grok", badge: "Kinetic Streaks" },
  { id: "codexa", label: "05 Native", badge: "Air-Gapped Core" },
  { id: "unified", label: "06 Workspace", badge: "All Frontiers" },
];

export function AIEcosystemSection() {
  const [activeScene, setActiveScene] = useState<SceneId>("openai");
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const isReduced = useReducedMotion();

  // Handle scene change
  const handleSceneSelect = (id: SceneId) => {
    setActiveScene(id);
  };

  const handleNextScene = useCallback(() => {
    const currentIndex = SCENE_OPTIONS.findIndex((s) => s.id === activeScene);
    const nextIndex = (currentIndex + 1) % SCENE_OPTIONS.length;
    setActiveScene(SCENE_OPTIONS[nextIndex].id);
  }, [activeScene]);

  const handlePrevScene = useCallback(() => {
    const currentIndex = SCENE_OPTIONS.findIndex((s) => s.id === activeScene);
    const prevIndex = (currentIndex - 1 + SCENE_OPTIONS.length) % SCENE_OPTIONS.length;
    setActiveScene(SCENE_OPTIONS[prevIndex].id);
  }, [activeScene]);

  // Automatic Scene Cycling
  useEffect(() => {
    if (!isPlaying || isReduced) return;

    const timer = setInterval(() => {
      handleNextScene();
    }, 9000);

    return () => clearInterval(timer);
  }, [isPlaying, isReduced, handleNextScene]);

  // GSAP Entrance Animations
  useEffect(() => {
    if (isReduced) return;

    const { gsap } = getGsap();
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleX: 0, opacity: 0 },
          {
            scaleX: 1,
            opacity: 1,
            duration: 1.2,
            ease: MOTION_EASINGS.smoothOut,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              once: true,
            },
          }
        );
      }

      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: MOTION_EASINGS.smoothOut,
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      if (stageRef.current) {
        gsap.fromTo(
          stageRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: MOTION_EASINGS.smoothOut,
            scrollTrigger: {
              trigger: stageRef.current,
              start: "top 75%",
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isReduced]);

  // Dynamic Editorial Headings by Scene (V20 & V21 Master Directives)
  const getSceneHeaderContent = () => {
    switch (activeScene) {
      case "openai":
        return {
          eyebrow: "AI ECOSYSTEM • MULTI-MODEL INTEGRATION",
          headline: "Intelligence, connected.",
          subheadline: "CodeXa Studio IDE integrates supported AI models into one development workspace.",
          isSerif: false,
        };
      case "anthropic":
        return {
          eyebrow: "ANTHROPIC × CODEXA",
          headline: "Claude, inside CodeXa.",
          subheadline: "Intelligent development, one connected workspace.",
          isSerif: true,
        };
      case "gemini":
        return {
          eyebrow: "GOOGLE GEMINI × CODEXA",
          headline: "Extreme Context. Infinite Flow.",
          subheadline: "Multimodal monorepo comprehension with 1M+ token ingestion in CodeXa Studio IDE.",
          isSerif: false,
        };
      case "grok":
        return {
          eyebrow: "XAI GROK × CODEXA",
          headline: "High-Throughput Reasoning.",
          subheadline: "Direct BYOK acceleration for algorithmic exploration and complex state machines.",
          isSerif: false,
        };
      case "codexa":
        return {
          eyebrow: "CODEXA NATIVE RUNTIME",
          headline: "Deterministic Local Core.",
          subheadline: "Air-gapped on-device neural execution with zero cloud telemetry and zero token cost.",
          isSerif: false,
        };
      case "unified":
      default:
        return {
          eyebrow: "CODEXA STUDIO IDE",
          headline: "Flagship Models. One Workspace.",
          subheadline: "Switch frontier models per task, per file, or per refactoring session seamlessly.",
          isSerif: false,
        };
    }
  };

  const headerContent = getSceneHeaderContent();

  return (
    <section
      ref={sectionRef}
      id="ai-ecosystem"
      className="relative w-full py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#050608] text-white overflow-hidden select-none"
    >
      {/* Background Radial Ambient Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(255,255,255,0.02)_0%,transparent_70%)] pointer-events-none" />

      {/* Horizontal Light Line Accent */}
      <div
        ref={lineRef}
        className="max-w-5xl mx-auto h-[1px] bg-gradient-to-r from-transparent via-[#E11D48]/50 to-transparent mb-16 origin-center"
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* ======================================================== */}
        {/* 1. SECTION INTRO & DYNAMIC EDITORIAL HEADINGS            */}
        {/* ======================================================== */}
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#E11D48]" />
            <span className="text-[10px] font-mono uppercase tracking-[3px] text-neutral-300 font-bold">
              {headerContent.eyebrow}
            </span>
          </div>

          {headerContent.isSerif ? (
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-serif italic font-normal tracking-tight text-[#F4F1EC] leading-tight transition-all duration-500">
              {headerContent.headline}
            </h2>
          ) : (
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-orbitron font-extrabold tracking-tight text-white leading-tight transition-all duration-500">
              {headerContent.headline}
            </h2>
          )}

          <p className="text-sm sm:text-base font-sans text-neutral-300 max-w-2xl mx-auto leading-relaxed transition-all duration-500">
            {headerContent.subheadline}
          </p>
        </div>

        {/* ======================================================== */}
        {/* 2. SCENE CONTROLS & NAVIGATION BAR                       */}
        {/* ======================================================== */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 p-2 rounded-2xl bg-[#090A0E]/85 border border-white/10 backdrop-blur-xl">
          {/* Scene Selector Pills */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {SCENE_OPTIONS.map((opt) => {
              const isActive = activeScene === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSceneSelect(opt.id)}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono transition-all duration-300 ${
                    isActive
                      ? "bg-white text-black font-bold shadow-[0_4px_16px_rgba(255,255,255,0.2)] scale-[1.02]"
                      : "text-neutral-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>

          {/* Autoplay & Arrow Controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-neutral-300 transition-colors"
              title={isPlaying ? "Pause cinematic cycle" : "Resume cinematic cycle"}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden md:inline">Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden md:inline">Play</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrevScene}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 transition-colors"
              aria-label="Previous provider scene"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={handleNextScene}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 transition-colors"
              aria-label="Next provider scene"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 3. CINEMATIC STAGE: Left Agency × Center X × Right Model */}
        {/* ======================================================== */}
        <div
          ref={stageRef}
          className="relative w-full rounded-3xl border border-white/15 bg-gradient-to-b from-[#090A0E] via-[#060709] to-[#040507] overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.8)]"
        >
          {/* Interactive Background Particle Canvas (Pointer Reactive) */}
          <div className="absolute inset-0 z-0">
            <InteractiveParticleCanvas activeScene={activeScene} />
          </div>

          {/* Main 3-Column Cinematic Layout (Desktop) / Stacked (Mobile) */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 sm:p-10 items-stretch min-h-[580px]">
            {/* LEFT — CODEXA AGENCY */}
            <div className="lg:col-span-4 flex flex-col justify-center order-2 lg:order-1">
              <CodeXaAgencyIdentity className="h-full" />
            </div>

            {/* CENTER — CODEXA X / HORIZON NEGATIVE SPACE */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center py-6 lg:py-0 order-1 lg:order-2">
              <CodeXaXCenterpiece activeScene={activeScene} />
            </div>

            {/* RIGHT — SELECTED AI PROVIDER */}
            <div className="lg:col-span-4 flex flex-col justify-center order-3 lg:order-3">
              <ProviderSceneDetails activeScene={activeScene} className="h-full" />
            </div>
          </div>

          {/* UNIFIED WORKSPACE PREVIEW (When Scene 6 is Active) */}
          {activeScene === "unified" && (
            <div className="relative z-10 px-6 sm:px-10 pb-10 pt-4 animate-in fade-in duration-500">
              <div className="text-center mb-6">
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block mb-1">
                  SEAMLESS WORKSPACE INTERFACE
                </span>
                <h3 className="text-xl sm:text-2xl font-orbitron font-bold text-white">
                  Different Models. One CodeXa.
                </h3>
              </div>
              <UnifiedWorkspacePreview />
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* 4. FLAGSHIP MODEL CATALOGUE                              */}
        {/* ======================================================== */}
        <FlagshipModelCatalogue />
      </div>
    </section>
  );
}