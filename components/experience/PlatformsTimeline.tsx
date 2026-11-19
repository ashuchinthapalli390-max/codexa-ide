"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useSpring } from "framer-motion";
import { Apple, ArrowUpRight, Monitor, Smartphone, Terminal } from "lucide-react";
import { releaseManifest, PlatformRelease } from "@/lib/releases/manifest";
import { Pill, Reveal, SectionHeading, TiltCard } from "./primitives";

const ORDER: PlatformRelease["os"][] = ["windows", "android", "macos", "linux", "ios"];

export const STATUS: Record<PlatformRelease["status"], { label: string; tone: "green" | "blue" | "amber" | "neutral" }> = {
  available: { label: "Available", tone: "green" },
  preview: { label: "Preview", tone: "blue" },
  coming_soon: { label: "Coming soon", tone: "amber" },
  planned: { label: "Planned", tone: "neutral" },
};

export function OsIcon({ os, className = "h-5 w-5" }: { os: PlatformRelease["os"]; className?: string }) {
  if (os === "macos" || os === "ios") return <Apple className={className} />;
  if (os === "linux") return <Terminal className={className} />;
  if (os === "android") return <Smartphone className={className} />;
  return <Monitor className={className} />;
}

export function PlatformsTimeline({
  index = "10",
  showTimeline = true,
  showLinks = true,
}: {
  index?: string;
  showTimeline?: boolean;
  showLinks?: boolean;
}) {
  const platforms = ORDER.map((k) => releaseManifest.platforms[k]).filter(Boolean);

  return (
    <section id="availability" className="relative bg-black py-24 sm:py-32">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          index={index}
          eyebrow="Platforms & releases"
          title={
            <>
              Desktop first. <span className="text-white/40">Everywhere next.</span>
            </>
          }
          lead={`Latest build: ${releaseManifest.latestVersion}. Every binary ships with a SHA-256 checksum and is announced on the release status page.`}
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {platforms.map((p, i) => {
            const s = STATUS[p.status];
            return (
              <Reveal key={p.os} delay={i * 0.06} className="h-full">
                <TiltCard max={7} className="flex h-full flex-col rounded-2xl border border-white/[0.09] bg-[#0B0B0D] p-5">
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white">
                      <OsIcon os={p.os} />
                    </span>
                    <Pill tone={s.tone}>{s.label}</Pill>
                  </div>
                  <h3 className="mt-5 text-[17px] font-semibold tracking-[-0.02em] text-white">{p.displayName}</h3>
                  <p className="mt-1 font-mono text-[11px] text-white/45">{p.architecture.join(" · ")}</p>
                  <dl className="mt-5 grid gap-2.5 border-t border-white/[0.07] pt-4 text-[12px]">
                    <Row k="Version" v={p.version} />
                    <Row k="Timing" v={p.releaseDate} />
                    {p.fileSize && <Row k="Size" v={p.fileSize} />}
                  </dl>
                  <p className="mt-4 text-[11.5px] leading-snug text-white/40">{p.minSystemReqs}</p>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>

        {showLinks && (
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/download" className="group inline-flex h-10 items-center gap-2 rounded-lg bg-white px-5 text-[14px] font-semibold text-black hover:bg-[#E5E7EB]">
              Downloads <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
            <Link href="/releases" className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/15 px-5 text-[14px] font-semibold text-white hover:border-white/35">
              Release notes
            </Link>
          </div>
        )}

        {showTimeline && <ReleaseHistory />}
      </div>
    </section>
  );
}

/** Release history with a line that draws itself as you scroll. */
export function ReleaseHistory() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: timelineRef, offset: ["start 0.8", "end 0.5"] });
  const line = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <div ref={timelineRef} className="relative mt-24 pl-8 sm:pl-12">
      <div className="absolute bottom-0 left-[7px] top-0 w-px bg-white/[0.08] sm:left-[11px]" />
      <motion.div style={{ scaleY: line }} className="absolute bottom-0 left-[7px] top-0 w-px origin-top bg-[#22C55E] sm:left-[11px]" />

      <Reveal>
        <p className="mb-10 font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">Release history</p>
      </Reveal>

      {releaseManifest.history.map((h, i) => (
        <Reveal key={h.version} delay={i * 0.05} className="relative mb-14 last:mb-0">
          <span className="absolute -left-8 top-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-[#22C55E]/50 bg-black sm:-left-12 sm:h-6 sm:w-6">
            <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
          </span>
          <div className="flex flex-wrap items-baseline gap-3">
            <h3 className="text-2xl font-semibold tracking-[-0.04em] text-white">{h.version}</h3>
            <span className="font-mono text-[11px] text-white/40">{h.date}</span>
            <Pill>{h.type}</Pill>
          </div>
          <div className="mt-5 grid gap-6 lg:grid-cols-3">
            <List title="Highlights" items={h.highlights} dot="bg-[#22C55E]" />
            <List title="Fixes" items={h.fixes} dot="bg-sky-300" />
            {h.knownIssues && <List title="Known issues" items={h.knownIssues} dot="bg-amber-300" />}
          </div>
        </Reveal>
      ))}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-white/40">{k}</dt>
      <dd className="text-right text-white/80">{v}</dd>
    </div>
  );
}

function List({ title, items, dot }: { title: string; items: string[]; dot: string }) {
  return (
    <div>
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">{title}</p>
      <ul className="grid gap-2">
        {items.map((it) => (
          <li key={it} className="flex gap-2.5 text-[13.5px] leading-snug text-white/70">
            <span className={`mt-[7px] h-1 w-1 shrink-0 rounded-full ${dot}`} />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}
