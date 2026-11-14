import React from "react";
import type { Metadata } from "next";
import { DownloadSection } from "@/components/download/DownloadSection";

export const metadata: Metadata = {
  title: "Official Download Center",
  description:
    "Download verified CodeXa Studio IDE binaries for Windows, macOS, Linux, and Android APK.",
};

export default function DownloadsPage() {
  return (
    <div className="pt-20 pb-16">
      <DownloadSection />
    </div>
  );
}
