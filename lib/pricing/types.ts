export type PlanTier = "STARTER" | "PLUS" | "PRO" | "MAX";

export interface SubscriptionPlan {
  id: PlanTier;
  name: string;
  tagline: string;
  badge?: string;
  isRecommended?: boolean;
  pricing: {
    monthlyStandardInr: number;
    monthlyDiscountedInr: number;
    discountPercent: number;
    currency: "INR";
    billingCycle: "monthly";
    renewalNotice: string;
    taxNotice: string;
  };
  tokenAllowance: {
    monthlyPremiumUnits: number;
    unitDescription: string;
    isProvisional: boolean;
  };
  modelAccess: {
    freeModels: string[];
    premiumModels: string[];
    notes: string;
  };
  features: string[];
  ctaText: string;
  prebookCtaText: string;
}

export interface UserSubscription {
  id: string;
  userId: string;
  userEmail: string;
  planId: PlanTier;
  status: "ACTIVE" | "PRE_BOOKED" | "TRIALING" | "PAST_DUE" | "CANCELLED";
  billingCycle: "monthly";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  renewalPriceInr: number;
  lastBilledPriceInr: number;
  discountApplied?: {
    code: string;
    percent: number;
    cycle: string;
  };
  createdAt: string;
  updatedAt: string;
}

