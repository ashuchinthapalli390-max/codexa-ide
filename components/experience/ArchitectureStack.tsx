"use client";

import React, { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  MotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ARCHITECTURE_LAYERS, ArchitectureLayer } from "@/lib/content/home";
import { SectionHeading, useMediaMin } from "./primitives";

const N = ARCHITECTURE_LAYERS.length;

/**
 * Isometric stack of the five system layers. Scrolling pulls the plates apart
 * along Z (exploded view) and walks through each layer's explanation.
 */
export function ArchitectureStack({ index = "05" }: { index?: string }) {
  const ref = useRef<HTMLElement>(null);
  const desktop = useMediaMin(1024);
  const reduce = useReducedMotion() ?? false;
  const pinned = desktop && !reduce;
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 110, damping: 26, mass: 0.4 });
  const spin = useTransform(p, [0, 1], [-46, -28]);
  const tilt = useTransform(p, [0, 0.25], [64, 56]);

  useMotionValueEvent(p, "change", (v) => {
    if (!pinned) return;
    const idx = Math.min(N - 1, Math.max(0, Math.floor(((v - 0.12) / 0.8) * N)));
    setActive(idx);
  });

  const layer = ARCHITECTURE_LAYERS[active];

  return (
    <section id="architecture" ref={ref} className={`relative bg-black ${pinned ? "h-[360vh]" : "py-24"}`}>
      <div className={pinned ? "pin-stage flex items-center overflow-hidden" : ""}>
        <div className="mx-auto grid w-full max-w-[1280px] items-center gap-12 px-4 sm:px-6 lg:h-full lg:grid-cols-[1.1fr_1fr] lg:px-8">
          {/* Stack */}
          <div className="relative order-2 flex h-[420px] items-center justify-center sm:h-[520px] lg:order-1 lg:h-full lg:max-h-[640px] [perspective:2200px]">
            <div aria-hidden className="absolute inset-0 rounded-full bg-[radial-gradient(closest-side,rgba(34,197,94,0.12),transparent)] blur-2xl" />
            <motion.div
              style={{
                rotateX: pinned ? tilt : 56,
                rotateZ: pinned ? spin : -36,
                transformStyle: "preserve-3d",
              }}
              className="relative mt-[12%] h-[200px] w-[200px] sm:h-[260px] sm:w-[260px] lg:h-[min(300px,34vh)] lg:w-[min(300px,34vh)]"
            >
              {ARCHITECTURE_LAYERS.map((l, i) => (
                <Plate
                  key={l.id}
                  layer={l}
                  // index 0 (shell) sits on top of the stack
                  level={N - 1 - i}
                  p={p}
                  pinned={pinned}
                  isActive={i === active}
                  onSelect={() => setActive(i)}
                />
              ))}
            </motion.div>
          </div>

          {/* Copy */}
          <div className="order-1 flex flex-col gap-8 lg:order-2">
            <SectionHeading
              index={index}
              eyebrow="Architecture"
              title={
                <>
                  Five layers. <span className="text-white/40">One coherent system.</span>
                </>
              }
              lead="Scroll to pull the stack apart. Each plate is a real subsystem — from the window you type into, down to the on-device core that keeps your code private."
            />

            <div className="flex flex-wrap gap-2">
              {ARCHITECTURE_LAYERS.map((l, i) => (
                <button
                  key={l.id}
                  onClick={() => setActive(i)}
                  className={`rounded-full border px-3 py-1.5 font-mono text-[11px] transition ${
                    i === active
                      ? "border-white/40 bg-white text-black"
                      : "border-white/10 text-white/55 hover:border-white/25 hover:text-white"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")} {l.name}
                </button>
              ))}
            </div>

            <div className="relative min-h-[260px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={layer.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                  className="rounded-2xl border border-white/[0.09] bg-[#0B0B0D] p-6 sm:p-7"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: layer.hue }}>
                        {layer.tag}
                      </p>
                      <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">{layer.name}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-semibold tracking-[-0.04em] text-white">{layer.stat.value}</p>
                      <p className="font-mono text-[10px] text-white/40">{layer.stat.label}</p>
                    </div>
                  </div>
                  <p className="mt-4 font-inter text-[14.5px] leading-relaxed text-white/65">{layer.summary}</p>
                  <ul className="mt-5 grid gap-2">
                    {layer.details.map((d) => (
                      <li key={d} className="flex items-center gap-2.5 text-[13.5px] text-white/75">
                        <span className="h-1 w-3 rounded-full" style={{ background: layer.hue }} />
                        {d}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Plate({
  layer,
  level,
  p,
  pinned,
  isActive,
  onSelect,
}: {
  layer: ArchitectureLayer;
  level: number;
  p: MotionValue<number>;
  pinned: boolean;
  isActive: boolean;
  onSelect: () => void;
}) {
  const z = useTransform(p, [0.02, 0.35], [level * 14, level * 56]);
  const staticZ = level * 48;

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      aria-label={layer.name}
      style={{ z: pinned ? z : staticZ, transformStyle: "preserve-3d" }}
      animate={{ scale: isActive ? 1.04 : 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="absolute inset-0 rounded-2xl"
    >
      <div
        className="absolute inset-0 rounded-2xl border transition-[background,border-color,box-shadow] duration-500"
        style={{
          borderColor: isActive ? layer.hue : "rgba(255,255,255,0.14)",
          background: isActive
            ? `linear-gradient(135deg, ${layer.hue}33, rgba(12,12,14,0.92) 60%)`
            : "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(10,10,12,0.9) 60%)",
          boxShadow: isActive ? `0 0 60px ${layer.hue}40` : "0 20px 60px rgba(0,0,0,0.6)",
        }}
      />
      <div className="absolute inset-3 rounded-xl bg-subtle-grid opacity-60" />
      <div className="absolute left-4 top-4 text-left">
        <p className="font-mono text-[9px] uppercase tracking-[0.2em]" style={{ color: isActive ? layer.hue : "rgba(255,255,255,0.4)" }}>
          L{level + 1}
        </p>
        <p className={`text-[13px] font-semibold tracking-[-0.02em] ${isActive ? "text-white" : "text-white/55"}`}>
          {layer.name}
        </p>
      </div>
      {/* Little modules sitting on the plate */}
      <div className="absolute bottom-5 right-5 flex gap-1.5">
        {[0, 1, 2].map((k) => (
          <span
            key={k}
            className="h-5 w-5 rounded-md border"
            style={{
              borderColor: isActive ? `${layer.hue}80` : "rgba(255,255,255,0.12)",
              background: isActive ? `${layer.hue}22` : "rgba(255,255,255,0.03)",
            }}
          />
        ))}
      </div>
    </motion.button>
  );
}
