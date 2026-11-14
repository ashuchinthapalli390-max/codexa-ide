"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Layers,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Info,
  Lock,
} from "lucide-react";
import {
  OpenAILogo,
  ClaudeLogo,
  GrokLogo,
  GeminiLogo,
  CodeXaNativeLogo,
} from "@/components/icons/ProviderLogos";

export interface ModelCatalogueItem {
  id: string;
  name: string;
  provider: "OpenAI" | "Anthropic" | "Google" | "xAI" | "CodeXa Native";
  verifiedStatus: string;
  statusBadgeColor: string;
  contextWindow: string;
  specialty: string;
  premiumPolicy: string;
  supportedWorkflows: string[];
  logo: React.ReactNode;
}

const CATALOGUE_MODELS: ModelCatalogueItem[] = [
  {
    id: "gpt-6-astra",
    name: "GPT-6 Astra",
    provider: "OpenAI",
    verifiedStatus: "Configured Frontier Preview",
    statusBadgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    contextWindow: "256k Tokens",
    specialty: "Multi-file DAG task decomposition & whole-systems architecture",
    premiumPolicy: "Monthly Token Quota (All Tiers: Free, Starter, Pro, Max)",
    supportedWorkflows: [
      "Autonomous monorepo refactoring",
      "Architectural planning with rollback safety",
      "Full-repo syntactic code synthesis",
    ],
    logo: <OpenAILogo className="w-5 h-5 text-white" />,
  },
  {
    id: "gpt-5.6-sol",
    name: "GPT-5.6 SOL",
    provider: "OpenAI",
    verifiedStatus: "Active Supported Integration",
    statusBadgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    contextWindow: "128k Tokens",
    specialty: "High-throughput code synthesis & comprehensive test generation",
    premiumPolicy: "Monthly Token Quota (All Tiers)",
    supportedWorkflows: [
      "End-to-end test suite creation",
      "Rapid boilerplate generation",
      "API contract synchronization",
    ],
    logo: <OpenAILogo className="w-5 h-5 text-white" />,
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    verifiedStatus: "Active Supported Integration",
    statusBadgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    contextWindow: "128k Tokens",
    specialty: "Multimodal visual reasoning & UI component synthesis",
    premiumPolicy: "Monthly Token Quota (All Tiers)",
    supportedWorkflows: [
      "Figma design to production code",
      "Visual UI layout debugging",
      "Split preview diff review",
    ],
    logo: <OpenAILogo className="w-5 h-5 text-white" />,
  },
  {
    id: "claude-3.7-sonnet",
    name: "Claude 3.7 Sonnet",
    provider: "Anthropic",
    verifiedStatus: "Active Supported Integration",
    statusBadgeColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    contextWindow: "200k Tokens",
    specialty: "Hybrid reasoning & complex algorithmic state machine debugging",
    premiumPolicy: "Monthly Token Quota (All Tiers)",
    supportedWorkflows: [
      "Complex concurrency bug isolation",
      "Mathematical logic proofs",
      "Multi-agent task orchestration",
    ],
    logo: <ClaudeLogo className="w-5 h-5 text-[#FAF7F2]" />,
  },
  {
    id: "claude-3.5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    verifiedStatus: "Active Supported Integration",
    statusBadgeColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    contextWindow: "200k Tokens",
    specialty: "Precision AST refactoring & whole-codebase consistency audits",
    premiumPolicy: "Monthly Token Quota (All Tiers)",
    supportedWorkflows: [
      "In-place TypeScript/Rust refactors",
      "Deterministic diff staging",
      "ESLint/Clippy gate verification",
    ],
    logo: <ClaudeLogo className="w-5 h-5 text-[#FAF7F2]" />,
  },
  {
    id: "claude-3.5-haiku",
    name: "Claude 3.5 Haiku",
    provider: "Anthropic",
    verifiedStatus: "Active Supported Integration",
    statusBadgeColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    contextWindow: "200k Tokens",
    specialty: "Sub-second latency in-line completions and docstrings",
    premiumPolicy: "Monthly Token Quota (All Tiers)",
    supportedWorkflows: [
      "Real-time typing autocompletion",
      "Fast docstring generation",
      "Quick snippet repairs",
    ],
    logo: <ClaudeLogo className="w-5 h-5 text-[#FAF7F2]" />,
  },
  {
    id: "gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    provider: "Google",
    verifiedStatus: "Active Supported Integration",
    statusBadgeColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    contextWindow: "1,000,000+ Tokens",
    specialty: "Ultra-low latency code search & massive semantic indexing",
    premiumPolicy: "Monthly Token Quota (All Tiers)",
    supportedWorkflows: [
      "Whole-repo semantic code search",
      "Cross-file reference lookups",
      "Rapid multimodal inspection",
    ],
    logo: <GeminiLogo className="w-5 h-5 text-cyan-400" />,
  },
  {
    id: "gemini-1.5-pro",
    name: "Gemini 1.5 Pro",
    provider: "Google",
    verifiedStatus: "Active Supported Integration",
    statusBadgeColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    contextWindow: "2,000,000+ Tokens",
    specialty: "Massive repository context ingestion & legacy codebase migration",
    premiumPolicy: "Monthly Token Quota (All Tiers)",
    supportedWorkflows: [
      "Million-line monorepo comprehension",
      "Legacy codebase modernization",
      "Full API specification auditing",
    ],
    logo: <GeminiLogo className="w-5 h-5 text-cyan-400" />,
  },
  {
    id: "grok-3",
    name: "Grok 3",
    provider: "xAI",
    verifiedStatus: "Supported via BYOK & Enterprise / Staged Integration",
    statusBadgeColor: "text-neutral-300 bg-white/5 border-white/10",
    contextWindow: "128k Tokens",
    specialty: "Dense mathematical computing & low-level performance kernels",
    premiumPolicy: "Direct BYOK API Key or Enterprise Plan",
    supportedWorkflows: [
      "High-speed algorithmic debugging",
      "Numerical simulation kernels",
      "Low-level memory optimization",
    ],
    logo: <GrokLogo className="w-5 h-5 text-white" />,
  },
  {
    id: "nexa-7b-fast",
    name: "NEXA-7B Fast",
    provider: "CodeXa Native",
    verifiedStatus: "Native Core • Included On All Tiers",
    statusBadgeColor: "text-[#E11D48] bg-[#E11D48]/10 border-[#E11D48]/20",
    contextWindow: "32k Tokens",
    specialty: "100% air-gapped on-device autocomplete with zero cloud telemetry",
    premiumPolicy: "Unlimited Zero-Token Usage (No Quota Deductions)",
    supportedWorkflows: [
      "Air-gapped offline coding",
      "Classified / proprietary codebases",
      "Zero-latency keystroke prediction",
    ],
    logo: <CodeXaNativeLogo size={20} className="w-5 h-5" />,
  },
  {
    id: "nexa-code-instruct",
    name: "NEXA-Code Instruct",
    provider: "CodeXa Native",
    verifiedStatus: "Native Core • Included On All Tiers",
    statusBadgeColor: "text-[#E11D48] bg-[#E11D48]/10 border-[#E11D48]/20",
    contextWindow: "32k Tokens",
    specialty: "Local syntax repair, AST node formatting, and hunk staging",
    premiumPolicy: "Unlimited Zero-Token Usage (No Quota Deductions)",
    supportedWorkflows: [
      "Offline syntax error fixes",
      "Code formatting & AST linting",
      "Local hunk diff creation",
    ],
    logo: <CodeXaNativeLogo size={20} className="w-5 h-5" />,
  },
];

export function FlagshipModelCatalogue() {
  const [selectedProvider, setSelectedProvider] = useState<string>("All");

  const providers = ["All", "OpenAI", "Anthropic", "Google", "xAI", "CodeXa Native"];

  const filteredModels =
    selectedProvider === "All"
      ? CATALOGUE_MODELS
      : CATALOGUE_MODELS.filter((m) => m.provider === selectedProvider);

  return (
    <div className="w-full mt-16 sm:mt-24 space-y-8">
      {/* Catalogue Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#E11D48] font-bold block mb-2">
            MODEL SPECIFICATIONS
          </span>
          <h3 className="text-2xl sm:text-3xl font-orbitron font-bold text-white tracking-tight">
            Flagship Model Catalogue
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl">
            Verified model families supported in CodeXa Studio IDE. Access is universal across all four plan tiers.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-white/[0.03] border border-white/10">
          {providers.map((p) => (
            <button
              key={p}
              onClick={() => setSelectedProvider(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedProvider === p
                  ? "bg-white text-black shadow-sm font-semibold"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Universal Model Policy Callout */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-white/[0.04] via-white/[0.02] to-transparent border border-white/10 flex items-start sm:items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5 sm:mt-0" />
        <div className="text-xs text-neutral-300 font-sans leading-relaxed">
          <strong className="text-white font-medium">Universal Model Access Policy:</strong> Every CodeXa subscription tier (Free, Starter, Pro, Max) includes access to all enabled models. Cloud model usage is governed by transparent monthly token quotas, while native NEXA models run locally with unlimited zero-token usage.
        </div>
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredModels.map((model) => (
          <div
            key={model.id}
            className="flex flex-col justify-between p-5 rounded-xl bg-[#090A0E] border border-white/10 hover:border-white/20 transition-all hover:shadow-[0_8px_24px_rgba(0,0,0,0.5)] group"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 flex-shrink-0">
                    {model.logo}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-neutral-100 transition-colors">
                      {model.name}
                    </h4>
                    <span className="text-[10px] font-mono text-neutral-400">
                      {model.provider}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-neutral-300 border border-white/5">
                  {model.contextWindow}
                </span>
              </div>

              {/* Status Badge */}
              <div className="mb-3">
                <span
                  className={`inline-block text-[10px] font-mono px-2 py-0.5 rounded-full border ${model.statusBadgeColor}`}
                >
                  {model.verifiedStatus}
                </span>
              </div>

              {/* Specialty */}
              <p className="text-xs text-neutral-300 leading-relaxed mb-4">
                {model.specialty}
              </p>

              {/* Supported Workflows */}
              <div className="space-y-1.5 mb-4">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block">
                  OPTIMIZED WORKFLOWS:
                </span>
                {model.supportedWorkflows.map((wf, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-[11px] text-neutral-400">
                    <span className="w-1 h-1 rounded-full bg-neutral-600" />
                    <span>{wf}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Token Policy Footer */}
            <div className="pt-3 border-t border-white/5 flex items-center gap-1.5 text-[10px] font-mono text-neutral-500">
              <Zap className="w-3 h-3 text-amber-400/80 flex-shrink-0" />
              <span className="truncate">{model.premiumPolicy}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
