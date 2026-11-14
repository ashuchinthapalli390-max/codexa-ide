import React from "react";
import type { Metadata } from "next";
import { FounderControlView } from "@/components/founder/FounderControlView";

export const metadata = {
  title: "Access Requests & Approvals | CodeXa Studio IDE",
  description: "Review and approve intern sandbox allocations and temporary quota overrides.",
};

export default function FounderRequestsPage() {
  return <FounderControlView initialTab="requests" />;
}
