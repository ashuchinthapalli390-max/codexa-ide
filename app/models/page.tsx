"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Search, Check, ArrowRight, ShieldCheck, Cpu, Zap, Brain, Layers } from "lucide-react";

interface ModelCatalogueItem {
  id: string;
  name: string;
  family: "native" | "fast" | "reasoning" | "agent" | "frontier";
  familyLabel: string;
  provider: string;
  contextWindow: string;
  weighting: string;
  isUnlimited: boolean;
  tagline: string;
  description: string;
  bestFit: string[];
  specs: {
    latency: string;
    offline: boolean;
    byok: boolean;
  };
  officialDocUrl?: string;
}

const MODELS_CATALOGUE: ModelCatalogueItem[] = [
  {
    id: "nexa-edge",
    name: "NEXA Edge",
    family: "native",
    familyLabel: "CodeXa Native",
    provider: "CodeXa Local Engine",
    contextWindow: "32k tokens",
    weighting: "0x (Zero Token Deduction)",
    isUnlimited: true,
    tagline: "100% on-device offline inference with zero cloud latency.",
    description: "Locally compiled quantized weights running on your CPU or GPU without transmitting code to external servers. Ideal for air-gapped security and offline travel.",
    bestFit: ["Single-file method autocompletion", "Local syntax transformations", "Zero-telemetry air-gapped development"],
    specs: { latency: "<15ms", offline: true, byok: false },
  },
  {
    id: "codexa-ast",
    name: "CodeXa AST Models",
    family: "native",
    familyLabel: "CodeXa Native",
    provider: "CodeXa Compiler Engine",
    contextWindow: "64k tokens",
    weighting: "0x (Zero Token Deduction)",
    isUnlimited: true,
    tagline: "Specialized abstract syntax tree indexing and symbol graph resolution.",
    description: "Trained exclusively on AST symbol relationships and syntax trees for ultra-fast symbol renaming, reference lookups, and type checking across large repositories.",
    bestFit: ["Cross-file symbol indexing", "Monorepo reference graph caching", "Syntactic diff validation"],
    specs: { latency: "<20ms", offline: true, byok: false },
  },
  {
    id: "gemini-3-6-flash",
    name: "Gemini 3.6 Flash",
    family: "fast",
    familyLabel: "Fast Responses",
    provider: "Google",
    contextWindow: "1M tokens",
    weighting: "1.0x standard units",
    isUnlimited: false,
    tagline: "High-throughput multimodal reasoning for rapid iterative coding.",
    description: "Exceptional speed-to-intelligence ratio with a massive 1-million-token context window. Highly efficient for broad file searches, multi-file reviews, and quick question answering.",
    bestFit: ["Rapid multi-file search", "Real-time chat queries", "Large context window documentation analysis"],
    specs: { latency: "~80ms", offline: false, byok: true },
  },
  {
    id: "gemini-3-8-flash",
    name: "Gemini 3.8 Flash",
    family: "fast",
    familyLabel: "Fast Responses",
    provider: "Google",
    contextWindow: "1M tokens",
    weighting: "1.2x standard units",
    isUnlimited: false,
    tagline: "Next-generation low-latency code synthesis and refactoring.",
    description: "Upgraded multimodal model delivering sharper architectural understanding and code diff accuracy with sub-second response times across large workspace contexts.",
    bestFit: ["Complex component generation", "Refactoring legacy code", "API contract harmonization"],
    specs: { latency: "~95ms", offline: false, byok: true },
  },
  {
    id: "gpt-6-astra",
    name: "GPT-6 Astra",
    family: "reasoning",
    familyLabel: "Frontier Reasoning",
    provider: "OpenAI",
    contextWindow: "256k tokens",
    weighting: "1.5x standard units",
    isUnlimited: false,
    tagline: "OpenAI's flagship reasoning model integrated for deep architectural decomposition.",
    description: "Official OpenAI GPT-6 Astra integration (model id: gpt-6-astra). Translates high-level feature specifications into atomic diff plans and multi-file orchestrations with verified semantic correctness.",
    bestFit: ["Architectural feature planning", "Multi-file refactoring runs", "Autonomous agent swarms"],
    specs: { latency: "~120ms", offline: false, byok: true },
    officialDocUrl: "https://developers.openai.com/api/docs/models/gpt-6-astra",
  },
  {
    id: "fabel-5-1",
    name: "Fabel 5.1 Verification",
    family: "agent",
    familyLabel: "Agent Workflows & Verification",
    provider: "CodeXa Verification Core",
    contextWindow: "96k tokens",
    weighting: "1.5x standard units",
    isUnlimited: false,
    tagline: "Formal invariant checks and surgical syntactic diff review.",
    description: "Acts as the automated QA engineer in the dual-agent loop. Verifies that generated code hunks do not violate TypeScript invariants, break lint rules, or cause regression.",
    bestFit: ["Pre-commit diff validation", "Invariant checking", "Automated test generation"],
    specs: { latency: "~120ms", offline: false, byok: true },
  },
  {
    id: "gpt-5-6-sol",
    name: "GPT 5.6 SOL",
    family: "frontier",
    familyLabel: "Frontier Reasoning",
    provider: "OpenAI / SOL Mesh",
    contextWindow: "128k tokens",
    weighting: "2.2x standard units",
    isUnlimited: false,
    tagline: "High-parameter frontier model for intricate systems engineering.",
    description: "Specialized for kernel bindings, low-level concurrency, cryptographic implementations, and distributed systems logic requiring maximum reasoning depth.",
    bestFit: ["Distributed systems architecture", "Memory management & concurrency", "Mathematical algorithms"],
    specs: { latency: "~220ms", offline: false, byok: true },
  },
  {
    id: "opus-5-5",
    name: "OPUS 5.5",
    family: "frontier",
    familyLabel: "Frontier Reasoning",
    provider: "Anthropic Ecosystem",
    contextWindow: "200k tokens",
    weighting: "2.5x standard units",
    isUnlimited: false,
    tagline: "Deep conceptual reasoning for enterprise framework development.",
    description: "World-class reasoning capabilities tailored for massive monorepo migrations, enterprise security boundaries, and complex domain-driven software design.",
    bestFit: ["Monorepo architectural overhauls", "Domain-driven design", "Security auditing"],
    specs: { latency: "~260ms", offline: false, byok: true },
  },
];

export default function ModelsCataloguePage() {
  const [selectedFamily, setSelectedFamily] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredModels = MODELS_CATALOGUE.filter((m) => {
    const matchesFamily = selectedFamily === "all" || m.family === selectedFamily;
    const matchesQuery =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.provider.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFamily && matchesQuery;
  });

  return (
    <div className="pt-28 pb-24 bg-[#000000] text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#A1A4AE] font-bold block">
            UNIVERSAL MODEL CATALOGUE
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-orbitron font-bold text-white tracking-tight leading-tight">
            Intelligence, Your Choice.
          </h1>
          <p className="text-base sm:text-lg text-white/70 font-sans leading-relaxed">
            Explore the AI models supported by CodeXa Studio IDE. Every model is accessible across Starter, Plus, Pro, and Max tiers.
          </p>

          <div className="pt-2 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Universal Access Policy Active: Zero Models Paywalled</span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="mb-10 flex flex-col sm:flex-row items-center justify-between gap-4 p-2 bg-[#101116] border border-white/10 rounded-2xl">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {[
              { id: "all", label: "All Models" },
              { id: "native", label: "CodeXa Native (Unlimited)" },
              { id: "fast", label: "Fast Responses" },
              { id: "reasoning", label: "Coding & Reasoning" },
              { id: "agent", label: "Agent & Verification" },
              { id: "frontier", label: "Frontier Models" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedFamily(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  selectedFamily === tab.id
                    ? "bg-white text-black font-bold shadow-sm"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search model or provider..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-white transition-colors font-mono"
            />
          </div>
        </div>

        {/* Models Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredModels.map((model) => (
            <div
              key={model.id}
              className="bg-[#111217] border border-white/10 hover:border-white/25 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 shadow-md group"
            >
              <div>
                {/* Top Badge & Weighting */}
                <div className="flex items-center justify-between mb-3 text-[10px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-white/5 text-white/60">
                    {model.provider}
                  </span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded ${
                      model.isUnlimited
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-white/10 text-white/80"
                    }`}
                  >
                    {model.weighting}
                  </span>
                </div>

                <h3 className="text-lg font-bold font-orbitron text-white mb-1 group-hover:text-neutral-200 transition-colors">
                  {model.name}
                </h3>
                <div className="text-[11px] font-mono text-emerald-400 mb-3">
                  {model.familyLabel}
                </div>

                <p className="text-xs text-white/70 font-sans leading-relaxed mb-4">
                  {model.description}
                </p>

                {/* Specs */}
                <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl mb-4 text-[10.5px] font-mono space-y-1 text-white/60">
                  <div className="flex justify-between">
                    <span>Context Window:</span>
                    <span className="text-white font-bold">{model.contextWindow}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Est. Latency:</span>
                    <span className="text-white">{model.specs.latency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Air-Gap Offline:</span>
                    <span className={model.specs.offline ? "text-emerald-400" : "text-white/40"}>
                      {model.specs.offline ? "Yes (100% On-Device)" : "Cloud TLS 1.3"}
                    </span>
                  </div>
                </div>

                {/* Best Fit Use Cases */}
                <div className="mb-4">
                  <div className="text-[10px] font-mono uppercase text-white/40 mb-2">
                    RECOMMENDED USE CASES
                  </div>
                  <ul className="space-y-1.5 text-[11px] text-white/70 font-sans">
                    {model.bestFit.map((fit, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{fit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="pt-3 border-t border-white/[0.06]">
                <Link
                  href="/pricing"
                  className="w-full py-2.5 px-3 rounded-lg bg-white/5 hover:bg-white text-white hover:text-black text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Select via Any Plan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Global Policy Footnote */}
        <div className="mt-16 p-6 rounded-2xl bg-white/[0.02] border border-white/10 max-w-3xl mx-auto flex items-start gap-4 text-xs text-white/60 leading-relaxed font-sans">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-white mb-1">Universal Model Availability Invariant</div>
            CodeXa Studio IDE enforces zero model locks. Whether you are on Starter (₹328/mo) or Max (₹3,176/mo), every operational model provider is unlocked. Your plan tier dictates your monthly pool of weighted premium token units.
          </div>
        </div>

      </div>
    </div>
  );
}
