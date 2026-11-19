import React from "react";
import type { Metadata } from "next";
import { releaseManifest } from "@/lib/releases/manifest";
import { PageHero } from "@/components/experience/page-kit";
import { DownloadCenter } from "@/components/experience/DownloadCenter";
import { PlatformsTimeline } from "@/components/experience/PlatformsTimeline";
import { FinalCTA } from "@/components/experience/FinalCTA";

export const metadata: Metadata = {
  title: "Download",
  description: "Download CodeXa Studio IDE for Windows and Android, verify SHA-256 checksums, and get notified for macOS, Linux and iOS.",
};

export default function DownloadPage() {
  const platforms = Object.values(releaseManifest.platforms);
  return (
    <div className="bg-black">
      <PageHero
        crumb="Download"
        eyebrow={`Latest build ${releaseManifest.latestVersion}`}
        title={
          <>
            Get CodeXa Studio. <span className="text-white/40">Verified builds only.</span>
          </>
        }
        lead="We detect your platform automatically. Every installer is published with a SHA-256 checksum so you can confirm it has not been tampered with."
        stats={[
          { value: String(platforms.length), label: "Platforms" },
          { value: String(platforms.filter((p) => p.status === "available").length), label: "Public now" },
          { value: String(platforms.filter((p) => p.status === "preview").length), label: "In preview" },
          { value: "SHA-256", label: "Integrity check" },
        ]}
      />
      <DownloadCenter index="01" />
      <PlatformsTimeline index="02" showLinks={false} />
      <FinalCTA />
    </div>
  );
}
