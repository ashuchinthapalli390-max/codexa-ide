import React from "react";
import Link from "next/link";
import { ArrowRight, Bell } from "lucide-react";
import { KineticHeadline } from "@/components/hero/KineticHeadline";
import { FloatingWorkspaceShowcase } from "@/components/hero/FloatingWorkspaceShowcase";

export function HeroSection() {
  return (
    <section className="relative pt-10 sm:pt-16 pb-0 overflow-hidden bg-[#000000]">
      {/* Background subtle architectural grid */}
      <div className="absolute inset-0 bg-subtle-grid opacity-20 pointer-events-none" />

      {/* NexCloud subtle ambient radial illumination */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[rgba(255,255,255,0.03)] rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Eyebrow Announcement Pill (Matching NexCloud promo pill) */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111111] border border-white/10 text-xs font-mono text-[#A1A4AE] hover:border-white/20 transition-all hover:scale-[1.01]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
            <span className="text-white font-semibold">
              CodeXa Studio IDE v1.0
            </span>
            <span className="text-white/40">•</span>
            <span className="text-white/80">Pre-Beta Reservations Open</span>
          </div>
        </div>

        {/* Hero Typography with Kinetic Transitioning Headline */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <KineticHeadline />

          <p className="max-w-2xl mx-auto text-base sm:text-[17px] font-inter font-normal text-white/70 leading-[1.5] tracking-[-0.015em]">
            CodeXa Studio IDE brings your code, intelligent assistance, developer tools and live previews into one focused workspace.
          </p>

          {/* Hero Action CTAs (Matching NexCloud exact .hero-actions) */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="#availability"
              className="group w-full sm:w-auto h-11 px-6 rounded-[8px] bg-white hover:bg-[#E5E7EB] active:scale-[0.98] text-[#050506] text-[15px] font-sans font-semibold tracking-[-0.03em] flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-[1.01]"
            >
              <Bell className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
              <span>Available Soon</span>
            </Link>

            <Link
              href="#pricing"
              className="group w-full sm:w-auto h-11 px-6 rounded-[8px] bg-[rgba(255,255,255,0.043)] hover:bg-[rgba(255,255,255,0.08)] active:scale-[0.98] text-white text-[15px] font-sans font-semibold tracking-[-0.03em] border border-[rgba(255,255,255,0.2)] hover:border-white/40 flex items-center justify-center gap-2 transition-all"
            >
              <span>Explore Plans</span>
              <ArrowRight className="w-4 h-4 text-white/60 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-white" />
            </Link>
          </div>

          {/* Quick Platform tags */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs font-sans text-white/50">
            <span className="flex items-center gap-1.5 text-white/75">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
              Windows x64 / ARM64
            </span>
            <span>•</span>
            <span>macOS Universal (Apple Silicon &amp; Intel)</span>
            <span>•</span>
            <span>Linux AppImage &amp; Deb</span>
            <span>•</span>
            <span>Android Companion Hub</span>
          </div>
        </div>

        {/* Large Dominant Floating Glass IDE Showcase with Autonomous Workflow */}
        <FloatingWorkspaceShowcase />
      </div>
    </section>
  );
}