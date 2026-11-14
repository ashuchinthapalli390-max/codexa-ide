import { doc, getDoc, updateDoc, setDoc, Firestore } from "firebase/firestore";
import { UserProfile, OrganizationRole, ProductEntitlement } from "@/lib/auth/roles";
import { COLLECTIONS, InvitationRecord, AuditLogEntry } from "@/lib/firebase/collections";

/**
 * Creates a secure, expiring invitation token for an intern or agency member.
 */
export async function createInvitation(
  db: Firestore,
  inviter: UserProfile,
  params: {
    role: OrganizationRole;
    entitlement: ProductEntitlement;
    targetEmail?: string;
    cohort?: string;
    expiresInHours?: number;
  }
): Promise<InvitationRecord> {
  // Validate inviter permission
  if (!["founder", "co_founder", "admin", "hr", "cto"].includes(inviter.role)) {
    throw new Error("Unauthorized: Only HR, Leadership or Admins can create invitations.");
  }

  const token = "inv_" + Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + (params.expiresInHours || 168) * 60 * 60 * 1000).toISOString();

  const invite: InvitationRecord = {
    id: token,
    targetEmail: params.targetEmail?.trim().toLowerCase(),
    role: params.role,
    entitlement: params.entitlement,
    invitedBy: {
      uid: inviter.uid,
      email: inviter.email,
      role: inviter.role,
    },
    cohort: params.cohort,
    expiresAt,
    status: "pending",
    createdAt: now.toISOString(),
  };

  const inviteRef = doc(db, COLLECTIONS.INVITATIONS, token);
  try {
    await setDoc(inviteRef, invite);
  } catch (err: any) {
    if (err?.message?.includes("offline") || err?.code === "unavailable") {
      throw new Error("Cloud Firestore is connecting or offline. Please ensure Cloud Firestore has been provisioned in the Firebase console.");
    }
    throw err;
  }

  // Write audit log
  try {
    const auditRef = doc(db, COLLECTIONS.AUDIT_LOGS, `aud_${Date.now()}`);
    const audit: AuditLogEntry = {
      id: auditRef.id,
      timestamp: now.toISOString(),
      actorUid: inviter.uid,
      actorEmail: inviter.email,
      actorRole: inviter.role,
      action: "INVITATION_CREATED",
      details: {
        inviteId: token,
        role: params.role,
        targetEmail: params.targetEmail,
        cohort: params.cohort,
      },
    };
    await setDoc(auditRef, audit);
  } catch (auditErr: any) {
    console.warn("[CodeXa Audit] Audit log write deferred:", auditErr?.message);
  }

  return invite;
}

/**
 * Claims an invitation for an authenticated user.
 */
export async function claimInvitation(
  db: Firestore,
  token: string,
  claimingUser: UserProfile
): Promise<{ success: boolean; message: string; updatedProfile?: UserProfile }> {
  const inviteRef = doc(db, COLLECTIONS.INVITATIONS, token.trim());
  let inviteSnap;
  try {
    inviteSnap = await getDoc(inviteRef);
  } catch (err: any) {
    if (err?.message?.includes("offline") || err?.code === "unavailable") {
      return {
        success: false,
        message: "Database is connecting or temporarily offline. Please ensure Cloud Firestore has been provisioned in the Firebase console and retry in a few moments.",
      };
    }
    throw err;
  }

  if (!inviteSnap.exists()) {
    return { success: false, message: "Invalid or non-existent invitation token." };
  }

  const invite = inviteSnap.data() as InvitationRecord;

  if (invite.status !== "pending") {
    return { success: false, message: `Invitation is no longer valid (Status: ${invite.status}).` };
  }

  if (new Date(invite.expiresAt) < new Date()) {
    await updateDoc(inviteRef, { status: "expired" });
    return { success: false, message: "This invitation has expired." };
  }

  if (invite.targetEmail && invite.targetEmail !== claimingUser.email.toLowerCase()) {
    return {
      success: false,
      message: `This invitation was issued specifically to ${invite.targetEmail}. Current account is ${claimingUser.email}.`,
    };
  }

  const now = new Date().toISOString();

  // Update invitation record
  await updateDoc(inviteRef, {
    status: "claimed",
    claimedAt: now,
    claimedByUid: claimingUser.uid,
  });

  // Update user profile in Firestore
  const userRef = doc(db, COLLECTIONS.USERS, claimingUser.uid);
  const updatedFields: Partial<UserProfile> = {
    role: invite.role,
    entitlement: invite.entitlement,
    agencyVerified: invite.role === "agency_member" || invite.role === "intern",
    internCohort: invite.cohort || claimingUser.internCohort,
  };

  await updateDoc(userRef, updatedFields);

  // Log audit entry
  const auditRef = doc(db, COLLECTIONS.AUDIT_LOGS, `aud_${Date.now()}`);
  const audit: AuditLogEntry = {
    id: auditRef.id,
    timestamp: now,
    actorUid: claimingUser.uid,
    actorEmail: claimingUser.email,
    actorRole: invite.role,
    action: "INVITATION_CLAIMED",
    targetUid: claimingUser.uid,
    details: {
      inviteId: token,
      assignedRole: invite.role,
      assignedEntitlement: invite.entitlement,
    },
  };
  await setDoc(auditRef, audit);

  const updatedProfile: UserProfile = {
    ...claimingUser,
    ...updatedFields,
  };

  return {
    success: true,
    message: `Invitation verified! You have been granted the ${invite.role} role.`,
    updatedProfile,
  };
}
