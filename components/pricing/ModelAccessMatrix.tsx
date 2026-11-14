"use client";

import React, { useRef, useEffect } from "react";
import { Check, Sparkles, Shield, Cpu, Zap, ArrowRight, Info } from "lucide-react";
import Link from "next/link";
import { getGsap } from "@/lib/motion/gsapSetup";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";
import { MOTION_EASINGS } from "@/lib/motion/tokens";

interface UsageRow {
  feature: string;
  starter: string | boolean;
  plus: string | boolean;
  pro: string | boolean;
  max: string | boolean;
  isHighlight?: boolean;
}

const USAGE_ROWS: UsageRow[] = [
  {
    feature: "Model Catalogue Access",
    starter: "All Supported Models",
    plus: "All Supported Models",
    pro: "All Supported Models",
    max: "All Supported Models",
    isHighlight: true,
  },
  {
    feature: "NEXA Edge (Offline Inference)",
    starter: "Unlimited Fair-Use",
    plus: "Unlimited Fair-Use",
    pro: "Unlimited Fair-Use",
    max: "Unlimited Fair-Use",
  },
  {
    feature: "CodeXa Native AST Models",
    starter: "Unlimited Fair-Use",
    plus: "Unlimited Fair-Use",
    pro: "Unlimited Fair-Use",
    max: "Unlimited Fair-Use",
  },
  {
    feature: "Premium Monthly Token Units",
    starter: "250,000 units",
    plus: "750,000 units",
    pro: "2,000,000 units",
    max: "5,000,000 units",
    isHighlight: true,
  },
  {
    feature: "Input Token Consumption",
    starter: "Standard Weighting",
    plus: "Standard Weighting",
    pro: "Standard Weighting",
    max: "Standard Weighting",
  },
  {
    feature: "Output Token Consumption",
    starter: "Model Cost Basis",
    plus: "Model Cost Basis",
    pro: "Model Cost Basis",
    max: "Model Cost Basis",
  },
  {
    feature: "Model-Dependent Usage Weighting",
    starter: "Transparent Metering",
    plus: "Transparent Metering",
    pro: "Transparent Metering",
    max: "Transparent Metering",
  },
  {
    feature: "Concurrent Premium Requests",
    starter: "2 Concurrent",
    plus: "5 Concurrent",
    pro: "12 Concurrent",
    max: "25 Concurrent",
  },
  {
    feature: "Autonomous Agent Execution",
    starter: "Single-Task Agent",
    plus: "Dual-Agent Planner",
    pro: "Multi-Agent Swarm",
    max: "Priority High-Volume",
  },
  {
    feature: "Local Keyring (BYOK)",
    starter: true,
    plus: true,
    pro: true,
    max: true,
  },
  {
    feature: "Monthly Usage Reset",
    starter: "30-Day Billing Cycle",
    plus: "30-Day Billing Cycle",
    pro: "30-Day Billing Cycle",
    max: "30-Day Billing Cycle",
  },
  {
    feature: "Usage Dashboard & Alerts",
    starter: true,
    plus: true,
    pro: true,
    max: true,
  },
  {
    feature: "Overage Safeguards",
    starter: "Hard Cap (No surprise fees)",
    plus: "Hard Cap (No surprise fees)",
    pro: "Soft Cap with Opt-in",
    max: "Dedicated Reserve Quota",
  },
];

export function ModelAccessMatrix() {
  const sectionRef = useRef<HTMLElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const isReduced = useReducedMotion();

  useEffect(() => {
    if (isReduced) return;

    const { gsap } = getGsap();
    if (!tableRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        tableRef.current,
        { opacity: 0, y: 30, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.65,
          ease: MOTION_EASINGS.smoothOut,
          scrollTrigger: {
            trigger: tableRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [isReduced]);

  const renderValue = (val: string | boolean, isHighlighted?: boolean) => {
    if (val === true) {
      return (
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto">
          <Check className="w-3.5 h-3.5" />
        </span>
      );
    }
    return (
      <span
        className={`text-xs font-mono ${
          isHighlighted ? "text-emerald-400 font-bold" : "text-white/80"
        }`}
      >
        {val}
      </span>
    );
  };

  return (
    <section
      ref={sectionRef}
      id="models-matrix"
      className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#050507] border-t border-white/5 relative select-none"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#A1A4AE] block mb-2 font-bold">
            UNIVERSAL MODEL POLICY
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-orbitron font-bold tracking-tight text-white">
            Every Model. Every Plan.
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-white/60 font-sans max-w-xl mx-auto leading-relaxed">
            Choose any supported model. Your subscription determines how much premium AI usage is included, with zero paywalled models.
          </p>

          {/* Universal Model Roster Badges */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
            {[
              { name: "GPT-6 Astra", type: "OpenAI Frontier" },
              { name: "Fabel 5.1", type: "Code Synthesis" },
              { name: "Claude OPUS 5.5", type: "Frontier Logic" },
              { name: "Gemini 3.8 Flash", type: "Low Latency" },
              { name: "GPT 6.1 SOL", type: "Language Architecture" },
              { name: "NEXA Edge", type: "Offline Local" },
              { name: "CodeXa AST", type: "Realtime Cache" },
            ].map((m) => (
              <span
                key={m.name}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-[11px] font-mono text-neutral-300"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <strong className="text-white font-medium">{m.name}</strong>
                <span className="text-neutral-500 text-[10px]">({m.type})</span>
              </span>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              href="/models"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/10 hover:bg-white text-white hover:text-black text-xs font-mono font-semibold transition-all border border-white/15"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explore Full Model Catalogue & Token Weights</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Matrix Table Container */}
        <div
          ref={tableRef}
          className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0A0B0E] shadow-2xl"
        >
          <table className="w-full text-left border-collapse font-sans text-xs sm:text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-white/10 bg-[#121317]">
                <th className="py-4 px-6 text-white/80 font-bold uppercase tracking-wider text-[11px] w-1/3">
                  Capability / Usage Dimension
                </th>
                <th className="py-4 px-4 text-center text-white/80 font-semibold w-1/6">
                  <div>Starter</div>
                  <div className="text-[10px] text-white/50 font-mono font-normal">₹328/mo</div>
                </th>
                <th className="py-4 px-4 text-center text-white font-bold bg-white/5 border-x border-white/10 w-1/6">
                  <div className="flex items-center justify-center gap-1">
                    <span>Plus</span>
                    <span className="text-[8px] font-mono px-1.5 py-0.2 rounded bg-white text-black font-bold uppercase">
                      Popular
                    </span>
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono font-normal">₹777/mo</div>
                </th>
                <th className="py-4 px-4 text-center text-white/80 font-semibold w-1/6">
                  <div>Pro</div>
                  <div className="text-[10px] text-white/50 font-mono font-normal">₹1,716/mo</div>
                </th>
                <th className="py-4 px-4 text-center text-white/80 font-semibold w-1/6">
                  <div>Max</div>
                  <div className="text-[10px] text-white/50 font-mono font-normal">₹3,176/mo</div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {USAGE_ROWS.map((row, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-3.5 px-6 font-medium text-neutral-300 text-xs">
                    {row.feature}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {renderValue(row.starter, row.isHighlight)}
                  </td>
                  <td className="py-3.5 px-4 text-center bg-white/[0.03] border-x border-white/10">
                    {renderValue(row.plus, row.isHighlight)}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {renderValue(row.pro, row.isHighlight)}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {renderValue(row.max, row.isHighlight)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footnote */}
        <div className="mt-6 flex items-center justify-between text-[11px] font-mono text-white/40">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-white/50" />
            <span>
              All models consume weighted premium units based on computational latency and provider costs.
            </span>
          </div>
          <div>Zero hard locks • Switch models anytime</div>
        </div>
      </div>
    </section>
  );
}