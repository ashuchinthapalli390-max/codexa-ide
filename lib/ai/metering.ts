import { AIModelDefinition, UserUsageState, ModelUsageRecord, FreeModelUsageRecord } from "./types";
import { getModelById, isModelAllowedForTier } from "./models";
import { SUBSCRIPTION_PLANS } from "@/lib/pricing/plans";
import { PlanTier } from "@/lib/pricing/types";

class MeteringStore {
  private balances: Map<string, UserUsageState> = new Map();

  constructor() {
    // Zero fake seed data. Initialized empty; populated when real authenticated requests or balances are queried.
  }

  public getOrCreateBalance(
    userId: string,
    planTier: PlanTier | "LEADERSHIP" | "NONE" = "STARTER",
    customAllowance?: number
  ): UserUsageState {
    const existing = this.balances.get(userId);
    if (existing) return existing;

    const allowance =
      customAllowance ??
      (planTier === "LEADERSHIP"
        ? 25000000
        : planTier === "NONE"
        ? 0
        : SUBSCRIPTION_PLANS[planTier]?.tokenAllowance?.monthlyPremiumUnits ?? 0);

    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString();

    const initialUsage: UserUsageState = {
      userId,
      planId: planTier,
      monthlyAllowanceUnits: allowance,
      usedUnits: 0,
      remainingUnits: allowance,
      percentageUsed: 0,
      isNearCap: false,
      isCapped: false,
      periodStart,
      periodEnd,
      premiumBreakdown: {},
      freeBreakdown: {},
      recentEvents: [],
    };

    this.balances.set(userId, initialUsage);
    return initialUsage;
  }

  public updatePlan(userId: string, newPlanTier: PlanTier | "LEADERSHIP" | "NONE"): UserUsageState {
    const current = this.getOrCreateBalance(userId);
    const newAllowance =
      newPlanTier === "LEADERSHIP"
        ? 25000000
        : newPlanTier === "NONE"
        ? 0
        : SUBSCRIPTION_PLANS[newPlanTier]?.tokenAllowance?.monthlyPremiumUnits ?? 0;

    current.planId = newPlanTier;
    current.monthlyAllowanceUnits = newAllowance;
    current.remainingUnits = Math.max(0, newAllowance - current.usedUnits);
    current.percentageUsed =
      newAllowance > 0 ? Math.min(100, Math.round((current.usedUnits / newAllowance) * 100)) : 0;
    current.isNearCap = current.percentageUsed >= 80;
    current.isCapped = current.percentageUsed >= 100;

    return current;
  }

  public processAIRequest(params: {
    userId: string;
    modelId: string;
    inputTokens: number;
    outputTokens: number;
    promptPreview: string;
  }): {
    success: boolean;
    model: AIModelDefinition;
    unitsDeducted: number;
    warningNearCap: boolean;
    remainingUnits: number;
    error?: string;
  } {
    const userState = this.getOrCreateBalance(params.userId);
    const model = getModelById(params.modelId);

    if (!model) {
      return {
        success: false,
        model: null as any,
        unitsDeducted: 0,
        warningNearCap: false,
        remainingUnits: userState.remainingUnits,
        error: `AI model "${params.modelId}" is not recognized.`,
      };
    }

    if (!model.enabled) {
      return {
        success: false,
        model,
        unitsDeducted: 0,
        warningNearCap: false,
        remainingUnits: userState.remainingUnits,
        error: `AI model "${model.name}" is temporarily disabled by administrator.`,
      };
    }

    // Check Plan Access
    if (!isModelAllowedForTier(params.modelId, userState.planId)) {
      return {
        success: false,
        model,
        unitsDeducted: 0,
        warningNearCap: false,
        remainingUnits: userState.remainingUnits,
        error: `AI model "${model.name}" requires an upgrade from ${userState.planId} plan.`,
      };
    }

    // Check FREE_UNLIMITED models: 0 units deducted!
    if (model.type === "FREE_UNLIMITED") {
      const freeRecord = userState.freeBreakdown[model.id] || {
        modelId: model.id,
        modelName: model.name,
        requestCount: 0,
        tokensProcessed: 0,
        avgLatencyMs: 12,
        fairUseStatus: "NORMAL",
      };

      freeRecord.requestCount += 1;
      freeRecord.tokensProcessed += params.inputTokens + params.outputTokens;
      userState.freeBreakdown[model.id] = freeRecord;

      return {
        success: true,
        model,
        unitsDeducted: 0,
        warningNearCap: false,
        remainingUnits: userState.remainingUnits,
      };
    }

    // PREMIUM Model: calculate weighted units
    const totalRaw = params.inputTokens + params.outputTokens;
    const requiredUnits = Math.ceil(totalRaw * model.unitWeight);

    // Check Quota Cap
    if (userState.usedUnits + requiredUnits > userState.monthlyAllowanceUnits) {
      userState.isCapped = true;
      userState.recentEvents.unshift({
        id: "evt_" + Math.random().toString(36).substring(2, 8),
        timestamp: new Date().toISOString(),
        modelId: model.id,
        modelName: model.name,
        promptPreview: params.promptPreview,
        rawTokens: totalRaw,
        unitsBilled: 0,
        status: "REJECTED_CAP",
      });

      return {
        success: false,
        model,
        unitsDeducted: 0,
        warningNearCap: true,
        remainingUnits: userState.remainingUnits,
        error: `Monthly premium token quota exceeded (${userState.usedUnits.toLocaleString()} / ${userState.monthlyAllowanceUnits.toLocaleString()} units). Upgrade plan or switch to unlimited NEXA / CodeXa models.`,
      };
    }

    // Deduct units atomically
    userState.usedUnits += requiredUnits;
    userState.remainingUnits = Math.max(0, userState.monthlyAllowanceUnits - userState.usedUnits);
    userState.percentageUsed = Math.min(100, Math.round((userState.usedUnits / userState.monthlyAllowanceUnits) * 100));
    userState.isNearCap = userState.percentageUsed >= 80;
    userState.isCapped = userState.percentageUsed >= 100;

    // Update premium breakdown
    const premRecord = userState.premiumBreakdown[model.id] || {
      modelId: model.id,
      modelName: model.name,
      rawInputTokens: 0,
      rawOutputTokens: 0,
      cachedTokens: 0,
      premiumUnitsBilled: 0,
      requestCount: 0,
    };
    premRecord.rawInputTokens += params.inputTokens;
    premRecord.rawOutputTokens += params.outputTokens;
    premRecord.premiumUnitsBilled += requiredUnits;
    premRecord.requestCount += 1;
    userState.premiumBreakdown[model.id] = premRecord;

    // Record audit event
    userState.recentEvents.unshift({
      id: "evt_" + Math.random().toString(36).substring(2, 8),
      timestamp: new Date().toISOString(),
      modelId: model.id,
      modelName: model.name,
      promptPreview: params.promptPreview,
      rawTokens: totalRaw,
      unitsBilled: requiredUnits,
      status: userState.isNearCap ? "WARNING_80" : "SUCCESS",
    });

    if (userState.recentEvents.length > 20) {
      userState.recentEvents = userState.recentEvents.slice(0, 20);
    }

    return {
      success: true,
      model,
      unitsDeducted: requiredUnits,
      warningNearCap: userState.isNearCap,
      remainingUnits: userState.remainingUnits,
    };
  }
}

export const meteringStore = new MeteringStore();

