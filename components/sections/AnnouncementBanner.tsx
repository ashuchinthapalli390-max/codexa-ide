"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function AnnouncementBanner() {
  const tickerItems = [
    "CodeXa Studio IDE — Official Online Launch: 17 November 2026",
    "Local-First Deterministic AST Architecture",
    "Astra 6, Fabel 5.1 & GPT 6.1 SOL Multi-Model Engine",
    "Zero Cloud Telemetry by Default",
    "Windows Preview Available (x64 / ARM64)",
    "Android Mobile Companion APK v1.0",
    "Hardware Key Licensing: CXA-DESK Verified",
    "Powered by CodeXa Agency",
  ];

  return (
    <div className="w-full bg-[#000000] border-b border-white/5 text-white/70 text-xs font-sans select-none overflow-hidden">
      {/* Top compact alert */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div className="flex items-center gap-2 justify-center">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]" />
          </span>
          <span className="text-white font-semibold text-[13px]">
            CodeXa Studio IDE — Official Online Launch: 17 November 2026
          </span>
          <span className="hidden md:inline text-white/40">•</span>
          <span className="hidden md:inline text-white/60 text-[13px]">
            Developer Preview seats now open for CodeXa Agency members
          </span>
        </div>

        <Link
          href="/download"
          className="inline-flex items-center gap-1.5 text-white hover:text-white/80 font-bold text-[12px] uppercase tracking-wider transition-colors shrink-0 font-sans"
        >
          <span>Claim Seat</span>
          <ArrowRight className="w-3.5 h-3.5 text-white" />
        </Link>
      </div>

      {/* Marquee ticker strip */}
      <div className="w-full bg-[#020202] border-t border-white/5 py-2 overflow-hidden flex relative">
        <div className="flex whitespace-nowrap animate-marquee items-center gap-8 text-[13px] font-sans font-medium text-white/60">
          {tickerItems.concat(tickerItems).map((text, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <span className="text-[#22C55E] font-bold">•</span>
              <span className="hover:text-white transition-colors">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
