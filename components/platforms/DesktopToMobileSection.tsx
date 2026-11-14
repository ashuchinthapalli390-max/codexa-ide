"use client";

import React, { useState } from "react";
import {
  Monitor,
  Smartphone,
  Download,
  Sparkles,
} from "lucide-react";

export function DesktopToMobileSection() {
  const [activePlatform, setActivePlatform] = useState<"desktop" | "mobile">("desktop");

  return (
    <section id="platforms" className="py-24 sm:py-32 bg-[#000000] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <span className="text-xs sm:text-sm font-sans font-medium uppercase tracking-[2px] text-[#9CA3AF] block">
            CONTINUITY ECOSYSTEM
          </span>

          <h2 className="text-3xl sm:text-5xl font-orbitron font-bold tracking-tight text-white leading-tight">
            From workstation powerhouse <br />
            <span>to agile mobile companion.</span>
          </h2>

          <p className="text-sm sm:text-base text-white/70 font-sans leading-relaxed">
            Engineered for seamless progression. CodeXa Studio IDE scales from multi-monitor desktop workstations to CodeXa's planned first mobile IDE, keeping context, authentication, and task graphs synchronized.
          </p>
        </div>

        {/* Platform Viewport Switcher */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1 rounded-xl bg-[#121316] border border-white/10 text-xs font-mono">
            <button
              onClick={() => setActivePlatform("desktop")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-[8px] transition-all ${
                activePlatform === "desktop"
                  ? "bg-white/10 text-white font-bold shadow-sm"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <Monitor className="w-4 h-4 text-white" /> Desktop Studio Viewport
            </button>
            <button
              onClick={() => setActivePlatform("mobile")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-[8px] transition-all ${
                activePlatform === "mobile"
                  ? "bg-white/10 text-white font-bold shadow-sm"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <Smartphone className="w-4 h-4 text-white" /> Mobile IDE Layout
            </button>
          </div>
        </div>

        {/* Dynamic Presentation Frame */}
        <div className="flex justify-center items-center">
          {activePlatform === "desktop" ? (
            /* Desktop Studio Frame */
            <div className="w-full max-w-4xl rounded-2xl border border-white/10 bg-[#121316] overflow-hidden shadow-2xl transition-all duration-500 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#15151A] border-b border-white/10 text-xs font-mono text-white/70">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                    <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                    <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  </div>
                  <span className="ml-2 font-bold text-white">CodeXa Studio Workstation</span>
                </div>
                <div className="text-[11px] text-white/50">Windows x64 / ARM64 &bull; Preview Build</div>
              </div>

              <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
                <div className="p-4 rounded-xl bg-[#18181D] border border-white/10 space-y-2">
                  <div className="text-[10px] text-white/50 uppercase font-bold">Workstation Engine</div>
                  <div className="text-base text-white font-bold">Uncapped Threading</div>
                  <p className="text-white/70 text-[11px] font-sans">
                    Full multithreaded AST indexer with live PTY terminal multiplexing.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#18181D] border border-white/10 space-y-2">
                  <div className="text-[10px] text-white/50 uppercase font-bold">Hardware License</div>
                  <div className="text-base text-white font-bold">CXA-DESK Keys</div>
                  <p className="text-white/70 text-[11px] font-sans">
                    Cryptographically bound to workstation motherboard UUID.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#18181D] border border-white/10 space-y-2">
                  <div className="text-[10px] text-white/50 uppercase font-bold">Telemetry</div>
                  <div className="text-base text-emerald-400 font-bold">Zero Cloud Leak</div>
                  <p className="text-white/70 text-[11px] font-sans">
                    Pure local processing or private air-gapped inference server.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Mobile IDE Frame */
            <div className="w-full max-w-sm rounded-[36px] border-4 border-white/20 bg-[#000000] p-4 shadow-2xl transition-all duration-500 animate-in fade-in zoom-in-95 relative">
              {/* Phone Notch */}
              <div className="w-32 h-4 bg-[#18181D] rounded-full mx-auto mb-4" />

              <div className="rounded-2xl bg-[#121316] border border-white/10 p-4 space-y-4">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-orbitron font-bold text-white text-[11px]">CODEXA MOBILE</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    APK v1.0
                  </span>
                </div>

                {/* Mobile IDE Code Editor Preview */}
                <div className="p-3 rounded-xl bg-[#18181D] border border-white/10 font-mono text-[10px] space-y-1">
                  <div className="text-white/40">// Touch-optimized syntax editor</div>
                  <div className="text-white font-bold">export function mobileTask() &#123;</div>
                  <div className="pl-2 text-white/80">return await syncAgency();</div>
                  <div className="text-white font-bold">&#125;</div>
                </div>

                {/* Mobile AI Quick Bar */}
                <div className="p-2.5 rounded-xl bg-[#18181D] border border-white/10 flex items-center justify-between text-[11px] font-mono">
                  <span className="flex items-center gap-1.5 text-white">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Astra 6 Mobile Assistant</span>
                  </span>
                  <span className="text-white font-bold">&rarr;</span>
                </div>

                <div className="pt-2 text-center">
                  <a
                    href="https://codxa-agency.online/downloads/CodeXa.apk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-[8px] bg-white hover:bg-[#E5E7EB] text-[#050506] text-xs font-sans font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" /> Download APK (46.5 MB)
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Platform Status Comparison Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Windows */}
          <div className="p-6 rounded-2xl bg-[#121316] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-base font-orbitron font-bold text-white">Windows</span>
              <span className="px-2 py-0.5 rounded bg-white/10 text-white text-[10px] font-mono font-bold">
                Preview Available
              </span>
            </div>
            <p className="text-xs text-white/70 font-sans leading-relaxed">
              Official preview executable package for Windows 10/11 x64 and ARM64 workstations.
            </p>
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/50">
              <span>Installer: 84.2 MB</span>
              <span className="text-white font-bold">v1.0.0-Preview</span>
            </div>
          </div>

          {/* macOS */}
          <div className="p-6 rounded-2xl bg-[#121316] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-base font-orbitron font-bold text-white">macOS</span>
              <span className="px-2 py-0.5 rounded bg-white/5 text-white/50 text-[10px] font-mono font-bold">
                Coming Soon
              </span>
            </div>
            <p className="text-xs text-white/70 font-sans leading-relaxed">
              Universal binary (Apple Silicon M1-M4 &amp; Intel) undergoing security notarization.
            </p>
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/50">
              <span>Target: Q1 2027</span>
              <span className="text-white font-bold">Planned</span>
            </div>
          </div>

          {/* Mobile */}
          <div className="p-6 rounded-2xl bg-[#121316] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-base font-orbitron font-bold text-white">Mobile Suite</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold">
                APK In Rollout
              </span>
            </div>
            <p className="text-xs text-white/70 font-sans leading-relaxed">
              Android APK v1.0 active in CodeXa Agency ecosystem; companion iOS in development.
            </p>
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/50">
              <span>Android APK: 46.5 MB</span>
              <span className="text-emerald-400 font-bold">Available Now</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
