"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { IDEWorkbench, IDETheme } from "@/components/workspace/IDEWorkbench";
import { Check } from "lucide-react";

const THEMES: { id: IDETheme; name: string; tag: string; description: string; colors: string[] }[] = [
  {
    id: "obsidian",
    name: "CodeXa Obsidian",
    tag: "Default Studio",
    description: "Ultra-dark obsidian surfaces (#121316) with precision white and emerald accents.",
    colors: ["#000000", "#121316", "#15151A", "#FFFFFF"],
  },
  {
    id: "pure-black",
    name: "Pure Black OLED",
    tag: "High Contrast",
    description: "True #000000 pixels engineered for OLED panels with zero blooming.",
    colors: ["#000000", "#050505", "#141416", "#22C55E"],
  },
  {
    id: "midnight-slate",
    name: "Midnight Slate",
    tag: "Cold Steel",
    description: "Deep oceanic slate with chilled cyan highlights and frosty syntax.",
    colors: ["#0B0F17", "#0E131F", "#1D2638", "#38BDF8"],
  },
  {
    id: "tokyo-dark",
    name: "Tokyo Night Dark",
    tag: "Cyber Aesthetic",
    description: "Subtle indigo and twilight amethyst tones with neon accents.",
    colors: ["#16161E", "#1A1B26", "#292E42", "#BB9AF7"],
  },
  {
    id: "monokai-pro",
    name: "Monokai Minimal",
    tag: "Warm Classic",
    description: "Warm charcoal backing with balanced ochre and lime highlights.",
    colors: ["#19181A", "#221F22", "#2D2A2E", "#FFD866"],
  },
  {
    id: "light-studio",
    name: "Studio Clean Light",
    tag: "High Luminance",
    description: "Crisp architectural paper white with razor-sharp editorial typography.",
    colors: ["#FFFFFF", "#F8FAFC", "#CBD5E1", "#050506"],
  },
];

export function ThemeExplorerSection() {
  const [selectedTheme, setSelectedTheme] = useState<IDETheme>("obsidian");

  return (
    <section id="themes" className="py-24 sm:py-32 bg-[#000000] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <span className="text-xs sm:text-sm font-sans font-medium uppercase tracking-[2px] text-[#9CA3AF] block">
            VISUAL PERSONALIZATION
          </span>

          <h2 className="text-3xl sm:text-5xl font-orbitron font-bold tracking-tight text-white">
            Tailored to your eyes. <br />
            <span>Obsidian by default.</span>
          </h2>

          <p className="text-sm sm:text-base text-white/70 font-sans leading-relaxed">
            Every theme is optically tuned for long engineering sessions. Color palettes map consistently across the editor canvas, sidebars, tabs, diff trees, and integrated terminal.
          </p>
        </div>

        {/* Theme Selector Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-12">
          {THEMES.map((th) => {
            const isSelected = selectedTheme === th.id;
            return (
              <button
                key={th.id}
                onClick={() => setSelectedTheme(th.id)}
                className={`p-3.5 rounded-xl border text-left transition-all relative ${
                  isSelected
                    ? "bg-white/10 border-white/30 text-white shadow-sm"
                    : "bg-[#121316] border-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex gap-1">
                    {th.colors.map((c, i) => (
                      <span
                        key={i}
                        className="w-2.5 h-2.5 rounded-full border border-black/40"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                </div>
                <div className="text-xs font-mono font-bold text-white truncate">{th.name}</div>
                <div className="text-[10px] font-mono text-white/50 uppercase mt-0.5">{th.tag}</div>
              </button>
            );
          })}
        </div>

        {/* Live Recolored IDE Preview */}
        <div className="rounded-2xl overflow-hidden shadow-2xl">
          <IDEWorkbench
            initialTheme={selectedTheme}
            compact={false}
            initialFile="src/components/LiveEditor.tsx"
            initialMode="plan"
          />
        </div>
      </div>
    </section>
  );
}
