"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

export const EASE_EDITORIAL = [0.22, 1, 0.36, 1] as const;

/** True once mounted on a viewport ≥ the given width. SSR-safe (false on server). */
export function useMediaMin(minWidth: number): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${minWidth}px)`);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [minWidth]);
  return matches;
}

export function Eyebrow({ index, children }: { index?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-white/45">
      {index && <span className="text-[#22C55E]">{index}</span>}
      {index && <span className="h-px w-8 bg-white/15" />}
      <span>{children}</span>
    </div>
  );
}

export function SectionHeading({
  index,
  eyebrow,
  title,
  lead,
  align = "left",
  className = "",
}: {
  index?: string;
  eyebrow: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  const centered = align === "center";
  return (
    <div className={`${centered ? "mx-auto text-center items-center" : ""} flex flex-col gap-5 max-w-3xl ${className}`}>
      <Reveal>
        <div className={centered ? "flex justify-center" : ""}>
          <Eyebrow index={index}>{eyebrow}</Eyebrow>
        </div>
      </Reveal>
      <MaskReveal delay={0.05}>
        <h2 className="text-[clamp(2rem,4.6vw,3.6rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-white">
          {title}
        </h2>
      </MaskReveal>
      {lead && (
        <Reveal delay={0.1}>
          <p className="text-[15px] sm:text-[17px] leading-relaxed text-white/60 font-inter tracking-[-0.01em]">{lead}</p>
        </Reveal>
      )}
    </div>
  );
}

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className = "",
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "span";
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y, filter: "blur(6px)" }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.8, delay, ease: EASE_EDITORIAL }}
    >
      {children}
    </Comp>
  );
}

/** Wipes content up from behind a mask with a slight 3D tilt as it enters the viewport. */
export function MaskReveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <div className={`[perspective:900px] ${className}`}>
      <motion.div
        initial={{ clipPath: "inset(0% 0% 100% 0%)", y: 40, rotateX: -35, opacity: 0 }}
        whileInView={{ clipPath: "inset(0% 0% -10% 0%)", y: 0, rotateX: 0, opacity: 1 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 1, delay, ease: EASE_EDITORIAL }}
        style={{ transformOrigin: "50% 100%" }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/** Element drifts vertically at a different speed than the page (parallax). */
export function Parallax({
  children,
  speed = 0.2,
  className = "",
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`${speed * 100}%`, `${-speed * 100}%`]);
  return (
    <motion.div ref={ref} style={reduce ? undefined : { y }} className={className}>
      {children}
    </motion.div>
  );
}

export function CountUp({
  to,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1.8,
  className = "",
}: {
  to: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setValue(to);
      return;
    }
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(v),
    });
    return () => controls.stop();
  }, [inView, to, duration, reduce]);

  const formatted = value.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

/** Card that tilts toward the pointer in 3D, with a soft moving glare. */
export function TiltCard({
  children,
  className = "",
  max = 9,
  glare = true,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
  glare?: boolean;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 220, damping: 22 });
  const sy = useSpring(py, { stiffness: 220, damping: 22 });
  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const glareX = useTransform(sx, (v) => `${v * 100}%`);
  const glareY = useTransform(sy, (v) => `${v * 100}%`);
  const glareBg = useTransform(
    [glareX, glareY],
    ([x, y]) => `radial-gradient(420px circle at ${x} ${y}, rgba(255,255,255,0.10), transparent 45%)`
  );

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType === "touch") return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <div className="[perspective:1200px] h-full">
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={reduce ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={`relative h-full ${className}`}
      >
        {children}
        {glare && !reduce && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{ background: glareBg }}
          />
        )}
      </motion.div>
    </div>
  );
}

export function Pill({
  children,
  tone = "neutral",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "green" | "amber" | "red" | "blue";
  className?: string;
}) {
  const tones: Record<string, string> = {
    neutral: "bg-white/[0.04] border-white/10 text-white/70",
    green: "bg-[#22C55E]/10 border-[#22C55E]/25 text-[#4ADE80]",
    amber: "bg-amber-400/10 border-amber-400/25 text-amber-300",
    red: "bg-rose-500/10 border-rose-500/25 text-rose-300",
    blue: "bg-sky-400/10 border-sky-400/25 text-sky-300",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}
