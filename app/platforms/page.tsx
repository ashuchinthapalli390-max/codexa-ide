import React from "react";
import type { Metadata } from "next";
import { DesktopToMobileSection } from "@/components/platforms/DesktopToMobileSection";
import { Button } from "@/components/ui/Button";
import { Download } from "lucide-react";

export const metadata: Metadata = {
  title: "Platforms & Roadmap",
  description:
    "Explore CodeXa Studio IDE platform availability across Windows, macOS, Linux, and CodeXa Mobile.",
};

export default function PlatformsPage() {
  return (
    <div className="pt-28 pb-20 bg-[#000000]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs sm:text-sm font-sans font-medium uppercase tracking-[2px] text-[#9CA3AF] block">
            CROSS-DEVICE ARCHITECTURE
          </span>
          <h1 className="text-4xl sm:text-6xl font-orbitron font-bold tracking-tight text-white leading-tight">
            One Architecture. <br />
            <span>Every Screen You Build On.</span>
          </h1>
          <p className="text-base text-white/70 font-sans leading-relaxed">
            From high-throughput Windows multi-monitor setups to the planned CodeXa mobile suite on Android and iOS. Your project context, device license, and agent workflows remain completely in sync.
          </p>
        </div>
      </div>

      <DesktopToMobileSection />

      {/* Cross-Platform Roadmap Schedule */}
      <section className="py-20 border-t border-white/5 bg-[#020202]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-orbitron font-bold text-white">
              Release Roadmap &amp; Publication Milestones
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 font-mono text-xs">
            <div className="p-6 rounded-2xl bg-[#121316] border border-white/10 space-y-3">
              <span className="text-[10px] text-emerald-400 font-bold uppercase block">Stage 01 &bull; Active</span>
              <h3 className="text-base font-orbitron font-bold text-white">Windows Preview</h3>
              <p className="text-white/70 font-sans text-xs">
                x64 and ARM64 preview builds with native CXA-DESK hardware key activation.
              </p>
              <div className="pt-2 text-[11px] text-white font-bold">Available Now</div>
            </div>

            <div className="p-6 rounded-2xl bg-[#121316] border border-white/10 space-y-3">
              <span className="text-[10px] text-emerald-400 font-bold uppercase block">Stage 02 &bull; Active</span>
              <h3 className="text-base font-orbitron font-bold text-white">Android Mobile</h3>
              <p className="text-white/70 font-sans text-xs">
                CodeXa Mobile APK v1.0 released for daily team workspace &amp; agency collaboration.
              </p>
              <div className="pt-2 text-[11px] text-emerald-400 font-bold">APK Released (46.5 MB)</div>
            </div>

            <div className="p-6 rounded-2xl bg-[#121316] border border-white/10 space-y-3">
              <span className="text-[10px] text-white/40 font-bold uppercase block">Stage 03 &bull; Q1 2027</span>
              <h3 className="text-base font-orbitron font-bold text-white">macOS Universal</h3>
              <p className="text-white/70 font-sans text-xs">
                Apple Silicon (M1-M4) &amp; Intel binaries undergoing notarization pipeline.
              </p>
              <div className="pt-2 text-[11px] text-white/50">In Security Review</div>
            </div>

            <div className="p-6 rounded-2xl bg-[#121316] border border-white/10 space-y-3">
              <span className="text-[10px] text-white/40 font-bold uppercase block">Stage 04 &bull; Q1 2027</span>
              <h3 className="text-base font-orbitron font-bold text-white">iOS Mobile Companion</h3>
              <p className="text-white/70 font-sans text-xs">
                TestFlight developer cohort opening alongside official milestone rollouts.
              </p>
              <div className="pt-2 text-[11px] text-white/50">Planned Beta</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 text-center">
        <Button variant="primary" size="lg" href="/download" leftIcon={<Download className="w-4 h-4" />}>
          Download CodeXa Studio
        </Button>
      </div>
    </div>
  );
}
