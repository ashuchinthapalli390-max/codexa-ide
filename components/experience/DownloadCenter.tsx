"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Check, CheckCircle2, Copy, Download, Loader2, Lock, ShieldCheck } from "lucide-react";
import confetti from "canvas-confetti";
import { releaseManifest, PlatformRelease } from "@/lib/releases/manifest";
import { useAuth } from "@/lib/auth/AuthContext";
import { isLeadershipRole } from "@/lib/auth/roles";
import { Pill, Reveal, SectionHeading } from "./primitives";
import { OsIcon, STATUS } from "./PlatformsTimeline";

const ORDER: PlatformRelease["os"][] = ["windows", "macos", "linux", "android", "ios"];

function detectOs(): PlatformRelease["os"] {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("android")) return "android";
  if (/iphone|ipad/.test(ua)) return "ios";
  if (ua.includes("win")) return "windows";
  if (ua.includes("mac")) return "macos";
  if (ua.includes("linux")) return "linux";
  return "windows";
}

export function DownloadCenter({ index = "01" }: { index?: string }) {
  const { role } = useAuth();
  const isInternal = isLeadershipRole(role) || role === "intern" || role === "agency_member";
  const [os, setOs] = useState<PlatformRelease["os"]>("windows");
  const [detected, setDetected] = useState<PlatformRelease["os"] | null>(null);
  const [copied, setCopied] = useState(false);
  const [preparing, setPreparing] = useState(false);
  const [email, setEmail] = useState("");
  const [notify, setNotify] = useState<{ state: "idle" | "sending" | "done" | "error"; msg?: string }>({ state: "idle" });

  useEffect(() => {
    const d = detectOs();
    setDetected(d);
    setOs(d);
  }, []);

  useEffect(() => setNotify({ state: "idle" }), [os]);

  const r = releaseManifest.platforms[os];
  const s = STATUS[r.status];
  const canDownload = !!r.downloadUrl && (r.status === "available" || (r.status === "preview" && isInternal));

  const startDownload = () => {
    if (!r.downloadUrl || preparing) return;
    setPreparing(true);
    setTimeout(() => {
      setPreparing(false);
      try {
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.75 }, colors: ["#FFFFFF", "#22C55E", "#9CA3AF"] });
      } catch {
        /* confetti is decorative */
      }
      window.location.href = r.downloadUrl as string;
    }, 650);
  };

  const copyHash = async () => {
    if (!r.sha256) return;
    try {
      await navigator.clipboard.writeText(r.sha256);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
  };

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotify({ state: "sending" });
    try {
      const res = await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, platform: os }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not save your email.");
      setNotify({ state: "done", msg: data.message });
      setEmail("");
    } catch (err) {
      setNotify({ state: "error", msg: err instanceof Error ? err.message : "Network error." });
    }
  };

  return (
    <section id="download" className="relative bg-black py-20 sm:py-28">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          index={index}
          eyebrow="Download center"
          title={
            <>
              Pick your platform. <span className="text-white/40">Verify, then install.</span>
            </>
          }
          lead={detected ? `We detected ${releaseManifest.platforms[detected].displayName}. Switch platforms any time.` : undefined}
        />

        <div className="mt-10 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          {ORDER.map((k) => {
            const p = releaseManifest.platforms[k];
            const on = k === os;
            return (
              <button
                key={k}
                onClick={() => setOs(k)}
                className={`relative flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-[13px] transition ${on ? "text-black" : "text-white/60 hover:text-white"}`}
              >
                {on && <motion.span layoutId="os-tab" className="absolute inset-0 rounded-full bg-white" transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
                <span className="relative flex items-center gap-2">
                  <OsIcon os={k} className="h-4 w-4" />
                  {p.displayName}
                  {k === detected && <span className={`h-1.5 w-1.5 rounded-full ${on ? "bg-[#16A34A]" : "bg-[#22C55E]"}`} />}
                </span>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={os}
            initial={{ opacity: 0, y: 24, rotateX: -10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4 }}
            style={{ transformPerspective: 1400 }}
            className="mt-6 grid gap-5 lg:grid-cols-[1.3fr_1fr]"
          >
            <div className="relative overflow-hidden rounded-3xl border border-white/[0.1] bg-gradient-to-br from-[#111114] to-[#08080A] p-6 sm:p-9">
              <div aria-hidden className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#22C55E]/10 blur-3xl" />
              <div className="relative flex flex-wrap items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white">
                  <OsIcon os={os} className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="text-2xl font-semibold tracking-[-0.04em] text-white">{r.displayName}</h3>
                  <p className="font-mono text-[11px] text-white/45">{r.architecture.join(" · ")}</p>
                </div>
                <Pill tone={s.tone} className="ml-auto">
                  {s.label}
                </Pill>
              </div>

              <dl className="relative mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  ["Version", r.version],
                  ["Channel", r.channel],
                  ["Timing", r.releaseDate],
                  ["Size", r.fileSize ?? "—"],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-xl border border-white/[0.07] bg-black/40 p-3">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/35">{k}</dt>
                    <dd className="mt-1 text-[14px] capitalize text-white">{v}</dd>
                  </div>
                ))}
              </dl>

              {r.sha256 && (
                <div className="relative mt-5 rounded-xl border border-white/[0.07] bg-black/40 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/35">
                      <ShieldCheck className="h-3.5 w-3.5 text-[#22C55E]" /> SHA-256
                    </p>
                    <button onClick={copyHash} className="flex items-center gap-1.5 text-[12px] text-white/60 hover:text-white">
                      {copied ? <Check className="h-3.5 w-3.5 text-[#4ADE80]" /> : <Copy className="h-3.5 w-3.5" />}
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <p className="mt-2 break-all font-mono text-[11.5px] text-white/70">{r.sha256}</p>
                </div>
              )}

              <div className="relative mt-7">
                {canDownload ? (
                  <button
                    onClick={startDownload}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white text-[15px] font-semibold text-black transition hover:bg-[#E5E7EB] sm:w-auto sm:px-8"
                  >
                    {preparing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                    {preparing ? "Preparing secure download…" : `Download ${r.displayName}${r.fileSize ? ` · ${r.fileSize}` : ""}`}
                  </button>
                ) : (
                  <div>
                    {r.status === "preview" && (
                      <p className="mb-4 flex items-center gap-2 text-[13px] text-white/55">
                        <Lock className="h-3.5 w-3.5" /> Preview builds are limited to CodeXa Agency team accounts. Get notified for the public build:
                      </p>
                    )}
                    {notify.state === "done" ? (
                      <p className="flex items-center gap-2 rounded-xl border border-[#22C55E]/30 bg-[#22C55E]/10 p-4 text-[14px] text-[#86EFAC]">
                        <CheckCircle2 className="h-4 w-4 shrink-0" /> {notify.msg}
                      </p>
                    ) : (
                      <form onSubmit={subscribe} className="flex flex-col gap-2 sm:flex-row">
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@company.com"
                          aria-label="Email for release notification"
                          className="h-12 flex-1 rounded-xl border border-white/10 bg-black/50 px-4 text-[14px] text-white placeholder:text-white/25 focus:border-white/35 focus:outline-none"
                        />
                        <button
                          type="submit"
                          disabled={notify.state === "sending"}
                          className="flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-[14px] font-semibold text-black hover:bg-[#E5E7EB] disabled:opacity-60"
                        >
                          {notify.state === "sending" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bell className="h-4 w-4" />}
                          Notify me
                        </button>
                      </form>
                    )}
                    {notify.state === "error" && <p className="mt-2 text-[13px] text-rose-300">{notify.msg}</p>}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <Reveal className="rounded-3xl border border-white/[0.09] bg-[#0B0B0D] p-6 sm:p-7">
                <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/40">Install steps</p>
                <ol className="mt-5 grid gap-4">
                  {r.instructions.map((step, i) => (
                    <li key={step} className="flex gap-3.5">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/15 font-mono text-[11px] text-white">
                        {i + 1}
                      </span>
                      <span className="text-[14px] leading-relaxed text-white/70">{step}</span>
                    </li>
                  ))}
                </ol>
              </Reveal>
              <div className="rounded-3xl border border-white/[0.09] bg-[#0B0B0D] p-6 sm:p-7">
                <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/40">System requirements</p>
                <p className="mt-3 text-[14px] leading-relaxed text-white/70">{r.minSystemReqs}</p>
                {os === "windows" && (
                  <p className="mt-4 rounded-lg border border-white/[0.07] bg-black/40 p-3 font-mono text-[11.5px] text-white/60">
                    certutil -hashfile CodeXaStudio-Setup.exe SHA256
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
