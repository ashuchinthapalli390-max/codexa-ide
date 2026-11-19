"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { SUBSCRIPTION_PLANS } from "@/lib/pricing/plans";
import { PlanTier, SubscriptionPlan } from "@/lib/pricing/types";
import { useAuth } from "@/lib/auth/AuthContext";
import { Reveal, SectionHeading, TiltCard } from "./primitives";
import { PrebookDialog, PrebookMode } from "./PrebookDialog";

const TIERS: PlanTier[] = ["STARTER", "PLUS", "PRO", "MAX"];
const inr = (n: number) =>
  n.toLocaleString("en-IN", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });

export function PricingDeck({ index = "08" }: { index?: string }) {
  const [launch, setLaunch] = useState(true);
  const [dialog, setDialog] = useState<{ plan: SubscriptionPlan; mode: PrebookMode } | null>(null);
  const { user, entitlement } = useAuth();
  const discount = SUBSCRIPTION_PLANS.STARTER.pricing.discountPercent;
  const isCurrent = (t: PlanTier) =>
    !!user && (entitlement?.toLowerCase() === t.toLowerCase() || (entitlement === "customer_subscription" && t === "PRO"));

  return (
    <section id="pricing" className="relative bg-black py-24 sm:py-32">
      <div aria-hidden className="absolute left-1/2 top-40 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-white/[0.025] blur-[120px]" />
      <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            index={index}
            eyebrow="Pricing in INR"
            title={
              <>
                Frontier models on every plan. <span className="text-white/40">Pay for volume.</span>
              </>
            }
            lead="Every paid plan unlocks GPT-6 Astra, Fabel 5.1, Gemini and OPUS 5.5. Plans differ mainly by monthly premium units and concurrency. GST is itemised at checkout; cancel any time."
          />

          <Reveal>
            <div className="inline-flex shrink-0 whitespace-nowrap rounded-full border border-white/10 bg-white/[0.03] p-1 text-[13px]">
              {[
                { on: true, label: `First month −${discount}%` },
                { on: false, label: "Standard monthly" },
              ].map((o) => (
                <button
                  key={o.label}
                  onClick={() => setLaunch(o.on)}
                  className={`relative rounded-full px-4 py-2 transition ${launch === o.on ? "text-black" : "text-white/60 hover:text-white"}`}
                >
                  {launch === o.on && (
                    <motion.span layoutId="price-toggle" className="absolute inset-0 rounded-full bg-white" transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                  )}
                  <span className="relative">{o.label}</span>
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {TIERS.map((t, i) => {
            const plan = SUBSCRIPTION_PLANS[t];
            const featured = !!plan.isRecommended;
            const price = launch ? plan.pricing.monthlyDiscountedInr : plan.pricing.monthlyStandardInr;
            return (
              <Reveal key={t} delay={i * 0.07} className="h-full">
                <TiltCard
                  className={`flex h-full flex-col rounded-2xl border p-6 ${
                    featured
                      ? "border-white/30 bg-gradient-to-b from-[#16161A] to-[#0B0B0D] shadow-[0_0_80px_rgba(255,255,255,0.06)]"
                      : "border-white/[0.09] bg-[#0B0B0D]"
                  }`}
                >
                  <div style={{ transform: "translateZ(40px)" }} className="flex h-full flex-col">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold tracking-[-0.03em] text-white">{plan.name}</h3>
                      {plan.badge && (
                        <span
                          className={`rounded-full px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.14em] ${
                            featured ? "bg-white text-black" : "border border-white/15 text-white/60"
                          }`}
                        >
                          {plan.badge}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 min-h-[42px] text-[13px] leading-snug text-white/50">{plan.tagline}</p>

                    <div className="mt-6 flex items-baseline gap-1.5">
                      <span className="text-lg text-white/50">₹</span>
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span
                          key={price}
                          initial={{ y: 20, opacity: 0, rotateX: -50 }}
                          animate={{ y: 0, opacity: 1, rotateX: 0 }}
                          exit={{ y: -20, opacity: 0, rotateX: 50 }}
                          transition={{ duration: 0.35 }}
                          className="text-[2.6rem] font-semibold leading-none tracking-[-0.05em] text-white tabular-nums"
                        >
                          {inr(price)}
                        </motion.span>
                      </AnimatePresence>
                      <span className="text-[13px] text-white/40">/mo</span>
                    </div>
                    <p className="mt-2 h-4 font-mono text-[11px] text-white/40">
                      {launch ? `then ₹${inr(plan.pricing.monthlyStandardInr)}/mo` : "billed monthly"}
                    </p>

                    <div className="mt-6 rounded-xl border border-white/[0.07] bg-black/40 p-3.5">
                      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">Premium units / month</p>
                      <p className="mt-1 text-xl font-semibold tracking-[-0.03em] text-white">
                        {plan.tokenAllowance.monthlyPremiumUnits.toLocaleString("en-IN")}
                      </p>
                    </div>

                    <ul className="mt-6 flex flex-col gap-2.5">
                      {plan.features.slice(1, 7).map((f) => (
                        <li key={f} className="flex gap-2.5 text-[13px] leading-snug text-white/70">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#22C55E]" />
                          {f}
                        </li>
                      ))}
                    </ul>

                    {isCurrent(t) ? (
                      <div className="mt-auto flex h-11 items-center justify-center gap-2 rounded-lg border border-[#22C55E]/30 bg-[#22C55E]/10 text-[14px] font-semibold text-[#86EFAC]" style={{ marginTop: 28 }}>
                        <Check className="h-4 w-4" /> Current plan
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDialog({ plan, mode: t === "MAX" ? "contact" : "prebook" })}
                        className={`group mt-auto flex h-11 items-center justify-center gap-2 rounded-lg text-[14px] font-semibold tracking-[-0.02em] transition ${
                          featured
                            ? "bg-white text-black hover:bg-[#E5E7EB]"
                            : "border border-white/15 text-white hover:border-white/35 hover:bg-white/[0.05]"
                        }`}
                        style={{ marginTop: 28 }}
                      >
                        {t === "MAX" ? "Talk to us" : plan.prebookCtaText}
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                      </button>
                    )}
                    <p className="mt-2.5 text-center text-[11px] text-white/35">
                      {t === "MAX" ? "Custom volume & dedicated SLA" : "No card now · cancel anytime"}
                    </p>
                  </div>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>

        <Reveal>
          <p className="mt-8 text-center text-[12.5px] text-white/40">
            NEXA Edge and CodeXa Models are unlimited on every plan. {SUBSCRIPTION_PLANS.STARTER.pricing.taxNotice}{" "}
            <Link href="/pricing#plan-matrix" className="text-white/70 underline-offset-4 hover:text-white hover:underline">
              Compare every plan feature
            </Link>
          </p>
        </Reveal>
      </div>
      <PrebookDialog plan={dialog?.plan ?? null} mode={dialog?.mode ?? "prebook"} onClose={() => setDialog(null)} />
    </section>
  );
}
