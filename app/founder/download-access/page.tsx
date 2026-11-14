import React from "react";
import type { Metadata } from "next";
import { FounderControlView } from "@/components/founder/FounderControlView";

export const metadata = {
  title: "Download Access Governance | CodeXa Studio IDE",
  description: "Configure role-gated distribution channels for internal preview and stable releases.",
};

export default function FounderDownloadAccessPage() {
  return <FounderControlView initialTab="download_access" />;
}
