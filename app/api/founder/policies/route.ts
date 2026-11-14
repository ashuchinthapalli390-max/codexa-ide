import { NextRequest, NextResponse } from "next/server";
import { policyGovernance } from "@/lib/services/policy-service";
import { isFounderRole, OrganizationRole } from "@/lib/auth/roles";

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
  const { authorized, actor } = verifyFounderSession(req);
  if (!authorized) {
    return NextResponse.json({ error: "Access restricted to verified Founder personnel only." }, { status: 403 });
  }

  const rolePolicies = policyGovernance.getAllRolePolicies();
  const safetyBudget = policyGovernance.getSafetyBudget();
  const auditLogs = policyGovernance.getAuditLogs().slice(0, 25);

  return NextResponse.json({
    authorized: true,
    actor,
    rolePolicies,
    safetyBudget,
    auditLogs,
  });
}

export async function POST(req: NextRequest) {
  const { authorized, actor } = verifyFounderSession(req);
  if (!authorized) {
    return NextResponse.json({ error: "Access restricted to verified Founder personnel only." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { action, role, policyUpdates, safetyBudgetUpdates } = body;

    if (action === "UPDATE_ROLE_POLICY" && role) {
      policyGovernance.updateRolePolicy(role as OrganizationRole, policyUpdates, actor);
      return NextResponse.json({
        success: true,
        message: `Updated policy for ${role.toUpperCase()} successfully.`,
        updatedPolicy: policyGovernance.getRolePolicy(role as OrganizationRole),
      });
    }

    if (action === "UPDATE_SAFETY_BUDGET" && safetyBudgetUpdates) {
      policyGovernance.updateSafetyBudget(safetyBudgetUpdates, actor);
      return NextResponse.json({
        success: true,
        message: "Organization safety budget updated successfully.",
        safetyBudget: policyGovernance.getSafetyBudget(),
      });
    }

    return NextResponse.json({ error: "Invalid action or parameters." }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update governance policy." }, { status: 500 });
  }
}
