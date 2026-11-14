/**
 * CODEXA STUDIO IDE — FIRESTORE COLLECTIONS & DATA CONTRACTS
 * 
 * Explicit schemas for the NEW isolated Firebase project.
 * Completely distinct and separate from any legacy Agency database.
 */

import { UserProfile, OrganizationRole, ProductEntitlement } from "@/lib/auth/roles";

// Collection Names
export const COLLECTIONS = {
  USERS: "users",
  USER_PROFILES: "user_profiles",
  ROLE_ASSIGNMENTS: "role_assignments",
  INVITATIONS: "invitations",
  ACCESS_REQUESTS: "access_requests",
  
  // Intern & Agency Workspaces
  INTERN_TASKS: "intern_tasks",
  INTERN_PROJECTS: "intern_projects",
  AGENCY_TEAMS: "agency_teams",
  AGENCY_RESOURCES: "agency_resources",

  // Billing & Subscriptions
  USER_SUBSCRIPTIONS: "user_subscriptions",
  AI_USAGE_EVENTS: "ai_usage_events",
  PREBETA_RESERVATIONS: "prebeta_reservations",

  // Website Data
  REVIEWS: "reviews",
  RELEASE_NOTIFICATIONS: "release_notifications",

  // Security & Audit
  AUDIT_LOGS: "audit_logs",
} as const;

// 1. Invitations Schema
export interface InvitationRecord {
  id: string; // Token
  targetEmail?: string;
  role: OrganizationRole;
  entitlement: ProductEntitlement;
  invitedBy: {
    uid: string;
    email: string;
    role: OrganizationRole;
  };
  cohort?: string;
  expiresAt: string;
  claimedAt?: string;
  claimedByUid?: string;
  status: "pending" | "claimed" | "revoked" | "expired";
  createdAt: string;
}

// 2. Intern Task Schema
export interface InternTask {
  id: string;
  internUid: string;
  title: string;
  description: string;
  category: "ide_testing" | "documentation" | "feature_testing" | "ast_indexing";
  status: "assigned" | "in_progress" | "submitted" | "completed";
  assignedBy: string;
  assignedAt: string;
  dueAt: string;
  completedAt?: string;
}

// 3. Agency Team Schema
export interface AgencyTeam {
  id: string;
  name: string;
  description: string;
  leadUid: string;
  memberUids: string[];
  createdAt: string;
}

// 4. User Subscription Schema
export interface UserSubscription {
  uid: string;
  planId: "free" | "starter" | "plus" | "pro" | "max";
  status: "active" | "canceled" | "past_due" | "prebeta_reserved";
  billingCycle: "monthly" | "annual";
  monthlyTokenQuota: number;
  tokensRemaining: number;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  updatedAt: string;
}

// 5. Review Submission Schema
export interface StoredReview {
  id: string;
  userId: string;
  userName: string;
  userRole?: string;
  rating: number; // 1-5
  title: string;
  content: string;
  verifiedCustomer: boolean;
  status: "APPROVED" | "PENDING" | "REJECTED";
  createdAt: string;
  moderatedAt?: string;
  moderatedBy?: string;
}

// 6. Pre-Beta Reservation Schema
export interface PreBetaReservation {
  id: string;
  uid?: string;
  email: string;
  selectedPlan: string;
  discountCode?: string;
  consentMarketing: boolean;
  reservedAt: string;
  status: "CONFIRMED" | "WAITLISTED";
}

// 7. Audit Log Entry Schema
export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorUid: string;
  actorEmail: string;
  actorRole: OrganizationRole;
  action:
    | "USER_PROFILE_CREATED"
    | "INVITATION_CREATED"
    | "INVITATION_CLAIMED"
    | "ROLE_ASSIGNED"
    | "ROLE_REVOKED"
    | "REVIEW_MODERATED"
    | "SUBSCRIPTION_UPDATED"
    | "AGENCY_LINK_REQUESTED";
  targetUid?: string;
  details: Record<string, any>;
  ipAddress?: string;
}
