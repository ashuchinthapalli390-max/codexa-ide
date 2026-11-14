"use client";

import React, { useRef, useEffect } from "react";
import { Monitor, Laptop, Terminal, Smartphone, Bell, Clock, ShieldCheck, CheckCircle2 } from "lucide-react";
import { getGsap } from "@/lib/motion/gsapSetup";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";
import { MOTION_EASINGS } from "@/lib/motion/tokens";

interface PlatformInfo {
  id: string;
  name: string;
  sub: string;
  arch: string;
  status: "AVAILABLE SOON" | "UNDER DEVELOPMENT" | "PLANNED";
  statusVariant: "soon" | "dev" | "planned";
  features: string[];
  icon: React.ReactNode;
}

const PLATFORMS: PlatformInfo[] = [
  {
    id: "windows",
    name: "Windows",
    sub: "Desktop Workstation",
    arch: "x64 & ARM64",
    status: "AVAILABLE SOON",
    statusVariant: "soon",
    features: [
      "Native MSIX installer with automatic background updates",
      "DirectX GPU-accelerated terminal canvas",
      "Windows Subsystem for Linux (WSL2) deep bridge",
      "Native Windows Credential Manager keychain",
    ],
    icon: <Monitor className="w-5 h-5 text-white" />,
  },
  {
    id: "macos",
    name: "macOS",
    sub: "Apple Silicon & Intel",
    arch: "Universal Binary",
    status: "AVAILABLE SOON",
    statusVariant: "soon",
    features: [
      "Apple Silicon (M1/M2/M3/M4) native ARM64 compilation",
      "Metal rendering engine with high-DPI Retina scaling",
      "macOS Keychain Access cryptographic token storage",
      "macOS dark/light appearance synchronization",
    ],
    icon: <Laptop className="w-5 h-5 text-white" />,
  },
  {
    id: "linux",
    name: "Linux",
    sub: "Desktop Distributions",
    arch: ".deb, .rpm & AppImage",
    status: "AVAILABLE SOON",
    statusVariant: "soon",
    features: [
      "Debian/Ubuntu, Fedora/RHEL, and Arch packaging",
      "Native Wayland and X11 display server protocols",
      "Secret Service API & libsecret private key vault",
      "Headless CLI mode for remote workstation servers",
    ],
    icon: <Terminal className="w-5 h-5 text-white" />,
  },
  {
    id: "android",
    name: "Android",
    sub: "Companion & Preview",
    arch: "ARM64 Android 12+",
    status: "UNDER DEVELOPMENT",
    statusVariant: "dev",
    features: [
      "Tablet-optimized live preview inspection runtime",
      "Remote agent task monitor & notifications",
      "On-the-go AST code review & commit approvals",
      "Touch-first virtual keyboard shortcuts",
    ],
    icon: <Smartphone className="w-5 h-5 text-white" />,
  },
  {
    id: "ios",
    name: "iOS & iPadOS",
    sub: "Companion Hub",
    arch: "iOS 16+ / iPadOS",
    status: "PLANNED",
    statusVariant: "planned",
    features: [
      "Companion notification center for AI build tasks",
      "iPad Stage Manager multi-window review layout",
      "Encrypted cloud-synced project notifications",
      "Touch-friendly unified diff inspector",
    ],
    icon: <Smartphone className="w-5 h-5 text-white" />,
  },
];

export function PlatformAvailabilitySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const isReduced = useReducedMotion();

  useEffect(() => {
    if (isReduced) return;

    const { gsap } = getGsap();
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: MOTION_EASINGS.smoothOut,
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      if (cardsRef.current) {
        gsap.fromTo(
          cardsRef.current.children,
          { opacity: 0, y: 30, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: MOTION_EASINGS.smoothOut,
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isReduced]);

  const handleNotify = (platformId: string) => {
    window.dispatchEvent(
      new CustomEvent("open-release-notification", {
        detail: { platform: platformId },
      })
    );
  };

  return (
    <section
      ref={sectionRef}
      id="availability"
      className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#000000] text-white border-t border-white/5 relative"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div ref={headerRef} className="text-center mb-16">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#A1A4AE] mb-3 block font-sans">
            PLATFORM AVAILABILITY
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white font-orbitron">
            CodeXa Is Coming Soon.
          </h2>
          <p className="text-[14px] text-white/60 max-w-2xl mx-auto leading-relaxed mt-3">
            CodeXa Studio IDE is being prepared for release. Explore supported targets and register for launch alerts across your developer operating systems.
          </p>
        </div>

        {/* 5 Platform Cards Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5"
        >
          {PLATFORMS.map((platform) => {
            const isSoon = platform.statusVariant === "soon";
            const isDev = platform.statusVariant === "dev";

            return (
              <div
                key={platform.id}
                className="bg-[#121217] border border-white/10 rounded-xl p-6 flex flex-col justify-between hover:border-white/20 transition-all shadow-sm group"
              >
                <div>
                  {/* Top Bar: Icon + Arch */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                      {platform.icon}
                    </div>
                    <span className="text-[10px] font-mono text-white/40">
                      {platform.arch}
                    </span>
                  </div>

                  {/* Title & Sub */}
                  <h3 className="text-lg font-bold text-white mb-0.5 font-sans">
                    {platform.name}
                  </h3>
                  <div className="text-[11px] text-white/40 font-mono mb-4">
                    {platform.sub}
                  </div>

                  {/* Status Pill */}
                  <div className="mb-5">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full ${
                        isSoon
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                          : isDev
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                          : "bg-white/5 text-neutral-400 border border-white/10"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isSoon
                            ? "bg-emerald-400 animate-pulse"
                            : isDev
                            ? "bg-amber-400"
                            : "bg-neutral-500"
                        }`}
                      />
                      {platform.status}
                    </span>
                  </div>

                  {/* Features */}
                  <ul className="flex flex-col gap-2 text-[11.5px] text-white/60 mb-6">
                    {platform.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Get Notified Button */}
                <div className="pt-3 border-t border-white/5">
                  <button
                    onClick={() => handleNotify(platform.id)}
                    className="w-full py-2.5 px-3 rounded-lg bg-white/10 hover:bg-white text-white hover:text-black text-xs font-semibold font-sans flex items-center justify-center gap-1.5 transition-all active:scale-95"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>Get Notified</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security & Release Notice */}
        <div className="mt-12 p-4 rounded-xl bg-white/[0.02] border border-white/5 max-w-2xl mx-auto flex items-center gap-3 text-xs text-white/50">
          <ShieldCheck className="w-5 h-5 text-white/40 shrink-0" />
          <span>
            All binaries are digitally signed with verified certificates and publish automated SHA-256 checksums alongside each official release.
          </span>
        </div>
      </div>
    </section>
  );
}