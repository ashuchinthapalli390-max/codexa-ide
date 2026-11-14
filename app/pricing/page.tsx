import React from "react";
import { SubscriptionsPricingSection } from "@/components/sections/SubscriptionsPricingSection";
import { ModelAccessMatrix } from "@/components/pricing/ModelAccessMatrix";
import { FAQSection } from "@/components/sections/FAQSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing & Plans — CodeXa Studio IDE",
  description:
    "Pre-beta subscription pricing in INR for Starter, Plus, Pro, and Max. Includes 20% launch discount and model access matrix.",
};

export default function PricingPage() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-[#000000]">
      <SubscriptionsPricingSection />
      <ModelAccessMatrix />
      <FAQSection />
    </div>
  );
}

