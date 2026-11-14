import React from "react";
import { SubscriptionsPricingSection } from "@/components/sections/SubscriptionsPricingSection";
import { ModelAccessMatrix } from "@/components/pricing/ModelAccessMatrix";
import { FAQSection } from "@/components/sections/FAQSection";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { resolveInitialRoleAndEntitlement } from "@/lib/services/user-service";
import { isLeadershipRole } from "@/lib/auth/roles";

export const metadata: Metadata = {
  title: "Pricing & Plans — CodeXa Studio IDE",
  description:
    "Pre-beta subscription pricing in INR for Starter, Plus, Pro, and Max. Includes 20% launch discount and model access matrix.",
};

export default function PricingPage() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get("cxa_session")?.value;
  let serverIsLeadership = false;
  if (sessionCookie) {
    try {
      const decoded = decodeURIComponent(sessionCookie);
      const parsed = JSON.parse(decoded);
      if (parsed?.email) {
        const { role } = resolveInitialRoleAndEntitlement(parsed.email);
        serverIsLeadership = isLeadershipRole(role);
      }
    } catch {
      // ignore parse error
    }
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#000000]">
      <SubscriptionsPricingSection initialIsLeadership={serverIsLeadership} />
      <ModelAccessMatrix />
      <FAQSection />
    </div>
  );
}

