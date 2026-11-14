"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { User, ShieldCheck, Zap, CreditCard, Sparkles, Key, ArrowRight, LogOut, GraduationCap, Briefcase, Shield, Crown } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { getRoleBadgeLabel, isLeadershipRole, isFounderRole } from "@/lib/auth/roles";
import { UsageDashboard } from "@/components/usage/UsageDashboard";

export default function AccountOverviewPage() {
  return (
    <RoleGuard fallbackMessage="Please sign in with Google to view your CodeXa account dashboard.">
      <AccountContent />
    </RoleGuard>
  );
}

function AccountContent() {
  const { user, userProfile, role, entitlement, signOut } = useAuth();
  const roleLabel = getRoleBadgeLabel(role);
  const isLeadership = isLeadershipRole(role);
  const isFounder = isFounderRole(role);

  return (
    <div className="pt-28 pb-24 bg-[#000000] text-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header Profile Banner */}
        <div className="p-8 rounded-2xl bg-[#0D0E13] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            {user?.photoURL ? (
              <Image
                src={user.photoURL}
                alt={user.displayName || "Avatar"}
                width={56}
                height={56}
                className="w-14 h-14 rounded-2xl object-cover shadow-lg border border-white/20"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-white text-black font-orbitron font-bold flex items-center justify-center text-xl shadow-lg">
                {user?.displayName ? user.displayName.charAt(0).toUpperCase() : "C"}
              </div>
            )}

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold font-orbitron text-white">
                  {userProfile?.displayName || user?.displayName || "CodeXa Developer"}
                </h1>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase font-bold">
                  {roleLabel}
                </span>
                {isLeadership ? (
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase font-bold">
                    CodeXa Agency Leadership Access • Verified Role: {roleLabel} • Assigned Leadership Policy
                  </span>
                ) : entitlement === "no_entitlement" || entitlement === "free" ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white/70 uppercase">
                    No Active Subscription
                  </span>
                ) : (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white/70 uppercase">
                    Plan: {entitlement.toUpperCase()}
                  </span>
                )}
              </div>
              <p className="text-xs text-white/50 font-mono mt-1">
                {user?.email} • UID: <span className="text-white/30">{user?.uid}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/account/usage"
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white text-white hover:text-black text-xs font-mono font-semibold transition-all border border-white/10"
            >
              Token Usage
            </Link>
            <button
              onClick={signOut}
              className="px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-mono font-semibold transition-all border border-red-500/20 flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Specialized Workspace Portals (based on user's verified role) */}
        {(role === "intern" || role === "agency_member" || isLeadership) && (
          <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/20 via-[#0E1016] to-blue-950/20 border border-white/15 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#A1A4AE] font-bold block">
              ORGANIZATIONAL WORKSPACES
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              {isFounder && (
                <Link
                  href="/founder"
                  className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Crown className="w-5 h-5 text-purple-400" />
                    <div>
                      <div className="text-xs font-orbitron font-bold text-white">Founder Control</div>
                      <div className="text-[10px] font-mono text-purple-300">Master Governance</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-purple-400" />
                </Link>
              )}

              {(role === "intern" || isLeadership) && (
                <Link
                  href="/intern"
                  className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-5 h-5 text-emerald-400" />
                    <div>
                      <div className="text-xs font-orbitron font-bold text-white">Intern Portal</div>
                      <div className="text-[10px] font-mono text-emerald-300">Tasks &amp; Learning</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                </Link>
              )}

              {(role === "agency_member" || isLeadership) && (
                <Link
                  href="/agency"
                  className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-5 h-5 text-blue-400" />
                    <div>
                      <div className="text-xs font-orbitron font-bold text-white">Agency Member Portal</div>
                      <div className="text-[10px] font-mono text-blue-300">Teams &amp; Resources</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-blue-400" />
                </Link>
              )}

              {isLeadership && (
                <Link
                  href="/agency/admin"
                  className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-amber-400" />
                    <div>
                      <div className="text-xs font-orbitron font-bold text-white">Leadership &amp; Admin</div>
                      <div className="text-[10px] font-mono text-amber-300">HR, CTO &amp; Governance</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Quick Nav Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Link
            href="/account/usage"
            className="p-6 rounded-2xl bg-[#0C0D12] border border-white/10 hover:border-white/20 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
                <Zap className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold font-orbitron text-white mb-1">
                AI Token Metering
              </h3>
              <p className="text-xs text-white/60">
                Monitor weighted unit consumption across Gemini, GPT-6 Astra, and frontier models.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-white font-semibold mt-4">
              <span>Inspect Quota</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/account/subscription"
            className="p-6 rounded-2xl bg-[#0C0D12] border border-white/10 hover:border-white/20 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-3">
                <CreditCard className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold font-orbitron text-white mb-1">
                {isLeadership ? "Leadership Policy" : "Plan & Entitlement"}
              </h3>
              <p className="text-xs text-white/60">
                {isLeadership
                  ? "CodeXa Agency Leadership Access active. Commercial subscription is not required."
                  : entitlement === "no_entitlement" || entitlement === "free"
                  ? "No Active Subscription. Explore pre-beta reservation tiers."
                  : `Current active tier: ${entitlement.toUpperCase()}. Review monthly tokens and quota limits.`}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-white font-semibold mt-4">
              <span>{isLeadership ? "View Leadership Terms" : "Manage Plan"}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/account/access"
            className="p-6 rounded-2xl bg-[#0C0D12] border border-white/10 hover:border-white/20 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-3">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold font-orbitron text-white mb-1">
                Access &amp; Security
              </h3>
              <p className="text-xs text-white/60">
                Identity verification, organization role, and authorized product entitlement.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-white font-semibold mt-4">
              <span>View Credentials</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Embedded Token Usage Dashboard */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-orbitron text-white">
              Active Entitlements &amp; Model Quota
            </h2>
          </div>
          <UsageDashboard />
        </div>

      </div>
    </div>
  );
}
