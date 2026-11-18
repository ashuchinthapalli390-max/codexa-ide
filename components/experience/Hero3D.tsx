"use client";

import React, { useRef } from "react";
import Link from "next/link";
import {
  motion,
  MotionValue,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight, Bell, Check, ChevronDown, Cpu, GitBranch, Sparkles, TerminalSquare } from "lucide-react";
import { siteConfig } from "@/lib/config/site";
import { EASE_EDITORIAL, useMediaMin } from "./primitives";

const HEADLINE_A = ["Code", "without", "limits."];
const HEADLINE_B = ["Build", "beyond."];

export function Hero3D() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion() ?? false;
  const desktop = useMediaMin(768);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.35 });

  // Pointer parallax (desktop only)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const mxs = useSpring(mx, { stiffness: 60, damping: 18 });
  const mys = useSpring(my, { stiffness: 60, damping: 18 });

  const onPointerMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType === "touch") return;
    mx.set(e.clientX / window.innerWidth - 0.5);
    my.set(e.clientY / window.innerHeight - 0.5);
  };

  // Headline exits up and blurs
  const headOpacity = useTransform(p, [0, 0.2], [1, 0]);
  const headY = useTransform(p, [0, 0.2], [0, -140]);
  const headScale = useTransform(p, [0, 0.2], [1, 0.9]);
  const headFilter = useTransform(p, [0, 0.2], ["blur(0px)", "blur(10px)"]);

  // IDE rises from a steep tilt to flat, then the layers explode in Z
  const sceneY = useTransform(p, [0, 0.42], desktop ? ["46vh", "0vh"] : ["42vh", "2vh"]);
  const baseRotX = useTransform(p, [0, 0.42, 1], [48, 0, 8]);
  const sceneScale = useTransform(p, [0, 0.42, 1], desktop ? [0.74, 0.9, 0.8] : [0.9, 1, 0.94]);
  const rotateX = useTransform([baseRotX, mys] as MotionValue<number>[], ([a, b]: number[]) => a - b * 6);
  const rotateY = useTransform([p, mxs] as MotionValue<number>[], ([pp, b]: number[]) => {
    const swing = pp > 0.5 ? (pp - 0.5) * -34 : 0;
    return b * 8 + swing;
  });

  const floorY = useTransform(p, [0, 1], ["0px", "-480px"]);
  const glowOpacity = useTransform(p, [0, 0.4, 1], [0.35, 0.7, 0.25]);
  const cueOpacity = useTransform(p, [0, 0.06], [1, 0]);
  const captionOpacity = useTransform(p, [0.66, 0.78], [0, 1]);
  const captionY = useTransform(p, [0.66, 0.78], [30, 0]);
  const progressW = useTransform(p, [0, 1], ["0%", "100%"]);

  if (reduce) {
    return (
      <section id="top" className="relative overflow-hidden bg-black pt-20 pb-16">
        <HeroCopy />
        <div className="mx-auto mt-14 w-[min(1100px,92vw)]">
          <IDEMock />
        </div>
      </section>
    );
  }

  return (
    <section id="top" ref={ref} className="relative h-[290vh] bg-black" onPointerMove={onPointerMove}>
      <div className="pin-stage overflow-hidden">
        {/* Ambient background: perspective grid floor + glow */}
        <div aria-hidden className="absolute inset-0 [perspective:900px]">
          <motion.div
            className="absolute left-1/2 top-[52%] h-[200vh] w-[260vw] -translate-x-1/2 origin-top bg-subtle-grid opacity-40"
            style={{ rotateX: 74, backgroundPositionY: floorY }}
          />
          <div className="absolute inset-x-0 top-[52%] h-[48%] bg-gradient-to-b from-black via-transparent to-black" />
        </div>
        <motion.div
          aria-hidden
          style={{ opacity: glowOpacity }}
          className="absolute left-1/2 top-[58%] h-[520px] w-[min(1100px,120vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(34,197,94,0.16),rgba(255,255,255,0.04)_55%,transparent)] blur-2xl"
        />
        <div aria-hidden className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black to-transparent" />

        {/* Headline layer */}
        <motion.div
          style={{ opacity: headOpacity, y: headY, scale: headScale, filter: headFilter }}
          className="relative z-20 pt-[5vh] sm:pt-[7vh]"
        >
          <HeroCopy />
        </motion.div>

        {/* 3D scene */}
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center [perspective:1800px]">
          <motion.div
            style={{ y: sceneY, rotateX, rotateY, scale: sceneScale, transformStyle: "preserve-3d" }}
            className="pointer-events-auto relative w-[min(1100px,94vw)]"
          >
            <IDEMock />

            <FloatLayer p={p} depth={150} dx={-70} dy={-20} className="left-[-4%] top-[14%] hidden md:block">
              <PlanCard />
            </FloatLayer>
            <FloatLayer p={p} depth={230} dx={80} dy={-50} className="right-[-3%] top-[-7%] hidden md:block">
              <DiffCard />
            </FloatLayer>
            <FloatLayer p={p} depth={300} dx={70} dy={50} className="right-[2%] bottom-[-8%]">
              <TerminalCard />
            </FloatLayer>
            <FloatLayer p={p} depth={190} dx={-60} dy={60} className="left-[6%] bottom-[-6%] hidden sm:block">
              <RouterChip />
            </FloatLayer>
          </motion.div>
        </div>

        {/* Exploded-view caption */}
        <motion.div
          style={{ opacity: captionOpacity, y: captionY }}
          className="pointer-events-none absolute inset-x-0 bottom-[7vh] z-30 px-4 text-center"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#4ADE80]">Exploded view</p>
          <p className="mt-2 text-xl sm:text-3xl font-semibold tracking-[-0.04em] text-white">
            One workspace. Every layer working together.
          </p>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          style={{ opacity: cueOpacity }}
          className="absolute bottom-6 left-1/2 z-30 -translate-x-1/2 flex flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40"
        >
          Scroll to explore
          <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
            <ChevronDown className="h-4 w-4" />
          </motion.span>
        </motion.div>

        {/* Section progress */}
        <div className="absolute bottom-0 left-0 right-0 z-30 h-px bg-white/[0.06]">
          <motion.div style={{ width: progressW }} className="h-full bg-[#22C55E]/70" />
        </div>
      </div>
    </section>
  );
}

function HeroCopy() {
  return (
    <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE_EDITORIAL }}
        className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 font-mono text-[11px] text-white/60 backdrop-blur"
      >
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#22C55E]" />
        <span className="font-semibold text-white">CodeXa Studio IDE v1.0</span>
        <span className="hidden text-white/30 sm:inline">/</span>
        <span className="hidden sm:inline">Launched {siteConfig.officialLaunchDate}</span>
      </motion.div>

      <h1 className="text-[clamp(2.6rem,8.2vw,6.6rem)] font-semibold leading-[0.95] tracking-[-0.055em]">
        <span className="block">
          {HEADLINE_A.map((w, i) => (
            <WordIn key={w} delay={0.1 + i * 0.08}>
              {w}
            </WordIn>
          ))}
        </span>
        <span className="block bg-gradient-to-b from-white via-white/80 to-white/35 bg-clip-text text-transparent">
          {HEADLINE_B.map((w, i) => (
            <WordIn key={w} delay={0.36 + i * 0.08}>
              {w}
            </WordIn>
          ))}
        </span>
      </h1>

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.55, ease: EASE_EDITORIAL }}
        className="mx-auto mt-6 max-w-2xl font-inter text-[15px] leading-relaxed text-white/60 sm:text-[17px]"
      >
        An AI development workspace with an AST-native core, a router across nine models and a verification gate on
        every diff. Your code, tools and live previews in one focused window.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.68, ease: EASE_EDITORIAL }}
        className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
      >
        <Link
          href="#availability"
          className="group flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-white px-6 text-[15px] font-semibold tracking-[-0.03em] text-black transition hover:bg-[#E5E7EB] hover:shadow-[0_0_28px_rgba(255,255,255,0.25)] sm:w-auto"
        >
          <Bell className="h-4 w-4 transition group-hover:scale-110" />
          Get early access
        </Link>
        <Link
          href="#pricing"
          className="group flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/[0.04] px-6 text-[15px] font-semibold tracking-[-0.03em] text-white transition hover:border-white/40 hover:bg-white/[0.08] sm:w-auto"
        >
          Explore plans
          <ArrowRight className="h-4 w-4 text-white/60 transition group-hover:translate-x-1 group-hover:text-white" />
        </Link>
      </motion.div>
    </div>
  );
}

function WordIn({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
      <motion.span
        className="inline-block"
        initial={{ y: "105%", rotateX: -60, opacity: 0 }}
        animate={{ y: "0%", rotateX: 0, opacity: 1 }}
        transition={{ duration: 0.9, delay, ease: EASE_EDITORIAL }}
      >
        {children}
      </motion.span>
      <span className="inline-block w-[0.24em]" />
    </span>
  );
}

function FloatLayer({
  p,
  depth,
  dx,
  dy,
  className,
  children,
}: {
  p: MotionValue<number>;
  depth: number;
  dx: number;
  dy: number;
  className: string;
  children: React.ReactNode;
}) {
  const z = useTransform(p, [0.42, 0.78], [10, depth]);
  const x = useTransform(p, [0.42, 0.78], [0, dx]);
  const y = useTransform(p, [0.42, 0.78], [0, dy]);
  const opacity = useTransform(p, [0.3, 0.44], [0, 1]);
  return (
    <motion.div style={{ z, x, y, opacity, transformStyle: "preserve-3d" }} className={`absolute ${className}`}>
      {children}
    </motion.div>
  );
}

/* ---------- IDE mock ---------- */

type Tok = [string, string];
const K = "text-[#D9354D]";
const F = "text-[#61AFEF]";
const S = "text-[#98C379]";
const C = "text-[#5C6370] italic";
const V = "text-[#E5C07B]";
const P = "text-white/80";

const CODE: Tok[][] = [
  [["// Route a task through plan → generate → verify", C]],
  [["import", K], [" { router, verify } ", P], ["from", K], [' "@codexa/agent"', S], [";", P]],
  [],
  [["export async function ", K], ["shipFeature", F], ["(task: ", P], ["Task", V], [") {", P]],
  [["  const ", K], ["graph", V], [" = ", P], ["await ", K], ["index", F], ["(workspace);", P], ["   // <50ms, local", C]],
  [["  const ", K], ["plan", V], [" = ", P], ["await ", K], ["router", V], [".", P], ["plan", F], ["(task, { model: ", P], ['"gpt-6-astra"', S], [" });", P]],
  [],
  [["  for ", K], ["(const step ", P], ["of ", K], ["plan.steps) {", P]],
  [["    const ", K], ["diff", V], [" = ", P], ["await ", K], ["router", V], [".", P], ["generate", F], ["(step, graph);", P]],
  [["    await ", K], ["verify", F], ["(diff, { gate: ", P], ['"fabel-5.1"', S], [" });", P]],
  [["    ", P], ["preview", F], [".", P], ["sync", F], ["(diff);", P], ["              // desktop + mobile", C]],
  [["  }", P]],
  [["  return ", K], ["git", V], [".", P], ["stageHunks", F], ["(plan.diffs);", P]],
  [["}", P]],
];

const FILES = [
  { name: "src", depth: 0, dir: true },
  { name: "agent", depth: 1, dir: true },
  { name: "planner.ts", depth: 2, active: true },
  { name: "router.ts", depth: 2 },
  { name: "verify.ts", depth: 2 },
  { name: "ui", depth: 1, dir: true },
  { name: "Preview.tsx", depth: 2 },
  { name: "package.json", depth: 0 },
];

function IDEMock() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.12] bg-[#0B0B0D] shadow-[0_0_0_8px_rgba(255,255,255,0.03),0_60px_140px_rgba(0,0,0,0.7)]">
      {/* Title bar */}
      <div className="flex h-10 items-center gap-3 border-b border-white/[0.07] bg-[#121217] px-4">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]/80" />
        </div>
        <div className="flex min-w-0 gap-1 font-mono text-[11px]">
          <span className="rounded-md border border-white/10 bg-white/[0.06] px-2.5 py-1 text-white">planner.ts</span>
          <span className="hidden px-2.5 py-1 text-white/40 sm:inline">router.ts</span>
          <span className="hidden px-2.5 py-1 text-white/40 md:inline">verify.ts</span>
        </div>
        <div className="ml-auto hidden items-center gap-2 font-mono text-[10px] text-white/50 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" /> GPT-6 Astra · routing
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[170px_1fr] lg:grid-cols-[170px_1fr_260px]">
        {/* Explorer */}
        <aside className="hidden border-r border-white/[0.06] bg-[#0E0E11] py-3 md:block">
          <p className="px-4 pb-2 font-mono text-[9px] uppercase tracking-[0.2em] text-white/35">Explorer</p>
          {FILES.map((f) => (
            <div
              key={f.name}
              className={`flex items-center gap-2 py-[5px] font-mono text-[11px] ${
                f.active ? "bg-white/[0.06] text-white" : "text-white/50"
              }`}
              style={{ paddingLeft: 16 + f.depth * 12 }}
            >
              <span className={f.dir ? "text-white/30" : "text-[#22C55E]/70"}>{f.dir ? "▸" : "•"}</span>
              {f.name}
            </div>
          ))}
        </aside>

        {/* Editor */}
        <div className="min-w-0 py-4 font-mono text-[10.5px] leading-[1.75] sm:text-[12px]">
          {CODE.map((line, i) => (
            <div key={i} className={`flex whitespace-pre ${i === 9 ? "bg-[#22C55E]/[0.07]" : ""}`}>
              <span className="w-10 shrink-0 select-none pr-3 text-right text-white/20">{i + 1}</span>
              <span className="overflow-hidden text-ellipsis">
                {line.map(([t, cls], j) => (
                  <span key={j} className={cls}>
                    {t}
                  </span>
                ))}
                {i === CODE.length - 1 && (
                  <motion.span
                    className="ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[2px] bg-[#22C55E]"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </span>
            </div>
          ))}
        </div>

        {/* AI panel */}
        <aside className="hidden flex-col gap-3 border-l border-white/[0.06] bg-[#0E0E11] p-4 lg:flex">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
            <Sparkles className="h-3 w-3 text-[#22C55E]" /> Agent
          </div>
          <div className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-3 text-[12px] leading-relaxed text-white/75">
            Add rate limiting to the router and verify the patch.
          </div>
          <div className="rounded-lg border border-[#22C55E]/20 bg-[#22C55E]/[0.06] p-3 text-[12px] leading-relaxed text-white/80">
            Planned 3 steps across <span className="text-white">router.ts</span> and{" "}
            <span className="text-white">verify.ts</span>. Verification passed.
          </div>
          <div className="mt-auto grid grid-cols-2 gap-2 font-mono text-[10px]">
            {[
              ["Units", "4,820"],
              ["Latency", "1.2s"],
              ["Files", "2"],
              ["Tests", "18/18"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-md border border-white/[0.06] bg-black/40 px-2 py-1.5">
                <div className="text-white/35">{k}</div>
                <div className="text-white">{v}</div>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* Status bar */}
      <div className="flex h-7 items-center gap-4 border-t border-white/[0.07] bg-[#121217] px-4 font-mono text-[10px] text-white/40">
        <span className="flex items-center gap-1.5">
          <GitBranch className="h-3 w-3" /> main
        </span>
        <span className="hidden sm:inline">TypeScript 5.6</span>
        <span className="ml-auto flex items-center gap-1.5 text-[#4ADE80]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" /> AST cache warm
        </span>
      </div>
    </div>
  );
}

const glass =
  "rounded-xl border border-white/[0.12] bg-[#111114]/90 backdrop-blur-xl shadow-[0_30px_80px_rgba(0,0,0,0.65)]";

function PlanCard() {
  return (
    <div className={`${glass} w-[230px] p-4`}>
      <p className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
        <Sparkles className="h-3 w-3 text-[#22C55E]" /> Agent plan
      </p>
      {["Index symbol graph", "Patch router.ts", "Verify with Fabel 5.1"].map((s) => (
        <div key={s} className="flex items-center gap-2 py-1 text-[12px] text-white/80">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#22C55E]/15">
            <Check className="h-2.5 w-2.5 text-[#4ADE80]" />
          </span>
          {s}
        </div>
      ))}
    </div>
  );
}

function DiffCard() {
  return (
    <div className={`${glass} w-[250px] overflow-hidden font-mono text-[10.5px]`}>
      <div className="flex items-center justify-between border-b border-white/[0.07] px-3 py-2 text-white/50">
        router.ts <span><span className="text-[#4ADE80]">+12</span> <span className="text-rose-400">−3</span></span>
      </div>
      <div className="py-1.5">
        <div className="bg-rose-500/10 px-3 text-rose-300/90">- return send(req)</div>
        <div className="bg-[#22C55E]/10 px-3 text-[#86EFAC]">+ await limiter.take(req.key)</div>
        <div className="bg-[#22C55E]/10 px-3 text-[#86EFAC]">+ return send(req, {"{ retry: 2 }"})</div>
      </div>
    </div>
  );
}

function TerminalCard() {
  return (
    <div className={`${glass} w-[250px] p-3 font-mono text-[10.5px] leading-relaxed`}>
      <p className="mb-1.5 flex items-center gap-2 text-white/45">
        <TerminalSquare className="h-3 w-3" /> terminal
      </p>
      <p className="text-white/70">$ codexa test --watch</p>
      <p className="text-[#4ADE80]">✓ router.spec.ts (11)</p>
      <p className="text-[#4ADE80]">✓ verify.spec.ts (7)</p>
      <p className="text-white">Tests 18 passed · 1.94s</p>
    </div>
  );
}

function RouterChip() {
  return (
    <div className={`${glass} flex items-center gap-3 px-3.5 py-2.5`}>
      <Cpu className="h-4 w-4 text-[#22C55E]" />
      <div className="font-mono text-[10.5px]">
        <p className="text-white/45">Router</p>
        <p className="text-white">NEXA → Astra → Fabel</p>
      </div>
    </div>
  );
}
