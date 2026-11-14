import { NextRequest, NextResponse } from "next/server";
import { SUBSCRIPTION_PLANS } from "@/lib/pricing/plans";
import { PlanTier, UserSubscription } from "@/lib/pricing/types";
import { promotionStore } from "@/lib/promotions/store";
import { meteringStore } from "@/lib/ai/metering";

// Store in-memory user subscriptions
const userSubscriptions: Map<string, UserSubscription> = new Map([
  [
    "cxa_usr_dev_01",
    {
      id: "sub_cxa_dev_01",
      userId: "cxa_usr_dev_01",
      userEmail: "dev@codxa-agency.online",
      planId: "PRO",
      status: "ACTIVE",
      billingCycle: "monthly",
      currentPeriodStart: "2026-11-01T00:00:00Z",
      currentPeriodEnd: "2026-12-01T00:00:00Z",
      renewalPriceInr: 1716,
      lastBilledPriceInr: 1372.8,
      discountApplied: {
        code: "CODEXA20",
        percent: 20,
        cycle: "FIRST_MONTH_ONLY",
      },
      createdAt: "2026-11-01T00:00:00Z",
      updatedAt: "2026-11-10T22:00:00Z",
    },
  ],
]);

export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get("cxa_session")?.value;
  const userId = sessionCookie ? "cxa_usr_dev_01" : "anonymous";
  const subscription = userSubscriptions.get(userId) || {
    id: "sub_guest",
    userId: "guest",
    userEmail: "guest@codxa-agency.online",
    planId: "STARTER" as PlanTier,
    status: "PRE_BOOKED" as const,
    billingCycle: "monthly" as const,
    currentPeriodStart: new Date().toISOString(),
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    renewalPriceInr: 328,
    lastBilledPriceInr: 262.4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const plan = SUBSCRIPTION_PLANS[subscription.planId];
  return NextResponse.json({
    subscription,
    plan,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { planId, couponCode, userEmail, agreeToTerms } = body;

    if (!agreeToTerms) {
      return NextResponse.json(
        { error: "You must agree to CodeXa Studio IDE subscription terms and renewal policies." },
        { status: 400 }
      );
    }

    if (!planId || !SUBSCRIPTION_PLANS[planId as PlanTier]) {
      return NextResponse.json({ error: "Invalid subscription plan selected." }, { status: 400 });
    }

    const targetPlan = SUBSCRIPTION_PLANS[planId as PlanTier];
    let finalFirstMonthPrice = targetPlan.pricing.monthlyStandardInr;
    let discountApplied = undefined;

    // Validate coupon if provided
    if (couponCode) {
      const validation = promotionStore.validateCoupon(couponCode, planId as PlanTier, userEmail);
      if (validation.valid && validation.pricing) {
        finalFirstMonthPrice = validation.pricing.discountedPriceInr;
        discountApplied = {
          code: couponCode.trim().toUpperCase(),
          percent: 20,
          cycle: "FIRST_MONTH_ONLY",
        };
      } else {
        return NextResponse.json({ error: validation.error || "Invalid coupon code." }, { status: 422 });
      }
    }

    const email = userEmail || "dev@codxa-agency.online";
    const userId = "cxa_usr_" + Math.random().toString(36).substring(7);

    const newSub: UserSubscription = {
      id: "sub_pre_" + Date.now(),
      userId,
      userEmail: email,
      planId: planId as PlanTier,
      status: "PRE_BOOKED",
      billingCycle: "monthly",
      currentPeriodStart: "2026-11-17T00:00:00+05:30",
      currentPeriodEnd: "2026-12-17T00:00:00+05:30",
      renewalPriceInr: targetPlan.pricing.monthlyStandardInr,
      lastBilledPriceInr: finalFirstMonthPrice,
      discountApplied,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    userSubscriptions.set(userId, newSub);
    // Update metering quota
    meteringStore.updatePlan(userId, planId as PlanTier);

    return NextResponse.json({
      success: true,
      message: `Successfully pre-booked CodeXa ${targetPlan.name} plan.`,
      subscription: newSub,
      itemizedBreakdown: {
        planName: targetPlan.name,
        standardPrice: targetPlan.pricing.monthlyStandardInr,
        firstMonthDiscount: discountApplied ? targetPlan.pricing.monthlyStandardInr - finalFirstMonthPrice : 0,
        subtotal: finalFirstMonthPrice,
        gst18: Number((finalFirstMonthPrice * 0.18).toFixed(2)),
        totalDueAtLaunch: Number((finalFirstMonthPrice * 1.18).toFixed(2)),
        renewalNotice: `Renews on Dec 17, 2026 at ₹${targetPlan.pricing.monthlyStandardInr}/mo + GST. Cancel anytime.`,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to process subscription." }, { status: 500 });
  }
}

