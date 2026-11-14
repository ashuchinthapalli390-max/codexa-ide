/**
 * CODEXA STUDIO IDE — ROLE-BASED ACCESS CONTROL (RBAC) & ENTITLEMENTS SPECIFICATION
 * 
 * CORE PRINCIPLE:
 * Organizational roles and Product Entitlements are distinct dimensions:
 * - organization_role: visitor | customer | intern | agency_member | leadership
 * - product_entitlement: free | starter | plus | pro | max | agency_sponsored
 */

export type OrganizationRole =
  | "public_visitor"
  | "customer"
  | "intern"
  | "agency_member"
  | "founder"
  | "co_founder"
  | "cto"
  | "hr"
  | "team_lead"
  | "admin";

export type ProductEntitlement =
  | "leadership_access"
  | "agency_sponsored"
  | "intern_assigned"
  | "customer_subscription"
  | "free"
  | "starter"
  | "plus"
  | "pro"
  | "max"
  | "no_entitlement";

export type Permission =
  | "view_public_site"
  | "view_account"
  | "manage_own_reviews"
  | "manage_own_notifications"
  | "view_intern_dashboard"
  | "view_intern_tasks"
  | "view_intern_learning"
  | "view_agency_dashboard"
  | "view_agency_teams"
  | "view_agency_resources"
  | "manage_intern_onboarding" // HR / Leadership
  | "manage_agency_onboarding" // HR / Founder
  | "moderate_reviews" // Admin
  | "manage_plans_pricing" // Admin / Founder
  | "view_audit_logs" // Leadership
  | "technical_oversight" // CTO
  | "founder_control" // Founder only
  | "manage_usage_policies" // Founder
  | "manage_releases" // Founder & CTO
  | "access_internal_downloads" // Leadership & internal users
  | "ide_unlimited_native" // All tiers
  | "ide_paid_models_access"; // Paid or leadership entitlements

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  provider: "google" | "password" | "anonymous";
  role: OrganizationRole;
  entitlement: ProductEntitlement;
  agencyVerified: boolean;
  agencyMemberId?: string;
  internCohort?: string;
  status: "active" | "suspended" | "pending_verification";
  createdAt: string;
  lastLoginAt: string;
  tokenBalance?: number;
  monthlyTokenQuota?: number;
}

/**
 * Static permission definitions mapped to each organizational role.
 * Applied with principle of least privilege.
 */
export const ROLE_PERMISSIONS: Record<OrganizationRole, Permission[]> = {
  public_visitor: ["view_public_site", "ide_unlimited_native"],
  
  customer: [
    "view_public_site",
    "view_account",
    "manage_own_reviews",
    "manage_own_notifications",
    "ide_unlimited_native",
  ],

  intern: [
    "view_public_site",
    "view_account",
    "view_intern_dashboard",
    "view_intern_tasks",
    "view_intern_learning",
    "manage_own_reviews",
    "manage_own_notifications",
    "ide_unlimited_native",
  ],

  agency_member: [
    "view_public_site",
    "view_account",
    "view_agency_dashboard",
    "view_agency_teams",
    "view_agency_resources",
    "manage_own_reviews",
    "manage_own_notifications",
    "ide_unlimited_native",
  ],

  team_lead: [
    "view_public_site",
    "view_account",
    "view_agency_dashboard",
    "view_agency_teams",
    "view_agency_resources",
    "view_intern_dashboard",
    "view_intern_tasks",
    "view_audit_logs",
    "manage_own_reviews",
    "ide_unlimited_native",
  ],

  hr: [
    "view_public_site",
    "view_account",
    "view_agency_dashboard",
    "view_intern_dashboard",
    "manage_intern_onboarding",
    "manage_agency_onboarding",
    "view_audit_logs",
    "manage_own_reviews",
    "ide_unlimited_native",
  ],

  cto: [
    "view_public_site",
    "view_account",
    "view_agency_dashboard",
    "technical_oversight",
    "manage_releases",
    "access_internal_downloads",
    "view_audit_logs",
    "manage_plans_pricing",
    "moderate_reviews",
    "ide_unlimited_native",
    "ide_paid_models_access",
  ],

  co_founder: [
    "view_public_site",
    "view_account",
    "view_agency_dashboard",
    "manage_intern_onboarding",
    "manage_agency_onboarding",
    "access_internal_downloads",
    "view_audit_logs",
    "moderate_reviews",
    "ide_unlimited_native",
    "ide_paid_models_access",
  ],

  founder: [
    "view_public_site",
    "view_account",
    "view_agency_dashboard",
    "view_intern_dashboard",
    "manage_intern_onboarding",
    "manage_agency_onboarding",
    "moderate_reviews",
    "manage_plans_pricing",
    "view_audit_logs",
    "technical_oversight",
    "founder_control",
    "manage_usage_policies",
    "manage_releases",
    "access_internal_downloads",
    "ide_unlimited_native",
    "ide_paid_models_access",
  ],

  admin: [
    "view_public_site",
    "view_account",
    "view_agency_dashboard",
    "view_intern_dashboard",
    "manage_intern_onboarding",
    "manage_agency_onboarding",
    "moderate_reviews",
    "manage_plans_pricing",
    "view_audit_logs",
    "technical_oversight",
    "founder_control",
    "manage_usage_policies",
    "manage_releases",
    "access_internal_downloads",
    "ide_unlimited_native",
    "ide_paid_models_access",
  ],
};

/**
 * Checks whether a user profile has a specific permission.
 */
export function hasPermission(user: UserProfile | null | undefined, permission: Permission): boolean {
  if (!user) {
    return ROLE_PERMISSIONS.public_visitor.includes(permission);
  }

  // Account must be active
  if (user.status !== "active") return false;

  const rolePerms = ROLE_PERMISSIONS[user.role] || [];
  return rolePerms.includes(permission);
}

/**
 * Helper to check if a role belongs to Leadership.
 */
export function isLeadershipRole(role: OrganizationRole): boolean {
  return [
    "founder",
    "co_founder",
    "cto",
    "hr",
    "team_lead",
    "admin",
  ].includes(role);
}

/**
 * Formats a role into a display badge label.
 */
export function getRoleBadgeLabel(role: OrganizationRole): string {
  switch (role) {
    case "founder":
      return "Founder";
    case "co_founder":
      return "Co-Founder";
    case "cto":
      return "CTO / Tech Lead";
    case "hr":
      return "HR Specialist";
    case "team_lead":
      return "Team Lead";
    case "admin":
      return "Administrator";
    case "agency_member":
      return "Agency Member";
    case "intern":
      return "CodeXa Intern";
    case "customer":
      return "Customer";
    default:
      return "Visitor";
  }
}

/**
 * Checks whether a user is a verified Founder.
 */
export function isFounderRole(role: OrganizationRole): boolean {
  return role === "founder";
}

/**
 * Returns human-readable entitlement description adhering to V19 rules:
 * Leadership accounts display "CodeXa Agency Leadership Access" instead of commercial plans.
 */
export function getEntitlementBadgeLabel(
  entitlement: ProductEntitlement,
  role: OrganizationRole
): string {
  if (isLeadershipRole(role)) {
    return "CodeXa Agency Leadership Access";
  }
  if (role === "agency_member" || entitlement === "agency_sponsored") {
    return "Agency Sponsored Access";
  }
  if (role === "intern" || entitlement === "intern_assigned") {
    return "CodeXa Intern Access";
  }
  switch (entitlement) {
    case "starter":
      return "Starter Tier";
    case "plus":
      return "Plus Tier";
    case "pro":
      return "Pro Tier";
    case "max":
      return "Max Tier";
    case "customer_subscription":
      return "Customer Subscription";
    case "free":
    case "no_entitlement":
    default:
      return "No Active Subscription";
  }
}
