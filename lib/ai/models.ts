import { AIModelDefinition } from "./types";

export const AI_MODELS: AIModelDefinition[] = [
  // 1. FREE UNLIMITED MODELS (Fair-use, 0 premium token deduction)
  {
    id: "nexa",
    name: "NEXA Edge",
    provider: "CodeXa Local",
    providerModelId: "nexa-v1-edge-quant",
    type: "FREE_UNLIMITED",
    unitWeight: 0,
    inputTokenRatePer1k: 0,
    outputTokenRatePer1k: 0,
    supportedTiers: ["STARTER", "PLUS", "PRO", "MAX"],
    availability: "AVAILABLE",
    capabilities: ["Local AST Analysis", "Zero-Latency Inline Suggest", "Air-Gapped Privacy"],
    contextWindow: "32k",
    description: "100% on-device neural weights running locally with zero cloud telemetry. Unlimited fair use on all plans.",
    enabled: true,
  },
  {
    id: "codexa-core",
    name: "CodeXa Models",
    provider: "CodeXa Neural",
    providerModelId: "codexa-ast-reasoner-v5",
    type: "FREE_UNLIMITED",
    unitWeight: 0,
    inputTokenRatePer1k: 0,
    outputTokenRatePer1k: 0,
    supportedTiers: ["STARTER", "PLUS", "PRO", "MAX"],
    availability: "AVAILABLE",
    capabilities: ["Deterministic Syntax Graph", "Atomic Unified Diff", "Type-Safe Patch Synthesis"],
    contextWindow: "64k",
    description: "Native CodeXa architecture models trained specifically for monorepo AST graphs. Included free across all plans.",
    enabled: true,
  },

  // 2. GOOGLE GEMINI MODELS
  {
    id: "gemini-3.6-flash",
    name: "Gemini 3.6 Flash",
    provider: "Google DeepMind",
    providerModelId: "gemini-3.6-flash",
    type: "PREMIUM",
    unitWeight: 1.0,
    inputTokenRatePer1k: 0.05,
    outputTokenRatePer1k: 0.15,
    supportedTiers: ["STARTER", "PLUS", "PRO", "MAX"],
    availability: "RETIRING_SOON",
    capabilities: ["Sub-Second Latency", "Multi-File Edits", "Context Ingestion"],
    contextWindow: "1M",
    description: "Fast high-frequency coding assistant. Note: Documented retirement window scheduled around 19 November 2026; routes automatically to Gemini 3.8 Flash upon cutoff.",
    deprecationDate: "2026-11-19T23:59:59Z",
    fallbackModelId: "gemini-3.8-flash",
    enabled: true,
  },
  {
    id: "gemini-3.8-flash",
    name: "Gemini 3.8 Flash",
    provider: "Google DeepMind",
    providerModelId: "gemini-3.8-flash",
    type: "PREMIUM",
    unitWeight: 1.2,
    inputTokenRatePer1k: 0.08,
    outputTokenRatePer1k: 0.24,
    supportedTiers: ["PLUS", "PRO", "MAX"],
    availability: "AVAILABLE",
    capabilities: ["Next-Gen Reasoning", "Multimodal UI Extraction", "Long-Context Monorepo"],
    contextWindow: "1M",
    description: "Google's upgraded Flash foundation model with advanced synthetic reasoning and deep multimodal token parsing.",
    enabled: true,
  },

  // 3. OPENAI FRONTIER INTEGRATION
  {
    id: "gpt-6-astra",
    name: "GPT-6 Astra",
    provider: "OpenAI",
    providerModelId: "gpt-6-astra",
    type: "PREMIUM",
    unitWeight: 1.5,
    inputTokenRatePer1k: 0.12,
    outputTokenRatePer1k: 0.36,
    supportedTiers: ["STARTER", "PLUS", "PRO", "MAX"],
    availability: "AVAILABLE",
    capabilities: ["Deep Architectural Planning", "Cross-File Refactoring", "Autonomous Agent Loops"],
    contextWindow: "256k",
    description: "OpenAI's flagship reasoning model integrated into CodeXa for architectural decomposition, cross-file refactoring, and agent swarms.",
    officialDocUrl: "https://developers.openai.com/api/docs/models/gpt-6-astra",
    enabled: true,
  },
  {
    id: "fabel-5.1",
    name: "Fabel 5.1 Verification",
    provider: "CodeXa Neural",
    providerModelId: "fabel-5.1-formal-verifier",
    type: "PREMIUM",
    unitWeight: 1.8,
    inputTokenRatePer1k: 0.15,
    outputTokenRatePer1k: 0.45,
    supportedTiers: ["PLUS", "PRO", "MAX"],
    availability: "AVAILABLE",
    capabilities: ["Cryptographic Invariant Check", "Type-Soundness Proofs", "Linter Invariant Gate"],
    contextWindow: "128k",
    description: "Rigorous formal verification model ensuring synthesized diffs satisfy strict type constraints and compiler invariants before commit.",
    enabled: true,
  },
  {
    id: "gpt-5.6-sol",
    name: "GPT 5.6 SOL",
    provider: "CodeXa Frontier",
    providerModelId: "gpt-5.6-sol-monorepo",
    type: "PREMIUM",
    unitWeight: 2.0,
    inputTokenRatePer1k: 0.20,
    outputTokenRatePer1k: 0.60,
    supportedTiers: ["PRO", "MAX"],
    availability: "AVAILABLE",
    capabilities: ["High-Throughput Synthesis", "Multi-Language Migrations", "Test Suite Generation"],
    contextWindow: "512k",
    description: "Specialized high-throughput token synthesizer built for large-scale framework migrations and test suite generation.",
    enabled: true,
  },
  {
    id: "gpt-6.1-sol",
    name: "GPT 6.1 SOL",
    provider: "CodeXa Frontier",
    providerModelId: "gpt-6.1-sol-enterprise",
    type: "PREMIUM",
    unitWeight: 2.5,
    inputTokenRatePer1k: 0.30,
    outputTokenRatePer1k: 0.90,
    supportedTiers: ["PRO", "MAX"],
    availability: "AVAILABLE",
    capabilities: ["Enterprise Monorepo Ingestion", "Whole-Project Dependency Graph", "Symbolic Synthesis"],
    contextWindow: "1M",
    description: "Enterprise-grade model capable of digesting massive monorepos, resolving cross-package symbolic links and microservices.",
    enabled: true,
  },
  {
    id: "opus-5.5",
    name: "OPUS 5.5 Autonomous Agent",
    provider: "CodeXa Frontier",
    providerModelId: "opus-5.5-agent-loop",
    type: "PREMIUM",
    unitWeight: 3.5,
    inputTokenRatePer1k: 0.50,
    outputTokenRatePer1k: 1.50,
    supportedTiers: ["MAX"],
    availability: "AVAILABLE",
    capabilities: ["Fully Autonomous PR Synthesis", "Multi-Turn Terminal Operations", "Self-Healing Sandboxes"],
    contextWindow: "500k",
    description: "Frontier autonomous agent runtime for unattended complex feature construction, multi-stage refactors, and automated PR delivery.",
    enabled: true,
  },
];

export function getModelById(id: string): AIModelDefinition | undefined {
  return AI_MODELS.find((m) => m.id === id);
}

import { PlanTier } from "@/lib/pricing/types";

export function getModelsForTier(tier: PlanTier | "LEADERSHIP" | "NONE"): AIModelDefinition[] {
  if (tier === "LEADERSHIP") return AI_MODELS.filter((m) => m.enabled);
  if (tier === "NONE") return AI_MODELS.filter((m) => m.type === "FREE_UNLIMITED" && m.enabled);
  return AI_MODELS.filter((m) => m.supportedTiers.includes(tier) && m.enabled);
}

export function isModelAllowedForTier(modelId: string, tier: PlanTier | "LEADERSHIP" | "NONE"): boolean {
  const model = getModelById(modelId);
  if (!model || !model.enabled) return false;
  if (tier === "LEADERSHIP") return true;
  if (tier === "NONE") return model.type === "FREE_UNLIMITED";
  return model.supportedTiers.includes(tier);
}

