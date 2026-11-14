export interface AgencyUser {
  id: string;
  name: string;
  email: string;
  role: "OWNER" | "ADMIN" | "CORE_TEAM" | "INTERN" | "CLIENT" | "DEVELOPER";
  avatarUrl?: string;
  agencyVerified: boolean;
  license?: {
    key: string;
    type: "PREVIEW_PRO" | "ENTERPRISE_STUDIO" | "AGENCY_INTERNAL";
    expiresAt: string;
    activeDevices: number;
    maxDevices: number;
  };
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AgencyUser | null;
  isLoading: boolean;
  error?: string | null;
}

export const AGENCY_AUTH_ENDPOINTS = {
  portalLogin: "https://codxa-agency.online/login",
  portalApps: "https://codxa-agency.online/dashboard/apps",
  verifySession: "/api/auth/session",
  login: "/api/auth/login",
  logout: "/api/auth/logout",
};

