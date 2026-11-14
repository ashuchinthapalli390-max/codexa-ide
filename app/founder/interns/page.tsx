import React from "react";
import type { Metadata } from "next";
import { FounderControlView } from "@/components/founder/FounderControlView";

export const metadata = {
  title: "Intern Cohorts Governance | CodeXa Studio IDE",
  description: "Manage intern cohorts, task-scoped IDE allocations, and sandbox safety boundaries.",
};

export default function FounderInternsPage() {
  return <FounderControlView initialTab="interns" />;
}
