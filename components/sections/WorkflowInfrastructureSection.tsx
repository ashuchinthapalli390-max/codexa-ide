"use client";

import React, { useState } from "react";
import {
  Code2,
  Sparkles,
  GitCommit,
  Eye,
  ArrowRight,
} from "lucide-react";

interface WorkflowStep {
  id: string;
  number: string;
  title: string;
  headline: string;
  subtitle: string;
  badge: string;
  icon: React.ReactNode;
  content: {
    badgeText: string;
    snippetTitle: string;
    codeLines: Array<{ text: string; type?: "normal" | "add" | "del" | "comment" | "keyword" }>;
    metrics: Array<{ label: string; value: string }>;
  };
}

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: "ide",
    number: "01",
    title: "IDE Workspace",
    headline: "Local-First Workspace & AST Ingestion",
    subtitle: "Your workspace opens with project symbol trees indexed in-memory for instant reference lookups.",
    badge: "LOCAL-FIRST",
    icon: <Code2 className="w-4 h-4 text-white" />,
    content: {
      badgeText: "WORKSPACE ENGINE",
      snippetTitle: "src/components/PaymentModal.tsx",
      codeLines: [
        { text: "// CodeXa Local AST Indexer: Active (in-memory syntax graph)", type: "comment" },
        { text: "export function PaymentModal({ amount, onSuccess }: ModalProps) {", type: "normal" },
        { text: "  const [currency, setCurrency] = useState<'USD' | 'EUR'>('USD');", type: "normal" },
        { text: "  const { processSecureTransaction } = useHardwareVault();", type: "normal" },
        { text: "  // Ready for dual-agent synthesis", type: "comment" },
      ],
      metrics: [
        { label: "Indexing Mode", value: "Local AST" },
        { label: "Workspace State", value: "Active" },
        { label: "Memory Strategy", value: "On-Device" },
      ],
    },
  },
  {
    id: "ai",
    number: "02",
    title: "AI Assistance",
    headline: "Multi-Model Context Formulation",
    subtitle: "Chat and Plan agents inspect dependencies and formulate structured, verifiable task breakdowns.",
    badge: "MULTI-MODEL",
    icon: <Sparkles className="w-4 h-4 text-white" />,
    content: {
      badgeText: "AGENTIC REASONING",
      snippetTitle: "Agent: biometric_auth_synthesis.plan",
      codeLines: [
        { text: "⚙ Agent Task: Implement biometric authorization with hardware fallback", type: "comment" },
        { text: "✔ Context Graph: payment_gateway.ts, webauthn_keys.ts, session.ts", type: "keyword" },
        { text: "✔ AST Verification: No undefined references in dependency graph", type: "keyword" },
        { text: "→ Formulating atomic diff with hardware key guard...", type: "normal" },
      ],
      metrics: [
        { label: "Active Model", value: "Astra 6 Core" },
        { label: "Verification Gate", value: "Fabel 5.1 PASS" },
        { label: "Synthesized Tokens", value: "348 tokens" },
      ],
    },
  },
  {
    id: "changes",
    number: "03",
    title: "Code Changes",
    headline: "Deterministic Atomic AST Diffing",
    subtitle: "CodeXa writes precise unified diffs and verifies type safety before applying edits.",
    badge: "LINT & TYPE VERIFIED",
    icon: <GitCommit className="w-4 h-4 text-white" />,
    content: {
      badgeText: "UNIFIED DIFF VIEWER",
      snippetTitle: "diff: src/components/PaymentModal.tsx",
      codeLines: [
        { text: "@@ -12,4 +12,8 @@", type: "comment" },
        { text: "-  // TODO: Add biometric confirmation hook", type: "del" },
        { text: "+  const { verifyBiometricTouch } = useWebAuthnCredential();", type: "add" },
        { text: "+  const isHardwareApproved = await verifyBiometricTouch();", type: "add" },
        { text: "+  if (!isHardwareApproved) throw new SecurityAuthError();", type: "add" },
      ],
      metrics: [
        { label: "Diff Size", value: "+3 / -1 lines" },
        { label: "Linter Gate", value: "0 Errors" },
        { label: "Type Check", value: "Strict PASS" },
      ],
    },
  },
  {
    id: "preview",
    number: "04",
    title: "Live Preview",
    headline: "Zero-Reload Reactive AST Hot Compilation",
    subtitle: "Changes compile directly into the reactive preview canvas in real time with dual desktop and mobile viewports.",
    badge: "HOT RELOAD",
    icon: <Eye className="w-4 h-4 text-white" />,
    content: {
      badgeText: "REACTIVE RUNTIME",
      snippetTitle: "DOM Canvas: localhost:3000/checkout",
      codeLines: [
        { text: "⚡ Hot AST Patch Applied", type: "keyword" },
        { text: "▶ Mounted Component: <PaymentModal amount={250} />", type: "normal" },
        { text: "✔ WebAuthn prompt verified", type: "keyword" },
        { text: "✔ Dual Viewport: Desktop (1440px) & Mobile (390px) synchronized", type: "normal" },
      ],
      metrics: [
        { label: "Runtime Mode", value: "Hot-Reload" },
        { label: "Viewports", value: "Synchronized" },
        { label: "DOM State", value: "Active" },
      ],
    },
  },
];

export function WorkflowInfrastructureSection() {
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const currentStep = WORKFLOW_STEPS[activeStepIdx];

  return (
    <section
      id="workflow-infrastructure"
      className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#000000] border-t border-white/5 relative overflow-hidden"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-3">
          <span className="text-xs sm:text-sm font-sans font-medium uppercase tracking-[2px] text-[#9CA3AF] block">
            SOFTWARE WORKFLOW INFRASTRUCTURE
          </span>
          <h2 className="text-3xl sm:text-[44px] font-orbitron font-bold tracking-tight text-white leading-tight">
            One Workspace. Streamlined Velocity.
          </h2>
          <p className="text-[14px] font-sans font-normal text-white/70 max-w-2xl mx-auto leading-[22.75px]">
            How CodeXa transforms developer intent into verified production code:{" "}
            <span className="text-white font-semibold">
              IDE → AI Assistance → Code Changes → Live Preview
            </span>
            .
          </p>
        </div>

        {/* Step Navigation Pill Strip (Matching NexCloud pill selector) */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
          {WORKFLOW_STEPS.map((step, idx) => {
            const isActive = activeStepIdx === idx;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStepIdx(idx)}
                className={`flex items-center gap-2 px-3.5 sm:px-5 py-2.5 rounded-[8px] text-[13px] font-sans font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-white/10 border border-white/20 text-white shadow-sm"
                    : "bg-[#121316] border border-white/10 text-white/60 hover:text-white hover:border-white/20"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-sans font-bold ${
                    isActive ? "bg-white text-black" : "bg-white/10 text-white/70"
                  }`}
                >
                  {step.number}
                </span>
                <span className="font-semibold">{step.title}</span>
                {idx < WORKFLOW_STEPS.length - 1 && (
                  <ArrowRight className="w-3 h-3 text-white/30 hidden md:inline ml-1" />
                )}
              </button>
            );
          })}
        </div>

        {/* Interactive Visual Presentation Frame (NexCloud .dashboard-preview rhythm) */}
        <div className="relative w-full bg-[#15151A] rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.12)] shadow-[rgba(255,255,255,0.03)_0px_0px_0px_8px,rgba(0,0,0,0.52)_0px_38px_110px_0px]">
          {/* Top Window Bar (NexCloud .dashboard-topbar: #121217) */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-[#121217] border-b border-[rgba(255,255,255,0.08)]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
              <span className="text-[11px] font-mono text-white/50 ml-3 hidden sm:inline">
                codexa://workflow/{currentStep.id}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="px-2 py-0.5 rounded bg-[#18181D] border border-white/10 text-white text-[10px] font-bold uppercase tracking-wider">
                {currentStep.badge}
              </span>
              <span className="text-white/50 text-[11px]">Stage {currentStep.number}/04</span>
            </div>
          </div>

          {/* Workflow Canvas Body */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Header info */}
            <div>
              <h3 className="text-xl sm:text-2xl font-orbitron font-bold text-white mb-2">
                {currentStep.headline}
              </h3>
              <p className="text-xs sm:text-sm text-white/70 font-sans leading-relaxed">
                {currentStep.subtitle}
              </p>
            </div>

            {/* Code / Execution Box (NexCloud metric surface #18181D) */}
            <div className="rounded-xl bg-[#18181D] border border-[rgba(255,255,255,0.075)] p-4 sm:p-5 font-mono text-xs overflow-x-auto">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5 text-[11px] text-white/50">
                <span>{currentStep.content.snippetTitle}</span>
                <span className="text-white/80">{currentStep.content.badgeText}</span>
              </div>

              <div className="space-y-1.5 leading-relaxed">
                {currentStep.content.codeLines.map((line, lIdx) => (
                  <div
                    key={lIdx}
                    className={`flex items-start gap-3 ${
                      line.type === "add"
                        ? "text-emerald-400 bg-emerald-950/20 px-2 py-0.5 rounded"
                        : line.type === "del"
                        ? "text-rose-400 bg-rose-950/20 px-2 py-0.5 rounded"
                        : line.type === "keyword"
                        ? "text-sky-300"
                        : line.type === "comment"
                        ? "text-white/40 italic"
                        : "text-white/90"
                    }`}
                  >
                    <span className="text-white/30 select-none w-4 text-right shrink-0">
                      {lIdx + 1}
                    </span>
                    <span className="break-all">{line.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Metrics Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {currentStep.content.metrics.map((m, mIdx) => (
                <div
                  key={mIdx}
                  className="p-3.5 rounded-xl bg-[#121316] border border-white/10 flex flex-col justify-between"
                >
                  <span className="text-[10px] font-mono uppercase tracking-wider text-white/50">
                    {m.label}
                  </span>
                  <span className="text-base font-orbitron font-bold text-white mt-1">
                    {m.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
