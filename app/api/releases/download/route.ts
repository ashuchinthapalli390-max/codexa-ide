import { NextRequest, NextResponse } from "next/server";
import { releaseManifest } from "@/lib/releases/manifest";

function resolveSessionUser(req: NextRequest): { isAuthenticated: boolean; role: string; email: string } {
  const sessionCookie = req.cookies.get("cxa_session")?.value;
  if (!sessionCookie) return { isAuthenticated: false, role: "public_visitor", email: "" };

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
    const isLeadership = isFounder || email.toLowerCase().endsWith("@codxa-agency.online");

    return {
      isAuthenticated: true,
      role: isFounder ? "founder" : isLeadership ? "leadership" : "customer",
      email,
    };
  } catch {
    return { isAuthenticated: false, role: "public_visitor", email: "" };
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const platform = searchParams.get("platform") || "windows";
  const release = releaseManifest.platforms[platform];

  if (!release) {
    return NextResponse.json({ error: "Platform not supported." }, { status: 404 });
  }

  const { isAuthenticated, role, email } = resolveSessionUser(req);
  const isInternal = role === "founder" || role === "leadership" || role === "agency_member" || role === "intern";

  // If platform is in preview channel, require authenticated internal access
  if (release.status === "preview") {
    if (!isAuthenticated || !isInternal) {
      return NextResponse.json(
        {
          error: "Preview channel restricted. Public release is scheduled for 17 November 2026.",
          status: "preview",
          requiresAuth: true,
          notice: "Sign in with an authorized CodeXa Agency leadership or intern account to access preview builds.",
        },
        { status: 403 }
      );
    }
  }

  // If platform is scheduled/coming soon
  if (release.status === "coming_soon" || release.status === "planned") {
    return NextResponse.json(
      {
        message: `${release.displayName} build is currently in pipeline. Sign up for release notifications.`,
        status: release.status,
      },
      { status: 400 }
    );
  }

  // Authorized release response with genuine artifact metadata
  return NextResponse.json({
    ok: true,
    platform: release.displayName,
    version: release.version,
    fileSize: release.fileSize,
    sha256: release.sha256,
    downloadUrl: release.downloadUrl || "https://codxa-agency.online/downloads/releases/codexa-studio-latest.exe",
    instructions: release.instructions,
    authorizedUser: email || "Authorized Member",
    grantExpiresAt: new Date(Date.now() + 1000 * 60 * 30).toISOString(), // 30-min valid grant
  });
}
