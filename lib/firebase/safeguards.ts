/**
 * CODEXA STUDIO IDE — DATABASE ISOLATION & SAFEGUARDS MODULE
 * 
 * Protects against accidental database resets or unapproved targets.
 */

// Known dangerous project identifiers or unapproved override targets
const DEFAULT_FORBIDDEN_PROJECT_IDS: string[] = [
  "codxa-agency-destructive-reset",
  "unapproved-legacy-target",
];

export class LegacyDatabaseSafetyViolation extends Error {
  constructor(attemptedProjectId: string) {
    super(
      `[DATABASE SAFETY VIOLATION] Attempted to connect to an unauthorized or forbidden project ID: "${attemptedProjectId}". ` +
      `Database connection rejected by security safeguard.`
    );
    this.name = "LegacyDatabaseSafetyViolation";
  }
}

/**
 * Validates that the targeted project ID does not match any prohibited targets.
 */
export function assertSafeProjectId(projectId: string | undefined): void {
  if (!projectId) return;

  const envForbidden = (process.env.FORBIDDEN_LEGACY_PROJECT_IDS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  const allForbidden = Array.from(new Set([...DEFAULT_FORBIDDEN_PROJECT_IDS, ...envForbidden]));

  const normalized = projectId.trim().toLowerCase();

  for (const forbidden of allForbidden) {
    if (forbidden && normalized === forbidden) {
      throw new LegacyDatabaseSafetyViolation(projectId);
    }
  }
}

/**
 * Explicit connection labels to ensure clear separation in server code.
 */
export const CONNECTION_NAMESPACES = {
  CODEXA_WEB_FIREBASE: "codexaWebFirebase",
  LEGACY_AGENCY_READONLY: "legacyAgencyConnection",
} as const;
