import React from "react";
import type { Metadata } from "next";
import { Palette, Sparkles, Terminal } from "lucide-react";
import { IDEWorkbench } from "@/components/workspace/IDEWorkbench";
import { FeatureGrid, PageHero, RiseIn3D, Section } from "@/components/experience/page-kit";
import { SectionHeading } from "@/components/experience/primitives";
import { FinalCTA } from "@/components/experience/FinalCTA";

export const metadata: Metadata = {
  title: "Interactive Workspace",
  description: "Test-drive the CodeXa Studio workbench in your browser: explorer, AI modes, terminal and themes.",
};

export default function WorkspacePage() {
  return (
    <div className="bg-black">
      <PageHero
        crumb="Workspace demo"
        eyebrow="Runs right here in your browser"
        title={
          <>
            Take the workbench <span className="text-white/40">for a spin.</span>
          </>
        }
        lead="Click through files, switch AI modes, type commands into the terminal and change themes. It is a simulation of the real layout — no install needed."
      />
      <div className="mx-auto -mt-10 max-w-[1280px] px-2 sm:px-6 lg:px-8">
        <RiseIn3D className="!mt-0">
          <IDEWorkbench initialFile="src/agents/autonomous_agent.ts" initialMode="agent" showWindowControls className="w-full" />
        </RiseIn3D>
      </div>
      <Section>
        <SectionHeading index="01" eyebrow="Things to try" title={<>Three places <span className="text-white/40">to start.</span></>} />
        <div className="mt-10">
          <FeatureGrid
            items={[
              { icon: <Terminal className="h-5 w-5" />, title: "Type into the terminal", body: "Try help, models, build or git status in the terminal prompt." },
              { icon: <Sparkles className="h-5 w-5" />, title: "Switch AI modes", body: "Flip between Chat, Plan, Agent and Debug to see how each mode answers." },
              { icon: <Palette className="h-5 w-5" />, title: "Change the theme", body: "Pick Obsidian Dark, Pure Black, Midnight Slate, Tokyo Night or Clean Light from the title bar." },
            ]}
          />
        </div>
      </Section>
      <FinalCTA />
    </div>
  );
}
