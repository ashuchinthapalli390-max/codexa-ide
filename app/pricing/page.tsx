import React from "react";
import type { Metadata } from "next";
import { SUBSCRIPTION_PLANS } from "@/lib/pricing/plans";
import { PageHero } from "@/components/experience/page-kit";
import { PricingDeck } from "@/components/experience/PricingDeck";
import { UsageCalculator } from "@/components/experience/UsageCalculator";
import { PlanMatrix } from "@/components/experience/sections-extra";
import { FaqExplorer } from "@/components/experience/FaqExplorer";
import { FinalCTA } from "@/components/experience/FinalCTA";

export const metadata: Metadata = {
  title: "Pricing & Plans",
  description: "Starter, Plus, Pro and Max plans in INR with frontier AI models on every plan, a usage estimator and a full plan matrix.",
};

export default function PricingPage() {
  const s = SUBSCRIPTION_PLANS;
  return (
    <div className="bg-black">
      <PageHero
        crumb="Pricing"
        eyebrow="Plans in INR · 20% off your first month"
        title={
          <>
            Simple plans. <span className="text-white/40">Serious models.</span>
          </>
        }
        lead="Reserve a plan today with no payment. Every plan includes unlimited local AI and access to frontier models; you only choose how much premium volume you need."
        stats={[
          { value: `₹${s.STARTER.pricing.monthlyDiscountedInr}`, label: "First month from" },
          { value: "4", label: "Plans" },
          { value: `${s.STARTER.tokenAllowance.monthlyPremiumUnits / 1000}k–${s.MAX.tokenAllowance.monthlyPremiumUnits / 1_000_000}M`, label: "Premium units / month" },
          { value: "₹0", label: "Surprise overages" },
        ]}
      />
      <PricingDeck index="01" />
      <UsageCalculator index="02" />
      <PlanMatrix index="03" />
      <FaqExplorer index="04" initialCategory="presale" />
      <FinalCTA />
    </div>
  );
}
