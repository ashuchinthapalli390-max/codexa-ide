import React from "react";
import { UsageDashboard } from "@/components/usage/UsageDashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Usage & Limits — CodeXa Studio IDE",
  description: "Monitor authoritative monthly token quotas, model consumption, and fair-use allowances.",
};

export default function UsagePage() {
  return (
    <div className="min-h-screen bg-[#000000] py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <UsageDashboard />
      </div>
    </div>
  );
}

