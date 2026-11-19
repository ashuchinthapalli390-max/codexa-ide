import React from "react";
import type { Metadata } from "next";
import { ALL_FAQS } from "@/lib/content/faq";
import { PageHero } from "@/components/experience/page-kit";
import { FaqExplorer } from "@/components/experience/FaqExplorer";
import { FinalCTA } from "@/components/experience/FinalCTA";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers about CodeXa Studio IDE plans, AI models, billing, offline use, BYOK and platform availability.",
};

export default function FAQPage() {
  return (
    <div className="bg-black">
      <PageHero
        crumb="FAQ"
        eyebrow={`${ALL_FAQS.length} answers`}
        title={
          <>
            Questions, <span className="text-white/40">answered.</span>
          </>
        }
        lead="Plans, pre-booking, AI usage, billing, offline mode and platforms. Search or filter to jump straight to what you need."
      />
      <FaqExplorer index="01" expanded showPageLink={false} />
      <FinalCTA />
    </div>
  );
}
