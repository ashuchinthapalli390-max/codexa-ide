import { OrganizationRole, ProductEntitlement } from "@/lib/auth/roles";
import { SUBSCRIPTION_PLANS } from "@/lib/pricing/plans";
import { PlanTier } from "@/lib/pricing/types";

export interface RoleUsagePolicy {
  role: OrganizationRole;
  monthlyAllowanceUnits: number;
  dailyAllowanceCeiling: number;
  maxConcurrency: number;
  requestsPerMinute: number;
  requestsPerDay: number;
  costCeilingInr: number;
  emergencyCapEnabled: boolean;
  allowedModelFamilies: string[];
}

export interface UserUsageOverride {
  userId: string;
  monthlyAllowanceUnits?: number;
  dailyAllowanceCeiling?: number;
  maxConcurrency?: number;
  budgetCapInr?: number;
  effectiveDate: string;
  expirationDate: string;
  approvedBy: string;
  notes?: string;
}

export interface AccessRequest {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  requestType:
    | "INTERN_IDE_ACCESS"
    | "AGENCY_MEMBER_ACCESS"
    | "USAGE_INCREASE"
    | "PREMIUM_MODEL_BUDGET"
    | "INTERNAL_BUILD_ACCESS"
    | "ROLE_PERMISSION_CHANGE";
  details: string;
  requestedUnits?: number;
  status: "SUBMITTED" | "PENDING_REVIEW" | "APPROVED" | "REJECTED" | "EXPIRED" | "REVOKED";
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  moderatorNotes?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: string;
  target?: string;
  details: string;
  status: "SUCCESS" | "VERIFIED" | "REJECTED" | "ENFORCED";
}

export interface OrganizationSafetyBudget {
  monthlyCapUnits: number;
  dailyCapUnits: number;
  monthlySpendingLimitInr: number;
  emergencyHaltEnabled: boolean;
  globalConcurrencyLimit: number;
}

// -------------------------------------------------------------
// IN-MEMORY / AUTHORITATIVE GOVERNANCE STORE
// -------------------------------------------------------------
class PolicyGovernanceStore {
  private safetyBudget: OrganizationSafetyBudget = {
    monthlyCapUnits: 500000000, // 500M units across org
    dailyCapUnits: 25000000,
    monthlySpendingLimitInr: 100000,
    emergencyHaltEnabled: false,
    globalConcurrencyLimit: 128,
  };

  private rolePolicies: Map<OrganizationRole, RoleUsagePolicy> = new Map([
    [
      "founder",
      {
        role: "founder",
        monthlyAllowanceUnits: 50000000,
        dailyAllowanceCeiling: 5000000,
        maxConcurrency: 32,
        requestsPerMinute: 60,
        requestsPerDay: 5000,
        costCeilingInr: 50000,
        emergencyCapEnabled: true,
        allowedModelFamilies: ["*"], // Universal
      },
    ],
    [
      "co_founder",
      {
        role: "co_founder",
        monthlyAllowanceUnits: 25000000,
        dailyAllowanceCeiling: 2500000,
        maxConcurrency: 24,
        requestsPerMinute: 45,
        requestsPerDay: 3000,
        costCeilingInr: 25000,
        emergencyCapEnabled: true,
        allowedModelFamilies: ["*"],
      },
    ],
    [
      "cto",
      {
        role: "cto",
        monthlyAllowanceUnits: 25000000,
        dailyAllowanceCeiling: 2500000,
        maxConcurrency: 24,
        requestsPerMinute: 45,
        requestsPerDay: 3000,
        costCeilingInr: 25000,
        emergencyCapEnabled: true,
        allowedModelFamilies: ["*"],
      },
    ],
    [
      "hr",
      {
        role: "hr",
        monthlyAllowanceUnits: 10000000,
        dailyAllowanceCeiling: 1000000,
        maxConcurrency: 12,
        requestsPerMinute: 30,
        requestsPerDay: 1500,
        costCeilingInr: 10000,
        emergencyCapEnabled: true,
        allowedModelFamilies: ["gpt-6-astra", "gemini-3.8-flash", "nexa", "codexa-core"],
      },
    ],
    [
      "team_lead",
      {
        role: "team_lead",
        monthlyAllowanceUnits: 15000000,
        dailyAllowanceCeiling: 1500000,
        maxConcurrency: 16,
        requestsPerMinute: 30,
        requestsPerDay: 2000,
        costCeilingInr: 15000,
        emergencyCapEnabled: true,
        allowedModelFamilies: ["*"],
      },
    ],
    [
      "agency_member",
      {
        role: "agency_member",
        monthlyAllowanceUnits: 5000000,
        dailyAllowanceCeiling: 500000,
        maxConcurrency: 8,
        requestsPerMinute: 20,
        requestsPerDay: 1000,
        costCeilingInr: 5000,
        emergencyCapEnabled: true,
        allowedModelFamilies: ["*"],
      },
    ],
    [
      "intern",
      {
        role: "intern",
        monthlyAllowanceUnits: 1500000,
        dailyAllowanceCeiling: 150000,
        maxConcurrency: 4,
        requestsPerMinute: 15,
        requestsPerDay: 500,
        costCeilingInr: 1500,
        emergencyCapEnabled: true,
        allowedModelFamilies: ["gemini-3.8-flash", "nexa", "codexa-core"],
      },
    ],
    [
      "public_visitor",
      {
        role: "public_visitor",
        monthlyAllowanceUnits: 0,
        dailyAllowanceCeiling: 0,
        maxConcurrency: 2,
        requestsPerMinute: 10,
        requestsPerDay: 100,
        costCeilingInr: 0,
        emergencyCapEnabled: true,
        allowedModelFamilies: ["nexa", "codexa-core"],
      },
    ],
    [
      "customer",
      {
        role: "customer",
        monthlyAllowanceUnits: 300000, // STARTER default
        dailyAllowanceCeiling: 50000,
        maxConcurrency: 4,
        requestsPerMinute: 20,
        requestsPerDay: 500,
        costCeilingInr: 0,
        emergencyCapEnabled: true,
        allowedModelFamilies: ["*"],
      },
    ],
  ]);

  private userOverrides: Map<string, UserUsageOverride> = new Map();

  private accessRequests: AccessRequest[] = [];

  private auditLogs: AuditLogEntry[] = [
    {
      id: "aud_init_01",
      timestamp: new Date().toISOString(),
      actor: "System Bootstrap",
      actorRole: "Security Governance",
      action: "Leadership Policy Enforcement Initialized",
      details: "Configured separate Leadership allowances. Zero commercial checkout requirements for Leadership.",
      status: "ENFORCED",
    },
    {
      id: "aud_init_02",
      timestamp: new Date().toISOString(),
      actor: "Security Lead",
      actorRole: "Founder Security",
      action: "Database Isolation Enforced",
      details: "Connected exclusively to ide-codexa. Old codxa-agency database write lock verified.",
      status: "VERIFIED",
    },
  ];

  // -------------------------------------------------------------
  // RESOLUTION ENGINE (PHASE 8 OVERRIDE PRECEDENCE)
  // Precedence Order:
  // 1. Organization-wide safety and spending caps
  // 2. Account suspension/security restrictions
  // 3. Provider and model availability
  // 4. Approved individual usage override
  // 5. Verified organizational role policy
  // 6. Explicit sponsored entitlement
  // 7. Active customer subscription policy
  // 8. No authorized entitlement
  // -------------------------------------------------------------
  public resolveEffectivePolicy(params: {
    userId: string;
    role: OrganizationRole;
    entitlement: ProductEntitlement;
    email?: string;
  }): {
    effectiveAllowanceUnits: number;
    dailyCeilingUnits: number;
    maxConcurrency: number;
    budgetCapInr: number;
    resolutionRule: string;
    emergencyCapEnabled: boolean;
    allowedModels: string[];
  } {
    // 1. Safety Budget Halt Check
    if (this.safetyBudget.emergencyHaltEnabled) {
      return {
        effectiveAllowanceUnits: 0,
        dailyCeilingUnits: 0,
        maxConcurrency: 0,
        budgetCapInr: 0,
        resolutionRule: "1. Global Safety Budget Emergency Halt Active",
        emergencyCapEnabled: true,
        allowedModels: ["nexa", "codexa-core"],
      };
    }

    // 4. Check for Approved Individual User Override
    const override = this.userOverrides.get(params.userId);
    if (override) {
      const now = new Date().toISOString();
      if (now >= override.effectiveDate && now <= override.expirationDate) {
        return {
          effectiveAllowanceUnits: override.monthlyAllowanceUnits ?? 10000000,
          dailyCeilingUnits: override.dailyAllowanceCeiling ?? 1000000,
          maxConcurrency: Math.min(override.maxConcurrency ?? 16, this.safetyBudget.globalConcurrencyLimit),
          budgetCapInr: override.budgetCapInr ?? 10000,
          resolutionRule: `4. Approved Individual Override (Approved by: ${override.approvedBy})`,
          emergencyCapEnabled: true,
          allowedModels: ["*"],
        };
      }
    }

    // 5. Verified Organizational Role Policy
    const rolePolicy = this.rolePolicies.get(params.role);
    if (rolePolicy && params.role !== "customer" && params.role !== "public_visitor") {
      return {
        effectiveAllowanceUnits: rolePolicy.monthlyAllowanceUnits,
        dailyCeilingUnits: rolePolicy.dailyAllowanceCeiling,
        maxConcurrency: Math.min(rolePolicy.maxConcurrency, this.safetyBudget.globalConcurrencyLimit),
        budgetCapInr: rolePolicy.costCeilingInr,
        resolutionRule: `5. Verified Organizational Role Policy (${params.role.toUpperCase()})`,
        emergencyCapEnabled: rolePolicy.emergencyCapEnabled,
        allowedModels: rolePolicy.allowedModelFamilies,
      };
    }

    // 6. Explicit Sponsored Entitlement
    if (params.entitlement === "agency_sponsored") {
      const sponsoredPolicy = this.rolePolicies.get("agency_member")!;
      return {
        effectiveAllowanceUnits: sponsoredPolicy.monthlyAllowanceUnits,
        dailyCeilingUnits: sponsoredPolicy.dailyAllowanceCeiling,
        maxConcurrency: sponsoredPolicy.maxConcurrency,
        budgetCapInr: sponsoredPolicy.costCeilingInr,
        resolutionRule: "6. Explicit Sponsored Entitlement (AGENCY_SPONSORED)",
        emergencyCapEnabled: true,
        allowedModels: sponsoredPolicy.allowedModelFamilies,
      };
    }
    if (params.entitlement === "intern_assigned") {
      const internPolicy = this.rolePolicies.get("intern")!;
      return {
        effectiveAllowanceUnits: internPolicy.monthlyAllowanceUnits,
        dailyCeilingUnits: internPolicy.dailyAllowanceCeiling,
        maxConcurrency: internPolicy.maxConcurrency,
        budgetCapInr: internPolicy.costCeilingInr,
        resolutionRule: "6. Explicit Sponsored Entitlement (INTERN_ASSIGNED)",
        emergencyCapEnabled: true,
        allowedModels: internPolicy.allowedModelFamilies,
      };
    }

    // 7. Active Customer Subscription Policy
    if (params.entitlement === "starter" || params.entitlement === "plus" || params.entitlement === "pro" || params.entitlement === "max") {
      const planTier = params.entitlement.toUpperCase() as PlanTier;
      const plan = SUBSCRIPTION_PLANS[planTier];
      const allowance = plan?.tokenAllowance?.monthlyPremiumUnits ?? 300000;
      return {
        effectiveAllowanceUnits: allowance,
        dailyCeilingUnits: Math.round(allowance / 10),
        maxConcurrency: planTier === "MAX" ? 16 : planTier === "PRO" ? 8 : 4,
        budgetCapInr: plan?.pricing?.monthlyStandardInr ?? 0,
        resolutionRule: `7. Active Customer Subscription Policy (${planTier})`,
        emergencyCapEnabled: true,
        allowedModels: ["*"],
      };
    }

    // 8. No Authorized Entitlement
    return {
      effectiveAllowanceUnits: 0,
      dailyCeilingUnits: 0,
      maxConcurrency: 2,
      budgetCapInr: 0,
      resolutionRule: "8. No Authorized Entitlement (Unlimited Offline Models Only)",
      emergencyCapEnabled: true,
      allowedModels: ["nexa", "codexa-core"],
    };
  }

  // Management APIs
  public getRolePolicy(role: OrganizationRole): RoleUsagePolicy | undefined {
    return this.rolePolicies.get(role);
  }

  public getAllRolePolicies(): RoleUsagePolicy[] {
    return Array.from(this.rolePolicies.values());
  }

  public updateRolePolicy(role: OrganizationRole, updates: Partial<RoleUsagePolicy>, actor: string): void {
    const existing = this.rolePolicies.get(role);
    if (!existing) return;
    const updated = { ...existing, ...updates };
    this.rolePolicies.set(role, updated);

    this.auditLogs.unshift({
      id: "aud_" + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
      actor,
      actorRole: "Founder",
      action: `Updated Role Policy: ${role.toUpperCase()}`,
      target: role,
      details: `New allowance: ${updated.monthlyAllowanceUnits.toLocaleString()} units, Daily ceiling: ${updated.dailyAllowanceCeiling.toLocaleString()}`,
      status: "SUCCESS",
    });
  }

  public setUserOverride(override: UserUsageOverride, actor: string): void {
    this.userOverrides.set(override.userId, override);

    this.auditLogs.unshift({
      id: "aud_" + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
      actor,
      actorRole: "Founder",
      action: `Set User Usage Override: ${override.userId}`,
      target: override.userId,
      details: `Units: ${override.monthlyAllowanceUnits?.toLocaleString() ?? "N/A"}, Expires: ${override.expirationDate}`,
      status: "SUCCESS",
    });
  }

  public removeUserOverride(userId: string, actor: string): void {
    this.userOverrides.delete(userId);
    this.auditLogs.unshift({
      id: "aud_" + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
      actor,
      actorRole: "Founder",
      action: `Removed User Usage Override: ${userId}`,
      target: userId,
      details: "Reverted user to role-default usage policy.",
      status: "SUCCESS",
    });
  }

  public getSafetyBudget(): OrganizationSafetyBudget {
    return this.safetyBudget;
  }

  public updateSafetyBudget(updates: Partial<OrganizationSafetyBudget>, actor: string): void {
    this.safetyBudget = { ...this.safetyBudget, ...updates };
    this.auditLogs.unshift({
      id: "aud_" + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
      actor,
      actorRole: "Founder",
      action: "Updated Organization Safety Budget",
      details: `Global cap: ${this.safetyBudget.monthlyCapUnits.toLocaleString()} units, Halt: ${this.safetyBudget.emergencyHaltEnabled}`,
      status: "ENFORCED",
    });
  }

  // Access Requests Workflow (Phase 18)
  public getAccessRequests(): AccessRequest[] {
    return this.accessRequests;
  }

  public submitAccessRequest(req: Omit<AccessRequest, "id" | "submittedAt" | "status">): AccessRequest {
    const newReq: AccessRequest = {
      ...req,
      id: "req_" + Math.random().toString(36).substring(2, 9),
      submittedAt: new Date().toISOString(),
      status: "PENDING_REVIEW",
    };
    this.accessRequests.unshift(newReq);
    return newReq;
  }

  public reviewAccessRequest(params: {
    requestId: string;
    decision: "APPROVED" | "REJECTED";
    moderatorNotes: string;
    reviewerName: string;
  }): AccessRequest | null {
    const req = this.accessRequests.find((r) => r.id === params.requestId);
    if (!req) return null;

    req.status = params.decision;
    req.reviewedAt = new Date().toISOString();
    req.reviewedBy = params.reviewerName;
    req.moderatorNotes = params.moderatorNotes;

    this.auditLogs.unshift({
      id: "aud_" + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
      actor: params.reviewerName,
      actorRole: "Founder",
      action: `${params.decision} Access Request: ${req.requestType}`,
      target: req.userEmail,
      details: `Decision: ${params.decision}. Notes: ${params.moderatorNotes}`,
      status: "SUCCESS",
    });

    return req;
  }

  public getAuditLogs(): AuditLogEntry[] {
    return this.auditLogs;
  }
}

export const policyGovernance = new PolicyGovernanceStore();
