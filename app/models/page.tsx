import React from "react";
import type { Metadata } from "next";
import { AI_MODELS } from "@/lib/ai/models";
import { PageHero } from "@/components/experience/page-kit";
import { ModelConstellation } from "@/components/experience/ModelConstellation";
import { ModelTable } from "@/components/experience/sections-extra";
import { UsageCalculator } from "@/components/experience/UsageCalculator";
import { FinalCTA } from "@/components/experience/FinalCTA";

export const metadata: Metadata = {
  title: "AI Model Catalogue",
  description: "Every model in the CodeXa router: providers, context windows, unit weights and plan availability.",
};

export default function ModelsPage() {
  const models = AI_MODELS.filter((m) => m.enabled);
  const maxWeight = Math.max(...models.map((m) => m.unitWeight));
  return (
    <div className="bg-black">
      <PageHero
        crumb="Models"
        eyebrow="Model catalogue"
        title={
          <>
            Every model, <span className="text-white/40">every number.</span>
          </>
        }
        lead="Context windows, unit weights and availability for each model in the CodeXa router. Explore them in 3D, sort the table, then estimate your monthly usage."
        stats={[
          { value: String(models.length), label: "Models" },
          { value: String(new Set(models.map((m) => m.provider)).size), label: "Providers" },
          { value: "1M", label: "Largest context" },
          { value: `${maxWeight}×`, label: "Highest weight" },
        ]}
      />
      <ModelConstellation index="01" />
      <ModelTable index="02" />
      <UsageCalculator index="03" />
      <FinalCTA />
    </div>
  );
}
