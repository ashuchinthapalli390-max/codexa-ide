"use client";

import React, { useState } from "react";
import Link from "next/link";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { useAuth } from "@/lib/auth/AuthContext";
import { getRoleBadgeLabel } from "@/lib/auth/roles";
import {
  GraduationCap,
  CheckCircle2,
  Clock,
  BookOpen,
  FolderGit2,
  FileCode,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  ChevronRight
} from "lucide-react";

export default function InternDashboardPage() {
  return (
    <RoleGuard
      allowedRoles={["intern", "founder", "co_founder", "admin", "hr", "cto", "team_lead"]}
      fallbackMessage="Access restricted. You must have an approved CodeXa Intern or Leadership role."
    >
      <InternContent />
    </RoleGuard>
  );
}

const INITIAL_TASKS = [
  {
    id: "tsk_01",
    title: "Verify AST Symbol Cache on Monorepo (100k+ LOC)",
    category: "IDE Testing",
    status: "in_progress",
    due: "Tomorrow, 6:00 PM",
    module: "codexa-ast-engine",
  },
  {
    id: "tsk_02",
    title: "Benchmark Gemini 3.8 Flash Streaming TTFT",
    category: "Performance",
    status: "completed",
    due: "Completed Nov 12",
    module: "ai-runtime-gateway",
  },
  {
    id: "tsk_03",
    title: "Draft Unit Tests for BYOK Local Keychain Pass-Through",
    category: "Security",
    status: "assigned",
    due: "Nov 18, 2026",
    module: "security-keyring",
  },
];

const LEARNING_RESOURCES = [
  {
    title: "AST Symbol Indexing Architecture",
    description: "Deep dive into CodeXa's in-memory syntax tree tokenizer and sub-millisecond symbol resolver.",
    href: "/docs/ast-indexing-architecture",
    tag: "Architecture",
  },
  {
    title: "Dual-Agent Task Planner Specification",
    description: "Learn how the Planner and Synthesizer sub-agents coordinate DAG code transformations.",
    href: "/docs/dual-agent-task-planner",
    tag: "Agent Swarms",
  },
  {
    title: "Zero-Telemetry Local Keyring Security",
    description: "Understanding OS Keychain integration and direct provider API pass-through guarantees.",
    href: "/docs/zero-telemetry-byok",
    tag: "Security",
  },
];

function InternContent() {
  const { user, userProfile, role } = useAuth();
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  const completeTask = (id: string) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, status: "completed" } : t))
    );
  };

  return (
    <div className="pt-28 pb-24 bg-[#000000] text-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Intern Header */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-[#0D0E13] to-[#0A0B0E] border border-emerald-500/20 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold font-orbitron text-white">
                  CodeXa Intern Workspace
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold uppercase">
                  Cohort: {userProfile?.internCohort || "2026-Beta"}
                </span>
              </div>
              <p className="text-xs text-white/60 font-sans mt-1">
                Welcome, {userProfile?.displayName || user?.displayName}. Your assigned engineering tasks and learning materials.
              </p>
            </div>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-right">
            <span className="text-[9.5px] font-mono uppercase tracking-wider text-white/40 block">
              IDE ENTITLEMENT
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400">
              Agency-Sponsored Starter
            </span>
          </div>
        </div>

        {/* Section 1: My Tasks */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-orbitron text-white flex items-center gap-2">
              <span>My Assigned Tasks</span>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                {tasks.filter((t) => t.status === "completed").length} / {tasks.length} Done
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-5 rounded-2xl bg-[#0C0D12] border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/70">
                      {task.category}
                    </span>
                    <span className="text-[10px] font-mono text-white/40">
                      Module: {task.module}
                    </span>
                  </div>
                  <h3 className="text-sm font-sans font-bold text-white">
                    {task.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-white/40">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>{task.due}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {task.status === "completed" ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified Completed</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => completeTask(task.id)}
                      className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-emerald-500 hover:text-black text-white text-xs font-mono font-semibold transition-all border border-white/10"
                    >
                      Submit for Review
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Learning Resources & Engineering Specs */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold font-orbitron text-white">
            Curated Intern Learning Resources
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {LEARNING_RESOURCES.map((res, idx) => (
              <Link
                key={idx}
                href={res.href}
                className="p-6 rounded-2xl bg-[#0C0D12] border border-white/10 hover:border-white/25 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/70">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                      {res.tag}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold font-orbitron text-white group-hover:text-emerald-400 transition-colors mb-1.5">
                    {res.title}
                  </h3>
                  <p className="text-xs text-white/60 font-sans leading-relaxed">
                    {res.description}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 mt-5">
                  <span>Read Spec</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Section 3: CodeXa Studio Access & Download */}
        <div className="p-6 rounded-2xl bg-[#090A0E] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-orbitron font-bold text-white">
              CodeXa Studio IDE Internal Preview
            </h3>
            <p className="text-xs text-white/60 font-sans">
              Your intern account includes pre-beta access to the desktop IDE canary builds with offline NEXA support.
            </p>
          </div>
          <Link
            href="/download"
            className="px-4 py-2 rounded-xl bg-white text-black font-orbitron font-bold text-xs hover:bg-neutral-200 transition-colors shrink-0"
          >
            Download Canary Build
          </Link>
        </div>

      </div>
    </div>
  );
}
