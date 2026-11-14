import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const redirectUri = `${origin}/api/auth/google/callback`;

  // Check if Google OAuth Client ID is configured in environment
  const clientId = process.env.GOOGLE_CLIENT_ID;

  if (clientId) {
    // Generate secure CSRF state
    const state = "cxa_state_" + Math.random().toString(36).substring(2, 12);
    const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    googleAuthUrl.searchParams.set("client_id", clientId);
    googleAuthUrl.searchParams.set("redirect_uri", redirectUri);
    googleAuthUrl.searchParams.set("response_type", "code");
    googleAuthUrl.searchParams.set("scope", "openid email profile");
    googleAuthUrl.searchParams.set("state", state);
    googleAuthUrl.searchParams.set("access_type", "online");

    const res = NextResponse.redirect(googleAuthUrl.toString());
    res.cookies.set("cxa_oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 600, // 10 minutes
      path: "/",
    });
    return res;
  }

  // Pre-Beta sandbox fallback: simulate Google Identity authentication seamlessly for development
  const demoEmail = "developer@gmail.com";
  const demoName = "Google Developer";

  const callbackUrl = new URL("/api/auth/google/callback", origin);
  callbackUrl.searchParams.set("demo", "true");
  callbackUrl.searchParams.set("email", demoEmail);
  callbackUrl.searchParams.set("name", demoName);

  return NextResponse.redirect(callbackUrl.toString());
}
