import { NextRequest, NextResponse } from "next/server";
import { promotionStore } from "@/lib/promotions/store";
import { SUBSCRIPTION_PLANS } from "@/lib/pricing/plans";
import { PlanTier } from "@/lib/pricing/types";

export async function GET(req: NextRequest) {
  // Permission check: in production verify agency role OWNER or ADMIN
  const sessionCookie = req.cookies.get("cxa_session")?.value;
  // For demo & management verification, return complete system status
  const campaign = promotionStore.getCampaign();
  const redemptions = promotionStore.getRedemptions();

  return NextResponse.json({
    campaign,
    redemptions,
    plans: SUBSCRIPTION_PLANS,
    metrics: {
      totalRedemptions: redemptions.length,
      activeCampaign: campaign.isActive && !promotionStore.isExpired(),
      maxCapacity: campaign.maxRedemptions,
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, updates, campaignUpdates } = body;

    if (action === "UPDATE_CAMPAIGN" && campaignUpdates) {
      const updated = promotionStore.updateCampaign(campaignUpdates);
      return NextResponse.json({ success: true, campaign: updated });
    }

    if (action === "UPDATE_PLAN_PRICE" && updates) {
      const { planId, standardPrice, discountedPrice } = updates;
      if (SUBSCRIPTION_PLANS[planId as PlanTier]) {
        SUBSCRIPTION_PLANS[planId as PlanTier].pricing.monthlyStandardInr = Number(standardPrice);
        SUBSCRIPTION_PLANS[planId as PlanTier].pricing.monthlyDiscountedInr = Number(discountedPrice);
        return NextResponse.json({ success: true, plan: SUBSCRIPTION_PLANS[planId as PlanTier] });
      }
    }

    return NextResponse.json({ error: "Invalid admin action requested." }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Admin update failed." }, { status: 500 });
  }
}

