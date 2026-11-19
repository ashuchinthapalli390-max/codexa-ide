"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Info, Sparkles } from "lucide-react";
import { AI_MODELS } from "@/lib/ai/models";
import { SUBSCRIPTION_PLANS } from "@/lib/pricing/plans";
import { PlanTier } from "@/lib/pricing/types";
import { Reveal, SectionHeading } from "./primitives";

const PREMIUM = AI_MODELS.filter((m) => m.enabled && m.type === "PREMIUM" && m.availability !== "RETIRING_SOON");
const TIERS: PlanTier[] = ["STARTER", "PLUS", "PRO", "MAX"];

const fmt = (n: number) => Math.round(n).toLocaleString("en-IN");
const compact = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 2)}M` : n >= 1000 ? `${(n / 1000).toFixed(0)}k` : `${Math.round(n)}`;

/**
 * Estimates monthly premium units with the same rule the metering service uses:
 * units = ceil((input + output tokens) × model weight); free local models cost 0.
 */
export function UsageCalculator({ index = "07" }: { index?: string }) {
  const [requests, setRequests] = useState(60);
  const [tokens, setTokens] = useState(2500);
  const [days, setDays] = useState(22);
  const [localShare, setLocalShare] = useState(40);
  const [modelId, setModelId] = useState("gpt-6-astra");
  const model = PREMIUM.find((m) => m.id === modelId) ?? PREMIUM[0];

  const result = useMemo(() => {
    const premiumRequests = requests * days * (1 - localShare / 100);
    const unitsPerRequest = Math.ceil(tokens * model.unitWeight);
    const units = premiumRequests * unitsPerRequest;
    const freeRequests = requests * days - premiumRequests;
    const fits = TIERS.map((t) => {
      const plan = SUBSCRIPTION_PLANS[t];
      const allowance = plan.tokenAllowance.monthlyPremiumUnits;
      return { t, plan, allowance, pct: allowance ? units / allowance : 0 };
    });
    const best = fits.find((f) => f.pct <= 1);
    return { units, unitsPerRequest, premiumRequests, freeRequests, fits, best };
  }, [requests, tokens, days, localShare, model]);

  return (
    <section id="calculator" className="relative bg-black py-24 sm:py-32">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          index={index}
          eyebrow="Usage estimator"
          title={
            <>
              Which plan fits <span className="text-white/40">the way you code?</span>
            </>
          }
          lead="Move the sliders to match a normal month. The estimate uses the router's published model weights, and anything routed to local NEXA or CodeXa models costs zero units."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          {/* Controls */}
          <Reveal className="rounded-2xl border border-white/[0.09] bg-[#0B0B0D] p-6 sm:p-8">
            <div className="grid gap-7">
              <Slider label="AI requests per day" value={requests} min={5} max={400} step={5} onChange={setRequests} display={`${requests}`} />
              <Slider label="Average tokens per request" value={tokens} min={500} max={20000} step={500} onChange={setTokens} display={fmt(tokens)} hint="input + output" />
              <Slider label="Coding days per month" value={days} min={4} max={30} step={1} onChange={setDays} display={`${days}`} />
              <Slider label="Share routed to free local models" value={localShare} min={0} max={90} step={5} onChange={setLocalShare} display={`${localShare}%`} accent />

              <div>
                <p className="mb-2.5 text-[13px] text-white/55">Main premium model</p>
                <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                  {PREMIUM.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setModelId(m.id)}
                      className={`rounded-lg border px-2.5 py-2 text-left transition ${
                        m.id === model.id ? "border-white/40 bg-white/[0.07]" : "border-white/[0.07] hover:border-white/20"
                      }`}
                    >
                      <span className="block truncate text-[12px] text-white">
                        {m.name.replace(" Autonomous Agent", "").replace(" Verification", "")}
                      </span>
                      <span className="font-mono text-[10px] text-white/40">{m.unitWeight.toFixed(1)}× weight</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Output */}
          <Reveal delay={0.08} className="flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.09] bg-gradient-to-br from-[#0F1511] to-[#0A0A0C] p-6 sm:p-8">
              <div aria-hidden className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#22C55E]/10 blur-3xl" />
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">Estimated premium units / month</p>
              <motion.p
                key={Math.round(result.units / 1000)}
                initial={{ opacity: 0.4, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 text-[clamp(2.6rem,6vw,4.4rem)] font-semibold leading-none tracking-[-0.05em] text-white tabular-nums"
              >
                {fmt(result.units)}
              </motion.p>
              <div className="mt-5 grid grid-cols-3 gap-3 border-t border-white/[0.07] pt-5 text-[12px]">
                <Stat k="Units / request" v={fmt(result.unitsPerRequest)} />
                <Stat k="Premium requests" v={fmt(result.premiumRequests)} />
                <Stat k="Free local requests" v={fmt(result.freeRequests)} green />
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.09] bg-[#0B0B0D] p-6 sm:p-7">
              <div className="grid gap-4">
                {result.fits.map(({ t, plan, allowance, pct }) => {
                  const isBest = result.best?.t === t;
                  const over = pct > 1;
                  const near = pct > 0.8 && !over;
                  const color = over ? "#F43F5E" : near ? "#FCD34D" : "#22C55E";
                  return (
                    <div key={t}>
                      <div className="mb-1.5 flex items-center justify-between text-[13px]">
                        <span className="flex items-center gap-2 text-white">
                          {plan.name}
                          {isBest && (
                            <span className="rounded-full bg-[#22C55E]/15 px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.12em] text-[#4ADE80]">
                              Best fit
                            </span>
                          )}
                        </span>
                        <span className="font-mono text-[11.5px] text-white/50">
                          {compact(result.units)} / {compact(allowance)} ·{" "}
                          {pct > 9.99 ? `${Math.round(pct)}× over` : `${Math.round(pct * 100)}%`}
                        </span>
                      </div>
                      <div className="relative h-2 overflow-hidden rounded-full bg-white/[0.06]">
                        <motion.div
                          className="h-full rounded-full"
                          animate={{ width: `${Math.min(100, Math.max(1, pct * 100))}%`, backgroundColor: color }}
                          transition={{ type: "spring", stiffness: 120, damping: 20 }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex items-start gap-3 rounded-xl border border-white/[0.07] bg-black/40 p-4">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#22C55E]" />
                {result.best ? (
                  <p className="text-[13.5px] leading-relaxed text-white/70">
                    <span className="text-white">{result.best.plan.name}</span> covers this month at{" "}
                    <span className="text-white">₹{result.best.plan.pricing.monthlyStandardInr.toLocaleString("en-IN")}/mo</span> (₹
                    {result.best.plan.pricing.monthlyDiscountedInr.toLocaleString("en-IN")} for your first month with the launch
                    discount), with {Math.round((1 - result.best.pct) * 100)}% headroom.
                  </p>
                ) : (
                  <p className="text-[13.5px] leading-relaxed text-white/70">
                    This exceeds Max. Route more work to free local models, switch to a lighter model, or plug in your own API
                    keys through the BYOK vault — there are never surprise overage charges.
                  </p>
                )}
              </div>
              <p className="mt-3 flex items-center gap-1.5 text-[11px] text-white/35">
                <Info className="h-3 w-3" /> Estimate only. Allowances are provisional until general availability.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Stat({ k, v, green }: { k: string; v: string; green?: boolean }) {
  return (
    <div>
      <p className="text-white/40">{k}</p>
      <p className={`mt-1 font-mono text-[14px] ${green ? "text-[#4ADE80]" : "text-white"}`}>{v}</p>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  display,
  hint,
  accent,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  display: string;
  hint?: string;
  accent?: boolean;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <label className="block">
      <div className="mb-3 flex items-baseline justify-between">
        <span className="text-[13px] text-white/55">
          {label} {hint && <span className="text-white/30">({hint})</span>}
        </span>
        <span className={`font-mono text-[15px] ${accent ? "text-[#4ADE80]" : "text-white"}`}>{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="cx-range w-full"
        style={{ ["--pct" as string]: `${pct}%`, ["--fill" as string]: accent ? "#22C55E" : "#FFFFFF" }}
      />
    </label>
  );
}
