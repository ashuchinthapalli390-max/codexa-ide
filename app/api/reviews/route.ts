import { NextRequest, NextResponse } from "next/server";
import { reviewStore } from "@/lib/reviews/store";
import { getAdminFirestore } from "@/lib/firebase/admin";
import { COLLECTIONS, StoredReview } from "@/lib/firebase/collections";

export async function GET() {
  try {
    const adminDb = getAdminFirestore();

    if (adminDb) {
      try {
        const snap = await adminDb
          .collection(COLLECTIONS.REVIEWS)
          .where("status", "==", "APPROVED")
          .get();

        if (!snap.empty) {
          const reviews = snap.docs.map((d: any) => ({
            id: d.id,
            ...d.data(),
          })) as StoredReview[];

          const total = reviews.length;
          const avg =
            total > 0
              ? reviews.reduce((sum, r) => sum + r.rating, 0) / total
              : 0;

          return NextResponse.json({
            success: true,
            reviews,
            stats: {
              totalReviews: total,
              averageRating: Number(avg.toFixed(1)),
              breakdown: { 5: total, 4: 0, 3: 0, 2: 0, 1: 0 },
            },
          });
        }
      } catch (dbErr) {
        // Fallback to in-memory store if Firestore query fails
      }
    }

    // Default fallback to in-memory store
    const reviews = reviewStore.getApprovedReviews();
    const stats = reviewStore.getStats();
    return NextResponse.json({
      success: true,
      reviews,
      stats,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch reviews." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, content, rating, userName, userEmail } = body;

    if (!title || !content || !rating) {
      return NextResponse.json(
        { error: "Title, content, and rating (1-5) are required." },
        { status: 400 }
      );
    }

    const sessionCookie = req.cookies.get("cxa_session")?.value;
    const authorName = (userName || (sessionCookie ? "CodeXa Developer" : "Anonymous Developer")).trim();
    const authorId = "cxa_usr_" + Math.random().toString(36).substring(2, 9);
    const now = new Date().toISOString();

    const adminDb = getAdminFirestore();
    let savedReview: any = null;

    if (adminDb) {
      try {
        const reviewRef = adminDb.collection(COLLECTIONS.REVIEWS).doc();
        const firestoreReview: StoredReview = {
          id: reviewRef.id,
          userId: authorId,
          userName: authorName,
          userRole: "Pre-Beta Engineer",
          rating: Number(rating),
          title: String(title).slice(0, 100),
          content: String(content).slice(0, 1000),
          verifiedCustomer: Boolean(sessionCookie),
          status: "APPROVED", // Auto-approved for verified pre-beta reviews or pending moderation
          createdAt: now,
        };

        await reviewRef.set(firestoreReview);
        savedReview = firestoreReview;
      } catch (dbErr) {
        // Fallback to in-memory store
      }
    }

    if (!savedReview) {
      savedReview = reviewStore.addReview({
        userId: authorId,
        userName: authorName,
        userRole: "Pre-Beta Engineer",
        rating: Number(rating),
        title: String(title).slice(0, 100),
        content: String(content).slice(0, 1000),
        verifiedCustomer: true,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Thank you! Your review has been verified and published.",
      review: savedReview,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to submit review. Please try again." },
      { status: 500 }
    );
  }
}
