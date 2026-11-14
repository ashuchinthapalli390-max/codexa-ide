"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Sparkles,
  Bot,
  ListTodo,
  FileCode2,
  Bug,
  CheckCircle2,
  Cpu,
} from "lucide-react";

type AIMode = "chat" | "plan" | "agent" | "debug";

interface ModelInfo {
  name: string;
  tagline: string;
  contextWindow: string;
  specialty: string;
  latency: string;
}

const MODELS: Record<string, ModelInfo> = {
  "Astra 6": {
    name: "Astra 6",
    tagline: "Autonomous Systems & Code Synthesis",
    contextWindow: "1M Tokens",
    specialty: "High-reasoning full-stack architecture & diff compilation",
    latency: "Ultra-fast (18ms TTFT)",
  },
  "Fabel 5.1": {
    name: "Fabel 5.1",
    tagline: "Formal Logic & Kernel Correctness",
    contextWindow: "512K Tokens",
    specialty: "Compiler invariants, strict TypeScript typing & AST analysis",
    latency: "Balanced",
  },
  "GPT 5.6 SOL": {
    name: "GPT 5.6 SOL",
    tagline: "Synthesizer & Multi-File Refactor",
    contextWindow: "2M Tokens",
    specialty: "Cross-repository codebase refactoring & dependency graph healing",
    latency: "Fast",
  },
  "GPT 6.1 SOL": {
    name: "GPT 6.1 SOL",
    tagline: "Deep Context Enterprise Ingestion",
    contextWindow: "4M Tokens",
    specialty: "Enterprise monorepo indexing & architectural governance",
    latency: "High Throughput",
  },
  "OPUS 5.5": {
    name: "OPUS 5.5",
    tagline: "Multi-Agent Orchestration",
    contextWindow: "1M Tokens",
    specialty: "Recursive task delegation, validation loops & sandboxed execution",
    latency: "Reasoning Depth",
  },
  NEXA: {
    name: "NEXA",
    tagline: "Local Edge Hardware-Accelerated Model",
    contextWindow: "128K Tokens",
    specialty: "Zero-cloud zero-telemetry local inference on NPU/GPU hardware",
    latency: "Instant (On-Device)",
  },
};

export function AIShowcaseSection() {
  const [activeMode, setActiveMode] = useState<AIMode>("agent");
  const [activeModel, setActiveModel] = useState<string>("Astra 6");

  return (
    <section id="ai" className="py-24 sm:py-32 bg-[#000000] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-sans font-medium text-[#9CA3AF] uppercase tracking-[2px]">
            <Cpu className="w-3.5 h-3.5 text-white" /> Multi-Model Intelligence Suite
          </div>

          <h2 className="text-3xl sm:text-[44px] font-orbitron font-bold tracking-[-1.1px] text-white leading-tight">
            Your code. Your context. <br />
            <span>Your AI.</span>
          </h2>

          <p className="text-[14px] font-sans font-normal text-white/70 leading-[22.75px]">
            CodeXa Studio IDE couples directly with the codebase's Abstract Syntax Tree. Select from high-performance models configured to generate verifiable, lint-passing diffs with zero guesswork.
          </p>
        </div>

        {/* Model Selector Bar (NexCloud #121316 surface) */}
        <div className="mb-10 p-2 rounded-2xl bg-[#121316] border border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 px-3 text-[11px] font-sans font-bold text-white/50 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-white/80" />
            <span>Configured Engine:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {Object.keys(MODELS).map((mName) => (
              <button
                key={mName}
                onClick={() => setActiveModel(mName)}
                className={`px-3.5 py-1.5 rounded-[8px] text-[13px] font-sans font-semibold transition-all ${
                  activeModel === mName
                    ? "bg-white text-[#050506] shadow-sm"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                {mName}
              </button>
            ))}
          </div>
        </div>

        {/* Active Model Specs Strip (NexCloud metric surface #18181D) */}
        <div className="mb-12 grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-[#18181D] border border-white/10 text-xs font-sans">
          <div>
            <span className="text-[10px] text-white/50 uppercase block">Selected Engine</span>
            <span className="text-white font-bold">{MODELS[activeModel].name}</span>
          </div>
          <div>
            <span className="text-[10px] text-white/50 uppercase block">Context Window</span>
            <span className="text-white font-bold">{MODELS[activeModel].contextWindow}</span>
          </div>
          <div>
            <span className="text-[10px] text-white/50 uppercase block">Specialization</span>
            <span className="text-white/70 truncate block">{MODELS[activeModel].specialty}</span>
          </div>
          <div>
            <span className="text-[10px] text-white/50 uppercase block">Inference Profile</span>
            <span className="text-emerald-400 font-bold">{MODELS[activeModel].latency}</span>
          </div>
        </div>

        {/* Interactive Mode Showcase (Chat, Plan, Agent, Debug) */}
        <div className="rounded-2xl border border-white/10 bg-[#121316] overflow-hidden shadow-2xl">
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-white/10 bg-[#15151A] text-xs font-mono uppercase tracking-wider">
            {[
              { id: "chat" as AIMode, label: "01. Chat", icon: <Bot className="w-4 h-4" /> },
              { id: "plan" as AIMode, label: "02. Plan", icon: <ListTodo className="w-4 h-4" /> },
              { id: "agent" as AIMode, label: "03. Agent", icon: <FileCode2 className="w-4 h-4" /> },
              { id: "debug" as AIMode, label: "04. Debug", icon: <Bug className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveMode(tab.id)}
                className={`py-3.5 px-4 flex items-center justify-center gap-2 border-r border-white/10 last:border-r-0 transition-colors ${
                  activeMode === tab.id
                    ? "bg-white/10 text-white font-bold border-b-2 border-white"
                    : "text-white/50 hover:text-white hover:bg-white/[0.02]"
                }`}
              >
                <span className={activeMode === tab.id ? "text-white" : "text-white/50"}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Mode Workflow Demonstrations */}
          <div className="p-6 sm:p-10">
            {activeMode === "chat" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <Badge variant="neutral" size="sm">
                    Project-Aware Dialogue
                  </Badge>
                  <h3 className="text-2xl font-orbitron font-bold text-white">
                    Conversational context grounded in your actual AST.
                  </h3>
                  <p className="text-sm text-white/70 leading-relaxed font-sans">
                    Chat with your codebase. CodeXa indexes types, interfaces, schemas, and configurations without exporting proprietary code to third parties.
                  </p>
                  <ul className="space-y-2 text-xs font-mono text-white/90 pt-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                      <span>Zero hallucination via Symbol-Index graph lookup</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                      <span>Respects <code className="text-white bg-[#18181D] px-1.5 py-0.5 rounded">.codexaignore</code> patterns</span>
                    </li>
                  </ul>
                </div>

                <div className="p-5 rounded-xl bg-[#18181D] border border-white/10 font-mono text-xs space-y-3">
                  <div className="p-3 rounded-lg bg-[#121316] text-white/70">
                    <span className="text-white/50 block text-[10px] uppercase font-bold mb-1">
                      User Prompt
                    </span>
                    "Explain why `verifySignature()` throws on replay packets."
                  </div>
                  <div className="p-3 rounded-lg bg-[#15151A] border border-white/10 text-white/90">
                    <span className="text-white font-bold block text-[10px] uppercase mb-1">
                      {activeModel} Response
                    </span>
                    The nonce cache in <code className="text-white bg-black/40 px-1 py-0.5 rounded">src/auth/token.ts</code> purges tokens after 300 seconds, but your monotonic counter in Redis had an unhandled TTL expiration. Fixed with atomic pipeline refresh.
                  </div>
                </div>
              </div>
            )}

            {activeMode === "plan" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <Badge variant="neutral" size="sm">
                    Autonomous Task Graph
                  </Badge>
                  <h3 className="text-2xl font-orbitron font-bold text-white">
                    Break complex features into verified, atomic milestones.
                  </h3>
                  <p className="text-sm text-white/70 leading-relaxed font-sans">
                    Before touching a single file, CodeXa Plan generates a verifiable dependency graph showing every affected module, test suite, and compilation boundary.
                  </p>
                  <ul className="space-y-2 text-xs font-mono text-white/90 pt-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                      <span>Step-by-step verification gates with rollback checkpoints</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                      <span>Estimated compute token budget and risk score</span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-[#18181D] border border-white/10 font-mono text-xs space-y-2">
                  <div className="text-[10px] uppercase tracking-wider text-white/50 pb-1 border-b border-white/5 font-bold">
                    Plan Blueprint: Add Hardware Key Entitlement Check
                  </div>
                  {[
                    { step: "1. Update AgencyUser schema in lib/auth/agency-auth.ts", ok: true },
                    { step: "2. Implement /api/auth/verify-device HMAC resolver", ok: true },
                    { step: "3. Bind cryptographic machine ID to session cookie", ok: true },
                    { step: "4. Run automated test suite across runner/win32_window", ok: false },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded bg-[#121316] border border-white/5"
                    >
                      <span className={item.ok ? "text-white/90" : "text-white font-bold"}>
                        {item.step}
                      </span>
                      {item.ok ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white font-semibold">
                          In Progress
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeMode === "agent" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <Badge variant="neutral" size="sm">
                    Autonomous Multi-File Diffing
                  </Badge>
                  <h3 className="text-2xl font-orbitron font-bold text-white">
                    Inspect precise unified diffs before applying changes.
                  </h3>
                  <p className="text-sm text-white/70 leading-relaxed font-sans">
                    The Agent mode writes atomic patches, executes linter verification, and displays side-by-side or inline diffs with one-click approval controls.
                  </p>
                  <div className="pt-2 flex items-center gap-3">
                    <Button variant="primary" size="sm">
                      Approve All Proposed Diffs
                    </Button>
                    <Button variant="secondary" size="sm">
                      Reject &amp; Re-Synthesize
                    </Button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#18181D] border border-white/10 font-mono text-xs overflow-x-auto space-y-1">
                  <div className="flex items-center justify-between pb-2 text-[10px] text-white/50 border-b border-white/5">
                    <span>src/engine/session.ts</span>
                    <span className="text-emerald-400 font-bold">+18 lines / -4 lines</span>
                  </div>
                  <div className="py-0.5 text-neutral-500">@@ -42,7 +42,9 @@ export class SessionBridge &#123;</div>
                  <div className="py-0.5 text-red-400 bg-red-950/30 px-1 rounded">-  private keyCache: Map&lt;string, string&gt; = new Map();</div>
                  <div className="py-0.5 text-emerald-400 bg-emerald-950/30 px-1 rounded">+  private keyCache: EncryptedStore = new EncryptedStore();</div>
                  <div className="py-0.5 text-emerald-400 bg-emerald-950/30 px-1 rounded">+  private hardwareFingerprint = resolveDeviceGuid();</div>
                  <div className="py-0.5 text-neutral-300">   public async validateEntitlement(): Promise&lt;boolean&gt; &#123;</div>
                </div>
              </div>
            )}

            {activeMode === "debug" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <Badge variant="neutral" size="sm">
                    Time-Travel Diagnostic Engine
                  </Badge>
                  <h3 className="text-2xl font-orbitron font-bold text-white">
                    Instant error root-cause diagnosis and compiler fix verification.
                  </h3>
                  <p className="text-sm text-white/70 leading-relaxed font-sans">
                    CodeXa Debug intercepts runtime exceptions, parses stack traces across asynchronous fibers, and proposes deterministic corrections.
                  </p>
                  <ul className="space-y-2 text-xs font-mono text-white/90 pt-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                      <span>Cross-checks stack trace against recent Git commit boundaries</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                      <span>One-click hot-patch injection with rollback safety</span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-[#18181D] border border-white/10 font-mono text-xs space-y-2">
                  <div className="p-2.5 rounded bg-red-950/20 border border-red-800/40 text-red-300 text-[11px]">
                    <span className="font-bold text-white block mb-0.5">Runtime TypeError:</span>
                    Cannot read properties of undefined (reading 'entitlements') at AuthGate.tsx:84
                  </div>
                  <div className="p-2.5 rounded bg-[#121316] border border-white/10 text-[11px] space-y-1">
                    <div className="text-emerald-400 font-bold text-[10px] uppercase">
                      Suggested Fix (Confidence: 99.4%)
                    </div>
                    <p className="text-white/70">
                      Add optional chaining or guard check before accessing member license object.
                    </p>
                    <code className="block bg-black/60 p-1.5 rounded text-white text-[10px]">
                      const hasAccess = user?.license?.entitlements?.includes('IDE_PREVIEW');
                    </code>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
