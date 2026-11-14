import { NextResponse } from "next/server";
import { releaseManifest } from "@/lib/releases/manifest";

export async function GET() {
  return NextResponse.json({
    ok: true,
    data: releaseManifest,
    serverTime: new Date().toISOString(),
  });
}

