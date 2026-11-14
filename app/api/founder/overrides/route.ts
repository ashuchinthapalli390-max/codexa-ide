import { NextRequest, NextResponse } from "next/server";
import { policyGovernance } from "@/lib/services/policy-service";

function verifyFounderSession(req: NextRequest): { authorized: boolean; actor: string } {
  const sessionCookie = req.cookies.get("cxa_session")?.value;
  if (!sessionCookie) return { authorized: false, actor: "Anonymous" };

  try {
    const decoded = decodeURIComponent(sessionCookie);
    let email = "";
    if (decoded.startsWith("{")) {
      const parsed = JSON.parse(decoded);
      email = parsed.email || "";
    } else {
      email = decoded;
    }

    const isFounder =
      email.toLowerCase() === "ashuchinthapalli3900@gmail.com" ||
      email.toLowerCase() === "founder@codxa-agency.online";

    return { authorized: isFounder, actor: email || "Founder" };
  } catch {
    return { authorized: false, actor: "Unknown" };
  }
}

export async function POST(req: NextRequest) {
  const { authorized, actor } = verifyFounderSession(req);
  if (!authorized) {
    return NextResponse.json({ error: "Access restricted to verified Founder personnel only." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { action, userId, override } = body;

    if (action === "SET_OVERRIDE" && userId && override) {
      policyGovernance.setUserOverride(
        {
          ...override,
          userId,
          approvedBy: actor,
        },
        actor
      );

      return NextResponse.json({
        success: true,
        message: `Override applied to user ${userId} successfully.`,
      });
    }

    if (action === "REMOVE_OVERRIDE" && userId) {
      policyGovernance.removeUserOverride(userId, actor);
      return NextResponse.json({
        success: true,
        message: `Override removed from user ${userId}. Reverted to role default.`,
      });
    }

    return NextResponse.json({ error: "Invalid action or parameters." }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to process user override." }, { status: 500 });
  }
}
