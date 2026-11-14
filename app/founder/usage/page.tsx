import React from "react";
import type { Metadata } from "next";
import { FounderControlView } from "@/components/founder/FounderControlView";

export const metadata: Metadata = {
  title: "Founder Usage Control | CodeXa Studio IDE",
  description: "Configure role-based AI token allowances, daily ceilings, and concurrency limits.",
};

export default function FounderUsagePage() {
  return <FounderControlView initialTab="usage_control" />;
}
