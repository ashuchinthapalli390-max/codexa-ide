import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Cpu, ShieldCheck, Key, ArrowRight, ExternalLink, Check, Info } from "lucide-react";
import { AIEcosystemSection } from "@/components/sections/AIEcosystemSection";
import {
  OpenAILogo,
  ClaudeLogo,
  GeminiLogo,
  GrokLogo,
  CodeXaNativeLogo,
} from "@/components/icons/ProviderLogos";

export const metadata: Metadata = {
  title: "AI Model Provider Integrations — CodeXa Studio IDE",
  description:
    "Official architectural overview of supported AI provider engines including OpenAI GPT-6 Astra, Anthropic Claude, Google Gemini, xAI Grok, and CodeXa Native NEXA.",
};

const PROVIDER_INTEGRATIONS = [
  {
    name: "OpenAI — GPT Engines",
    id: "openai",
    providerModelId: "gpt-6-astra",
    status: "Available on All Paid Plans",
    officialDoc: "https://developers.openai.com/api/docs/models/gpt-6-astra",
    description:
      "Direct integration with OpenAI foundation models. Powers deep architectural planning, multi-file code synthesis, and autonomous agent loops.",
    models: [
      { name: "GPT-6 Astra", id: "gpt-6-astra", context: "256k", multiplier: "1.5x units", role: "Flagship Reasoning & Planning" },
      { name: "GPT 5.6 SOL", id: "gpt-5.6-sol", context: "128k", multiplier: "2.0x units", role: "High-Throughput Monorepos" },
    ],
    byokSupport: "Supported via Local OS Keychain",
    telemetryPolicy: "Zero customer code retained for model training. API zero-data retention enabled.",
    capabilities: ["Directed Acyclic Graph (DAG) task formulation", "Cross-file refactoring runs", "Autonomous tool orchestration"],
  },
  {
    name: "Anthropic — Claude",
    id: "anthropic",
    providerModelId: "claude-3-7-sonnet",
    status: "Available on All Paid Plans",
    officialDoc: "https://docs.anthropic.com/en/docs",
    description:
      "Supported integration for Anthropic Claude models. Specialized in long-context repository comprehension, nuanced code refactoring, and AST verification.",
    models: [
      { name: "Claude 3.7 Sonnet", id: "claude-3-7-sonnet", context: "200k", multiplier: "1.8x units", role: "Nuanced Code Synthesis" },
      { name: "Claude OPUS 5.5", id: "opus-5.5", context: "200k", multiplier: "3.5x units", role: "Deep Frontier Logic" },
    ],
    byokSupport: "Supported via Local OS Keychain",
    telemetryPolicy: "Anthropic commercial terms: source context never used for training.",
    capabilities: ["Complex algorithm redesign", "Syntactic diff validation", "Long-context architecture analysis"],
  },
  {
    name: "Google — Gemini",
    id: "google",
    providerModelId: "gemini-3.8-flash",
    status: "Available on All Paid Plans",
    officialDoc: "https://ai.google.dev/gemini-api/docs",
    description:
      "High-throughput, low-latency integration powered by Google foundation models. Delivers rapid iterative code edits and multi-million token context windows.",
    models: [
      { name: "Gemini 3.8 Flash", id: "gemini-3.8-flash", context: "1M", multiplier: "1.2x units", role: "Low-Latency Synthesis" },
      { name: "Gemini 3.6 Flash", id: "gemini-3.6-flash", context: "1M", multiplier: "1.0x units", role: "Fast Inline Autocomplete" },
    ],
    byokSupport: "Supported via Local OS Keychain",
    telemetryPolicy: "Enterprise API privacy guarantee. Data isolated within regional boundaries.",
    capabilities: ["Sub-second code completion", "Million-token context exploration", "Instant documentation generation"],
  },
  {
    name: "xAI — Grok",
    id: "xai",
    providerModelId: "grok-3-reasoning",
    status: "Planned Integration (Pre-Beta Wave 2)",
    officialDoc: "https://x.ai/api",
    description:
      "Scheduled integration for xAI Grok developer API. Designed for rigorous mathematical problem solving, formal logic checks, and algorithmic verification.",
    models: [
      { name: "Grok 3 Reasoning", id: "grok-3", context: "128k", multiplier: "TBD on launch", role: "Mathematical & Logic Synthesis" },
    ],
    byokSupport: "Planned on public release",
    telemetryPolicy: "Will adhere to xAI API developer agreement terms.",
    capabilities: ["Algorithmic complexity analysis", "Mathematical proof checking", "Formal specification generation"],
  },
  {
    name: "CodeXa Native — NEXA Edge",
    id: "nexa",
    providerModelId: "nexa-8b-edge",
    status: "Unlimited Fair-Use on All Plans",
    officialDoc: "/docs/ast-indexing-architecture",
    description:
      "100% on-device offline runtime. Executes directly on local CPU/GPU using native Ollama detection. Zero cloud latency, zero external data transit, and costs 0x tokens.",
    models: [
      { name: "NEXA-8B Edge", id: "nexa-8b", context: "32k", multiplier: "0x units (Free)", role: "Local Offline Inference" },
      { name: "CodeXa AST Indexer", id: "ast-core", context: "Unlimited", multiplier: "0x units (Free)", role: "Sub-50ms Symbol Cache" },
    ],
    byokSupport: "Not needed (Runs 100% locally)",
    telemetryPolicy: "Air-gapped operation. Zero telemetry leaves your machine.",
    capabilities: ["Offline code completion", "In-memory AST symbol cache", "Local git diff inspection"],
  },
];

export default function IntegrationsPage() {
  return (
    <div className="pt-24 pb-24 bg-[#000000] text-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#A1A4AE] font-bold block mb-2">
            INTEGRATIONS ARCHITECTURE
          </span>
          <h1 className="text-3xl sm:text-5xl font-orbitron font-bold tracking-tight text-white">
            Supported AI Model Integrations
          </h1>
          <p className="mt-4 text-xs sm:text-sm text-white/60 font-sans leading-relaxed">
            CodeXa Studio IDE connects directly to leading model providers through official APIs and local on-device runtimes.
            All paid plans include universal access to enabled models with transparent token weighting and BYOK support.
          </p>
        </div>

        {/* Embedded Interactive Ecosystem Section */}
        <AIEcosystemSection />

        {/* Detailed Provider Technical Specifications */}
        <div className="space-y-8">
          <div className="border-b border-white/10 pb-4">
            <h2 className="text-xl sm:text-2xl font-orbitron font-bold text-white">
              Provider Engineering Specifications
            </h2>
            <p className="text-xs text-white/60 mt-1">
              Detailed technical contracts, context limits, and security guarantees.
            </p>
          </div>

          <div className="space-y-6">
            {PROVIDER_INTEGRATIONS.map((prov) => (
              <div
                key={prov.id}
                id={prov.id}
                className="p-6 sm:p-8 rounded-2xl bg-[#0D0E12] border border-white/10 shadow-xl space-y-6 scroll-mt-24"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 rounded-xl bg-white/[0.05] border border-white/15 text-white shrink-0">
                      {prov.id === "openai" && <OpenAILogo className="w-6 h-6" size={24} />}
                      {prov.id === "anthropic" && <ClaudeLogo className="w-6 h-6" size={24} />}
                      {prov.id === "google" && <GeminiLogo className="w-6 h-6" size={24} />}
                      {prov.id === "xai" && <GrokLogo className="w-6 h-6" size={24} />}
                      {prov.id === "nexa" && <CodeXaNativeLogo className="w-6 h-6" size={24} />}
                    </div>
                    <div>
                      <h3 className="text-lg font-orbitron font-bold text-white">{prov.name}</h3>
                      <p className="text-xs text-white/60 font-sans mt-0.5">{prov.description}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 sm:self-start">
                    {prov.status}
                  </span>
                </div>

                {/* Models Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-white/40 text-[10px] uppercase">
                        <th className="py-2 pr-4">Model Name</th>
                        <th className="py-2 pr-4">Context Window</th>
                        <th className="py-2 pr-4">Token Weighting</th>
                        <th className="py-2">Primary Workload</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {prov.models.map((m) => (
                        <tr key={m.id} className="text-neutral-300">
                          <td className="py-2.5 pr-4 text-white font-bold">{m.name}</td>
                          <td className="py-2.5 pr-4 text-neutral-400">{m.context}</td>
                          <td className="py-2.5 pr-4 text-emerald-400 font-bold">{m.multiplier}</td>
                          <td className="py-2.5 text-white/80">{m.role}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Capabilities & Security Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs font-sans">
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                    <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider block">
                      KEYRING &amp; PRIVACY
                    </span>
                    <div className="text-white/80 space-y-1">
                      <div><strong className="text-white">BYOK:</strong> {prov.byokSupport}</div>
                      <div><strong className="text-white">Data Privacy:</strong> {prov.telemetryPolicy}</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                    <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider block">
                      SUPPORTED WORKFLOWS
                    </span>
                    <ul className="space-y-1 text-white/80">
                      {prov.capabilities.map((cap, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{cap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
