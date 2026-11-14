"use client";

import React from "react";
import Image from "next/image";
import { SceneId } from "./InteractiveParticleCanvas";

interface CodeXaXCenterpieceProps {
  activeScene: SceneId;
  className?: string;
}

export function CodeXaXCenterpiece({ activeScene, className = "" }: CodeXaXCenterpieceProps) {
  // Scene-dependent subtle aesthetic styling (Zero sci-fi HUD slop, zero concentric circles)
  const getSceneStyling = () => {
    switch (activeScene) {
      case "openai":
        return {
          glowColor: "rgba(220, 235, 255, 0.08)",
          haloColor: "rgba(255, 255, 255, 0.15)",
          accentColor: "#F4F5F8",
          subtleBorder: "rgba(255, 255, 255, 0.12)",
        };
      case "anthropic":
        return {
          glowColor: "rgba(244, 181, 140, 0.04)",
          haloColor: "rgba(244, 181, 140, 0.12)",
          accentColor: "#F4B58C",
          subtleBorder: "rgba(244, 181, 140, 0.15)",
        };
      case "gemini":
        return {
          glowColor: "rgba(56, 189, 248, 0.08)",
          haloColor: "rgba(56, 189, 248, 0.18)",
          accentColor: "#38BDF8",
          subtleBorder: "rgba(56, 189, 248, 0.15)",
        };
      case "grok":
        return {
          glowColor: "rgba(255, 255, 255, 0.05)",
          haloColor: "rgba(255, 255, 255, 0.14)",
          accentColor: "#FFFFFF",
          subtleBorder: "rgba(255, 255, 255, 0.15)",
        };
      case "codexa":
      default:
        return {
          glowColor: "rgba(225, 29, 72, 0.10)",
          haloColor: "rgba(225, 29, 72, 0.22)",
          accentColor: "#E11D48",
          subtleBorder: "rgba(225, 29, 72, 0.25)",
        };
    }
  };

  const style = getSceneStyling();

  // In the Claude scene (V21), the centerpiece yields to massive negative space
  // so the gigantic planetary horizon and sunrise are the heroic centerpiece!
  if (activeScene === "anthropic") {
    return (
      <div className={`relative flex flex-col items-center justify-center select-none min-h-[320px] ${className}`}>
        {/* Soft atmospheric starlight anchor in negative space */}
        <div className="relative z-10 flex flex-col items-center text-center opacity-80 pointer-events-none">
          <div className="w-1.5 h-1.5 rounded-full bg-[#FFF5DF] shadow-[0_0_12px_#F4B58C] mb-2 animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#F4B58C]/70">
            Harmonized Intelligence
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      {/* Restrained Ambient Soft Glow (Subtle depth, NOT a neon explosion) */}
      <div
        className="absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full blur-[80px] pointer-events-none transition-all duration-700 -z-10"
        style={{ backgroundColor: style.glowColor }}
      />

      {/* Elegant, Authentic CodeXa Emblem Focal Point */}
      <div className="relative w-44 h-44 sm:w-56 sm:h-56 flex items-center justify-center">
        {/* Ambient Silver Starlight Halo */}
        <div
          className="absolute inset-0 rounded-full transition-all duration-700 pointer-events-none"
          style={{
            boxShadow: `0 0 45px ${style.haloColor}`,
            border: `1px solid ${style.subtleBorder}`,
          }}
        />

        {/* Genuine CodeXa Brand Emblem Silhouette */}
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden bg-[#0A0B0E]/90 backdrop-blur-md flex items-center justify-center p-3 shadow-[0_12px_36px_rgba(0,0,0,0.8)] border border-white/10 group transition-transform duration-500 hover:scale-105">
          <Image
            src="/assets/brand/codexa-logo.png"
            alt="CodeXa Studio IDE Official Emblem"
            width={160}
            height={160}
            className="w-full h-full object-cover rounded-full"
            priority
          />
        </div>
      </div>

      {/* Clean, Restrained Editorial Label */}
      <div className="mt-4 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
        <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-400">
          CodeXa Engine
        </span>
      </div>
    </div>
  );
}