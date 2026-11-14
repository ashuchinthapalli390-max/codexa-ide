import React from "react";
import { HeroSection } from "@/components/hero/HeroSection";
import { TechnologyStrip } from "@/components/sections/TechnologyStrip";
import { UnlimitedCodingSection } from "@/components/sections/UnlimitedCodingSection";
import { HorizontalTicker } from "@/components/sections/HorizontalTicker";
import { SubscriptionsPricingSection } from "@/components/sections/SubscriptionsPricingSection";
import { EngineeringGraphsSection } from "@/components/sections/EngineeringGraphsSection";
import { AIEcosystemSection } from "@/components/sections/AIEcosystemSection";
import { ModelAccessMatrix } from "@/components/pricing/ModelAccessMatrix";
import { WorkflowInfrastructureSection } from "@/components/sections/WorkflowInfrastructureSection";
import { BuiltForPerformanceSection } from "@/components/sections/BuiltForPerformanceSection";
import { CompetitorComparisonSection } from "@/components/sections/CompetitorComparisonSection";
import { CommunityReviewsSection } from "@/components/reviews/CommunityReviewsSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { RelatedArticlesSection } from "@/components/sections/RelatedArticlesSection";
import { PlatformAvailabilitySection } from "@/components/sections/PlatformAvailabilitySection";

export default function HomePage() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-[#000000]">
      {/* 1. DARK: Homepage Hero with Kinetic Typography & Dominant Floating IDE Workspace */}
      <HeroSection />

      {/* 2. DARK: Compact Platform, Model Ecosystem & Developer Workbench Strip */}
      <TechnologyStrip />

      {/* 3. DARK: CodeXa Native AI Unlimited Coding Value Proposition */}
      <UnlimitedCodingSection />

      {/* 4. LIGHT TRANSITION BRIDGE: Infinite Horizontal Ticker */}
      <HorizontalTicker />

      {/* 5. LIGHT (bg-gray-300): Subscription Pricing (Standard by default + 20% Discount with Slide-Over Drawer) */}
      <SubscriptionsPricingSection />

      {/* 6. LIGHT (bg-gray-300): Interactive Engineering Graphs ("Built for Engineers. Designed for Flow.") */}
      <EngineeringGraphsSection />

      {/* 7. DARK: CodeXa Agency Multi-Provider AI Ecosystem (OpenAI GPT-6 Astra, Claude, Gemini, Grok, NEXA) */}
      <AIEcosystemSection />

      {/* 8. DARK: Universal AI Model Access & Usage Comparison Matrix ("Every Model. Every Plan.") */}
      <ModelAccessMatrix />

      {/* 9. DARK: Software Workflow Infrastructure (IDE -> AI Assistance -> Diff -> Live Preview) */}
      <WorkflowInfrastructureSection />

      {/* 10. LIGHT: Asymmetrical Bento Grid ("Built for Performance") */}
      <BuiltForPerformanceSection />

      {/* 11. DARK: Full-Width Competitor & Price Comparison Matrix (CodeXa vs Cursor vs Antigravity vs VS Code) */}
      <CompetitorComparisonSection />

      {/* 12. LIGHT-GRAY (#D0D3DA): Community Feedback with Opposite-Direction Review Marquees */}
      <CommunityReviewsSection />

      {/* 13. DARK: Comprehensive Developer FAQs & Pre-Sale Subscription Accordion (18 Pre-Sale Answers) */}
      <FAQSection />

      {/* 14. LIGHT: Technical Articles & Documentation Knowledge Base */}
      <RelatedArticlesSection />

      {/* 15. DARK: Platform Availability & Readiness ("CodeXa Is Coming Soon") */}
      <PlatformAvailabilitySection />
    </div>
  );
}
