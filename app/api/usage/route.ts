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

export async function GET(req: NextRequest) {
  const { userId, isLeadership, planTier } = resolveSessionUser(req);
  const usage = meteringStore.getOrCreateBalance(userId, planTier);

  return NextResponse.json({
    usage,
    isLeadership,
    policy: {
      freeModels: "NEXA & CodeXa Models have unlimited execution under fair-use monitoring.",
      premiumUnitExplanation:
        "Premium token units are model-weighted. Each model consumes units proportional to underlying inference complexity.",
      overageBehavior: isLeadership
        ? "CodeXa Agency Leadership Policy active. Extended allowance with administrative controls."
        : "When premium units reach 80%, a notification banner appears. At 100%, premium requests halt with a prompt to upgrade or fall back to free unlimited models. No surprise overage billing.",
    },
  });
}
