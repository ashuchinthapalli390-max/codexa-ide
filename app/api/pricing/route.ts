import { NextResponse } from "next/server";
import { getAllPlans } from "@/lib/pricing/plans";
import { AI_MODELS } from "@/lib/ai/models";
import { promotionStore } from "@/lib/promotions/store";

export async function GET() {
  const plans = getAllPlans();
  const campaign = promotionStore.getCampaign();
  const isCampaignActive = campaign.isActive && !promotionStore.isExpired();

  return NextResponse.json({
    currency: "INR",
    campaign: {
      active: isCampaignActive,
      code: campaign.code,
      discountPercent: campaign.discountPercent,
      expiresAt: campaign.expiresAt,
      timezone: campaign.timezone,
    },
    plans,
    models: AI_MODELS,
    disclosures: {
      firstMonthOffer: "20% Pre-Beta discount applies to first billing cycle only.",
      renewalTerms: "Subsequent billing cycles bill at the normal standard monthly price.",
      taxes: "18% GST itemized separately at checkout.",
      cancellation: "Cancel anytime from your CodeXa Agency subscription dashboard.",
    },
  });
}

