import React from "react";
import type { Metadata } from "next";
import { FounderControlView } from "@/components/founder/FounderControlView";

export const metadata = {
  title: "Agency Member Management | CodeXa Studio IDE",
  description: "Configure sponsored access and project allowances for Agency engineers.",
};

export default function FounderMembersPage() {
  return <FounderControlView initialTab="agency_members" />;
}
