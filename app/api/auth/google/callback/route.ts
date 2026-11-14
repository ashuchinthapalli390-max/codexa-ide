import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const searchParams = req.nextUrl.searchParams;

  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const isDemo = searchParams.get("demo") === "true";
  const demoEmail = searchParams.get("email") || "developer@gmail.com";
  const demoName = searchParams.get("name") || "Google Developer";

  // Validate state cookie for CSRF protection if real OAuth
  if (code && !isDemo) {
    const savedState = req.cookies.get("cxa_oauth_state")?.value;
    if (!state || state !== savedState) {
      return NextResponse.redirect(`${origin}/?auth_error=csrf_validation_failed`);
    }
  }

  // Create authenticated user session
  const user = {
    id: "cxa_google_" + Math.random().toString(36).substring(2, 9),
    name: demoName,
    email: demoEmail,
    role: "DEVELOPER",
    provider: "google",
    agencyVerified: true,
  };

  const response = NextResponse.redirect(`${origin}/?auth_success=google`);

  // Persist session cookie
  response.cookies.set("cxa_session", JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}
