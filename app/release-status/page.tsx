import React from "react";
import type { Metadata } from "next";
import { PlatformAvailabilitySection } from "@/components/sections/PlatformAvailabilitySection";

export const metadata: Metadata = {
  title: "Platform Release Status — CodeXa Studio IDE",
  description:
    "Official build and release readiness status for Windows, macOS, Linux, and Android platforms.",
};

export default function ReleaseStatusPage() {
  return (
    <div className="pt-16 pb-20 bg-[#000000] min-h-screen">
      <PlatformAvailabilitySection />
    </div>
  );
}
