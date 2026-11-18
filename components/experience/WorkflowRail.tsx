"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  MotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Check, GitCommit, Monitor, ShieldCheck, Smartphone } from "lucide-react";
import { WORKFLOW_STAGES, WorkflowStage } from "@/lib/content/home";
import { SectionHeading, useMediaMin } from "./primitives";

/**
 * Pinned horizontal rail: vertical scroll drives the track sideways while each
 * card swings in 3D around its own Y axis as it passes the centre.
 */
export function WorkflowRail() {
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const desktop = useMediaMin(1024);
  const reduce = useReducedMotion() ?? false;
  const pinned = desktop && !reduce;
  const [distance, setDistance] = useState(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!pinned) return;
    const measure = () => {
      const el = trackRef.current;
      if (el) setDistance(Math.max(0, el.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [pinned]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });
  const x = useTransform(p, (v) => -v * distance);
  const bar = useTransform(p, [0, 1], ["0%", "100%"]);
  const n = WORKFLOW_STAGES.length;

  useMotionValueEvent(p, "change", (v) => {
    setActive(Math.min(n - 1, Math.max(0, Math.round(v * (n - 1)))));
  });

  return (
    <section id="workflow" ref={ref} className={`relative bg-black ${pinned ? "h-[520vh]" : "py-24"}`}>
      <div className={pinned ? "pin-stage flex flex-col justify-center overflow-hidden" : ""}>
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              index="03"
              eyebrow="How a change ships"
              title={
                <>
                  From prompt to commit, <span className="text-white/40">in six verified steps.</span>
                </>
              }
            />
            {pinned && (
              <div className="hidden shrink-0 font-mono text-[11px] text-white/40 lg:block">
                Step <span className="text-white">{WORKFLOW_STAGES[active].step}</span> / {String(n).padStart(2, "0")}
              </div>
            )}
          </div>
        </div>

        <motion.div
          ref={trackRef}
          style={pinned ? { x } : undefined}
          className={`mt-8 flex gap-6 px-4 sm:px-6 lg:px-[max(2rem,calc((100vw-1280px)/2+2rem))] ${
            pinned ? "w-max [perspective:1400px]" : "flex-col"
          }`}
        >
          {WORKFLOW_STAGES.map((s, i) => (
            <StageCard key={s.id} stage={s} index={i} total={n} p={p} pinned={pinned} />
          ))}
        </motion.div>

        {pinned && (
          <div className="mx-auto mt-10 w-full max-w-[1280px] px-8">
            <div className="relative h-px bg-white/10">
              <motion.div style={{ width: bar }} className="absolute inset-y-0 left-0 bg-[#22C55E]" />
            </div>
            <div className="mt-3 flex justify-between font-mono text-[10px] uppercase tracking-[0.18em]">
              {WORKFLOW_STAGES.map((s, i) => (
                <span key={s.id} className={i <= active ? "text-white" : "text-white/30"}>
                  {s.title}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function StageCard({
  stage,
  index,
  total,
  p,
  pinned,
}: {
  stage: WorkflowStage;
  index: number;
  total: number;
  p: MotionValue<number>;
  pinned: boolean;
}) {
  const c = index / (total - 1);
  const w = 1 / (total - 1);
  const rotateY = useTransform(p, [c - w, c, c + w], [22, 0, -22]);
  const scale = useTransform(p, [c - w, c, c + w], [0.9, 1, 0.9]);
  const opacity = useTransform(p, [c - 1.6 * w, c, c + 1.6 * w], [0.35, 1, 0.35]);

  return (
    <motion.article
      style={pinned ? { rotateY, scale, opacity, transformStyle: "preserve-3d" } : undefined}
      className={`relative shrink-0 overflow-hidden rounded-2xl border border-white/[0.09] bg-gradient-to-b from-[#111114] to-[#0A0A0C] ${
        pinned ? "w-[min(760px,62vw)]" : "w-full"
      }`}
    >
      <div className="grid gap-0 md:grid-cols-[1.05fr_1fr]">
        <div className="flex flex-col gap-5 p-7 sm:p-9">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[12px] text-[#22C55E]">{stage.step}</span>
            <span className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/55">
              {stage.model}
            </span>
          </div>
          <div>
            <h3 className="text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">{stage.title}</h3>
            <p className="mt-1 text-[15px] text-white/45">{stage.kicker}</p>
          </div>
          <p className="font-inter text-[14.5px] leading-relaxed text-white/65">{stage.description}</p>
          <ul className="flex flex-col gap-2">
            {stage.points.map((pt) => (
              <li key={pt} className="flex items-center gap-2.5 text-[13.5px] text-white/75">
                <Check className="h-3.5 w-3.5 shrink-0 text-[#22C55E]" />
                {pt}
              </li>
            ))}
          </ul>
          <div className="mt-auto flex items-baseline gap-3 border-t border-white/[0.07] pt-5">
            <span className="text-3xl font-semibold tracking-[-0.04em] text-white">{stage.metricValue}</span>
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/40">{stage.metricLabel}</span>
          </div>
        </div>
        <div className="relative min-h-[240px] border-t border-white/[0.07] bg-black/40 md:border-l md:border-t-0">
          <div className="absolute inset-0 bg-dot-matrix opacity-60" />
          <div className="relative flex h-full items-center justify-center p-6">
            <StageVisual kind={stage.visual} />
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function StageVisual({ kind }: { kind: WorkflowStage["visual"] }) {
  const mono = "font-mono text-[11px]";
  switch (kind) {
    case "tree":
      return (
        <svg viewBox="0 0 220 180" className="w-full max-w-[260px]" aria-hidden>
          {[
            [110, 24, 50, 80],
            [110, 24, 170, 80],
            [50, 80, 24, 146],
            [50, 80, 82, 146],
            [170, 80, 140, 146],
            [170, 80, 198, 146],
          ].map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.18)" />
          ))}
          {[
            [110, 24, "#22C55E"],
            [50, 80, "#fff"],
            [170, 80, "#fff"],
            [24, 146, "#7DD3FC"],
            [82, 146, "#7DD3FC"],
            [140, 146, "#7DD3FC"],
            [198, 146, "#7DD3FC"],
          ].map(([cx, cy, fill], i) => (
            <circle key={i} cx={cx as number} cy={cy as number} r={i === 0 ? 9 : 6} fill={fill as string} opacity={0.9} />
          ))}
        </svg>
      );
    case "plan":
      return (
        <div className={`flex w-full max-w-[260px] flex-col gap-2 ${mono}`}>
          {["Read router.ts", "Add limiter", "Update tests", "Verify"].map((s, i) => (
            <div key={s} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-white/75">
              <span className="text-white/35">{i + 1}</span>
              {s}
              <span className={`ml-auto h-1.5 w-1.5 rounded-full ${i < 3 ? "bg-[#22C55E]" : "bg-white/20"}`} />
            </div>
          ))}
        </div>
      );
    case "code":
      return (
        <div className={`w-full max-w-[280px] overflow-hidden rounded-lg border border-white/10 ${mono}`}>
          <div className="bg-rose-500/10 px-3 py-1 text-rose-300/90">- if (!user) return</div>
          <div className="bg-[#22C55E]/10 px-3 py-1 text-[#86EFAC]">+ if (!user) throw new AuthError()</div>
          <div className="bg-[#22C55E]/10 px-3 py-1 text-[#86EFAC]">+ await audit.log(user.id)</div>
          <div className="px-3 py-1 text-white/40">  return session(user)</div>
        </div>
      );
    case "verify":
      return (
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#22C55E]/30 bg-[#22C55E]/10 shadow-[0_0_60px_rgba(34,197,94,0.25)]">
            <ShieldCheck className="h-9 w-9 text-[#4ADE80]" />
          </div>
          <div className={`${mono} text-center text-white/60`}>
            types ✓ · lint ✓ · tests 18/18 ✓
          </div>
        </div>
      );
    case "preview":
      return (
        <div className="flex items-end gap-3">
          <div className="flex h-28 w-40 flex-col overflow-hidden rounded-lg border border-white/15 bg-[#0E0E11]">
            <div className="flex h-4 items-center gap-1 border-b border-white/10 px-2">
              <Monitor className="h-2.5 w-2.5 text-white/40" />
            </div>
            <div className="flex-1 space-y-1.5 p-2">
              <div className="h-2 w-2/3 rounded bg-white/25" />
              <div className="h-2 w-1/2 rounded bg-white/10" />
              <div className="mt-2 h-6 w-16 rounded bg-[#22C55E]/40" />
            </div>
          </div>
          <div className="flex h-28 w-14 flex-col overflow-hidden rounded-lg border border-white/15 bg-[#0E0E11]">
            <div className="flex h-4 items-center justify-center border-b border-white/10">
              <Smartphone className="h-2.5 w-2.5 text-white/40" />
            </div>
            <div className="flex-1 space-y-1 p-1.5">
              <div className="h-1.5 rounded bg-white/25" />
              <div className="h-1.5 w-2/3 rounded bg-white/10" />
              <div className="mt-2 h-4 rounded bg-[#22C55E]/40" />
            </div>
          </div>
        </div>
      );
    case "git":
      return (
        <div className={`flex w-full max-w-[260px] flex-col gap-2.5 ${mono}`}>
          {["feat: rate-limit router", "test: limiter edge cases", "chore: verify gate"].map((m, i) => (
            <div key={m} className="flex items-center gap-3 text-white/70">
              <GitCommit className={`h-4 w-4 ${i === 0 ? "text-[#22C55E]" : "text-white/35"}`} />
              {m}
            </div>
          ))}
        </div>
      );
  }
}
