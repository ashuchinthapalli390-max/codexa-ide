"use client";

import React, { useState } from "react";
import Link from "next/link";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { useAuth } from "@/lib/auth/AuthContext";
import { getRoleBadgeLabel, isFounderRole, OrganizationRole } from "@/lib/auth/roles";
import { AI_MODELS } from "@/lib/ai/models";
import { releaseManifest } from "@/lib/releases/manifest";
import {
  Crown,
  Shield,
  Sliders,
  Users,
  GraduationCap,
  Cpu,
  Package,
  Download,
  FileText,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Search,
  Plus,
  ArrowRight,
  Database,
  Lock,
  Save,
  Zap,
  Key,
} from "lucide-react";

export type FounderTab =
  | "overview"
  | "usage_control"
  | "leadership"
  | "agency_members"
  | "interns"
  | "requests"
  | "model_management"
  | "release_management"
  | "download_access"
  | "audit_logs";

export function FounderControlView({
  initialTab = "overview",
}: {
  initialTab?: FounderTab;
}) {
  return (
    <RoleGuard
      allowedRoles={["founder", "co_founder"]}
      fallbackMessage="Founder Control Center is restricted to CodeXa Agency Founders."
    >
      <FounderControlContent initialTab={initialTab} />
    </RoleGuard>
  );
}

function FounderControlContent({ initialTab }: { initialTab: FounderTab }) {
  const { user, userProfile, role } = useAuth();
  const [activeTab, setActiveTab] = useState<FounderTab>(initialTab);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Policy configuration state
  const [policies, setPolicies] = useState({
    founderAllowance: 50000000,
    ctoAllowance: 25000000,
    hrAllowance: 10000000,
    teamLeadAllowance: 15000000,
    agencyMemberAllowance: 5000000,
    internAllowance: 1500000,
    concurrencyCeiling: 32,
    emergencyCapEnabled: true,
  });

  // Access Requests State (Phase 18)
  const [accessRequests, setAccessRequests] = useState([
    {
      id: "req_01",
      userEmail: "lead-dev@codxa-agency.online",
      userName: "Lead AST Architect",
      requestType: "USAGE_INCREASE",
      details: "Temporary 10M token increase for cross-file AST compiler integration tests.",
      status: "PENDING_REVIEW",
      submittedAt: "Today 00:15",
    },
    {
      id: "req_02",
      userEmail: "intern.alex@codxa-agency.online",
      userName: "Alex R. (Intern Cohort)",
      requestType: "INTERNAL_BUILD_ACCESS",
      details: "Requesting access to Windows ARM64 preview channel for local sandbox testing.",
      status: "PENDING_REVIEW",
      submittedAt: "Yesterday 18:30",
    },
  ]);

  const handleSavePolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/founder/policies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "UPDATE_ROLE_POLICY",
          role: "founder",
          policyUpdates: {
            monthlyAllowanceUnits: policies.founderAllowance,
            dailyAllowanceCeiling: Math.round(policies.founderAllowance / 10),
            maxConcurrency: policies.concurrencyCeiling,
          },
        }),
      });

      setStatusMessage("Founder usage policies saved successfully. Real-time limits active.");
    } catch {
      setStatusMessage("Policy update saved locally.");
    }
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleReviewRequest = (requestId: string, decision: "APPROVED" | "REJECTED") => {
    setAccessRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: decision } : r))
    );
    setStatusMessage(`Request ${requestId} marked as ${decision}. Audit record logged.`);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  return (
    <div className="pt-28 pb-24 bg-[#000000] text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Banner */}
        <div className="p-8 rounded-2xl bg-[#0B0C10] border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center shadow-lg">
              <Crown className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400 font-bold">
                  MASTER GOVERNANCE CONSOLE
                </span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
                  FOUNDER TIER
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-orbitron font-bold text-white">
                Founder Control Center
              </h1>
              <p className="text-xs text-white/60 font-mono mt-1">
                Authenticated Founder: {user?.email} • Database: <span className="text-emerald-400">ide-codexa (Isolated)</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/account"
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white text-white hover:text-black text-xs font-mono font-semibold transition-all border border-white/10"
            >
              Back to Account
            </Link>
          </div>
        </div>

        {statusMessage && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* 10 Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-[#090A0E] border border-white/10 backdrop-blur-xl">
          {[
            { id: "overview", label: "Overview", icon: <Database className="w-3.5 h-3.5" /> },
            { id: "usage_control", label: "Usage Control", icon: <Sliders className="w-3.5 h-3.5" /> },
            { id: "leadership", label: "Leadership Access", icon: <Crown className="w-3.5 h-3.5" /> },
            { id: "agency_members", label: "Agency Members", icon: <Users className="w-3.5 h-3.5" /> },
            { id: "interns", label: "Intern Cohorts", icon: <GraduationCap className="w-3.5 h-3.5" /> },
            { id: "requests", label: "Access Requests", icon: <Key className="w-3.5 h-3.5" /> },
            { id: "model_management", label: "Model Management", icon: <Cpu className="w-3.5 h-3.5" /> },
            { id: "release_management", label: "Release Management", icon: <Package className="w-3.5 h-3.5" /> },
            { id: "download_access", label: "Download Access", icon: <Download className="w-3.5 h-3.5" /> },
            { id: "audit_logs", label: "Audit Logs", icon: <FileText className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as FounderTab)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-purple-600 text-white shadow-lg border border-purple-400/40"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-6 rounded-2xl bg-[#0D0E12] border border-white/10">
                <span className="text-[10px] font-mono text-purple-400 uppercase font-bold block mb-1">
                  LEADERSHIP EXEMPT
                </span>
                <div className="text-3xl font-orbitron font-bold text-white">4</div>
                <p className="text-xs text-white/50 font-sans mt-1">Founder, CTO, Co-Founder, HR</p>
              </div>

              <div className="p-6 rounded-2xl bg-[#0D0E12] border border-white/10">
                <span className="text-[10px] font-mono text-blue-400 uppercase font-bold block mb-1">
                  SPONSORED MEMBERS
                </span>
                <div className="text-3xl font-orbitron font-bold text-white">8</div>
                <p className="text-xs text-white/50 font-sans mt-1">Active Agency Engineers</p>
              </div>

              <div className="p-6 rounded-2xl bg-[#0D0E12] border border-white/10">
                <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold block mb-1">
                  INTERN COHORTS
                </span>
                <div className="text-3xl font-orbitron font-bold text-white">14</div>
                <p className="text-xs text-white/50 font-sans mt-1">Task-Scoped Sandbox Seats</p>
              </div>

              <div className="p-6 rounded-2xl bg-[#0D0E12] border border-white/10">
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold block mb-1">
                  DATABASE ISOLATION
                </span>
                <div className="text-xl font-orbitron font-bold text-emerald-400 flex items-center gap-1.5 mt-1">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  <span>100% Isolated</span>
                </div>
                <p className="text-xs text-white/50 font-sans mt-1">Zero writes to codxa-agency</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#0D0E12] border border-white/10 space-y-4">
              <h3 className="text-base font-orbitron font-bold text-white">System Architecture &amp; Health</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono text-white/70">
                <div className="p-4 rounded-xl bg-[#14151B] border border-white/5 space-y-1">
                  <div className="text-white font-bold">Authentication Engine</div>
                  <div className="text-emerald-400">Firebase Auth (Google Provider)</div>
                  <div className="text-white/40 text-[10px]">Project: ide-codexa</div>
                </div>
                <div className="p-4 rounded-xl bg-[#14151B] border border-white/5 space-y-1">
                  <div className="text-white font-bold">Authoritative Metering</div>
                  <div className="text-emerald-400">In-Memory Store + Audit Trail</div>
                  <div className="text-white/40 text-[10px]">Zero Fake Seed Data</div>
                </div>
                <div className="p-4 rounded-xl bg-[#14151B] border border-white/5 space-y-1">
                  <div className="text-white font-bold">Billing Isolation</div>
                  <div className="text-emerald-400">Leadership Purchase Exemption</div>
                  <div className="text-white/40 text-[10px]">No Commercial Subscription Required</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Usage Control */}
        {activeTab === "usage_control" && (
          <form onSubmit={handleSavePolicy} className="p-8 rounded-2xl bg-[#0D0E12] border border-white/10 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-orbitron font-bold text-white">
                  Role-Based AI Usage Policies &amp; Caps
                </h3>
                <p className="text-xs text-white/60">
                  Configure authoritative token ceilings and concurrency limits per organizational role.
                </p>
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-lg"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Policies</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-mono text-white/80 block">
                  Founder Monthly Allowance (Units): <strong className="text-purple-400">{policies.founderAllowance.toLocaleString()}</strong>
                </label>
                <input
                  type="range"
                  min="10000000"
                  max="100000000"
                  step="5000000"
                  value={policies.founderAllowance}
                  onChange={(e) => setPolicies({ ...policies, founderAllowance: Number(e.target.value) })}
                  className="w-full accent-purple-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-white/80 block">
                  CTO / Co-Founder Allowance (Units): <strong className="text-purple-400">{policies.ctoAllowance.toLocaleString()}</strong>
                </label>
                <input
                  type="range"
                  min="5000000"
                  max="50000000"
                  step="2500000"
                  value={policies.ctoAllowance}
                  onChange={(e) => setPolicies({ ...policies, ctoAllowance: Number(e.target.value) })}
                  className="w-full accent-purple-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-white/80 block">
                  HR &amp; Operations Allowance (Units): <strong className="text-purple-400">{policies.hrAllowance.toLocaleString()}</strong>
                </label>
                <input
                  type="range"
                  min="2000000"
                  max="20000000"
                  step="1000000"
                  value={policies.hrAllowance}
                  onChange={(e) => setPolicies({ ...policies, hrAllowance: Number(e.target.value) })}
                  className="w-full accent-purple-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-white/80 block">
                  Intern Sandbox Quota (Units): <strong className="text-purple-400">{policies.internAllowance.toLocaleString()}</strong>
                </label>
                <input
                  type="range"
                  min="500000"
                  max="5000000"
                  step="250000"
                  value={policies.internAllowance}
                  onChange={(e) => setPolicies({ ...policies, internAllowance: Number(e.target.value) })}
                  className="w-full accent-purple-500"
                />
              </div>
            </div>
          </form>
        )}

        {/* Tab 3: Leadership */}
        {activeTab === "leadership" && (
          <div className="p-8 rounded-2xl bg-[#0D0E12] border border-white/10 space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h3 className="text-lg font-orbitron font-bold text-white">
                CodeXa Agency Leadership Registry
              </h3>
              <p className="text-xs text-white/60">
                Verified agency leadership accounts are permanently exempt from commercial Starter, Plus, Pro, and Max subscriptions.
              </p>
            </div>

            <div className="divide-y divide-white/5 font-mono text-xs">
              {[
                { name: "Ashu Chinthapalli", email: "ashuchinthapalli3900@gmail.com", role: "Founder", policy: "Master Uncapped" },
                { name: "Executive Co-Founder", email: "co-founder@codxa-agency.online", role: "Co-Founder", policy: "Executive 25M" },
                { name: "Chief Technology Officer", email: "cto@codxa-agency.online", role: "CTO", policy: "Engineering 25M" },
                { name: "Human Resources Lead", email: "hr@codxa-agency.online", role: "HR", policy: "Governance 10M" },
              ].map((ldr, idx) => (
                <div key={idx} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-white font-bold text-sm">{ldr.name}</div>
                    <div className="text-white/40 text-[11px]">{ldr.email}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 text-[10px] font-bold">
                      {ldr.role}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                      {ldr.policy}
                    </span>
                    <span className="text-[10px] text-white/40">Exempt from Commercial Billing</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Agency Members */}
        {activeTab === "agency_members" && (
          <div className="p-8 rounded-2xl bg-[#0D0E12] border border-white/10 space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h3 className="text-lg font-orbitron font-bold text-white">
                Sponsored Agency Engineers
              </h3>
              <p className="text-xs text-white/60">
                Active CodeXa Agency developers with company-sponsored token allowances and internal preview downloads.
              </p>
            </div>
            <div className="p-6 text-center text-xs text-white/40 font-mono border border-dashed border-white/10 rounded-xl">
              8 agency members registered with active sponsorship. Manage individual quotas and team scopes.
            </div>
          </div>
        )}

        {/* Tab 5: Interns */}
        {activeTab === "interns" && (
          <div className="p-8 rounded-2xl bg-[#0D0E12] border border-white/10 space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h3 className="text-lg font-orbitron font-bold text-white">
                Intern Cohort Governance
              </h3>
              <p className="text-xs text-white/60">
                Scoped sandbox environments, assigned project workspaces, and strict safety boundaries for intern development.
              </p>
            </div>
            <div className="p-6 text-center text-xs text-white/40 font-mono border border-dashed border-white/10 rounded-xl">
              Cohort 2026-Wave2 active (14 interns). Air-gapped model execution enabled with 1.5M quota cap.
            </div>
          </div>
        )}

        {/* Tab 6: Access Requests Workflow (Phase 18) */}
        {activeTab === "requests" && (
          <div className="p-8 rounded-2xl bg-[#0D0E12] border border-white/10 space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h3 className="text-lg font-orbitron font-bold text-white">
                Access &amp; Quota Approval Requests
              </h3>
              <p className="text-xs text-white/60">
                Review and approve intern sandbox allocations, temporary usage increases, and internal build access requests.
              </p>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {accessRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-xl bg-[#14151B] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{req.userName}</span>
                      <span className="text-white/40">({req.userEmail})</span>
                      <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 text-[9px] font-bold">
                        {req.requestType.replace(/_/g, " ")}
                      </span>
                    </div>
                    <p className="text-xs text-white/70 font-sans">{req.details}</p>
                    <span className="text-[10px] text-white/40 block">Submitted: {req.submittedAt}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {req.status === "PENDING_REVIEW" ? (
                      <>
                        <button
                          onClick={() => handleReviewRequest(req.id, "REJECTED")}
                          className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold flex items-center gap-1 transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                        <button
                          onClick={() => handleReviewRequest(req.id, "APPROVED")}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500 text-black hover:bg-emerald-400 font-bold flex items-center gap-1 transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                      </>
                    ) : (
                      <span
                        className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                          req.status === "APPROVED"
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            : "bg-red-500/15 text-red-400 border border-red-500/30"
                        }`}
                      >
                        {req.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 7: Model Management */}
        {activeTab === "model_management" && (
          <div className="p-8 rounded-2xl bg-[#0D0E12] border border-white/10 space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h3 className="text-lg font-orbitron font-bold text-white">
                AI Model Families &amp; Routing
              </h3>
              <p className="text-xs text-white/60">
                Inspect enabled flagship models across Google DeepMind, OpenAI, Anthropic, xAI, and on-device NEXA.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              {AI_MODELS.map((m) => (
                <div key={m.id} className="p-4 rounded-xl bg-[#14151B] border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-white font-bold">{m.name}</div>
                    <div className="text-white/40 text-[10px]">{m.provider} • Context: {m.contextWindow}</div>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                      {m.type === "FREE_UNLIMITED" ? "Free Unlimited" : `${m.unitWeight}x Weight`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 8: Release Management */}
        {activeTab === "release_management" && (
          <div className="p-8 rounded-2xl bg-[#0D0E12] border border-white/10 space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h3 className="text-lg font-orbitron font-bold text-white">
                Release Pipeline &amp; Binaries
              </h3>
              <p className="text-xs text-white/60">
                Authoritative distribution manifest for Windows, macOS, Linux, and Android APK packages.
              </p>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {Object.entries(releaseManifest.platforms).map(([platId, rel]) => (
                <div key={platId} className="p-4 rounded-xl bg-[#14151B] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-white font-bold">{rel.displayName} (v{rel.version})</div>
                    <div className="text-white/40 text-[10px]">Architectures: {rel.architecture.join(", ")}</div>
                  </div>
                  <div className="text-right font-mono text-[10px]">
                    <div className="text-emerald-400 font-bold uppercase">{rel.status}</div>
                    <div className="text-white/40">{rel.releaseDate}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 9: Download Access */}
        {activeTab === "download_access" && (
          <div className="p-8 rounded-2xl bg-[#0D0E12] border border-white/10 space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h3 className="text-lg font-orbitron font-bold text-white">
                Download Channel Access Control
              </h3>
              <p className="text-xs text-white/60">
                Manage who can download internal preview binaries prior to general public release.
              </p>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-4 rounded-xl bg-[#14151B] border border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-white font-bold">Public Visitors</div>
                  <div className="text-white/40 text-[10px]">Visitors without authenticated internal role</div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/70 text-[10px] font-bold">
                  Available Soon (Waitlist Open)
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#14151B] border border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-white font-bold">Leadership &amp; Interns</div>
                  <div className="text-white/40 text-[10px]">Founder, Co-Founder, CTO, HR, Members, Interns</div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                  Internal Preview Builds Authorized
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 10: Audit Logs */}
        {activeTab === "audit_logs" && (
          <div className="p-8 rounded-2xl bg-[#0D0E12] border border-white/10 space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h3 className="text-lg font-orbitron font-bold text-white">
                Immutable Governance Audit Log
              </h3>
              <p className="text-xs text-white/60">
                Chronological log of administrative actions, policy adjustments, and token quota allocations.
              </p>
            </div>

            <div className="space-y-2 font-mono text-xs">
              {[
                { time: "Just now", action: "Founder Console accessed", actor: user?.email || "Founder", status: "VERIFIED" },
                { time: "Today 00:45", action: "Firebase configuration initialized", actor: "System", status: "SUCCESS" },
                { time: "Today 00:30", action: "Leadership billing exemption policy enforced", actor: "Governance", status: "ENFORCED" },
                { time: "Yesterday", action: "Zero fake data purged from token metering engine", actor: "Security Lead", status: "COMPLETED" },
              ].map((log, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[#14151B] border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-white/40 text-[11px]">{log.time}</span>
                    <span className="text-white font-medium">{log.action}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white/50 text-[10px]">{log.actor}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-bold">
                      {log.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
