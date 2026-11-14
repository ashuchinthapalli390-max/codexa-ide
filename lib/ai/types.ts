import { PlanTier } from "@/lib/pricing/types";

export type ModelType = "FREE_UNLIMITED" | "PREMIUM";

export type ModelAvailability =
  | "AVAILABLE"
  | "RETIRING_SOON"
  | "HIGHER_PLAN_REQUIRED"
  | "COMING_SOON"
  | "TEMPORARILY_UNAVAILABLE";

export interface AIModelDefinition {
  id: string;
  name: string;
  provider: "CodeXa Local" | "Google DeepMind" | "CodeXa Neural" | "CodeXa Frontier" | "OpenAI" | "Anthropic" | "xAI";
  providerModelId: string;
  type: ModelType;
  unitWeight: number; // multiplier for premium token units (0 for free models)
  inputTokenRatePer1k: number; // INR or micro-units
  outputTokenRatePer1k: number;
  cacheTokenRatePer1k?: number;
  supportedTiers: PlanTier[];
  availability: ModelAvailability;
  capabilities: string[];
  contextWindow: string;
  description: string;
  deprecationDate?: string;
  fallbackModelId?: string;
  officialDocUrl?: string;
  enabled: boolean;
}

export interface ModelUsageRecord {
  modelId: string;
  modelName: string;
  rawInputTokens: number;
  rawOutputTokens: number;
  cachedTokens: number;
  premiumUnitsBilled: number;
  requestCount: number;
}

export interface FreeModelUsageRecord {
  modelId: string;
  modelName: string;
  requestCount: number;
  tokensProcessed: number;
  avgLatencyMs: number;
  fairUseStatus: "NORMAL" | "ELEVATED" | "THROTTLED";
}

export interface UserUsageState {
  userId: string;
  planId: PlanTier | "LEADERSHIP" | "NONE";
  monthlyAllowanceUnits: number;
  usedUnits: number;
  remainingUnits: number;
  percentageUsed: number;
  isNearCap: boolean; // >= 80%
  isCapped: boolean; // >= 100%
  periodStart: string;
  periodEnd: string;
  premiumBreakdown: Record<string, ModelUsageRecord>;
  freeBreakdown: Record<string, FreeModelUsageRecord>;
  recentEvents: Array<{
    id: string;
    timestamp: string;
    modelId: string;
    modelName: string;
    promptPreview: string;
    rawTokens: number;
    unitsBilled: number;
    status: "SUCCESS" | "WARNING_80" | "REJECTED_CAP";
  }>;
}

