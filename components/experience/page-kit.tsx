"use client";

import React, { useRef } from "react";
import Link from "next/link";
import {
  motion,
  MotionValue,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { ChevronRight } from "lucide-react";
import { EASE_EDITORIAL, Reveal } from "./primitives";

/* ------------------------------------------------------------------ */
/* PageHero — every inner page opens with this.                         */
/* Title tilts back into the grid floor as you scroll past it, and an   */
/* optional visual rises up out of perspective underneath.              */
/* ------------------------------------------------------------------ */

export interface HeroStat {
  value: string;
  label: string;
}

export function PageHero({
  crumb,
  eyebrow,
  title,
  lead,
  actions,
  stats,
  children,
}: {
  crumb: string;
  eyebrow: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  actions?: React.ReactNode;
  stats?: HeroStat[];
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  const rotateX = useTransform(p, [0, 0.6], [0, 28]);
  const y = useTransform(p, [0, 0.6], [0, -60]);
  const opacity = useTransform(p, [0, 0.55], [1, 0]);
  const floorY = useTransform(p, [0, 1], ["0px", "-260px"]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-black pb-16 pt-14 sm:pb-24 sm:pt-20">
      <div aria-hidden className="absolute inset-0 [perspective:900px]">
        <motion.div
          className="absolute left-1/2 top-[38%] h-[160vh] w-[240vw] -translate-x-1/2 origin-top bg-subtle-grid opacity-30"
          style={{ rotateX: 74, backgroundPositionY: reduce ? undefined : floorY }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-black" />
      </div>
      <div aria-hidden className="absolute left-1/2 top-24 h-[380px] w-[min(900px,110vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(34,197,94,0.14),transparent)] blur-2xl" />

      <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 [perspective:1200px]">
        <motion.div style={reduce ? undefined : { rotateX, y, opacity, transformOrigin: "50% 0%" }}>
          <motion.nav
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 font-mono text-[11px] text-white/40"
          >
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white/70">{crumb}</span>
          </motion.nav>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-[#4ADE80]"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#22C55E]" />
            {eyebrow}
          </motion.p>

          <div className="mt-5 overflow-hidden pb-2">
            <motion.h1
              initial={reduce ? { opacity: 0 } : { y: "100%", rotateX: -40, opacity: 0 }}
              animate={{ y: "0%", rotateX: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.1, ease: EASE_EDITORIAL }}
              style={{ transformOrigin: "50% 100%" }}
              className="max-w-5xl text-[clamp(2.4rem,7vw,5.6rem)] font-semibold leading-[0.98] tracking-[-0.055em] text-white"
            >
              {title}
            </motion.h1>
          </div>

          {lead && (
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: EASE_EDITORIAL }}
              className="mt-6 max-w-2xl font-inter text-[15px] leading-relaxed text-white/60 sm:text-[17px]"
            >
              {lead}
            </motion.p>
          )}

          {actions && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: EASE_EDITORIAL }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              {actions}
            </motion.div>
          )}

          {stats && stats.length > 0 && (
            <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08] sm:grid-cols-4">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.45 + i * 0.07, ease: EASE_EDITORIAL }}
                  className="bg-black p-5"
                >
                  <p className="text-2xl font-semibold tracking-[-0.04em] text-white sm:text-3xl">{s.value}</p>
                  <p className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.12em] text-white/40">{s.label}</p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {children && <RiseIn3D>{children}</RiseIn3D>}
      </div>
    </section>
  );
}

/** Content that starts tilted away in perspective and flattens as it scrolls into view. */
export function RiseIn3D({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });
  const rotateX = useTransform(p, [0, 1], [32, 0]);
  const scale = useTransform(p, [0, 1], [0.86, 1]);
  const y = useTransform(p, [0, 1], [80, 0]);
  const opacity = useTransform(p, [0, 0.4], [0.2, 1]);
  return (
    <div ref={ref} className={`relative mt-14 [perspective:1600px] ${className}`}>
      <motion.div style={reduce ? undefined : { rotateX, scale, y, opacity, transformOrigin: "50% 100%" }}>
        {children}
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Primary / secondary buttons in the house style                       */
/* ------------------------------------------------------------------ */

export function PrimaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-white px-6 text-[15px] font-semibold tracking-[-0.03em] text-black transition hover:bg-[#E5E7EB] hover:shadow-[0_0_28px_rgba(255,255,255,0.25)]"
    >
      {children}
    </Link>
  );
}

export function GhostLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/[0.04] px-6 text-[15px] font-semibold tracking-[-0.03em] text-white transition hover:border-white/40 hover:bg-white/[0.08]"
    >
      {children}
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* VelocityMarquee — big outlined type that speeds up and skews with    */
/* scroll velocity, two rows running in opposite directions.            */
/* ------------------------------------------------------------------ */

function wrap(min: number, max: number, v: number) {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
}

function VelocityRow({ text, baseVelocity }: { text: string; baseVelocity: number }) {
  const reduce = useReducedMotion() ?? false;
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [-1500, 0, 1500], [-5, 0, 5], { clamp: false });
  const skewX = useTransform(smooth, [-2000, 0, 2000], [12, 0, -12]);
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);
  const dir = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    let move = dir.current * baseVelocity * (delta / 1000);
    const f = factor.get();
    if (f < 0) dir.current = -1;
    else if (f > 0) dir.current = 1;
    move += dir.current * move * f;
    baseX.set(baseX.get() + move);
  });

  return (
    <div className="flex overflow-hidden whitespace-nowrap">
      <motion.div style={{ x, skewX: reduce ? 0 : skewX }} className="flex gap-10 pr-10">
        {[0, 1, 2, 3].map((k) => (
          <span
            key={k}
            className="text-[clamp(3rem,10vw,8.5rem)] font-semibold uppercase leading-none tracking-[-0.05em] text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.28)]"
          >
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function VelocityMarquee({ rows }: { rows: [string, string] }) {
  return (
    <section aria-hidden className="relative overflow-hidden bg-black py-14 sm:py-20">
      <div className="flex flex-col gap-3 [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
        <VelocityRow text={rows[0]} baseVelocity={-3} />
        <VelocityRow text={rows[1]} baseVelocity={3} />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* StackCards — sticky cards that pile on top of each other; earlier    */
/* cards shrink and dim back into depth as later ones arrive.           */
/* ------------------------------------------------------------------ */

export interface StackItem {
  id: string;
  kicker: string;
  title: string;
  body: string;
  stat: { value: string; label: string };
  accent: string;
  bullets: string[];
}

export function StackCards({ items }: { items: StackItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  return (
    <div ref={ref} className="relative">
      {items.map((it, i) => (
        <StackCard key={it.id} item={it} index={i} total={items.length} progress={scrollYProgress} />
      ))}
    </div>
  );
}

function StackCard({
  item,
  index,
  total,
  progress,
}: {
  item: StackItem;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const reduce = useReducedMotion() ?? false;
  const start = index / total;
  const targetScale = 1 - (total - 1 - index) * 0.05;
  const scale = useTransform(progress, [start, 1], [1, targetScale]);
  const dim = useTransform(progress, [start, Math.min(1, start + 1 / total), 1], [0, 0, (total - 1 - index) * 0.18]);
  const rotateX = useTransform(progress, [start, 1], [0, (total - 1 - index) * 4]);

  return (
    <div className="sticky flex h-[78svh] items-start justify-center" style={{ top: `calc(var(--nav-offset) + ${24 + index * 18}px)` }}>
      <motion.article
        style={reduce ? undefined : { scale, rotateX, transformOrigin: "50% 0%" }}
        className="relative w-full overflow-hidden rounded-3xl border border-white/[0.1] bg-[#0B0B0D] shadow-[0_-20px_80px_rgba(0,0,0,0.7)] [transform-style:preserve-3d]"
      >
        <div aria-hidden className="absolute inset-0 opacity-70" style={{ background: `radial-gradient(600px circle at 85% 0%, ${item.accent}22, transparent 60%)` }} />
        <div aria-hidden className="absolute inset-0 bg-subtle-grid opacity-30" />
        <div className="relative grid gap-8 p-7 sm:p-10 md:grid-cols-[1.3fr_1fr] md:p-14">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: item.accent }}>
              {String(index + 1).padStart(2, "0")} · {item.kicker}
            </p>
            <h3 className="mt-4 text-[clamp(1.9rem,4.4vw,3.6rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-white">
              {item.title}
            </h3>
            <p className="mt-5 max-w-xl font-inter text-[15px] leading-relaxed text-white/60 sm:text-[16px]">{item.body}</p>
            <ul className="mt-6 grid gap-2.5">
              {item.bullets.map((b) => (
                <li key={b} className="flex items-center gap-3 text-[14px] text-white/80">
                  <span className="h-1 w-4 rounded-full" style={{ background: item.accent }} />
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col justify-end">
            <div className="rounded-2xl border border-white/[0.08] bg-black/50 p-6 backdrop-blur">
              <p className="text-[clamp(3rem,8vw,6rem)] font-semibold leading-none tracking-[-0.06em] text-white">{item.stat.value}</p>
              <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-white/45">{item.stat.label}</p>
            </div>
          </div>
        </div>
        <motion.div aria-hidden style={{ opacity: reduce ? 0 : dim }} className="pointer-events-none absolute inset-0 bg-black" />
      </motion.article>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ZoomThrough — giant word that you fly through as you scroll.         */
/* ------------------------------------------------------------------ */

export function ZoomThrough({ word, caption }: { word: string; caption: string }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 110, damping: 26 });
  const scale = useTransform(p, [0, 0.85], [1, 22]);
  const opacity = useTransform(p, [0, 0.6, 0.85], [1, 1, 0]);
  const capOpacity = useTransform(p, [0, 0.25], [1, 0]);
  const glow = useTransform(p, [0.5, 0.9], [0, 1]);

  if (reduce) {
    return (
      <section className="bg-black py-24 text-center">
        <p className="text-[clamp(3rem,12vw,10rem)] font-semibold tracking-[-0.06em] text-white">{word}</p>
        <p className="mt-4 text-white/50">{caption}</p>
      </section>
    );
  }

  return (
    <section ref={ref} aria-label={word} className="relative h-[220vh] bg-black">
      <div className="pin-stage flex items-center justify-center overflow-hidden">
        <motion.div aria-hidden style={{ opacity: glow }} className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.22),transparent_60%)]" />
        <motion.p
          style={{ scale, opacity }}
          className="relative select-none whitespace-nowrap text-[clamp(3.4rem,15vw,13rem)] font-semibold leading-none tracking-[-0.07em] text-white will-change-transform"
        >
          {word}
        </motion.p>
        <motion.p style={{ opacity: capOpacity }} className="absolute bottom-[10%] px-4 text-center font-mono text-[11px] uppercase tracking-[0.24em] text-white/45">
          {caption}
        </motion.p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Simple content section wrapper                                       */
/* ------------------------------------------------------------------ */

export function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`relative bg-black py-20 sm:py-28 ${className}`}>
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

export function FeatureGrid({
  items,
}: {
  items: { icon: React.ReactNode; title: string; body: string; tag?: string }[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((f, i) => (
        <Reveal key={f.title} delay={(i % 3) * 0.06} className="h-full">
          <div className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0B0B0D] p-6 transition-colors hover:border-white/20">
            <div aria-hidden className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#22C55E]/0 blur-3xl transition-colors duration-500 group-hover:bg-[#22C55E]/15" />
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-[#4ADE80]">
                {f.icon}
              </span>
              {f.tag && <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/35">{f.tag}</span>}
            </div>
            <h3 className="mt-5 text-[17px] font-semibold tracking-[-0.02em] text-white">{f.title}</h3>
            <p className="mt-2 font-inter text-[14px] leading-relaxed text-white/55">{f.body}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
