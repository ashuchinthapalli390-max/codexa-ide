import { NextRequest, NextResponse } from "next/server";
import { promotionStore } from "@/lib/promotions/store";
import { PlanTier } from "@/lib/pricing/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { code = "CODEXA20", planId = "PLUS", userEmail } = body;

    const normalizedCode = (code || "CODEXA20").trim().toUpperCase();

    if (normalizedCode !== "CODEXA20") {
      return NextResponse.json(
        { error: "Invalid coupon code. Only CODEXA20 is valid for the pre-beta discount." },
        { status: 400 }
      );
    }

    if (promotionStore.isExpired()) {
      return NextResponse.json(
        { error: "This pre-beta promotion campaign has concluded." },
        { status: 410 }
      );
    }

    // Record claim
    const sessionCookie = req.cookies.get("cxa_session")?.value;
    const email = userEmail || (sessionCookie ? "dev@codxa-agency.online" : "prebeta.guest@codxa-agency.online");

    const redemption = promotionStore.claimDiscount(normalizedCode, planId as PlanTier, {
      id: "cxa_usr_" + Math.random().toString(36).substring(7),
      email: email,
    });

    const res = NextResponse.json({
      success: true,
      claimed: true,
      discountPercent: 20,
      couponCode: "CODEXA20",
      message: "Pre-Beta 20% discount successfully claimed! Pricing has been updated.",
      redemption,
    });

    // Set cookie so claim persists across page loads
    res.cookies.set("cxa_discount_claimed", "true", {
      httpOnly: false, // accessible to client for instant UI reactivity
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    return res;
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to claim coupon." },
      { status: 422 }
    );
  }
}
