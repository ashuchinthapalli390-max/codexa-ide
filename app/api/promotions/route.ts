import { NextResponse } from "next/server";
import { promotionStore } from "@/lib/promotions/store";

export async function GET() {
  const campaign = promotionStore.getCampaign();
  const isExpired = promotionStore.isExpired();

  return NextResponse.json({
    active: campaign.isActive && !isExpired,
    isExpired,
    campaign: {
      id: campaign.id,
      code: campaign.code,
      name: campaign.name,
      eyebrow: campaign.eyebrow,
      heading: campaign.heading,
      description: campaign.description,
      highlight: campaign.highlight,
      discountPercent: campaign.discountPercent,
      appliesToCycle: campaign.appliesToCycle,
      expiresAt: campaign.expiresAt,
      timezone: campaign.timezone,
      allowedPlans: campaign.allowedPlans,
      redemptionsCount: campaign.currentRedemptions,
    },
    serverTime: new Date().toISOString(),
  });
}

