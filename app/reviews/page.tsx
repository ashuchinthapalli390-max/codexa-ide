import React from "react";
import type { Metadata } from "next";
import { CommunityReviewsSection } from "@/components/reviews/CommunityReviewsSection";

export const metadata: Metadata = {
  title: "Community Reviews & Feedback — CodeXa Studio IDE",
  description:
    "Genuine feedback, benchmark reports, and reviews from developers and teams building with CodeXa Studio IDE.",
};

export default function ReviewsPage() {
  return (
    <div className="pt-16 pb-20 bg-[#000000] min-h-screen">
      <CommunityReviewsSection />
    </div>
  );
}
