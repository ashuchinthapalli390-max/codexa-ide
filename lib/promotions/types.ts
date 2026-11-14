export interface PromotionCampaign {
  id: string;
  code: string;
  name: string;
  eyebrow: string;
  heading: string;
  description: string;
  highlight: string;
  discountPercent: number;
  appliesToCycle: "FIRST_MONTH_ONLY" | "RECURRING";
  expiresAt: string; // ISO 8601 with timezone (e.g. 2026-11-17T00:00:00+05:30)
  timezone: string;
  isActive: boolean;
  allowedPlans: Array<"STARTER" | "PLUS" | "PRO" | "MAX">;
  maxRedemptions: number;
  currentRedemptions: number;
  createdAt: string;
  updatedAt: string;
}

export interface CouponRedemption {
  id: string;
  campaignId: string;
  code: string;
  userEmail: string;
  userId?: string;
  planId: "STARTER" | "PLUS" | "PRO" | "MAX";
  discountPercent: number;
  originalPriceInr: number;
  discountedPriceInr: number;
  renewalPriceInr: number;
  status: "APPLIED" | "CONFIRMED" | "CANCELLED";
  redeemedAt: string;
  checkoutSessionId?: string;
}

export interface CouponValidationResult {
  valid: boolean;
  code: string;
  campaign?: {
    id: string;
    name: string;
    discountPercent: number;
    appliesToCycle: string;
    expiresAt: string;
    timezone: string;
  };
  pricing?: {
    planId: string;
    originalPriceInr: number;
    discountedPriceInr: number;
    savingsInr: number;
    renewalPriceInr: number;
    billingCycle: string;
    taxesNote: string;
  };
  error?: string;
}

