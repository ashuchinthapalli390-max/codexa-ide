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

export async function GET(req: NextRequest) {
  const { authorized } = verifyFounderSession(req);
  if (!authorized) {
    return NextResponse.json({ error: "Access restricted to verified Founder personnel only." }, { status: 403 });
  }

  const requests = policyGovernance.getAccessRequests();
  return NextResponse.json({ requests });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, requestId, decision, moderatorNotes, requestData } = body;

    // Submitting a new request (can be done by user or intern)
    if (action === "SUBMIT_REQUEST" && requestData) {
      const created = policyGovernance.submitAccessRequest(requestData);
      return NextResponse.json({ success: true, request: created });
    }

    // Reviewing a request (requires Founder auth)
    const { authorized, actor } = verifyFounderSession(req);
    if (!authorized) {
      return NextResponse.json({ error: "Access restricted to verified Founder personnel only." }, { status: 403 });
    }

    if (action === "REVIEW_REQUEST" && requestId && decision) {
      const reviewed = policyGovernance.reviewAccessRequest({
        requestId,
        decision,
        moderatorNotes: moderatorNotes || "Decision recorded by Founder",
        reviewerName: actor,
      });

      if (!reviewed) {
        return NextResponse.json({ error: "Request not found." }, { status: 404 });
      }

      return NextResponse.json({ success: true, request: reviewed });
    }

    return NextResponse.json({ error: "Invalid action or parameters." }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to process access request." }, { status: 500 });
  }
}
