import React from "react";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { releaseManifest } from "@/lib/releases/manifest";
import { GhostLink, PageHero, PrimaryLink, Section } from "@/components/experience/page-kit";
import { ReleaseHistory } from "@/components/experience/PlatformsTimeline";
import { FinalCTA } from "@/components/experience/FinalCTA";

export const metadata: Metadata = {
  title: "Release Notes",
  description: "Changelog, fixes and known issues for every CodeXa Studio IDE release.",
};

export default function ReleasesPage() {
  const h = releaseManifest.history;
  return (
    <div className="bg-black">
      <PageHero
        crumb="Releases"
        eyebrow={`Latest ${releaseManifest.latestVersion}`}
        title={
          <>
            What&apos;s new <span className="text-white/40">in CodeXa Studio.</span>
          </>
        }
        lead="Highlights, fixes and known issues for each build, newest first."
        actions={
          <>
            <PrimaryLink href="/download">
              Download latest <ArrowRight className="h-4 w-4" />
            </PrimaryLink>
            <GhostLink href="/release-status">Release status</GhostLink>
          </>
        }
        stats={[
          { value: String(h.length), label: "Releases" },
          { value: String(h.reduce((n, r) => n + r.highlights.length, 0)), label: "Highlights" },
          { value: String(h.reduce((n, r) => n + r.fixes.length, 0)), label: "Fixes" },
          { value: releaseManifest.officialLaunchDate.split(" ").slice(1).join(" "), label: "Launch" },
        ]}
      />
      <Section className="!pt-0">
        <ReleaseHistory />
      </Section>
      <FinalCTA />
    </div>
  );
}
