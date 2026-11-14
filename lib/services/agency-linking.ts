import { doc, getDoc, setDoc, Firestore } from "firebase/firestore";
import { UserProfile } from "@/lib/auth/roles";
import { COLLECTIONS, AuditLogEntry } from "@/lib/firebase/collections";

export interface AgencyLinkRequest {
  id: string;
  uid: string;
  email: string;
  claimedAgencyId: string;
  department?: string;
  requestedAt: string;
  status: "pending_review" | "approved" | "rejected";
  reviewedBy?: string;
  reviewedAt?: string;
}

/**
 * Requests linking of an existing CodeXa Agency member identity to the new Firebase account.
 * 
 * STRICT COMPLIANCE:
 * - This creates an access request in the NEW website database.
 * - Does NOT alter, delete, or write to any legacy Agency database tables.
 */
export async function requestAgencyLinking(
  db: Firestore,
  user: UserProfile,
  claimedAgencyId: string,
  department?: string
): Promise<{ success: boolean; message: string; requestId: string }> {
  const requestId = `req_${user.uid}`;
  const requestRef = doc(db, COLLECTIONS.ACCESS_REQUESTS, requestId);
  const now = new Date().toISOString();

  const reqData: AgencyLinkRequest = {
    id: requestId,
    uid: user.uid,
    email: user.email,
    claimedAgencyId: claimedAgencyId.trim(),
    department,
    requestedAt: now,
    status: "pending_review",
  };

  try {
    await setDoc(requestRef, reqData);
  } catch (err: any) {
    if (err?.message?.includes("offline") || err?.code === "unavailable") {
      return {
        success: false,
        message: "Database is connecting or temporarily offline. Please ensure Cloud Firestore has been provisioned in the Firebase console and retry in a few moments.",
        requestId,
      };
    }
    throw err;
  }

  // Write audit log
  try {
    const auditRef = doc(db, COLLECTIONS.AUDIT_LOGS, `aud_${Date.now()}`);
    const audit: AuditLogEntry = {
      id: auditRef.id,
      timestamp: now,
      actorUid: user.uid,
      actorEmail: user.email,
      actorRole: user.role,
      action: "AGENCY_LINK_REQUESTED",
      targetUid: user.uid,
      details: {
        claimedAgencyId,
        department,
      },
    };
    await setDoc(auditRef, audit);
  } catch (auditErr: any) {
    console.warn("[CodeXa Audit] Audit log write deferred:", auditErr?.message);
  }

  return {
    success: true,
    message: "Agency verification request submitted to HR & Leadership. You will receive an in-app confirmation once verified.",
    requestId,
  };
}
