"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import {
  Code2,
  Eye,
  Monitor,
  Tablet,
  Smartphone,
  Sliders,
  Sparkles,
  Check,
  RefreshCw,
  LayoutGrid,
  Columns,
  Square,
  ArrowRight,
} from "lucide-react";

export function CodeToPreviewSection() {
  const [headline, setHeadline] = useState("Autonomous Web Platform");
  const [subheading, setSubheading] = useState("Engineered with CodeXa Agency architecture.");
  const [accent, setAccent] = useState("#D9354D");
  const [layout, setLayout] = useState<"cards" | "split" | "minimal">("cards");
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [activeTab, setActiveTab] = useState<"split" | "code-only" | "preview-only">("split");

  // Dynamically constructed realistic code string reflecting actual state
  const generatedCode = `"use client";

import React from "react";
import { Button } from "@/components/ui/button";

export default function ModernHero() {
  return (
    <section className="relative p-8 rounded-2xl bg-[#0D0E11] border border-[#282A31]">
      {/* Accent Aura */}
      <div 
        className="absolute top-0 right-10 w-48 h-48 rounded-full blur-3xl pointer-events-none" 
        style={{ backgroundColor: "${accent}15" }}
      />
      
      <div className="relative z-10 max-w-xl">
        <span 
          className="text-xs font-mono uppercase tracking-widest font-semibold"
          style={{ color: "${accent}" }}
        >
          // Verified Build
        </span>
        <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-white">
          ${headline}
        </h1>
        <p className="mt-2 text-sm text-neutral-400">
          ${subheading}
        </p>

        {/* Layout Mode: ${layout.toUpperCase()} */}
        <div className="mt-6 flex items-center gap-3">
          <button 
            style={{ backgroundColor: "${accent}" }}
            className="px-4 py-2 rounded-xl text-white font-mono text-xs uppercase font-bold"
          >
            Deploy Container
          </button>
        </div>
      </div>
    </section>
  );
}`;

  const lines = generatedCode.split("\n");

  return (
    <section id="preview" className="py-24 sm:py-32 bg-[#08090B] border-t border-[#1F2127]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <Badge variant="accent" size="md">
            Reactive Synthesis Engine
          </Badge>

          <h2 className="text-3xl sm:text-5xl font-orbitron font-black tracking-tight text-[#F5F5F6]">
            From code to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D9354D] to-[#EB465D]">
              something real.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-[#A5A6AE] font-sans leading-relaxed">
            Watch the boundaries between code syntax and production interface disappear. As you type, CodeXa's reactive compiler reflects AST transformations with hot-swap precision.
          </p>
        </div>

        {/* Demo Controls Bar */}
        <div className="mb-6 p-3 rounded-2xl bg-[#0D0E11] border border-[#282A31] flex flex-wrap items-center justify-between gap-4">
          {/* View Mode Splitter */}
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5 text-xs font-mono">
            <button
              onClick={() => setActiveTab("split")}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === "split" ? "bg-[#1A1C22] text-white font-bold" : "text-[#71737D] hover:text-white"
              }`}
            >
              <Columns className="w-3.5 h-3.5" /> Split (Code + Preview)
            </button>
            <button
              onClick={() => setActiveTab("code-only")}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === "code-only" ? "bg-[#1A1C22] text-white font-bold" : "text-[#71737D] hover:text-white"
              }`}
            >
              <Code2 className="w-3.5 h-3.5" /> Code Only
            </button>
            <button
              onClick={() => setActiveTab("preview-only")}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === "preview-only" ? "bg-[#1A1C22] text-white font-bold" : "text-[#71737D] hover:text-white"
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> Preview Only
            </button>
          </div>

          {/* Interactive Controls */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            {/* Accent Selector */}
            <div className="flex items-center gap-2">
              <span className="text-[#71737D]">Accent:</span>
              <div className="flex items-center gap-1">
                {[
                  { name: "Crimson", hex: "#D9354D" },
                  { name: "Cyan", hex: "#38BDF8" },
                  { name: "Amber", hex: "#F59E0B" },
                  { name: "Emerald", hex: "#10B981" },
                ].map((col) => (
                  <button
                    key={col.hex}
                    onClick={() => setAccent(col.hex)}
                    title={col.name}
                    className={`w-4 h-4 rounded-full border transition-transform ${
                      accent === col.hex ? "border-white scale-125" : "border-transparent"
                    }`}
                    style={{ backgroundColor: col.hex }}
                  />
                ))}
              </div>
            </div>

            {/* Layout Mode */}
            <div className="flex items-center gap-1.5">
              <span className="text-[#71737D]">Layout:</span>
              <div className="flex items-center bg-black/40 rounded-lg p-0.5 border border-white/5">
                {(["cards", "split", "minimal"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLayout(l)}
                    className={`px-2 py-1 rounded capitalize text-[11px] ${
                      layout === l ? "bg-[#1A1C22] text-white font-bold" : "text-[#71737D]"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Viewport Switcher */}
            <div className="flex items-center gap-1 bg-black/40 rounded-lg p-0.5 border border-white/5">
              <button
                onClick={() => setViewport("desktop")}
                className={`p-1.5 rounded ${viewport === "desktop" ? "bg-[#1A1C22] text-white" : "text-[#71737D]"}`}
                title="Desktop 1440px"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewport("tablet")}
                className={`p-1.5 rounded ${viewport === "tablet" ? "bg-[#1A1C22] text-white" : "text-[#71737D]"}`}
                title="Tablet 768px"
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewport("mobile")}
                className={`p-1.5 rounded ${viewport === "mobile" ? "bg-[#1A1C22] text-white" : "text-[#71737D]"}`}
                title="Mobile 375px"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Workspace Dual Panel (Code Editor on Left, Live Render on Right) */}
        <div className="rounded-2xl border border-[#282A31] bg-[#0D0E11] overflow-hidden shadow-2xl">
          {/* Header bar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#090A0D] border-b border-[#282A31] text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D9354D]" />
              <span className="text-[#F5F5F6] font-semibold">src/components/ModernHero.tsx</span>
              <span className="text-[10px] text-[#71737D]">&bull; Reactive Compilation Target</span>
            </div>
            <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Hot HMR Active (0ms)
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
            {/* Left: Code Editor (7 cols if split, 12 if code-only, hidden if preview-only) */}
            {activeTab !== "preview-only" && (
              <div
                className={`${
                  activeTab === "split" ? "lg:col-span-6 border-b lg:border-b-0 lg:border-r" : "lg:col-span-12"
                } border-[#282A31] bg-[#0A0B0E] p-4 font-mono text-[11px] sm:text-xs overflow-y-auto ide-scroll leading-relaxed max-h-[460px]`}
              >
                {lines.map((line, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start py-0.5 rounded px-1.5 ${
                      line.includes(headline) || line.includes(accent)
                        ? "bg-[rgba(217,53,77,0.12)] border-l-2 border-[#D9354D]"
                        : "hover:bg-white/[0.02]"
                    }`}
                  >
                    <span className="w-8 text-right pr-3 select-none text-[10px] text-[#555863] shrink-0 font-mono">
                      {idx + 1}
                    </span>
                    <span className="flex-1 whitespace-pre break-all">
                      {line.includes("export default") || line.includes("return") || line.includes("import") ? (
                        <span className="text-[#D9354D] font-bold">{line}</span>
                      ) : line.includes("<") || line.includes("</") ? (
                        <span className="text-[#61AFEF]">{line}</span>
                      ) : line.includes('"') || line.includes("'") ? (
                        <span className="text-[#98C379]">{line}</span>
                      ) : (
                        <span className="text-[#E5C07B]">{line}</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Right: Live Preview Rendering (6 cols if split, 12 if preview-only, hidden if code-only) */}
            {activeTab !== "code-only" && (
              <div
                className={`${
                  activeTab === "split" ? "lg:col-span-6" : "lg:col-span-12"
                } bg-[#08090B] p-6 sm:p-8 flex flex-col justify-center items-center overflow-x-auto`}
              >
                {/* Live Responsive Frame */}
                <div
                  className={`w-full transition-all duration-300 rounded-2xl border border-[#282A31] bg-[#0D0E11] p-6 shadow-2xl relative overflow-hidden ${
                    viewport === "desktop"
                      ? "max-w-xl"
                      : viewport === "tablet"
                      ? "max-w-md"
                      : "max-w-xs"
                  }`}
                >
                  {/* Subtle directional glow */}
                  <div
                    className="absolute -top-10 -right-10 w-44 h-44 rounded-full blur-2xl pointer-events-none transition-colors duration-300"
                    style={{ backgroundColor: `${accent}25` }}
                  />

                  {/* Header text inputs inside preview */}
                  <div className="relative z-10 space-y-3">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span
                        className="font-bold uppercase tracking-wider"
                        style={{ color: accent }}
                      >
                        // Live Result
                      </span>
                      <span className="text-[#71737D]">CodeXa Sandbox</span>
                    </div>

                    <input
                      type="text"
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      className="w-full bg-transparent text-xl sm:text-2xl font-orbitron font-extrabold text-[#F5F5F6] border-b border-transparent hover:border-white/20 focus:border-white focus:outline-none transition-colors"
                      title="Click to edit headline"
                    />

                    <input
                      type="text"
                      value={subheading}
                      onChange={(e) => setSubheading(e.target.value)}
                      className="w-full bg-transparent text-xs text-[#A5A6AE] border-b border-transparent hover:border-white/20 focus:border-white focus:outline-none transition-colors font-sans"
                      title="Click to edit subtitle"
                    />

                    {/* Layout variations based on state */}
                    {layout === "cards" && (
                      <div className="grid grid-cols-2 gap-3 pt-3">
                        <div className="p-3 rounded-xl bg-[#13151A] border border-[#282A31] space-y-1">
                          <span className="text-[10px] font-mono text-[#71737D] uppercase">Throughput</span>
                          <span className="block text-base font-orbitron font-bold text-white">4.2M/s</span>
                        </div>
                        <div className="p-3 rounded-xl bg-[#13151A] border border-[#282A31] space-y-1">
                          <span className="text-[10px] font-mono text-[#71737D] uppercase">Latency</span>
                          <span className="block text-base font-orbitron font-bold text-emerald-400">12ms</span>
                        </div>
                      </div>
                    )}

                    {layout === "split" && (
                      <div className="p-3 rounded-xl bg-[#13151A] border border-[#282A31] flex items-center justify-between text-xs font-mono">
                        <span className="text-[#A5A6AE]">Local Edge Engine</span>
                        <span className="text-white font-bold" style={{ color: accent }}>Active</span>
                      </div>
                    )}

                    {/* Interactive Button */}
                    <div className="pt-3">
                      <button
                        style={{ backgroundColor: accent }}
                        className="w-full py-2.5 rounded-xl text-white font-mono text-xs uppercase font-bold tracking-wider shadow-lg transition-transform active:scale-95"
                      >
                        Deploy Container
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-[11px] font-mono text-[#71737D]">
                  Editable in-place: Click on the headline or subtitle in the preview to live-update code.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

