"use client";

import React, { useState, useEffect } from "react";
import { UserUsageState } from "@/lib/ai/types";
import {
  Sparkles,
  Zap,
  Shield,
  HardDrive,
  RefreshCw,
  AlertTriangle,
  ArrowUpRight,
  Send,
  Loader2,
  CheckCircle2,
  Clock,
} from "lucide-react";

export function UsageDashboard() {
  const [usage, setUsage] = useState<UserUsageState | null>(null);
  const [loading, setLoading] = useState(true);
  const [testingModel, setTestingModel] = useState("gpt-6-astra");
  const [testPrompt, setTestPrompt] = useState("Refactor AST visitor in compiler-core.ts");
  const [simulating, setSimulating] = useState(false);
  const [simMessage, setSimMessage] = useState<string | null>(null);

  const fetchUsage = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/usage");
      const data = await res.json();
      if (data.usage) {
        setUsage(data.usage);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsage();
  }, []);

  const handleSimulateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSimulating(true);
    setSimMessage(null);

    try {
      const res = await fetch("/api/ai/meter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelId: testingModel,
          promptPreview: testPrompt,
          inputTokens: 1400,
          outputTokens: 600,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSimMessage(`✔ ${data.message}`);
        fetchUsage();
      } else {
        setSimMessage(`⚠ ${data.error}`);
      }
    } catch {
      setSimMessage("Network error running verification test.");
    } finally {
      setSimulating(false);
    }
  };

  if (loading && !usage) {
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center text-white/50 font-mono text-xs">
        <Loader2 className="w-5 h-5 animate-spin mr-2 text-white" />
        <span>Loading authoritative token quota from CodeXa Agency...</span>
      </div>
    );
  }

  if (!usage) return null;

  const isLeadership = usage.planId === "LEADERSHIP";

  return (
    <div className="w-full space-y-8 select-none text-white font-sans">
      {/* Top Banner Warning if >= 80% */}
      {usage.isNearCap && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-between text-xs font-sans">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              <strong>Quota Notice:</strong> You have consumed over 80% of your monthly premium token allowance.
            </span>
          </div>
          {!isLeadership && (
            <a
              href="/#prebeta-pricing"
              className="px-3 py-1 rounded-lg bg-amber-400 text-black font-semibold text-xs shrink-0"
            >
              Upgrade Plan
            </a>
          )}
        </div>
      )}

      {/* Primary Quota Metric Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0E0F12] border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono uppercase text-white/50 tracking-wider">
                {isLeadership ? "AUTHORITATIVE POLICY" : "CURRENT SUBSCRIPTION"}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  isLeadership
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    : "bg-white/10 text-white"
                }`}
              >
                {isLeadership ? "AGENCY LEADERSHIP ACCESS" : `${usage.planId} TIER`}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-orbitron font-bold text-white">
              AI Usage &amp; Limits
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchUsage}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              title="Refresh Quota"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            {isLeadership ? (
              <a
                href="/founder"
                className="px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono font-semibold text-xs hover:bg-emerald-500/25 transition-colors flex items-center gap-1.5"
              >
                <span>Founder Control</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            ) : (
              <a
                href="/#prebeta-pricing"
                className="px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors flex items-center gap-1.5"
              >
                <span>Change Plan</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Big Progress Bar */}
        <div className="space-y-3">
          <div className="flex justify-between items-baseline text-xs font-sans">
            <span className="text-white/60">
              Used: <strong className="text-white font-mono">{usage.usedUnits.toLocaleString()}</strong> / {usage.monthlyAllowanceUnits.toLocaleString()} units
            </span>
            <span className="text-white font-mono font-bold text-sm">
              {usage.percentageUsed}% consumed
            </span>
          </div>

          <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/10 relative">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                usage.isNearCap ? "bg-amber-400" : "bg-emerald-400"
              }`}
              style={{ width: `${Math.min(100, usage.percentageUsed)}%` }}
            />
          </div>

          <div className="flex justify-between text-[11px] font-mono text-white/40 pt-1">
            <span>Period Start: Nov 01, 2026</span>
            <span>Monthly Reset: Dec 01, 2026</span>
          </div>
        </div>
      </div>

      {/* Two Column Section: Premium Models Breakdown vs Free Models */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Premium Models Consumption */}
        <div className="p-6 rounded-2xl bg-[#0E0F12] border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="text-base font-orbitron font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-white" />
              <span>Premium Models Billed</span>
            </h3>
            <span className="text-[11px] font-mono text-white/50">Deducts Quota</span>
          </div>

          <div className="space-y-3">
            {Object.keys(usage.premiumBreakdown).length === 0 ? (
              <div className="py-6 text-center text-xs text-white/40 font-mono border border-dashed border-white/10 rounded-xl">
                No premium model inference recorded for this period.
              </div>
            ) : (
              Object.values(usage.premiumBreakdown).map((m) => (
                <div
                  key={m.modelId}
                  className="p-3.5 rounded-xl bg-[#141519] border border-white/5 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-white text-[13px]">{m.modelName}</div>
                    <div className="text-[11px] text-white/40 font-mono mt-0.5">
                      {m.requestCount} requests • {m.rawInputTokens.toLocaleString()} in / {m.rawOutputTokens.toLocaleString()} out
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-emerald-400">
                      {m.premiumUnitsBilled.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-white/40 font-mono">units</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Free Unlimited Models (Zero Token Deduction) */}
        <div className="p-6 rounded-2xl bg-[#0E0F12] border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="text-base font-orbitron font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Free CodeXa Models</span>
            </h3>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
              0 Units Deducted
            </span>
          </div>

          <div className="space-y-3">
            {Object.keys(usage.freeBreakdown).length === 0 ? (
              <div className="py-6 text-center text-xs text-white/40 font-mono border border-dashed border-white/10 rounded-xl">
                No local NEXA or CodeXa AST executions logged yet. Free models have unlimited quota.
              </div>
            ) : (
              Object.values(usage.freeBreakdown).map((m) => (
                <div
                  key={m.modelId}
                  className="p-3.5 rounded-xl bg-[#141519] border border-white/5 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-white text-[13px]">{m.modelName}</div>
                    <div className="text-[11px] text-white/40 font-mono mt-0.5">
                      {m.requestCount} requests • Avg latency: {m.avgLatencyMs}ms
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-white/80">
                      {m.tokensProcessed.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-emerald-400 font-mono">Unlimited Fair Use</div>
                  </div>
                </div>
              ))
            )}
          </div>

          <p className="text-[11px] text-white/40 leading-relaxed pt-2">
            *NEXA on-device neural weights and native CodeXa AST syntax models run with zero cloud exfiltration and zero token deduction.
          </p>
        </div>
      </div>

      {/* Interactive AI Execution Simulator for Verification */}
      <div className="p-6 rounded-2xl bg-[#0E0F12] border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-orbitron font-bold text-white">
              Live Token Metering Simulator
            </h3>
            <p className="text-xs text-white/60">
              Trigger a real-time request to the authoritative backend meter to verify live deduction and quota gates.
            </p>
          </div>
        </div>

        <form onSubmit={handleSimulateRequest} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-4">
            <select
              value={testingModel}
              onChange={(e) => setTestingModel(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#141519] border border-white/15 text-white text-xs focus:outline-none"
            >
              <option value="gpt-6-astra">GPT-6 Astra [OpenAI] (1.5x Premium)</option>
              <option value="gemini-3.8-flash">Gemini 3.8 Flash (1.2x Premium)</option>
              <option value="fabel-5.1">Fabel 5.1 Verification (1.8x Premium)</option>
              <option value="gpt-5.6-sol">GPT 5.6 SOL (2.0x Premium)</option>
              <option value="opus-5.5">OPUS 5.5 Frontier (3.5x - Pro requires upgrade)</option>
              <option value="nexa">NEXA Edge (0x - Free Unlimited)</option>
              <option value="codexa-core">CodeXa Models (0x - Free Unlimited)</option>
            </select>
          </div>

          <div className="sm:col-span-6">
            <input
              type="text"
              value={testPrompt}
              onChange={(e) => setTestPrompt(e.target.value)}
              placeholder="Test prompt preview..."
              className="w-full px-3 py-2.5 rounded-xl bg-[#141519] border border-white/15 text-white text-xs placeholder:text-white/30 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={simulating}
              className="w-full h-full py-2.5 px-3 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {simulating ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </>
              )}
            </button>
          </div>
        </form>

        {simMessage && (
          <div className="p-3 rounded-xl bg-[#141519] border border-white/10 text-xs font-mono text-white/90">
            {simMessage}
          </div>
        )}
      </div>

      {/* Recent Events Audit Table */}
      <div className="p-6 rounded-2xl bg-[#0E0F12] border border-white/10 space-y-4">
        <h3 className="text-base font-orbitron font-bold text-white">
          Authoritative Token Audit Log
        </h3>

        {usage.recentEvents.length === 0 ? (
          <div className="py-8 text-center text-xs text-white/40 font-mono border border-dashed border-white/10 rounded-xl">
            No AI token transactions recorded yet. Use the simulator above or execute models in the IDE workspace.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-white/10 text-white/40 font-mono text-[10px] uppercase">
                  <th className="pb-3">Timestamp</th>
                  <th className="pb-3">Model</th>
                  <th className="pb-3">Prompt Excerpt</th>
                  <th className="pb-3">Raw Tokens</th>
                  <th className="pb-3 text-right">Units Billed</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {usage.recentEvents.map((evt) => (
                  <tr key={evt.id} className="hover:bg-white/[0.02]">
                    <td className="py-2.5 text-white/40 font-mono text-[11px]">
                      {new Date(evt.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-2.5 text-white font-medium">{evt.modelName}</td>
                    <td className="py-2.5 text-white/60 truncate max-w-[200px]">{evt.promptPreview}</td>
                    <td className="py-2.5 font-mono text-white/60">{evt.rawTokens.toLocaleString()}</td>
                    <td className="py-2.5 font-mono font-bold text-right text-emerald-400">
                      {evt.unitsBilled.toLocaleString()}
                    </td>
                    <td className="py-2.5 text-right">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                          evt.status === "SUCCESS"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : evt.status === "WARNING_80"
                            ? "bg-amber-500/10 text-amber-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {evt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

