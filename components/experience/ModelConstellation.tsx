"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll } from "framer-motion";
import { Hand } from "lucide-react";
import { AI_MODELS } from "@/lib/ai/models";
import { AIModelDefinition } from "@/lib/ai/types";
import { SUBSCRIPTION_PLANS } from "@/lib/pricing/plans";
import { PlanTier } from "@/lib/pricing/types";
import { Pill, Reveal, SectionHeading } from "./primitives";

const MODELS = AI_MODELS.filter((m) => m.enabled);
const MAX_WEIGHT = Math.max(...MODELS.map((m) => m.unitWeight));
const PLAN_ORDER: PlanTier[] = ["STARTER", "PLUS", "PRO", "MAX"];

function parseContext(ctx: string): number {
  const n = parseFloat(ctx);
  if (/m/i.test(ctx)) return n * 1_000_000;
  if (/k/i.test(ctx)) return n * 1_000;
  return n;
}
const MAX_CTX = Math.max(...MODELS.map((m) => parseContext(m.contextWindow)));
const MIN_CTX = Math.min(...MODELS.map((m) => parseContext(m.contextWindow)));

/** Plans whose published model list includes this model (free models ship on every plan). */
function plansFor(model: AIModelDefinition): PlanTier[] {
  if (model.type === "FREE_UNLIMITED") return PLAN_ORDER;
  return PLAN_ORDER.filter((t) =>
    SUBSCRIPTION_PLANS[t].modelAccess.premiumModels.some((n) => model.name.toLowerCase().startsWith(n.toLowerCase()))
  );
}

function colorFor(m: AIModelDefinition): string {
  if (m.availability === "RETIRING_SOON") return "#FCD34D";
  if (m.type === "FREE_UNLIMITED") return "#22C55E";
  return "#E5E7EB";
}

export function ModelConstellation({ index = "06" }: { index?: string }) {
  const [selected, setSelected] = useState(MODELS.findIndex((m) => m.id === "gpt-6-astra"));
  const model = MODELS[Math.max(0, selected)];
  const plans = plansFor(model);
  const ctx = parseContext(model.contextWindow);
  const ctxPct = (Math.log(ctx) - Math.log(MIN_CTX)) / (Math.log(MAX_CTX) - Math.log(MIN_CTX));
  const fallback = model.fallbackModelId ? AI_MODELS.find((m) => m.id === model.fallbackModelId) : undefined;

  return (
    <section id="models" className="relative bg-black py-24 sm:py-32">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          index={index}
          eyebrow="Model constellation"
          title={
            <>
              {MODELS.length} models. <span className="text-white/40">One router decides.</span>
            </>
          }
          lead="Drag the sphere or pick a model. Green nodes run free and unlimited on your machine; premium nodes draw weighted units from your plan."
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.15fr_1fr]">
          <Reveal className="relative">
            <Sphere selected={selected} onSelect={setSelected} />
          </Reveal>

          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-1.5">
              {MODELS.map((m, i) => (
                <button
                  key={m.id}
                  onClick={() => setSelected(i)}
                  className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] transition ${
                    i === selected
                      ? "border-white/40 bg-white/[0.08] text-white"
                      : "border-white/[0.08] text-white/55 hover:border-white/25 hover:text-white"
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: colorFor(m) }} />
                  {m.name.replace(" Autonomous Agent", "").replace(" Verification", "")}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={model.id}
                initial={{ opacity: 0, y: 16, rotateX: -8 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className="flex flex-1 flex-col rounded-2xl border border-white/[0.09] bg-gradient-to-b from-[#111114] to-[#0A0A0C] p-6 sm:p-7"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Pill tone={model.type === "FREE_UNLIMITED" ? "green" : "neutral"}>
                    {model.type === "FREE_UNLIMITED" ? "Free · unlimited" : "Premium"}
                  </Pill>
                  <Pill tone={model.availability === "RETIRING_SOON" ? "amber" : "blue"}>
                    {model.availability === "RETIRING_SOON" ? "Retiring soon" : "Available"}
                  </Pill>
                  <span className="ml-auto font-mono text-[11px] text-white/40">{model.provider}</span>
                </div>
                <h3 className="mt-4 text-3xl font-semibold tracking-[-0.045em] text-white">{model.name}</h3>
                <p className="mt-3 font-inter text-[14px] leading-relaxed text-white/60">{model.description}</p>

                <div className="mt-6 grid gap-4">
                  <Meter
                    label="Unit weight"
                    value={model.type === "FREE_UNLIMITED" ? "0× (free)" : `${model.unitWeight.toFixed(1)}×`}
                    pct={model.unitWeight / MAX_WEIGHT}
                    color={colorFor(model)}
                  />
                  <Meter label="Context window" value={`${model.contextWindow} tokens`} pct={0.08 + ctxPct * 0.92} color="#7DD3FC" />
                  <div className="flex items-center justify-between rounded-lg border border-white/[0.07] bg-black/40 px-4 py-3">
                    <span className="text-[13px] text-white/55">Units for a 10,000-token request</span>
                    <span className="font-mono text-[14px] text-white">
                      {Math.ceil(10_000 * model.unitWeight).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-1.5">
                  {model.capabilities.map((c) => (
                    <span key={c} className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-1 text-[11.5px] text-white/65">
                      {c}
                    </span>
                  ))}
                </div>

                <div className="mt-auto pt-6">
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">Included in</p>
                  <div className="grid grid-cols-4 gap-1.5">
                    {PLAN_ORDER.map((t) => {
                      const on = plans.includes(t);
                      return (
                        <div
                          key={t}
                          className={`rounded-md border px-2 py-2 text-center font-mono text-[11px] ${
                            on ? "border-[#22C55E]/30 bg-[#22C55E]/10 text-[#86EFAC]" : "border-white/[0.06] text-white/25 line-through"
                          }`}
                        >
                          {SUBSCRIPTION_PLANS[t].name}
                        </div>
                      );
                    })}
                  </div>
                  {fallback && (
                    <p className="mt-3 text-[12px] text-amber-300/80">
                      Requests route automatically to {fallback.name} after retirement.
                    </p>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <WeightChart selected={selected} onSelect={setSelected} />
      </div>
    </section>
  );
}

function Meter({ label, value, pct, color }: { label: string; value: string; pct: number; color: string }) {
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-[13px]">
        <span className="text-white/55">{label}</span>
        <span className="font-mono text-white">{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(2, pct * 100)}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

function WeightChart({ selected, onSelect }: { selected: number; onSelect: (i: number) => void }) {
  const sorted = useMemo(() => MODELS.map((m, i) => ({ m, i })).sort((a, b) => a.m.unitWeight - b.m.unitWeight), []);
  return (
    <div className="mt-16 rounded-2xl border border-white/[0.08] bg-[#08080A] p-6 sm:p-8">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Cost of intelligence</p>
          <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-white">Premium units charged per token, by model</h3>
        </div>
        <p className="text-[12px] text-white/40">units = (input + output tokens) × weight</p>
      </div>
      <div className="mt-8 grid gap-2.5">
        {sorted.map(({ m, i }, row) => (
          <button key={m.id} onClick={() => onSelect(i)} className="group grid grid-cols-[minmax(110px,170px)_1fr_48px] items-center gap-3 text-left">
            <span className={`truncate text-[12.5px] ${i === selected ? "text-white" : "text-white/55 group-hover:text-white"}`}>
              {m.name.replace(" Autonomous Agent", "").replace(" Verification", "")}
            </span>
            <span className="relative h-6 overflow-hidden rounded-md bg-white/[0.04]">
              <motion.span
                className="absolute inset-y-0 left-0 rounded-md"
                style={{
                  background: i === selected ? colorFor(m) : `${colorFor(m)}55`,
                }}
                initial={{ width: 0 }}
                whileInView={{ width: `${Math.max(1.5, (m.unitWeight / MAX_WEIGHT) * 100)}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: row * 0.06, ease: [0.22, 1, 0.36, 1] }}
              />
            </span>
            <span className="text-right font-mono text-[12px] text-white/70">{m.unitWeight.toFixed(1)}×</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Canvas sphere ---------------- */

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

function fibonacciSphere(n: number): Vec3[] {
  const pts: Vec3[] = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const t = phi * i;
    pts.push({ x: Math.cos(t) * r, y, z: Math.sin(t) * r });
  }
  return pts;
}

function Sphere({ selected, onSelect }: { selected: number; onSelect: (i: number) => void }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion() ?? false;
  const selectedRef = useRef(selected);
  selectedRef.current = selected;
  const projected = useRef<{ x: number; y: number; z: number }[]>([]);
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start end", "end start"] });

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dust = fibonacciSphere(560);
    const nodes = fibonacciSphere(MODELS.length + 2).slice(1, -1); // skip the poles
    let w = 0;
    let h = 0;
    let dpr = 1;
    let rotY = 0.6;
    let rotX = -0.25;
    let velY = reduce ? 0 : 0.0028;
    let dragging = false;
    let dragDistance = 0;
    let lastX = 0;
    let lastY = 0;
    let raf = 0;
    let visible = true;

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(frame);
    });
    io.observe(wrap);

    const project = (v: Vec3, R: number, cx: number, cy: number, ry: number) => {
      const cosY = Math.cos(ry);
      const sinY = Math.sin(ry);
      const x1 = v.x * cosY - v.z * sinY;
      const z1 = v.x * sinY + v.z * cosY;
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const y2 = v.y * cosX - z1 * sinX;
      const z2 = v.y * sinX + z1 * cosX;
      const persp = 2.6 / (2.6 + z2);
      return { x: cx + x1 * R * persp, y: cy + y2 * R * persp, z: z2 };
    };

    function frame() {
      raf = 0;
      if (!visible || !ctx) return;
      if (!dragging) {
        rotY += velY;
        if (!reduce) velY += (0.0028 - velY) * 0.02;
      }
      const ry = rotY + scrollYProgress.get() * 2.2;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const R = Math.min(w, h) * 0.36;
      const cx = w / 2;
      const cy = h / 2;

      // Equator rings
      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      ctx.lineWidth = 1;
      for (const k of [1, 0.66]) {
        ctx.beginPath();
        ctx.ellipse(cx, cy, R * k * 1.02, R * k * 0.32, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Dust
      for (const d of dust) {
        const pr = project(d, R, cx, cy, ry);
        const a = 0.08 + (1 - (pr.z + 1) / 2) * 0.4;
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.fillRect(pr.x, pr.y, 1.4, 1.4);
      }

      // Router core
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.38);
      g.addColorStop(0, "rgba(34,197,94,0.35)");
      g.addColorStop(1, "rgba(34,197,94,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 0.38, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#22C55E";
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fill();

      // Model nodes (sorted back-to-front)
      const proj = nodes.map((n) => project({ x: n.x * 1.08, y: n.y * 1.08, z: n.z * 1.08 }, R, cx, cy, ry));
      projected.current = proj;
      const order = proj.map((pp, i) => ({ pp, i })).sort((a, b) => b.pp.z - a.pp.z);
      ctx.font = "500 11px 'JetBrains Mono', monospace";
      for (const { pp, i } of order) {
        const m = MODELS[i];
        const isSel = i === selectedRef.current;
        const front = 1 - (pp.z + 1) / 2;
        const col = colorFor(m);
        ctx.strokeStyle = isSel ? `${col}cc` : `rgba(255,255,255,${0.04 + front * 0.1})`;
        ctx.lineWidth = isSel ? 1.4 : 1;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(pp.x, pp.y);
        ctx.stroke();

        const r = (isSel ? 7 : 4.5) * (0.7 + front * 0.6);
        if (isSel) {
          ctx.fillStyle = `${col}33`;
          ctx.beginPath();
          ctx.arc(pp.x, pp.y, r * 2.6, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 0.35 + front * 0.65;
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.arc(pp.x, pp.y, r, 0, Math.PI * 2);
        ctx.fill();
        if (isSel || front > 0.62) {
          ctx.fillStyle = isSel ? "#FFFFFF" : "rgba(255,255,255,0.55)";
          ctx.fillText(m.name.replace(" Autonomous Agent", "").replace(" Verification", ""), pp.x + r + 6, pp.y + 4);
        }
        ctx.globalAlpha = 1;
      }

      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    const down = (e: PointerEvent) => {
      dragging = true;
      dragDistance = 0;
      lastX = e.clientX;
      lastY = e.clientY;
      canvas.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      dragDistance += Math.abs(dx) + Math.abs(dy);
      rotY += dx * 0.006;
      velY = dx * 0.006;
      rotX = Math.max(-1.1, Math.min(1.1, rotX + dy * 0.004));
    };
    const up = (e: PointerEvent) => {
      dragging = false;
      if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
    };
    const click = (e: MouseEvent) => {
      if (dragDistance > 6) return; // it was a drag, not a click
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      let best = -1;
      let bestD = 22;
      projected.current.forEach((pp, i) => {
        const d = Math.hypot(pp.x - x, pp.y - y);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      });
      if (best >= 0) onSelect(best);
    };
    canvas.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    canvas.addEventListener("click", click);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      canvas.removeEventListener("click", click);
    };
  }, [onSelect, reduce, scrollYProgress]);

  return (
    <div
      ref={wrapRef}
      className="relative aspect-square w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-[radial-gradient(circle_at_50%_50%,#0D1410,#000_70%)]"
    >
      <canvas ref={canvasRef} className="absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing" aria-label="Interactive 3D map of AI models" />
      <div className="pointer-events-none absolute left-4 top-4 flex flex-col gap-1.5 font-mono text-[10px] text-white/45">
        <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />Free · local</span>
        <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[#E5E7EB]" />Premium</span>
        <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[#FCD34D]" />Retiring</span>
      </div>
      <div className="pointer-events-none absolute bottom-4 right-4 flex items-center gap-1.5 font-mono text-[10px] text-white/40">
        <Hand className="h-3 w-3" /> Drag to rotate · click a node
      </div>
    </div>
  );
}
