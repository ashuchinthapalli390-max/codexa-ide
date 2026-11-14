import { NextRequest, NextResponse } from "next/server";
import { notificationStore } from "@/lib/notifications/store";
import { getAdminFirestore } from "@/lib/firebase/admin";
import { COLLECTIONS } from "@/lib/firebase/collections";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, platform } = body;

    if (!email || typeof email !== "string" || !email.includes("@") || !email.includes(".")) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const validPlatforms = ["windows", "macos", "linux", "android", "ios", "all"];
    const targetPlatform = validPlatforms.includes((platform || "").toLowerCase())
      ? platform.toLowerCase()
      : "windows";

    const normalizedEmail = email.trim().toLowerCase();
    const now = new Date().toISOString();

    const adminDb = getAdminFirestore();
    if (adminDb) {
      try {
        const notifRef = adminDb.collection(COLLECTIONS.RELEASE_NOTIFICATIONS).doc();
        await notifRef.set({
          id: notifRef.id,
          email: normalizedEmail,
          platform: targetPlatform,
          createdAt: now,
          status: "active",
        });
      } catch (dbErr) {
        // Fallback to in-memory store
      }
    }

    const subscription = notificationStore.subscribe(email, targetPlatform);

    return NextResponse.json({
      success: true,
      message: `You're on the list! We'll notify you as soon as the ${targetPlatform.toUpperCase()} version becomes available.`,
      subscription,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to record notification preference. Please try again." },
      { status: 500 }
    );
  }
}
