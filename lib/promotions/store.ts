import { PromotionCampaign, CouponRedemption, CouponValidationResult } from "./types";
import { SUBSCRIPTION_PLANS } from "@/lib/pricing/plans";
import { PlanTier } from "@/lib/pricing/types";

// Server-authoritative promotion campaign store
export const DEFAULT_CAMPAIGN: PromotionCampaign = {
  id: "camp_prebeta_2026",
  code: "CODEXA20",
  name: "Pre-Beta Exclusive 20% Off",
  eyebrow: "PRE-BETA EXCLUSIVE",
  heading: "Build Early. Save 20%.",
  description:
    "Pre-book your CodeXa Studio IDE plan and unlock 20% off your first month. Get access to intelligent coding tools and a premium multi-model AI workspace.",
  highlight: "20% OFF ALL FOUR PLANS",
  discountPercent: 20,
  appliesToCycle: "FIRST_MONTH_ONLY",
  expiresAt: "2026-11-17T00:00:00+05:30", // Authoritative launch deadline in IST
  timezone: "Asia/Kolkata",
  isActive: true,
  allowedPlans: ["STARTER", "PLUS", "PRO", "MAX"],
  maxRedemptions: 5000,
  currentRedemptions: 142,
  createdAt: "2026-11-01T00:00:00Z",
  updatedAt: "2026-11-10T22:00:00Z",
};

// In-memory store (persists across requests during server lifetime)
class PromotionStore {
  private campaign: PromotionCampaign = { ...DEFAULT_CAMPAIGN };
  private redemptions: Map<string, CouponRedemption> = new Map();

  constructor() {
    // Seed initial redemptions for demonstration
    this.redemptions.set("cxa_usr_dev_01", {
      id: "red_01",
      campaignId: this.campaign.id,
      code: "CODEXA20",
      userEmail: "dev@codxa-agency.online",
      userId: "cxa_usr_dev_01",
      planId: "PRO",
      discountPercent: 20,
      originalPriceInr: 1716,
      discountedPriceInr: 1372.8,
      renewalPriceInr: 1716,
      status: "CONFIRMED",
      redeemedAt: new Date().toISOString(),
      checkoutSessionId: "cs_eval_9981",
    });
  }

  public getCampaign(): PromotionCampaign {
    return this.campaign;
  }

  public updateCampaign(updates: Partial<PromotionCampaign>): PromotionCampaign {
    this.campaign = {
      ...this.campaign,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.campaign;
  }

  public isExpired(): boolean {
    const expiryTime = new Date(this.campaign.expiresAt).getTime();
    return Date.now() >= expiryTime;
  }

  public validateCoupon(code: string, planId?: PlanTier, userEmail?: string): CouponValidationResult {
    const normalizedCode = (code || "").trim().toUpperCase();

    if (!this.campaign.isActive) {
      return { valid: false, code: normalizedCode, error: "Promotion campaign is currently inactive." };
    }

    if (this.isExpired()) {
      return { valid: false, code: normalizedCode, error: "The Pre-Beta 20% discount campaign has expired." };
    }

    if (normalizedCode !== this.campaign.code) {
      return { valid: false, code: normalizedCode, error: "Invalid discount coupon code." };
    }

    // Check plan restriction if plan provided
    const targetPlanId = planId || "PLUS";
    if (!this.campaign.allowedPlans.includes(targetPlanId)) {
      return { valid: false, code: normalizedCode, error: `Coupon is not valid for ${targetPlanId} plan.` };
    }

    // Check user redundancy if userEmail provided
    if (userEmail) {
      const existing = Array.from(this.redemptions.values()).find(
        (r) => r.userEmail.toLowerCase() === userEmail.toLowerCase() && r.code === normalizedCode
      );
      if (existing) {
        return {
          valid: false,
          code: normalizedCode,
          error: "You have already claimed this one-time Pre-Beta discount.",
        };
      }
    }

    const plan = SUBSCRIPTION_PLANS[targetPlanId];
    const originalPrice = plan.pricing.monthlyStandardInr;
    const discountAmount = Number(((originalPrice * this.campaign.discountPercent) / 100).toFixed(2));
    const discountedPrice = Number((originalPrice - discountAmount).toFixed(2));

    return {
      valid: true,
      code: this.campaign.code,
      campaign: {
        id: this.campaign.id,
        name: this.campaign.name,
        discountPercent: this.campaign.discountPercent,
        appliesToCycle: this.campaign.appliesToCycle,
        expiresAt: this.campaign.expiresAt,
        timezone: this.campaign.timezone,
      },
      pricing: {
        planId: targetPlanId,
        originalPriceInr: originalPrice,
        discountedPriceInr: discountedPrice,
        savingsInr: discountAmount,
        renewalPriceInr: originalPrice,
        billingCycle: "First month discounted; renews at standard monthly rate",
        taxesNote: "18% GST itemized separately at checkout.",
      },
    };
  }

  public claimDiscount(code: string, planId: PlanTier, user: { id: string; email: string }): CouponRedemption {
    const validation = this.validateCoupon(code, planId, user.email);
    if (!validation.valid || !validation.pricing) {
      throw new Error(validation.error || "Unable to claim coupon.");
    }

    const redemptionId = "red_" + Math.random().toString(36).substring(2, 10);
    const redemption: CouponRedemption = {
      id: redemptionId,
      campaignId: this.campaign.id,
      code: this.campaign.code,
      userId: user.id,
      userEmail: user.email,
      planId: planId,
      discountPercent: this.campaign.discountPercent,
      originalPriceInr: validation.pricing.originalPriceInr,
      discountedPriceInr: validation.pricing.discountedPriceInr,
      renewalPriceInr: validation.pricing.renewalPriceInr,
      status: "CONFIRMED",
      redeemedAt: new Date().toISOString(),
      checkoutSessionId: "cs_prebeta_" + Date.now(),
    };

    this.redemptions.set(user.email.toLowerCase(), redemption);
    this.campaign.currentRedemptions += 1;

    return redemption;
  }

  public getRedemptions(): CouponRedemption[] {
    return Array.from(this.redemptions.values());
  }
}

export const promotionStore = new PromotionStore();

