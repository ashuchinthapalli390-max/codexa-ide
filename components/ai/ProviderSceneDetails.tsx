"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SceneId } from "./InteractiveParticleCanvas";
import {
  OpenAILogo,
  ClaudeLogo,
  GrokLogo,
  GeminiLogo,
  CodeXaNativeLogo,
} from "@/components/icons/ProviderLogos";

interface ProviderSceneDetailsProps {
  activeScene: SceneId;
  className?: string;
}

export function ProviderSceneDetails({ activeScene, className = "" }: ProviderSceneDetailsProps) {
  const getContent = () => {
    switch (activeScene) {
      case "intro":
        return {
          brand: "Supported AI Providers",
          subBrand: "Integrated Architecture",
          eyebrow: "FOUNDATION NETWORK",
          tagline: "One unified development workspace for frontier reasoning models.",
          statusText: "Integrated Runtime",
          statusColor: "text-[#E11D48] bg-[#E11D48]/10 border-[#E11D48]/20",
          logo: <CodeXaNativeLogo size={44} className="w-11 h-11" />,
          models: [
            { name: "OpenAI GPT Series", role: "Planning & Synthesis", context: "Configured" },
            { name: "Anthropic Claude", role: "AST Refactor & Diffs", context: "Configured" },
            { name: "Google Gemini", role: "Long-Context Monorepos", context: "Configured" },
          ],
          description:
            "CodeXa Studio IDE connects supported foundation models into a unified developer workspace. Select models per task with plan-based token metering.",
          usagePolicy: "Centralized metering with air-gapped offline local fallbacks",
          linkUrl: "/models",
        };

      case "openai":
        return {
          brand: "OpenAI",
          subBrand: "GPT Models",
          eyebrow: "SUPPORTED PROVIDER",
          tagline: "Autonomous multi-file decomposition and verified code synthesis.",
          statusText: "Integrated Model Runtime",
          statusColor: "text-neutral-200 bg-white/5 border-white/10",
          logo: <OpenAILogo className="w-10 h-10 text-white" />,
          models: [
            { name: "GPT-6 Astra", role: "Configured Frontier Preview", context: "256k" },
            { name: "GPT-5.6 SOL", role: "High-Throughput Synthesis", context: "128k" },
            { name: "GPT-4o", role: "Multimodal Code & Visual UI", context: "128k" },
          ],
          description:
            "Deconstruct deep monorepo refactors, execute Directed Acyclic Graph (DAG) task planning, and generate cross-file code updates with automatic rollback safeguards.",
          usagePolicy: "Integrated supported model runtime • Deducts from token allowance",
          linkUrl: "/models?provider=OpenAI",
        };

      case "anthropic":
        return {
          brand: "Anthropic",
          subBrand: "Claude Models",
          eyebrow: "ANTHROPIC × CODEXA",
          tagline: "Pinpoint syntactic nuance, extensive context ingestion, and surgical diffs.",
          statusText: "Integrated Model Runtime",
          statusColor: "text-[#F4B58C] bg-[#F4B58C]/10 border-[#F4B58C]/20",
          logo: <ClaudeLogo className="w-10 h-10 text-[#FAF7F2]" />,
          models: [
            { name: "Claude 3.7 Sonnet", role: "Hybrid Reasoning & Complex Logic", context: "200k" },
            { name: "Claude 3.5 Sonnet", role: "Precision AST & Monorepo Audits", context: "200k" },
            { name: "Claude 3.5 Haiku", role: "Low-Latency Instant Edits", context: "200k" },
          ],
          description:
            "Engineered for whole-codebase audits, human-aligned code reviews, and deterministic atomic diff generation across large TypeScript, Python, and Rust codebases.",
          usagePolicy: "Integrated supported model runtime • Deducts from token allowance",
          linkUrl: "/models?provider=Anthropic",
        };

      case "grok":
        return {
          brand: "xAI",
          subBrand: "Grok Models",
          eyebrow: "SUPPORTED PROVIDER",
          tagline: "High-throughput mathematical reasoning and rapid code exploration.",
          statusText: "Direct BYOK & Enterprise",
          statusColor: "text-neutral-300 bg-white/5 border-white/10",
          logo: <GrokLogo className="w-10 h-10 text-white" />,
          models: [
            { name: "Grok 3", role: "Algorithmic & Math Reasoning", context: "128k" },
            { name: "Grok 2", role: "Fast Monorepo Symbol Traversals", context: "64k" },
          ],
          description:
            "High-speed algorithmic queries, complex state-machine debugging, and mathematical computations with zero telemetry interception.",
          usagePolicy: "Available via direct BYOK API key or enterprise tier",
          linkUrl: "/models?provider=xAI",
        };

      case "gemini":
        return {
          brand: "Google",
          subBrand: "Gemini Models",
          eyebrow: "SUPPORTED PROVIDER",
          tagline: "Long-context repository ingestion with rapid token throughput.",
          statusText: "Integrated Model Runtime",
          statusColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
          logo: <GeminiLogo className="w-10 h-10 text-cyan-400" />,
          models: [
            { name: "Gemini 2.0 Flash", role: "Real-Time Autocomplete & Search", context: "1M+" },
            { name: "Gemini 1.5 Pro", role: "Massive Monorepo Context Auditing", context: "2M+" },
          ],
          description:
            "Ingest entire repositories, legacy documentation, and full design system specifications in a single prompt with rapid multi-language comprehension.",
          usagePolicy: "Integrated supported model runtime • Deducts from token allowance",
          linkUrl: "/models?provider=Google",
        };

      case "codexa":
        return {
          brand: "CodeXa Native",
          subBrand: "NEXA Neural Core",
          eyebrow: "ON-DEVICE PRIVACY",
          tagline: "Zero-latency local autocomplete, offline AST linting, and 100% air-gapped privacy.",
          statusText: "Native Core • Included On All Plans",
          statusColor: "text-[#E11D48] bg-[#E11D48]/10 border-[#E11D48]/20",
          logo: <CodeXaNativeLogo size={44} className="w-11 h-11" />,
          models: [
            { name: "NEXA-7B Fast", role: "Zero-Token Instant In-Line Completion", context: "32k" },
            { name: "NEXA-Code Instruct", role: "Air-Gapped Offline Syntax Repair", context: "32k" },
          ],
          description:
            "Runs natively on local CPU/GPU hardware. Never sends source code to the cloud, requires zero internet access, and consumes 0 quota units across all plans.",
          usagePolicy: "Unlimited zero-token usage on Free, Starter, Pro, and Max plans",
          linkUrl: "/models?provider=CodeXa",
        };

      case "unified":
      default:
        return {
          brand: "Unified CodeXa Workspace",
          subBrand: "Multi-Model Orchestration",
          eyebrow: "ORCHESTRATION LAYER",
          tagline: "Switch models per task, per file, or per refactoring session.",
          statusText: "Universal Integration",
          statusColor: "text-white bg-white/10 border-white/20",
          logo: (
            <div className="flex items-center -space-x-2">
              <OpenAILogo className="w-7 h-7 text-white p-1 rounded-full bg-black border border-white/20" />
              <ClaudeLogo className="w-7 h-7 text-[#FAF7F2] p-1 rounded-full bg-black border border-white/20" />
              <GeminiLogo className="w-7 h-7 text-cyan-400 p-1 rounded-full bg-black border border-white/20" />
              <GrokLogo className="w-7 h-7 text-white p-1 rounded-full bg-black border border-white/20" />
              <CodeXaNativeLogo size={28} className="w-7 h-7" />
            </div>
          ),
          models: [
            { name: "OpenAI GPT-6 / 4o", role: "Planning & Synthesis", context: "256k" },
            { name: "Claude 3.7 / 3.5", role: "AST & Precision Diffs", context: "200k" },
            { name: "Gemini 2.0 Flash", role: "Massive Context Search", context: "1M+" },
          ],
          description:
            "Route code planning to GPT-6 Astra, precision AST refactoring to Claude 3.7 Sonnet, monorepo context audits to Gemini, and in-line completions to NEXA Local.",
          usagePolicy: "All four CodeXa subscription tiers include access to all enabled models",
          linkUrl: "/models",
        };
    }
  };

  const data = getContent();

  return (
    <div
      className={`flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-[#090A0D]/75 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)] ${className}`}
    >
      <div>
        {/* Eyebrow & Status Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold">
            {data.eyebrow}
          </span>
          <span
            className={`text-[10px] font-mono px-2.5 py-1 rounded-full border ${data.statusColor}`}
          >
            {data.statusText}
          </span>
        </div>

        {/* Brand Header & Logo */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative w-12 h-12 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center flex-shrink-0">
            {data.logo}
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-orbitron font-extrabold text-white tracking-tight leading-tight">
              {data.brand}
            </h3>
            <div className="text-xs font-mono text-neutral-400">
              {data.subBrand}
            </div>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans mb-5">
          {data.description}
        </p>

        {/* Verified Configured Models in Secondary Area */}
        <div className="space-y-2 mb-5">
          <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
            VERIFIED CONFIGURED MODELS
          </div>
          {data.models.map((mod, mIdx) => (
            <div
              key={mIdx}
              className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/5"
            >
              <div>
                <span className="text-xs font-semibold text-white">{mod.name}</span>
                <span className="text-[11px] text-neutral-400 block font-sans">{mod.role}</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-neutral-300">
                {mod.context}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-white/10 flex items-center justify-between">
        <span className="text-[11px] text-neutral-400 font-sans line-clamp-1 mr-2">
          {data.usagePolicy}
        </span>
        <Link
          href={data.linkUrl}
          className="inline-flex items-center gap-1 text-xs text-white hover:text-neutral-300 font-semibold transition-colors flex-shrink-0"
        >
          <span>Catalog</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}