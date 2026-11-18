import React from "react";
import { Hero3D } from "@/components/experience/Hero3D";
import { Overview } from "@/components/experience/Overview";
import { WorkflowRail } from "@/components/experience/WorkflowRail";
import { ArchitectureStack } from "@/components/experience/ArchitectureStack";
import { ModelConstellation } from "@/components/experience/ModelConstellation";
import { UsageCalculator } from "@/components/experience/UsageCalculator";
import { PricingDeck } from "@/components/experience/PricingDeck";
import { CompareSection } from "@/components/experience/CompareSection";
import { PlatformsTimeline } from "@/components/experience/PlatformsTimeline";
import { FaqExplorer } from "@/components/experience/FaqExplorer";
import { FinalCTA } from "@/components/experience/FinalCTA";
import { ChapterRail } from "@/components/experience/ChapterRail";

/**
 * Homepage — scroll-driven 3D experience.
 * Pinned scenes (hero, workflow, architecture) use position: sticky, so no
 * ancestor may set overflow: hidden/auto or a transform/filter.
 */
export default function HomePage() {
  return (
    <div className="relative w-full bg-black">
      <ChapterRail />
      <Hero3D />
      <Overview />
      <WorkflowRail />
      <ArchitectureStack />
      <ModelConstellation />
      <UsageCalculator />
      <PricingDeck />
      <CompareSection />
      <PlatformsTimeline />
      <FaqExplorer />
      <FinalCTA />
    </div>
  );
}
