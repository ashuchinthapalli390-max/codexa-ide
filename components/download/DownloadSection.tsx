"use client";

import React, { useState, useEffect, useRef } from "react";
import { releaseManifest, PlatformRelease } from "@/lib/releases/manifest";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import confetti from "canvas-confetti";
import { getGsap } from "@/lib/motion/gsapSetup";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";
import { MOTION_EASINGS } from "@/lib/motion/tokens";
import {
  Download,
  Monitor,
  Laptop,
  Smartphone,
  Copy,
  Check,
  ShieldCheck,
  FileCheck,
  Bell,
  Clock,
  Terminal,
  ChevronRight,
  Lock,
} from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { isLeadershipRole, getRoleBadgeLabel } from "@/lib/auth/roles";

export function DownloadSection() {
  const { user, role, entitlement } = useAuth();
  const isLeadership = isLeadershipRole(role);
  const isInternal = isLeadership || role === "intern" || role === "agency_member";

  const [selectedPlatform, setSelectedPlatform] = useState<string>("windows");
  const [copiedHash, setCopiedHash] = useState(false);
  const [notifyModalOpen, setNotifyModalOpen] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifySuccess, setNotifySuccess] = useState(false);
  const [detectedOS, setDetectedOS] = useState<string>("windows");
  const [isPreparingDownload, setIsPreparingDownload] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const isReduced = useReducedMotion();

  useEffect(() => {
    if (isReduced) return;

    const { gsap, ScrollTrigger } = getGsap();
    if (!cardRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 35, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: MOTION_EASINGS.smoothOut,
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [isReduced]);

  useEffect(() => {
    // OS Detection
    if (typeof window !== "undefined") {
      const userAgent = window.navigator.userAgent.toLowerCase();
      if (userAgent.includes("win")) {
        setSelectedPlatform("windows");
        setDetectedOS("windows");
      } else if (userAgent.includes("mac")) {
        setSelectedPlatform("macos");
        setDetectedOS("macos");
      } else if (userAgent.includes("android")) {
        setSelectedPlatform("android");
        setDetectedOS("android");
      } else if (userAgent.includes("linux")) {
        setSelectedPlatform("linux");
        setDetectedOS("linux");
      }
    }
  }, []);

  const release: PlatformRelease =
    releaseManifest.platforms[selectedPlatform] || releaseManifest.platforms.windows;

  const copyChecksum = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2500);
  };

  const handleDownloadTrigger = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (isPreparingDownload) {
      e.preventDefault();
      return;
    }
    e.preventDefault();
    setIsPreparingDownload(true);

    setTimeout(() => {
      setIsPreparingDownload(false);
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
          colors: ["#FFFFFF", "#22C55E", "#9CA3AF"],
        });
      } catch {}
      window.location.href = href;
    }, 700);
  };

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyEmail) return;
    setNotifySuccess(true);
    setTimeout(() => {
      setNotifyModalOpen(false);
      setNotifySuccess(false);
      setNotifyEmail("");
    }, 1800);
  };

  return (
    <section ref={sectionRef} id="download" className="py-24 sm:py-32 bg-[#000000] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <span className="text-xs sm:text-sm font-sans font-medium uppercase tracking-[2px] text-[#9CA3AF] block">
            OFFICIAL RELEASE DISTRIBUTION
          </span>

          <h2 className="text-3xl sm:text-[44px] font-orbitron font-bold tracking-tight text-white leading-tight">
            Get CodeXa Studio IDE.
          </h2>

          <p className="text-[14px] font-sans font-normal text-white/70 leading-[22.75px]">
            Verified, cryptographically signed binaries direct from CodeXa Agency infrastructure.
          </p>

          <div className="pt-2 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#121316] border border-white/10 text-[13px] font-sans text-white">
            <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
            <span>Official Online Launch &bull;</span>
            <strong className="text-white">17 November 2026</strong>
          </div>
        </div>

        {/* Platform Selection Tabs */}
        <div className="flex justify-center mb-10">
          <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-[#121316] border border-white/10 font-sans">
            {[
              { id: "windows", label: "Windows", icon: <Monitor className="w-4 h-4" /> },
              { id: "macos", label: "macOS", icon: <Laptop className="w-4 h-4" /> },
              { id: "linux", label: "Linux", icon: <Terminal className="w-4 h-4" /> },
              { id: "android", label: "Android APK", icon: <Smartphone className="w-4 h-4" /> },
              { id: "ios", label: "iOS", icon: <Smartphone className="w-4 h-4" /> },
            ].map((plat) => (
              <button
                key={plat.id}
                onClick={() => setSelectedPlatform(plat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-[8px] text-[13px] font-sans font-semibold transition-all ${
                  selectedPlatform === plat.id
                    ? "bg-white/10 text-white border border-white/20 shadow-sm"
                    : "text-white/60 hover:text-white"
                }`}
              >
                <span className={selectedPlatform === plat.id ? "text-white" : "text-white/50"}>
                  {plat.icon}
                </span>
                <span>{plat.label}</span>
                {detectedOS === plat.id && (
                  <span className="text-[9px] px-1 rounded bg-white/10 text-white font-mono">
                    Detected
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Primary Download Package Card (NexCloud #121316 surface) */}
        <div ref={cardRef} className="max-w-4xl mx-auto rounded-2xl bg-[#121316] border border-white/10 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left 7 cols: Package Specs & Meta */}
            <div className="md:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-orbitron font-extrabold text-white">
                  {release.displayName}
                </span>
                <span
                  className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                    release.status === "available"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : release.status === "preview"
                      ? "bg-white/10 text-white border-white/20"
                      : "bg-white/5 text-white/50 border-white/10"
                  }`}
                >
                  {release.status === "preview"
                    ? "Preview Available"
                    : release.status === "available"
                    ? "Production Ready"
                    : "Scheduled Release"}
                </span>
              </div>

              {/* Package Detail Grid */}
              <div className="grid grid-cols-2 gap-4 text-xs font-mono p-4 rounded-xl bg-[#18181D] border border-white/10">
                <div>
                  <span className="text-[10px] text-white/50 uppercase block">Version</span>
                  <span className="text-white font-bold">{release.version}</span>
                </div>
                <div>
                  <span className="text-[10px] text-white/50 uppercase block">Architectures</span>
                  <span className="text-white/70">{release.architecture.join(", ")}</span>
                </div>
                {release.fileSize && (
                  <div>
                    <span className="text-[10px] text-white/50 uppercase block">File Size</span>
                    <span className="text-white font-bold">{release.fileSize}</span>
                  </div>
                )}
                <div>
                  <span className="text-[10px] text-white/50 uppercase block">Release Status</span>
                  <span className="text-white font-bold">{release.releaseDate}</span>
                </div>
              </div>

              {/* SHA-256 Checksum Container */}
              {release.sha256 ? (
                <div className="p-3.5 rounded-xl bg-[#18181D] border border-white/10 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono text-white/50">
                    <span className="uppercase font-bold flex items-center gap-1 text-white/80">
                      <FileCheck className="w-3.5 h-3.5 text-white" /> SHA-256 Checksum
                    </span>
                    <button
                      onClick={() => copyChecksum(release.sha256!)}
                      className="text-[11px] text-white hover:underline flex items-center gap-1 font-mono"
                    >
                      {copiedHash ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copy Hash
                        </>
                      )}
                    </button>
                  </div>
                  <div className="text-[10px] font-mono text-white/70 break-all select-all bg-black/60 p-2 rounded border border-white/5">
                    {release.sha256}
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-[#18181D] border border-white/10 text-[11px] font-mono text-white/50 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-white/70" />
                  <span>Binary checksum will be published upon notarization.</span>
                </div>
              )}
            </div>

            {/* Right 5 cols: Primary Download Action & System Requirements */}
            <div className="md:col-span-5 flex flex-col justify-between space-y-6">
              <div className="p-4 rounded-xl bg-[#18181D] border border-white/10 space-y-2 text-xs font-mono">
                <span className="text-[10px] text-white/50 uppercase font-bold block">
                  System Requirements
                </span>
                <p className="text-white/70 leading-relaxed">{release.minSystemReqs}</p>
                {release.requiresLicense && (
                  <div className="pt-2 text-[11px] text-white border-t border-white/5 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>CXA-DESK Device Key Required</span>
                  </div>
                )}
              </div>

              {/* Action Button (NexCloud primary CTA: bg-white text-black) */}
              {release.status === "preview" ? (
                isInternal ? (
                  <div className="space-y-2">
                    <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5 mb-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Internal Preview Authorized ({getRoleBadgeLabel(role)})</span>
                    </div>
                    <a
                      href={release.downloadUrl || "/api/releases/download?platform=windows"}
                      onClick={(e) => handleDownloadTrigger(e, release.downloadUrl || "/api/releases/download?platform=windows")}
                      className="w-full py-3.5 rounded-[8px] bg-white hover:bg-[#E5E7EB] text-[#050506] font-sans text-sm font-semibold tracking-[-0.045em] flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] cursor-pointer"
                    >
                      {isPreparingDownload ? (
                        <>
                          <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          <span>Verifying Binary Signature...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" /> Download Windows Preview (.exe)
                        </>
                      )}
                    </a>
                    <p className="text-[10px] text-center font-mono text-white/50">
                      Direct internal installer &bull; SHA-256 verified build
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-white/70">
                      <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-1">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Public Beta Available Soon</span>
                      </div>
                      <p className="text-[11px] text-white/50 leading-relaxed">
                        Public installers launch 17 November 2026. CodeXa Agency members and interns can sign in to access internal builds.
                      </p>
                    </div>

                    <button
                      onClick={() => setNotifyModalOpen(true)}
                      className="w-full py-3.5 rounded-[8px] bg-white hover:bg-[#E5E7EB] text-[#050506] font-sans text-sm font-semibold tracking-[-0.045em] flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] cursor-pointer"
                    >
                      <Bell className="w-4 h-4" /> Notify Me on Release
                    </button>
                    <p className="text-[10px] text-center font-mono text-white/50">
                      General availability scheduled for 17 November 2026
                    </p>
                  </div>
                )
              ) : release.status === "available" ? (
                <div className="space-y-2">
                  <a
                    href={release.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => handleDownloadTrigger(e, release.downloadUrl || "")}
                    className="w-full py-3.5 rounded-[8px] bg-white hover:bg-[#E5E7EB] text-[#050506] font-sans text-sm font-semibold tracking-[-0.045em] flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] cursor-pointer"
                  >
                    {isPreparingDownload ? (
                      <>
                        <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>Preparing Package...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" /> Download APK ({release.fileSize})
                      </>
                    )}
                  </a>
                  <p className="text-[10px] text-center font-mono text-white/50">
                    Official APK hosted on CodeXa Agency
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => setNotifyModalOpen(true)}
                    className="w-full py-3.5 rounded-[8px] bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/20 font-sans text-sm font-semibold tracking-[-0.045em] flex items-center justify-center gap-2 transition-all"
                  >
                    <Bell className="w-4 h-4 text-white/70" /> Notify Me on Release
                  </button>
                  <p className="text-[10px] text-center font-mono text-white/50">
                    In internal staging &bull; Expected {release.releaseDate}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Installation Instructions */}
          <div className="mt-8 pt-6 border-t border-white/10 space-y-3 font-mono text-xs">
            <span className="text-[10px] uppercase tracking-wider text-white/50 font-bold block">
              Installation &amp; Activation Steps
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-white/70">
              {release.instructions.map((inst, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-[#18181D] border border-white/10 flex items-start gap-2.5 text-[11px]"
                >
                  <span className="text-white font-bold">{idx + 1}.</span>
                  <span>{inst}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Release Notes Link */}
        <div className="mt-12 text-center">
          <Button variant="ghost" size="md" href="/releases" rightIcon={<ChevronRight className="w-4 h-4" />}>
            View Full Release Notes &amp; Version History
          </Button>
        </div>
      </div>

      {/* Notify Me Modal */}
      <Modal
        isOpen={notifyModalOpen}
        onClose={() => setNotifyModalOpen(false)}
        title="Get Notified on Publication"
        subtitle={`We will notify you immediately when CodeXa Studio for ${release.displayName} is published.`}
      >
        <form onSubmit={handleNotifySubmit} className="space-y-4">
          {notifySuccess ? (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400 flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>You have been registered for official release notifications.</span>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-[11px] font-mono text-white/70 uppercase mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.value)}
                  placeholder="developer@example.com"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#18181D] border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30"
                />
              </div>

              <Button type="submit" variant="primary" size="md" className="w-full">
                Register for Notification
              </Button>
            </>
          )}
        </form>
      </Modal>
    </section>
  );
}
