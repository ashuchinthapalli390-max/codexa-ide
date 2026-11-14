import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Zap, ShieldCheck } from "lucide-react";
import { UsageDashboard } from "@/components/usage/UsageDashboard";

export const metadata: Metadata = {
  title: "AI Token Usage & Quotas — CodeXa Studio IDE",
  description: "Track weighted token consumption, concurrency, and model usage limits.",
};

export default function AccountUsagePage() {
  return (
    <div className="pt-28 pb-24 bg-[#000000] text-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex items-center justify-between">
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Account Overview</span>
          </Link>

          <span className="text-[10px] font-mono uppercase text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            Real-time Metering Active
          </span>
        </div>

        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#A1A4AE] font-bold block mb-1">
            RESOURCE ACCOUNTING
          </span>
          <h1 className="text-3xl sm:text-4xl font-orbitron font-bold text-white">
            AI Token Usage &amp; Allowances
          </h1>
          <p className="text-xs sm:text-sm text-white/60 font-sans mt-2 max-w-xl">
            Live consumption breakdown across Gemini, GPT-6 Astra, Fabel 5.1, and offline NEXA models.
          </p>
        </div>

        <UsageDashboard />
      </div>
    </div>
  );
}
