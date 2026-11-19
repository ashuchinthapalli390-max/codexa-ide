import React from "react";
import type { Metadata } from "next";
import { ArrowRight, Boxes, Cpu, GitBranch, KeyRound, Laptop, Palette, ShieldCheck, Terminal, Zap } from "lucide-react";
import { FeatureGrid, GhostLink, PageHero, PrimaryLink, Section, VelocityMarquee } from "@/components/experience/page-kit";
import { SectionHeading } from "@/components/experience/primitives";
import { HighlightsStack } from "@/components/experience/HighlightsStack";
import { ArchitectureStack } from "@/components/experience/ArchitectureStack";
import { WorkflowRail } from "@/components/experience/WorkflowRail";
import { ThemeShowcase } from "@/components/experience/sections-extra";
import { FinalCTA } from "@/components/experience/FinalCTA";

export const metadata: Metadata = {
  title: "Features",
  description: "AST-native editor, multi-model AI router, verification gate, live preview, terminal matrix, visual Git and local-first privacy.",
};

const FEATURES = [
  { icon: <Zap className="h-5 w-5" />, title: "AST-native indexing", body: "Your repository is held as an in-memory symbol graph, so lookups and context building take under 50 ms.", tag: "Core" },
  { icon: <Cpu className="h-5 w-5" />, title: "Multi-model router", body: "Nine models behind one switch. Each request goes to the model that fits it, metered by transparent weights.", tag: "AI" },
  { icon: <ShieldCheck className="h-5 w-5" />, title: "Verification gate", body: "Fabel 5.1 checks every AI diff for type soundness and compiler invariants before you see it.", tag: "Safety" },
  { icon: <Laptop className="h-5 w-5" />, title: "Live dual preview", body: "Desktop and mobile viewports render your change as it is written, with no ports to open.", tag: "Runtime" },
  { icon: <Terminal className="h-5 w-5" />, title: "Terminal matrix", body: "PowerShell, Bash and Zsh sessions side by side, with command suggestions from the agent.", tag: "Tools" },
  { icon: <GitBranch className="h-5 w-5" />, title: "Visual Git", body: "Branch graph, hunk-level staging and readable AI commit summaries for every change.", tag: "Tools" },
  { icon: <KeyRound className="h-5 w-5" />, title: "BYOK keychain vault", body: "Use your own provider keys. They live only in your OS keychain and never reach CodeXa servers.", tag: "Privacy" },
  { icon: <Boxes className="h-5 w-5" />, title: "MCP servers", body: "Connect databases, logs and internal tools through Model Context Protocol so the agent can use them.", tag: "Extend" },
  { icon: <Palette className="h-5 w-5" />, title: "Theme engine", body: "Obsidian Dark, Pure Black OLED, Midnight Slate, Tokyo Night and Clean Light — or your own palette.", tag: "Comfort" },
];

export default function FeaturesPage() {
  return (
    <div className="bg-black">
      <PageHero
        crumb="Features"
        eyebrow="Everything in one window"
        title={
          <>
            An editor that <span className="text-white/40">understands your code.</span>
          </>
        }
        lead="CodeXa Studio combines an AST-native editor, a multi-model AI router, a verification gate and a live runtime — designed to work as one system rather than a pile of plugins."
        actions={
          <>
            <PrimaryLink href="/workspace">
              Try the workspace demo <ArrowRight className="h-4 w-4" />
            </PrimaryLink>
            <GhostLink href="/pricing">See plans</GhostLink>
          </>
        }
        stats={[
          { value: "<50ms", label: "AST indexing" },
          { value: "9", label: "AI models" },
          { value: "3", label: "Terminal shells" },
          { value: "5", label: "Built-in themes" },
        ]}
      />
      <Section id="capabilities">
        <SectionHeading index="01" eyebrow="Capabilities" title={<>Nine building blocks, <span className="text-white/40">one workspace.</span></>} />
        <div className="mt-12">
          <FeatureGrid items={FEATURES} />
        </div>
      </Section>
      <VelocityMarquee rows={["Index · Plan · Generate · ", "Verify · Preview · Ship · "]} />
      <WorkflowRail />
      <HighlightsStack index="03" />
      <ArchitectureStack index="04" />
      <ThemeShowcase index="05" />
      <FinalCTA />
    </div>
  );
}
