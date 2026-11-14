import React from "react";
import type { Metadata } from "next";
import { FounderControlView } from "@/components/founder/FounderControlView";

export const metadata = {
  title: "Release Management | CodeXa Studio IDE",
  description: "Manage cross-platform binary distributions, build hashes, and notarization status.",
};

export default function FounderReleasesPage() {
  return <FounderControlView initialTab="release_management" />;
}
