import { NextRequest, NextResponse } from "next/server";
import { meteringStore } from "@/lib/ai/metering";
import { PlanTier } from "@/lib/pricing/types";

function resolveSessionUser(req: NextRequest) {
  const sessionCookie = req.cookies.get("cxa_session")?.value;
  const uidParam = req.nextUrl.searchParams.get("uid");

  let userId = uidParam || "cxa_anonymous";
  let email = "";

  if (sessionCookie) {
    try {
      const decoded = decodeURIComponent(sessionCookie);
      if (decoded.startsWith("{")) {
        const parsed = JSON.parse(decoded);
        userId = parsed.uid || parsed.id || userId;
        email = parsed.email || "";
      } else {
        userId = sessionCookie;
      }
    } catch {
      userId = sessionCookie;
    }
  }

  const isLeadership =
    email.toLowerCase() === "ashuchinthapalli3900@gmail.com" ||
    email.toLowerCase().endsWith("@codxa-agency.online");

  const planTier: PlanTier | "LEADERSHIP" = isLeadership ? "LEADERSHIP" : "PLUS";

  return { userId, email, isLeadership, planTier };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { modelId, promptPreview, inputTokens = 1200, outputTokens = 450 } = body;

    const { userId, planTier } = resolveSessionUser(req);
    // Ensure balance initialized with user's tier
    meteringStore.getOrCreateBalance(userId, planTier);

    if (!modelId) {
      return NextResponse.json({ error: "Model identifier is required." }, { status: 400 });
    }

    const result = meteringStore.processAIRequest({
      userId,
      modelId,
      inputTokens: Number(inputTokens),
      outputTokens: Number(outputTokens),
      promptPreview: promptPreview || "In-editor inline synthesis",
    });

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error,
          quotaExceeded: result.error?.includes("quota exceeded"),
          upgradeRequired: result.error?.includes("requires an upgrade"),
          remainingUnits: result.remainingUnits,
        },
        { status: result.error?.includes("quota exceeded") ? 429 : 403 }
      );
    }

    return NextResponse.json({
      success: true,
      model: result.model.name,
      modelType: result.model.type,
      unitsDeducted: result.unitsDeducted,
      warningNearCap: result.warningNearCap,
      remainingUnits: result.remainingUnits,
      message:
        result.model.type === "FREE_UNLIMITED"
          ? "Execution successful (Free model: 0 premium units consumed)."
          : `Execution successful (${result.unitsDeducted.toLocaleString()} premium units consumed).`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to process token metering." }, { status: 500 });
  }
}
