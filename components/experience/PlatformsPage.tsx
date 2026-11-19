import React from "react";
import { ArrowRight, Cloud, Laptop, RefreshCw, Smartphone } from "lucide-react";
import { releaseManifest } from "@/lib/releases/manifest";
import { FeatureGrid, PageHero, PrimaryLink, Section } from "./page-kit";
import { SectionHeading } from "./primitives";
import { PlatformsTimeline } from "./PlatformsTimeline";
import { FinalCTA } from "./FinalCTA";

/** Shared body for /platforms and /release-status. */
export function PlatformsPage({ crumb }: { crumb: string }) {
  return (
    <div className="bg-black">
      <PageHero
        crumb={crumb}
        eyebrow={`Latest build ${releaseManifest.latestVersion}`}
        title={
          <>
            Your workspace, <span className="text-white/40">on every screen.</span>
          </>
        }
        lead="Windows leads the preview, the Android companion is live, and macOS, Linux and iOS follow. One Agency account keeps your plan and settings in sync everywhere."
        actions={
          <PrimaryLink href="/download">
            Go to downloads <ArrowRight className="h-4 w-4" />
          </PrimaryLink>
        }
      />
      <PlatformsTimeline index="01" />
      <Section id="sync">
        <SectionHeading index="02" eyebrow="Desktop to mobile" title={<>Start on desktop. <span className="text-white/40">Check in from your phone.</span></>} />
        <div className="mt-12">
          <FeatureGrid
            items={[
              { icon: <Laptop className="h-5 w-5" />, title: "Full IDE on desktop", body: "Editor, agents, terminal matrix and live preview on Windows today, with macOS and Linux next." },
              { icon: <Smartphone className="h-5 w-5" />, title: "Mobile companion", body: "Review agent runs, read diffs and follow builds from the Android app; iOS is planned." },
              { icon: <RefreshCw className="h-5 w-5" />, title: "One account, synced", body: "Sign in once with CodeXa Agency and your subscription and settings follow you across devices." },
              { icon: <Cloud className="h-5 w-5" />, title: "Release notifications", body: "Leave your email on the download page and we will tell you when your platform ships." },
            ]}
          />
        </div>
      </Section>
      <FinalCTA />
    </div>
  );
}
