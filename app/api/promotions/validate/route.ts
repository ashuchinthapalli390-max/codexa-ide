import { NextRequest, NextResponse } from "next/server";
import { promotionStore } from "@/lib/promotions/store";
import { PlanTier } from "@/lib/pricing/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, planId, userEmail } = body;

    if (!code) {
      return NextResponse.json(
        { valid: false, error: "Discount coupon code is required." },
        { status: 400 }
      );
    }

    const result = promotionStore.validateCoupon(
      code,
      planId as PlanTier | undefined,
      userEmail
    );

    if (!result.valid) {
      return NextResponse.json(result, { status: 422 });
    }

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { valid: false, error: err.message || "Failed to validate coupon." },
      { status: 500 }
    );
  }
}

