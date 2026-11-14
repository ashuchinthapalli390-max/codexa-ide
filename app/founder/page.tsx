import React from "react";
import type { Metadata } from "next";
import { FounderControlView, FounderTab } from "@/components/founder/FounderControlView";

export const metadata: Metadata = {
  title: "Founder Control Center | CodeXa Studio IDE",
  description: "Master governance console for CodeXa Agency leadership, usage limits, and secure releases.",
};

export default function FounderPage({
  searchParams,
}: {
  searchParams?: { tab?: string };
}) {
  const initialTab = (searchParams?.tab as FounderTab) || "overview";
  return <FounderControlView initialTab={initialTab} />;
}
