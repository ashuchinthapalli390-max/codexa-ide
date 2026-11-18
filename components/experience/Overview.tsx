"use client";

import React, { useRef } from "react";
import { motion, MotionValue, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { AI_MODELS } from "@/lib/ai/models";
import { SUBSCRIPTION_PLANS } from "@/lib/pricing/plans";
import { releaseManifest } from "@/lib/releases/manifest";
import { HERO_MARQUEE, MANIFESTO } from "@/lib/content/home";
import { CountUp, Eyebrow, Reveal } from "./primitives";

const enabledModels = AI_MODELS.filter((m) => m.enabled);
const freeModels = enabledModels.filter((m) => m.type === "FREE_UNLIMITED");
const platformCount = Object.keys(releaseManifest.platforms).length;
const shippedPlatforms = Object.values(releaseManifest.platforms).filter(
  (p) => p.status === "available" || p.status === "preview"
).length;

const STATS = [
  { value: enabledModels.length, label: "AI models in one router", note: `${freeModels.length} run free & unlimited` },
  { value: 1, suffix: "M", label: "Token context window", note: "Gemini 3.8 Flash · GPT 6.1 SOL" },
  { value: SUBSCRIPTION_PLANS.MAX.tokenAllowance.monthlyPremiumUnits / 1_000_000, suffix: "M", label: "Monthly units on Max", note: "250k on Starter" },
  { value: SUBSCRIPTION_PLANS.STARTER.pricing.monthlyDiscountedInr, prefix: "₹", decimals: 2, label: "First month, Starter", note: `${SUBSCRIPTION_PLANS.STARTER.pricing.discountPercent}% launch discount` },
  { value: platformCount, label: "Platforms on the roadmap", note: `${shippedPlatforms} available or in preview` },
  { value: 0, label: "Cloud telemetry by default", note: "Local-first, BYOK keychain" },
];

export function Overview() {
  return (
    <section id="overview" className="relative bg-black py-24 sm:py-32">
      <Marquee />

      <div className="mx-auto mt-20 max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <Eyebrow index="01">By the numbers</Eyebrow>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08] lg:grid-cols-3">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.05} className="bg-black">
              <div className="group relative h-full p-6 sm:p-8 transition-colors hover:bg-[#0B0B0D]">
                <div className="text-[clamp(2.2rem,5vw,4rem)] font-semibold leading-none tracking-[-0.05em] text-white">
                  <CountUp to={s.value} prefix={s.prefix} suffix={s.suffix} decimals={s.decimals ?? 0} />
                </div>
                <p className="mt-4 text-[14px] font-medium text-white/80 sm:text-[15px]">{s.label}</p>
                <p className="mt-1 font-mono text-[11px] text-white/40">{s.note}</p>
                <span className="absolute right-5 top-5 h-1.5 w-1.5 rounded-full bg-white/10 transition-colors group-hover:bg-[#22C55E]" />
              </div>
            </Reveal>
          ))}
        </div>

        <ScrollWords text={MANIFESTO} />
      </div>
    </section>
  );
}

function Marquee() {
  const items = [...HERO_MARQUEE, ...HERO_MARQUEE];
  return (
    <div className="relative overflow-hidden border-y border-white/[0.07] py-5 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
      <div className="animate-marquee gap-12 pr-12">
        {items.map((t, i) => (
          <span key={i} className="flex items-center gap-12 whitespace-nowrap font-mono text-[12px] uppercase tracking-[0.2em] text-white/45">
            {t}
            <span className="h-1 w-1 rounded-full bg-[#22C55E]/60" />
          </span>
        ))}
      </div>
    </div>
  );
}

/** Paragraph whose words light up one by one as it scrolls through the viewport. */
function ScrollWords({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = text.split(" ");

  return (
    <div className="mt-28 sm:mt-36">
      <Reveal>
        <Eyebrow index="02">Why it exists</Eyebrow>
      </Reveal>
      <p
        ref={ref}
        className="mt-8 max-w-[1100px] text-[clamp(1.6rem,3.6vw,3rem)] font-semibold leading-[1.18] tracking-[-0.04em]"
      >
        {words.map((w, i) =>
          reduce ? (
            <span key={i} className="text-white">
              {w}{" "}
            </span>
          ) : (
            <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
              {w}
            </Word>
          )
        )}
      </p>
    </div>
  );
}

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  const highlight = /^(AST-native|router|verification|Local|Private)/.test(children);
  return (
    <motion.span style={{ opacity }} className={highlight ? "text-[#4ADE80]" : "text-white"}>
      {children}{" "}
    </motion.span>
  );
}
