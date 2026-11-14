import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ ok: true, message: "Logged out from CodeXa Studio." });
  response.cookies.delete("cxa_session");
  return response;
}

