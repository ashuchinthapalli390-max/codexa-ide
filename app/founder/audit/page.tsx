import React from "react";
import type { Metadata } from "next";
import { FounderControlView } from "@/components/founder/FounderControlView";

export const metadata = {
  title: "Governance Audit Logs | CodeXa Studio IDE",
  description: "Immutable chronological trail of administrative policy adjustments and quota allocations.",
};

export default function FounderAuditPage() {
  return <FounderControlView initialTab="audit_logs" />;
}
