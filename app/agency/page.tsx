"use client";

import React from "react";
import Link from "next/link";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { useAuth } from "@/lib/auth/AuthContext";
import { getRoleBadgeLabel, isLeadershipRole } from "@/lib/auth/roles";
import {
  Briefcase,
  Users,
  FolderGit2,
  BookOpen,
  CheckCircle2,
  Shield,
  ArrowRight,
  ExternalLink,
  Cpu
} from "lucide-react";

export default function AgencyPortalPage() {
  return (
    <RoleGuard
      allowedRoles={["agency_member", "founder", "co_founder", "admin", "hr", "cto", "team_lead"]}
      fallbackMessage="Access restricted. Verified CodeXa Agency membership or Leadership role required."
    >
      <AgencyContent />
    </RoleGuard>
  );
}

const TEAMS = [
  {
    name: "AI Core & Model Gateways",
    role: "Core Developer",
    leads: "CTO / Lead Architect",
    focus: "OpenAI GPT-6 Astra, Gemini 3.8 Flash, NEXA-8B runtime",
  },
  {
    name: "IDE Desktop Workbench",
    role: "Contributor",
    leads: "Workbench Lead",
    focus: "Monaco editor canvas, AST symbol indexing, split diff hunks",
  },
  {
    name: "Agency Security & Keyring",
    role: "Reviewer",
    leads: "Security Lead",
    focus: "BYOK OS Keychain pass-through, zero customer code telemetry",
  },
];

const REPOSITORIES = [
  { name: "codexa/studio-desktop-core", branch: "main", status: "Clean", language: "TypeScript / Rust" },
  { name: "codexa/nexa-runtime-engine", branch: "v0.8.4-canary", status: "Building", language: "C++ / Metal" },
  { name: "codexa/ast-indexer-ts", branch: "perf-symbols", status: "Merged", language: "TypeScript" },
];

function AgencyContent() {
  const { user, userProfile, role } = useAuth();
  const isLeadership = isLeadershipRole(role);

  return (
    <div className="pt-28 pb-24 bg-[#000000] text-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header Banner */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-blue-950/30 via-[#0D0E13] to-[#0A0B0E] border border-blue-500/20 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-lg">
              <Briefcase className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold font-orbitron text-white">
                  CodeXa Agency Member Portal
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 font-bold uppercase">
                  Verified Member
                </span>
              </div>
              <p className="text-xs text-white/60 font-sans mt-1">
                Collaborative resources, active squads, and engineering repositories for verified CodeXa Agency team members.
              </p>
            </div>
          </div>

          {isLeadership && (
            <Link
              href="/agency/admin"
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-orbitron font-bold text-xs transition-colors flex items-center gap-2 shrink-0 shadow"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Leadership Dashboard</span>
            </Link>
          )}
        </div>

        {/* Section 1: Assigned Teams */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold font-orbitron text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-400" />
            <span>Assigned Teams &amp; Squads</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TEAMS.map((team, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#0C0D12] border border-white/10 hover:border-white/20 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold font-orbitron text-white">
                    {team.name}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300">
                    {team.role}
                  </span>
                </div>
                <p className="text-xs text-white/60 font-sans leading-relaxed">
                  {team.focus}
                </p>
                <div className="pt-2 border-t border-white/[0.08] text-[10.5px] font-mono text-white/40">
                  Lead: {team.leads}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Repositories & Modules */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold font-orbitron text-white flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-emerald-400" />
            <span>Internal Code Repositories &amp; Branches</span>
          </h2>

          <div className="grid grid-cols-1 gap-3">
            {REPOSITORIES.map((repo, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#0C0D12] border border-white/10 flex items-center justify-between text-xs font-mono"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="font-bold text-white">{repo.name}</span>
                  <span className="text-white/40">[{repo.branch}]</span>
                </div>
                <div className="flex items-center gap-4 text-white/60">
                  <span>{repo.language}</span>
                  <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] text-white">
                    {repo.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Agency Member Entitlements */}
        <div className="p-6 rounded-2xl bg-[#090A0E] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-orbitron font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>Agency Internal IDE License Active</span>
            </h3>
            <p className="text-xs text-white/60 font-sans">
              All agency member accounts are provisioned with full multi-model access and internal canary flags.
            </p>
          </div>
          <Link
            href="/download"
            className="px-4 py-2 rounded-xl bg-white text-black font-orbitron font-bold text-xs hover:bg-neutral-200 transition-colors shrink-0"
          >
            Launch Studio IDE
          </Link>
        </div>

      </div>
    </div>
  );
}
