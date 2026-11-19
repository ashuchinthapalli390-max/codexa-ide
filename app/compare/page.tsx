import React from "react";
import type { Metadata } from "next";
import { PageHero } from "@/components/experience/page-kit";
import { CompareSection } from "@/components/experience/CompareSection";
import { HighlightsStack } from "@/components/experience/HighlightsStack";
import { FinalCTA } from "@/components/experience/FinalCTA";

export const metadata: Metadata = {
  title: "Compare",
  description: "CodeXa Studio IDE compared with Cursor, Google Antigravity and VS Code on architecture, AI access, workflow, privacy and price.",
};

export default function ComparePage() {
  return (
    <div className="bg-black">
      <PageHero
        crumb="Compare"
        eyebrow="Honest comparison"
        title={
          <>
            CodeXa vs <span className="text-white/40">the editors you know.</span>
          </>
        }
        lead="How CodeXa Studio compares with Cursor, Google Antigravity and VS Code with Copilot — across architecture, AI access, everyday workflow, privacy and price."
      />
      <CompareSection index="01" />
      <HighlightsStack index="02" />
      <FinalCTA />
    </div>
  );
}
