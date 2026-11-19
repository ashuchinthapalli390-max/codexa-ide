import React from "react";
import type { Metadata } from "next";
import { ArrowRight, CloudOff, Eye, KeyRound, Scale, ShieldCheck, Shuffle } from "lucide-react";
import { AI_MODELS } from "@/lib/ai/models";
import { FeatureGrid, GhostLink, PageHero, PrimaryLink, Section, ZoomThrough } from "@/components/experience/page-kit";
import { SectionHeading } from "@/components/experience/primitives";
import { AIModes } from "@/components/experience/sections-extra";
import { ModelConstellation } from "@/components/experience/ModelConstellation";
import { FinalCTA } from "@/components/experience/FinalCTA";

export const metadata: Metadata = {
  title: "CodeXa AI",
  description: "Chat, Plan, Agent and Debug modes across nine models, with unlimited on-device AI, BYOK and a verification gate on every diff.",
};

const TRUST = [
  { icon: <CloudOff className="h-5 w-5" />, title: "Offline when you want", body: "NEXA Edge runs entirely on your machine. Turn off the network and keep coding with AI." },
  { icon: <KeyRound className="h-5 w-5" />, title: "Bring your own keys", body: "Plug in OpenAI, Anthropic, Google or xAI keys. They are stored only in your OS keychain." },
  { icon: <ShieldCheck className="h-5 w-5" />, title: "Verified output", body: "Fabel 5.1 checks each AI diff for type soundness and compiler invariants before you accept it." },
  { icon: <Scale className="h-5 w-5" />, title: "Transparent metering", body: "Units = tokens × model weight. Weights are published, and local models always cost zero." },
  { icon: <Shuffle className="h-5 w-5" />, title: "Automatic fallback", body: "When a model retires, requests route to its successor automatically — no broken workflows." },
  { icon: <Eye className="h-5 w-5" />, title: "No training on your code", body: "Only the minimum context needed is sent to cloud models, over TLS. Zero telemetry by default." },
];

export default function AIPage() {
  const models = AI_MODELS.filter((m) => m.enabled);
  return (
    <div className="bg-black">
      <PageHero
        crumb="CodeXa AI"
        eyebrow="Multi-model AI, built in"
        title={
          <>
            The right model <span className="text-white/40">for every keystroke.</span>
          </>
        }
        lead="CodeXa routes each request to the model that suits it — fast Flash models for edits, frontier models for refactors and planning, and on-device NEXA Edge when you are offline."
        actions={
          <>
            <PrimaryLink href="/models">
              Browse the models <ArrowRight className="h-4 w-4" />
            </PrimaryLink>
            <GhostLink href="/pricing">See plans</GhostLink>
          </>
        }
        stats={[
          { value: String(models.length), label: "Models" },
          { value: String(models.filter((m) => m.type === "FREE_UNLIMITED").length), label: "Free & unlimited" },
          { value: "4", label: "Work modes" },
          { value: "1M", label: "Max context" },
        ]}
      />
      <AIModes index="01" />
      <ZoomThrough word="Nine models." caption="One router decides" />
      <ModelConstellation index="02" />
      <Section id="trust">
        <SectionHeading index="03" eyebrow="Privacy & control" title={<>Powerful AI, <span className="text-white/40">on your terms.</span></>} />
        <div className="mt-12">
          <FeatureGrid items={TRUST} />
        </div>
      </Section>
      <FinalCTA />
    </div>
  );
}
