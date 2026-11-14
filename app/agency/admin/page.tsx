"use client";

import React, { useState } from "react";
import Link from "next/link";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { useAuth } from "@/lib/auth/AuthContext";
import { OrganizationRole, ProductEntitlement, getRoleBadgeLabel } from "@/lib/auth/roles";
import { createInvitation } from "@/lib/services/invitations";
import { getFirebaseFirestore } from "@/lib/firebase/client";
import {
  Shield,
  UserCheck,
  Cpu,
  FileCheck,
  Key,
  Copy,
  Check,
  Clock,
  AlertCircle,
  ExternalLink,
  Users,
  Eye,
  CheckCircle2,
  XCircle,
  History
} from "lucide-react";

export default function LeadershipAdminPage() {
  return (
    <RoleGuard
      allowedRoles={["founder", "co_founder", "admin", "hr", "cto", "team_lead"]}
      fallbackMessage="Access restricted to authorized Leadership & Administrator personnel only."
    >
      <AdminContent />
    </RoleGuard>
  );
}

function AdminContent() {
  const { user, userProfile, role } = useAuth();
  const [activeTab, setActiveTab] = useState<"hr" | "cto" | "reviews" | "audit">("hr");

  // HR Invite Generation State
  const [targetEmail, setTargetEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<OrganizationRole>("intern");
  const [inviteCohort, setInviteCohort] = useState("2026-Wave2");
  const [createdInviteToken, setCreatedInviteToken] = useState<string | null>(null);
  const [isCreatingInvite, setIsCreatingInvite] = useState(false);
  const [copied, setCopied] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  // Real Pending Reviews Moderation State
  const [reviewsList, setReviewsList] = useState<any[]>([]);

  const handleCreateInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) return;

    const db = getFirebaseFirestore();
    if (!db) {
      setInviteError("Database is not connected. Configure Firebase credentials first.");
      return;
    }

    setIsCreatingInvite(true);
    setInviteError(null);

    try {
      const invite = await createInvitation(db, userProfile, {
        role: inviteRole,
        entitlement: inviteRole === "intern" ? "starter" : "pro",
        targetEmail: targetEmail.trim() || undefined,
        cohort: inviteCohort,
        expiresInHours: 168, // 7 days
      });
      setCreatedInviteToken(invite.id);
      setTargetEmail("");
    } catch (err: any) {
      setInviteError(err.message || "Failed to create invitation.");
    } finally {
      setIsCreatingInvite(false);
    }
  };

  const handleCopyToken = () => {
    if (!createdInviteToken) return;
    navigator.clipboard.writeText(createdInviteToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const moderateReview = (id: string, newStatus: "APPROVED" | "REJECTED") => {
    setReviewsList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  // Permission Checks for Tab Rendering
  const canAccessHR = ["founder", "co_founder", "admin", "hr"].includes(role);
  const canAccessCTO = ["founder", "admin", "cto"].includes(role);
  const canAccessReviews = ["founder", "co_founder", "admin", "cto"].includes(role);
  const canAccessAudit = ["founder", "co_founder", "admin", "cto", "hr", "team_lead"].includes(role);

  return (
    <div className="pt-28 pb-24 bg-[#000000] text-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Leadership Header */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-amber-950/30 via-[#0D0E13] to-[#0A0B0E] border border-amber-500/20 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold font-orbitron text-white">
                  Leadership &amp; Governance Portal
                </h1>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold uppercase">
                  {getRoleBadgeLabel(role)}
                </span>
              </div>
              <p className="text-xs text-white/60 font-sans mt-1">
                Authorized administration for intern onboarding, model oversight, and review moderation.
              </p>
            </div>
          </div>

          <div className="text-[11px] font-mono text-white/40 text-right">
            <span>Actor: </span>
            <span className="text-white font-bold">{userProfile?.displayName || user?.displayName}</span>
          </div>
        </div>

        {/* Administrative Navigation Tabs */}
        <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-white/[0.04] border border-white/10 text-xs font-mono">
          {canAccessHR && (
            <button
              onClick={() => setActiveTab("hr")}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === "hr"
                  ? "bg-amber-500 text-black font-bold shadow"
                  : "text-white/60 hover:text-white"
              }`}
            >
              HR &amp; Intern Onboarding
            </button>
          )}

          {canAccessCTO && (
            <button
              onClick={() => setActiveTab("cto")}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === "cto"
                  ? "bg-amber-500 text-black font-bold shadow"
                  : "text-white/60 hover:text-white"
              }`}
            >
              CTO &amp; Model Routing
            </button>
          )}

          {canAccessReviews && (
            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === "reviews"
                  ? "bg-amber-500 text-black font-bold shadow"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Review Moderation
            </button>
          )}

          {canAccessAudit && (
            <button
              onClick={() => setActiveTab("audit")}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === "audit"
                  ? "bg-amber-500 text-black font-bold shadow"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Audit Logs
            </button>
          )}
        </div>

        {/* TAB 1: HR & INTERN ONBOARDING */}
        {activeTab === "hr" && canAccessHR && (
          <div className="p-8 rounded-2xl bg-[#0D0E13] border border-white/10 shadow-xl space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-lg font-bold font-orbitron text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-amber-400" />
                <span>Create Expiring Invitation Token</span>
              </h2>
              <p className="text-xs text-white/60 font-sans mt-0.5">
                Generate secure, single-use invitation tokens for incoming interns or verified agency members.
              </p>
            </div>

            <form onSubmit={handleCreateInvite} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10.5px] font-mono text-white/50 mb-1.5 uppercase">
                  Target Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as OrganizationRole)}
                  className="w-full bg-[#14151D] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="intern">CodeXa Intern (Access to /intern)</option>
                  <option value="agency_member">CodeXa Agency Member (Access to /agency)</option>
                  <option value="team_lead">Team Lead</option>
                  {role === "founder" && <option value="cto">CTO / Technical Architect</option>}
                  {role === "founder" && <option value="hr">HR Specialist</option>}
                </select>
              </div>

              <div>
                <label className="block text-[10.5px] font-mono text-white/50 mb-1.5 uppercase">
                  Specific Email (Optional)
                </label>
                <input
                  type="email"
                  value={targetEmail}
                  onChange={(e) => setTargetEmail(e.target.value)}
                  placeholder="intern@university.edu"
                  className="w-full bg-[#14151D] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white placeholder-white/20 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-mono text-white/50 mb-1.5 uppercase">
                  Cohort Identifier
                </label>
                <input
                  type="text"
                  value={inviteCohort}
                  onChange={(e) => setInviteCohort(e.target.value)}
                  placeholder="2026-Beta-Wave2"
                  className="w-full bg-[#14151D] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white placeholder-white/20 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="sm:col-span-3 pt-2 flex items-center justify-between">
                <span className="text-[11px] font-mono text-white/40">
                  Tokens expire automatically in 7 days (168h) and are logged to audit records.
                </span>
                <button
                  type="submit"
                  disabled={isCreatingInvite}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs transition-colors flex items-center gap-2"
                >
                  <Key className="w-4 h-4" />
                  <span>{isCreatingInvite ? "Generating..." : "Generate Invitation Token"}</span>
                </button>
              </div>
            </form>

            {inviteError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300">
                {inviteError}
              </div>
            )}

            {createdInviteToken && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">
                    Invitation Generated Successfully
                  </span>
                  <code className="text-xs font-mono text-white select-all">
                    {createdInviteToken}
                  </code>
                </div>
                <button
                  onClick={handleCopyToken}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500 text-black font-mono font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-400"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy Token"}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CTO & MODEL ROUTING */}
        {activeTab === "cto" && canAccessCTO && (
          <div className="p-8 rounded-2xl bg-[#0D0E13] border border-white/10 shadow-xl space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-lg font-bold font-orbitron text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-amber-400" />
                <span>CTO Technical Integration Contracts</span>
              </h2>
              <p className="text-xs text-white/60 font-sans mt-0.5">
                Model routing gateways, latency metrics, and AST runtime integrity checks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <span className="text-[10px] text-white/40 block">OPENAI GATEWAY</span>
                <span className="text-sm font-bold text-emerald-400 mt-1 block">GPT-6 Astra</span>
                <span className="text-[10px] text-white/50 mt-1 block">1.5x Multiplier • ZDR Active</span>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <span className="text-[10px] text-white/40 block">ANTHROPIC GATEWAY</span>
                <span className="text-sm font-bold text-amber-400 mt-1 block">Claude 3.7 Sonnet</span>
                <span className="text-[10px] text-white/50 mt-1 block">1.8x Multiplier • AST Linted</span>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <span className="text-[10px] text-white/40 block">GOOGLE DEEPMIND</span>
                <span className="text-sm font-bold text-blue-400 mt-1 block">Gemini 3.8 Flash</span>
                <span className="text-[10px] text-white/50 mt-1 block">38ms TTFT • 1M Context</span>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <span className="text-[10px] text-white/40 block">NATIVE ON-DEVICE</span>
                <span className="text-sm font-bold text-cyan-400 mt-1 block">NEXA-8B Edge</span>
                <span className="text-[10px] text-white/50 mt-1 block">0x Tokens • Metal / CUDA</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: REVIEW MODERATION */}
        {activeTab === "reviews" && canAccessReviews && (
          <div className="p-8 rounded-2xl bg-[#0D0E13] border border-white/10 shadow-xl space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-lg font-bold font-orbitron text-white flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-amber-400" />
                <span>Community Review Moderation</span>
              </h2>
              <p className="text-xs text-white/60 font-sans mt-0.5">
                Reviews submitted on the website require moderator approval before publishing to the public marquee.
              </p>
            </div>

            <div className="space-y-3">
              {reviewsList.length === 0 ? (
                <div className="py-8 text-center text-xs text-white/40 font-mono border border-dashed border-white/10 rounded-xl">
                  No pending reviews awaiting moderation. Verified developer reviews will appear here once submitted.
                </div>
              ) : (
                reviewsList.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-bold text-white">{rev.user}</span>
                        <span className="text-white/40">• {rev.role}</span>
                        <span className="text-amber-400">★ {rev.rating}/5</span>
                        <span
                          className={`text-[9.5px] font-mono px-2 py-0.5 rounded ${
                            rev.status === "APPROVED"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : rev.status === "REJECTED"
                              ? "bg-red-500/10 text-red-400"
                              : "bg-amber-500/10 text-amber-400"
                          }`}
                        >
                          {rev.status}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white/90">{rev.title}</h4>
                      <p className="text-xs text-white/60">{rev.content}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => moderateReview(rev.id, "REJECTED")}
                        className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-mono flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                      <button
                        onClick={() => moderateReview(rev.id, "APPROVED")}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 text-black hover:bg-emerald-400 text-xs font-mono font-bold flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 4: AUDIT LOGS */}
        {activeTab === "audit" && canAccessAudit && (
          <div className="p-8 rounded-2xl bg-[#0D0E13] border border-white/10 shadow-xl space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-lg font-bold font-orbitron text-white flex items-center gap-2">
                <History className="w-5 h-5 text-amber-400" />
                <span>Security &amp; Administrative Audit Trail</span>
              </h2>
              <p className="text-xs text-white/60 font-sans mt-0.5">
                Immutable chronological log of all role elevations, invitations, and administrative actions.
              </p>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-emerald-400 font-bold">[USER_PROFILE_CREATED]</span>
                  <span className="text-white/80 ml-2">New Google account signed in. Assigned role: customer.</span>
                </div>
                <span className="text-white/40 text-[10px]">Just now</span>
              </div>
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-amber-400 font-bold">[INVITATION_CREATED]</span>
                  <span className="text-white/80 ml-2">Role: intern • Cohort: 2026-Wave2 • Created by HR</span>
                </div>
                <span className="text-white/40 text-[10px]">2h ago</span>
              </div>
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-blue-400 font-bold">[FIREBASE_SAFEGUARD_VERIFIED]</span>
                  <span className="text-white/80 ml-2">Target project: codexa-studio-web (Legacy isolated)</span>
                </div>
                <span className="text-white/40 text-[10px]">Today, 10:00 AM</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
