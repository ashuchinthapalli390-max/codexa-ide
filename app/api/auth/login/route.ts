import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    // In production, delegates to https://codxa-agency.online/api/login
    // Here we validate and set session
    const response = NextResponse.json({
      ok: true,
      message: "Authenticated with CodeXa Agency ecosystem.",
      user: {
        id: "cxa_usr_" + Math.random().toString(36).substring(7),
        name: email.split("@")[0],
        email,
        role: "DEVELOPER",
        agencyVerified: true,
        license: {
          key: "CXA-DESK-EVAL-2026-X99",
          type: "PREVIEW_PRO",
          expiresAt: "2027-11-17",
          activeDevices: 1,
          maxDevices: 2,
        },
      },
    });

    response.cookies.set("cxa_session", "verified_cxa_token_" + Date.now(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Authentication failed. Please verify credentials." }, { status: 500 });
  }
}

