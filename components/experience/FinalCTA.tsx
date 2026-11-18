"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Bell } from "lucide-react";
import { AI_MODELS } from "@/lib/ai/models";

const RING = [
  ...AI_MODELS.filter((m) => m.enabled).map((m) => m.name.replace(" Autonomous Agent", "").replace(" Verification", "")),
  "AST Core",
  "Live Preview",
  "Visual Git",
];

/** Closing scene: a ring of model names orbiting in 3D, turned by scroll. */
export function FinalCTA() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 80, damping: 24 });
  const rotateY = useTransform(p, [0, 1], [40, -220]);
  const tilt = useTransform(p, [0, 0.5, 1], [22, 12, 4]);
  const scale = useTransform(p, [0, 0.5], [0.8, 1]);
  const n = RING.length;
  const radius = 460;

  return (
    <section ref={ref} className="relative overflow-hidden bg-black py-32 sm:py-44">
      <div aria-hidden className="absolute inset-0 bg-subtle-grid opacity-25 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div aria-hidden className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#22C55E]/[0.08] blur-[110px]" />

      {/* 3D ring */}
      <div aria-hidden className="pointer-events-none absolute inset-0 flex scale-[0.55] items-center justify-center [perspective:1400px] sm:scale-100">
        <motion.div
          style={reduce ? undefined : { rotateY, rotateX: tilt, scale, transformStyle: "preserve-3d" }}
          className="relative h-10 w-10"
        >
          {RING.map((label, i) => (
            <div
              key={label}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-white/10 bg-[#0B0B0D]/80 px-4 py-2 font-mono text-[12px] text-white/55 [backface-visibility:hidden]"
              style={{ transform: `rotateY(${(360 / n) * i}deg) translateZ(${radius}px)` }}
            >
              {label}
            </div>
          ))}
        </motion.div>
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="text-[clamp(2.4rem,6.5vw,5.4rem)] font-semibold leading-[0.98] tracking-[-0.055em] text-white"
        >
          Your next commit
          <br />
          <span className="bg-gradient-to-b from-white to-white/35 bg-clip-text text-transparent">starts here.</span>
        </motion.h2>
        <p className="mx-auto mt-6 max-w-xl font-inter text-[16px] leading-relaxed text-white/55">
          Reserve your place for the next pre-beta wave. No payment today — your launch discount is locked in.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/pricing#pricing"
            className="group flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-white px-7 text-[15px] font-semibold tracking-[-0.02em] text-black transition hover:bg-[#E5E7EB] hover:shadow-[0_0_36px_rgba(255,255,255,0.25)] sm:w-auto"
          >
            <Bell className="h-4 w-4" /> Reserve early access
          </Link>
          <Link
            href="/workspace"
            className="group flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/[0.04] px-7 text-[15px] font-semibold tracking-[-0.02em] text-white transition hover:border-white/40 sm:w-auto"
          >
            Try the interactive workspace
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
