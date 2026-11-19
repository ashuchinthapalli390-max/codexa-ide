import React from "react";
import type { Metadata } from "next";
import { PageHero } from "@/components/experience/page-kit";
import { ReviewsWall } from "@/components/experience/ReviewsWall";
import { FinalCTA } from "@/components/experience/FinalCTA";

export const metadata: Metadata = {
  title: "Community Reviews",
  description: "Reviews of CodeXa Studio IDE from pre-beta developers.",
};

export default function ReviewsPage() {
  return (
    <div className="bg-black">
      <PageHero
        crumb="Reviews"
        eyebrow="From the pre-beta community"
        title={
          <>
            Built with developers, <span className="text-white/40">reviewed by them.</span>
          </>
        }
        lead="Read what pre-beta developers think, or add your own review in under a minute."
      />
      <ReviewsWall index="01" />
      <FinalCTA />
    </div>
  );
}
