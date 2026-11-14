import React from "react";
import { AdminPricingPanel } from "@/components/admin/AdminPricingPanel";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Pricing & Campaign Controls — CodeXa Agency",
  description: "Server-side administration panel for plan pricing, token quotas, and campaign deadlines.",
};

export default function AdminPlansPage() {
  return (
    <div className="min-h-screen bg-[#000000] py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <AdminPricingPanel />
      </div>
    </div>
  );
}

