import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get("cxa_session")?.value;

  if (!sessionCookie) {
    return NextResponse.json({
      authenticated: false,
      user: null,
      message: "No active session found.",
    });
  }

  try {
    if (sessionCookie.startsWith("{")) {
      const parsed = JSON.parse(sessionCookie);
      return NextResponse.json({
        authenticated: true,
        user: parsed,
      });
    }
  } catch {}

  return NextResponse.json({
    authenticated: false,
    user: null,
    message: "Invalid session.",
  });
}
