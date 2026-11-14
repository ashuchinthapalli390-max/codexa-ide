import React from "react";
import type { Metadata } from "next";
import { CompetitorComparisonSection } from "@/components/sections/CompetitorComparisonSection";

export const metadata: Metadata = {
  title: "Competitor Comparison — CodeXa vs Cursor, Antigravity & VS Code",
  description:
    "An objective, evidence-based architectural and financial comparison of CodeXa Studio IDE vs Cursor, Google Antigravity, and Visual Studio Code.",
};

export default function ComparePage() {
  return (
    <div className="pt-16 pb-20 bg-[#000000] min-h-screen">
      <CompetitorComparisonSection />
    </div>
  );
}
