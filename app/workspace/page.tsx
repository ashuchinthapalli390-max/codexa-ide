import React from "react";
import type { Metadata } from "next";
import { IDEWorkbench } from "@/components/workspace/IDEWorkbench";
import { Button } from "@/components/ui/Button";
import { Download, Terminal, Sparkles, Sliders } from "lucide-react";

export const metadata: Metadata = {
  title: "Interactive IDE Workspace",
  description:
    "Test-drive the in-browser simulated CodeXa Studio IDE workspace: explore files, test simulated terminal commands, inspect AI diffs, and switch themes.",
};

export default function WorkspacePage() {
  return (
    <div className="pt-28 pb-20 bg-[#000000]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs sm:text-sm font-sans font-medium uppercase tracking-[2px] text-[#9CA3AF] block">
              FULL IN-BROWSER INTERACTIVE SHOWCASE
            </span>
            <h1 className="text-3xl sm:text-5xl font-orbitron font-bold tracking-tight text-white leading-tight">
              The CodeXa <span className="text-white">Studio Workbench.</span>
            </h1>
            <p className="text-sm sm:text-base text-white/70 font-sans leading-relaxed">
              Explore the real layout of CodeXa Studio IDE. Click through project explorer files, switch AI modes (Chat, Plan, Agent, Debug), test virtual terminal commands, and observe responsive live previews.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="primary" size="md" href="/download" leftIcon={<Download className="w-4 h-4" />}>
              Download CodeXa IDE
            </Button>
          </div>
        </div>
      </div>

      {/* Main Large Dominant IDE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <IDEWorkbench
          initialFile="src/agents/autonomous_agent.ts"
          initialMode="agent"
          showWindowControls={true}
          className="w-full"
        />

        {/* Feature Highlights beneath workbench */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
          <div className="p-5 rounded-xl bg-[#121316] border border-white/10 space-y-2">
            <div className="text-[10px] text-white/50 uppercase font-bold flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-white" /> Interactive Virtual Shell
            </div>
            <div className="text-sm font-bold text-white">Simulated Process Execution</div>
            <p className="text-white/70 font-sans text-xs">
              Type <code className="text-white bg-black/40 px-1 py-0.5 rounded">help</code>, <code className="text-white bg-black/40 px-1 py-0.5 rounded">models</code>, <code className="text-white bg-black/40 px-1 py-0.5 rounded">build</code>, or <code className="text-white bg-black/40 px-1 py-0.5 rounded">git status</code> into the terminal prompt.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#121316] border border-white/10 space-y-2">
            <div className="text-[10px] text-white/50 uppercase font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-white" /> AI Panel Modes
            </div>
            <div className="text-sm font-bold text-white">Chat, Plan, Agent, Debug</div>
            <p className="text-white/70 font-sans text-xs">
              Switch between reasoning modes to see how CodeXa generates unified diffs and breaks tasks into testable verification gates.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#121316] border border-white/10 space-y-2">
            <div className="text-[10px] text-white/50 uppercase font-bold flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-white" /> Dynamic Theme Engine
            </div>
            <div className="text-sm font-bold text-white">Realtime Color Mapping</div>
            <p className="text-white/70 font-sans text-xs">
              Select Obsidian Dark, Pure Black (OLED), Midnight Slate, Tokyo Night, or Clean Light from the top title bar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
