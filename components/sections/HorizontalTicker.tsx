"use client";

import React from "react";

export function HorizontalTicker() {
  const announcements = [
    { text: "CODEXA STUDIO IDE 5.0", highlight: true },
    { text: "AI-POWERED DEVELOPMENT" },
    { text: "CHAT • PLAN • AGENT • DEBUG", highlight: true },
    { text: "CODE. BUILD. CREATE." },
    { text: "LOCAL-FIRST AST REASONING ENGINE" },
    { text: "SUB-50MS EXECUTION LOOP", highlight: true },
    { text: "ZERO TELEMETRY AIR-GAP PRIVACY" },
    { text: "OFFICIAL ONLINE LAUNCH: 17 NOVEMBER 2026", highlight: true },
    { text: "POWERED BY CODEXA AGENCY" },
    { text: "MULTI-MODEL ORCHESTRATION: GEMINI • CLAUDE • DEEPSEEK • OLLAMA", highlight: true },
    { text: "WINDOWS • MACOS • LINUX • ANDROID COMPANION" },
  ];

  // Exactly 2 copies for flawless -50% translateX loop
  const displayItems = [...announcements, ...announcements];

  return (
    <div className="w-full bg-gray-200 border-y border-gray-300 text-black py-3.5 overflow-hidden flex shadow-sm promo-banner-container group select-none relative z-20">
      <div className="flex whitespace-nowrap min-w-max shrink-0 promo-scroll items-center">
        {displayItems.map((item, idx) => (
          <span
            key={idx}
            className="flex items-center text-[13.5px] font-sans font-semibold tracking-wide text-gray-800 px-6 shrink-0 transition-colors group-hover:text-black"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-black/60 mr-4 shrink-0" />
            <span className={item.highlight ? "font-bold text-black" : "text-gray-700"}>
              {item.text}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
