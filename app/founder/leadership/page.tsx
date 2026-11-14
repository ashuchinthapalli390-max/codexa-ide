import React from "react";
import type { Metadata } from "next";
import { FounderControlView } from "@/components/founder/FounderControlView";

export const metadata = {
  title: "Founder Leadership Access | CodeXa Studio IDE",
  description: "Manage verified CodeXa Agency leadership registry and assigned policies.",
};

export default function FounderLeadershipPage() {
  return <FounderControlView initialTab="leadership" />;
}
