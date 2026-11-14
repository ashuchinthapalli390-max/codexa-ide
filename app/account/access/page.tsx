"use client";

import React from "react";
import Link from "next/link";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { useAuth } from "@/lib/auth/AuthContext";
import { getRoleBadgeLabel, isLeadershipRole, isFounderRole } from "@/lib/auth/roles";
import {
  Shield,
  ShieldCheck,
  User,
  Key,
  Lock,
  ArrowLeft,
  CheckCircle2,
  FileText,
  Download,
  Cpu,
  Layers,
  Crown,
} from "lucide-react";

export default function AccountAccessPage() {
  return (
    <RoleGuard fallbackMessage="Please sign in with Google to view your access credentials.">
      <AccountAccessContent />
    </RoleGuard>
  );
}

function AccountAccessContent() {
  const { user, userProfile, role, entitlement, permissions } = useAuth();
  const roleLabel = getRoleBadgeLabel(role);
  const isLeadership = isLeadershipRole(role);
  const isFounder = isFounderRole(role);

  return (
    <div className="pt-28 pb-24 bg-[#000000] text-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div>
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Account Overview</span>
          </Link>

          <span className="text-[10px] font-mono uppercase tracking-widest text-[#A1A4AE] font-bold block mb-1">
            SECURITY &amp; CREDENTIALS
          </span>
          <h1 className="text-3xl sm:text-4xl font-orbitron font-bold text-white">
            Access &amp; Entitlement Governance
          </h1>
          <p className="text-xs sm:text-sm text-white/60 font-sans mt-2 max-w-xl">
            Authoritative verification of your verified CodeXa Agency identity, organization role, and authorized product entitlements.
          </p>
        </div>

        {/* 3 Pillars: Identity, Role, Entitlement (Phase 2 Separation) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1: Identity */}
          <div className="p-6 rounded-2xl bg-[#0D0E12] border border-white/10 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-white/40 block">PILLAR 1: IDENTITY</span>
              <h3 className="text-base font-orbitron font-bold text-white mt-0.5">Firebase Identity</h3>
            </div>
            <div className="space-y-2 text-xs font-mono text-white/70 divide-y divide-white/5">
              <div className="pt-1">
                <span className="text-white/40 text-[10px] block">UID</span>
                <span className="text-white font-bold break-all">{user?.uid}</span>
              </div>
              <div className="pt-2">
                <span className="text-white/40 text-[10px] block">Email</span>
                <span className="text-white break-all">{user?.email}</span>
              </div>
              <div className="pt-2">
                <span className="text-white/40 text-[10px] block">Auth Provider</span>
                <span className="text-emerald-400 font-bold">Google Sign-In (Verified)</span>
              </div>
            </div>
          </div>

          {/* Pillar 2: Organization Role */}
          <div className="p-6 rounded-2xl bg-[#0D0E12] border border-white/10 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-white/40 block">PILLAR 2: AGENCY POSITION</span>
              <h3 className="text-base font-orbitron font-bold text-white mt-0.5">Organization Role</h3>
            </div>
            <div className="space-y-2 text-xs font-mono text-white/70 divide-y divide-white/5">
              <div className="pt-1">
                <span className="text-white/40 text-[10px] block">Verified Position</span>
                <span className="text-purple-300 font-bold">{roleLabel}</span>
              </div>
              <div className="pt-2">
                <span className="text-white/40 text-[10px] block">Agency Status</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{userProfile?.agencyVerified ? "Agency Verified" : "Public Developer"}</span>
                </span>
              </div>
              <div className="pt-2">
                <span className="text-white/40 text-[10px] block">Governance Policy</span>
                <span className="text-white">{isLeadership ? "Leadership Exemption Active" : "Standard Policy"}</span>
              </div>
            </div>
          </div>

          {/* Pillar 3: Product Entitlement */}
          <div className="p-6 rounded-2xl bg-[#0D0E12] border border-white/10 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-white/40 block">PILLAR 3: IDE ACCESS</span>
              <h3 className="text-base font-orbitron font-bold text-white mt-0.5">Product Entitlement</h3>
            </div>
            <div className="space-y-2 text-xs font-mono text-white/70 divide-y divide-white/5">
              <div className="pt-1">
                <span className="text-white/40 text-[10px] block">Current Entitlement</span>
                <span className="text-emerald-400 font-bold uppercase">{entitlement}</span>
              </div>
              <div className="pt-2">
                <span className="text-white/40 text-[10px] block">Commercial Plan Needed?</span>
                <span className="text-white font-bold">{isLeadership ? "No (Exempted)" : "Customer Plan Applicable"}</span>
              </div>
              <div className="pt-2">
                <span className="text-white/40 text-[10px] block">Download Channel</span>
                <span className="text-white">{isLeadership ? "Internal Alpha & Beta" : "Public Beta Releases"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Assigned Permissions List */}
        <div className="p-8 rounded-2xl bg-[#0D0E12] border border-white/10 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-lg font-orbitron font-bold text-white">
                Authorized Capabilities &amp; Permissions
              </h3>
              <p className="text-xs text-white/60">
                Derived directly from verified organizational role and enforced on every API request.
              </p>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-white/10 text-white/80 font-bold">
              {permissions.length} Active Permissions
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
            {permissions.map((perm) => (
              <div key={perm} className="p-3 rounded-xl bg-[#14151B] border border-white/5 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-white/80">{perm.replace(/_/g, " ").toUpperCase()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Database & Privacy Isolation Assurance */}
        <div className="p-6 rounded-2xl bg-[#0C1210] border border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
            <div>
              <h4 className="text-sm font-orbitron font-bold text-white">Database Isolation Guarantee</h4>
              <p className="text-xs text-white/60 mt-0.5">
                This session connects strictly to the new <code className="text-emerald-400">ide-codexa</code> Firebase environment. Zero writes occur on the historical CodeXa Agency database.
              </p>
            </div>
          </div>
          <Link
            href="/founder"
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white text-white hover:text-black font-mono text-xs font-semibold transition-all shrink-0"
          >
            {isFounder ? "Founder Console" : "Security Details"}
          </Link>
        </div>

      </div>
    </div>
  );
}
