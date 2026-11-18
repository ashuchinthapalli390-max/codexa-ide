"use client";

import React, { useRef, useEffect } from "react";
import { Check, X, Minus, HelpCircle, ExternalLink, ShieldCheck, Tag } from "lucide-react";
import { getGsap } from "@/lib/motion/gsapSetup";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";
import { MOTION_EASINGS } from "@/lib/motion/tokens";

export interface ComparisonItem {
  category: string;
  rows: {
    dimension: string;
    codexa: string | boolean;
    cursor: string | boolean;
    antigravity: string | boolean;
    vscode: string | boolean;
  }[];
}

export const COMPARISON_CATEGORIES: ComparisonItem[] = [
  {
    category: "A • Editor & Workspace Core",
    rows: [
      {
        dimension: "Base Desktop Architecture",
        codexa: "Local-First Desktop Core",
        cursor: "Electron VS Code Fork",
        antigravity: "Cloud Agent Workspace",
        vscode: "Open-Source Electron",
      },
      {
        dimension: "Local AST In-Memory Cache",
        codexa: "Native Sub-50ms Buffer",
        cursor: "Limited Client Cache",
        antigravity: "Cloud Indexing",
        vscode: "Via Extension LSPs",
      },
      {
        dimension: "Integrated PTY Terminal Matrix",
        codexa: true,
        cursor: true,
        antigravity: "Sandboxed Subagent CLI",
        vscode: true,
      },
      {
        dimension: "Extension Ecosystem",
        codexa: "Open VSX Registry",
        cursor: "Open VSX / Gallery",
        antigravity: "Marketplace Plugins & Skills",
        vscode: "VS Code Marketplace",
      },
      {
        dimension: "Mobile Companion Availability",
        codexa: "Android (Under Dev)",
        cursor: "Web/iOS Companion",
        antigravity: "Browser Tab Access",
        vscode: "vscode.dev (Web only)",
      },
    ],
  },
  {
    category: "B • AI Functionality & Universal Model Access",
    rows: [
      {
        dimension: "Supported Model Diversity",
        codexa: "Astra 6, Fabel, Gemini, NEXA",
        cursor: "Claude 3.5, GPT-4o",
        antigravity: "Gemini 2.5 Pro / Flash",
        vscode: "GitHub Copilot GPT",
      },
      {
        dimension: "Universal Model Access (All Paid Plans)",
        codexa: true,
        cursor: "Tier-Restricted Models",
        antigravity: "Quota Tier Restricted",
        vscode: "Copilot Add-on Dependent",
      },
      {
        dimension: "Deterministic Task Planner",
        codexa: true,
        cursor: "Agent Mode (Beta)",
        antigravity: "Native Swarm Orchestration",
        vscode: false,
      },
      {
        dimension: "Line-by-Line Syntactic AST Review",
        codexa: true,
        cursor: true,
        antigravity: "Artifact Inspection",
        vscode: "Via Extension",
      },
      {
        dimension: "Uncapped Offline Coding Model",
        codexa: "NEXA Edge (100% Air-Gap)",
        cursor: false,
        antigravity: false,
        vscode: false,
      },
    ],
  },
  {
    category: "C • Development Workflow & Runtime",
    rows: [
      {
        dimension: "Synchronized Live DOM Container",
        codexa: "Dual Mobile/Desktop Split",
        cursor: "External Browser Tab",
        antigravity: "Browser Subagent Tab",
        vscode: "Separate Simple Browser",
      },
      {
        dimension: "Visual Git Branch & Hunk Staging",
        codexa: true,
        cursor: true,
        antigravity: "Workspace Commits",
        vscode: true,
      },
      {
        dimension: "Zero-Port Local Runtime Preview",
        codexa: true,
        cursor: false,
        antigravity: "Local Port Forwarding",
        vscode: "Manual Localhost Port",
      },
    ],
  },
  {
    category: "D • Privacy, Keychains & Infrastructure",
    rows: [
      {
        dimension: "Bring-Your-Own-Key (BYOK)",
        codexa: "Encrypted OS Vault",
        cursor: "Supported with Limits",
        antigravity: "Managed Cloud Auth",
        vscode: "Via Third-Party Plugins",
      },
      {
        dimension: "Default Telemetry Policy",
        codexa: "Zero Cloud Telemetry",
        cursor: "Opt-out Privacy Mode",
        antigravity: "Google Cloud Policy",
        vscode: "Opt-out Telemetry",
      },
      {
        dimension: "Local Credential Vault Storage",
        codexa: "WinCred / Keychain / Libsecret",
        cursor: "Local Storage",
        antigravity: "Cloud Account Storage",
        vscode: "OS Keychain Support",
      },
    ],
  },
];

export const PRICING_COMPARISON_CARDS = [
  {
    product: "CodeXa Studio IDE",
    highlight: true,
    freeTier: "Pre-Beta Access & Unlimited Local NEXA",
    starterPrice: "₹328 / month (₹262.40 with CODEXA20)",
    proPrice: "₹1,716 / month (Pro)",
    billingCurrency: "INR (Direct Indian UPI & Cards)",
    aiUsageStructure: "250k - 5M weighted premium units. All models accessible across all plans.",
    notes: "Transparent Indian billing. No foreign currency transaction fees.",
  },
  {
    product: "Cursor",
    highlight: false,
    freeTier: "Free Hobby Tier (2,000 completions + 50 slow requests)",
    starterPrice: "$20 / month (~₹1,670 / mo)",
    proPrice: "$40 / month (~₹3,340 / mo Business)",
    billingCurrency: "USD (International Card)",
    aiUsageStructure: "500 fast requests/mo, then pooled queue. High-end models metered strictly.",
    notes: "Official pricing verified from cursor.com/pricing as of Nov 2026.",
  },
  {
    product: "Google Antigravity",
    highlight: false,
    freeTier: "Free Individual Preview with basic quotas",
    starterPrice: "Pay-As-You-Go / Cloud Pro",
    proPrice: "Google Cloud Organization Billing",
    billingCurrency: "USD (Google Cloud Billing)",
    aiUsageStructure: "Token quotas tied to Google Cloud project limits & Gemini API tiers.",
    notes: "Antigravity is an agent-first cloud IDE by Google DeepMind.",
  },
  {
    product: "VS Code (+ Copilot)",
    highlight: false,
    freeTier: "Free Open-Source Core Editor",
    starterPrice: "$10 / month (Copilot Individual)",
    proPrice: "$19 / user / month (Copilot Business)",
    billingCurrency: "USD (Microsoft Billing)",
    aiUsageStructure: "Unlimited chat completions with OpenAI models, separate enterprise limits.",
    notes: "VS Code is completely free; Copilot is an optional subscription add-on.",
  },
];

export function CompetitorComparisonSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const isReduced = useReducedMotion();

  useEffect(() => {
    if (isReduced) return;

    const { gsap } = getGsap();
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (tableRef.current) {
        gsap.fromTo(
          tableRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: MOTION_EASINGS.smoothOut,
            scrollTrigger: {
              trigger: tableRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isReduced]);

  const renderValue = (val: string | boolean) => {
    if (val === true) {
      return (
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400">
          <Check className="w-3.5 h-3.5" />
        </span>
      );
    }
    if (val === false) {
      return (
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-neutral-800 text-neutral-500">
          <X className="w-3.5 h-3.5" />
        </span>
      );
    }
    return <span className="text-xs text-white/80 font-medium">{val}</span>;
  };

  return (
    <section
      ref={sectionRef}
      id="compare"
      className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#000000] text-white border-t border-white/5 relative select-none"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section 1 Header: Feature Matrix */}
        <div className="text-center mb-16">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#A1A4AE] mb-3 block font-sans">
            WORKFLOW COMPARISON
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white font-orbitron">
            Find Your Development Workflow.
          </h2>
          <p className="text-[14px] text-white/60 max-w-2xl mx-auto leading-relaxed mt-3">
            An honest side-by-side comparison across modern coding tools, local ergonomics, pricing models, and AI agent architectures.
          </p>
        </div>

        {/* Feature Comparison Table */}
        <div
          ref={tableRef}
          className="border border-white/10 rounded-2xl overflow-hidden bg-[#0D0E12] shadow-2xl overflow-x-auto mb-20"
        >
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.03]">
                <th className="py-4 px-6 text-xs font-mono uppercase tracking-wider text-neutral-400 w-1/4">
                  Feature Dimension
                </th>
                <th className="py-4 px-6 text-xs font-bold font-orbitron text-white w-1/4 bg-white/[0.04] border-x border-white/10">
                  <div className="flex items-center gap-2">
                    <span>CodeXa Studio IDE</span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white text-black font-bold uppercase">
                      Local-First
                    </span>
                  </div>
                </th>
                <th className="py-4 px-6 text-xs font-bold font-sans text-neutral-300 w-1/6">
                  Cursor
                </th>
                <th className="py-4 px-6 text-xs font-bold font-sans text-neutral-300 w-1/6">
                  Google Antigravity
                </th>
                <th className="py-4 px-6 text-xs font-bold font-sans text-neutral-300 w-1/6">
                  VS Code (+ Copilot)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {COMPARISON_CATEGORIES.map((cat, catIdx) => (
                <React.Fragment key={catIdx}>
                  {/* Category Header Row */}
                  <tr className="bg-white/[0.02]">
                    <td
                      colSpan={5}
                      className="py-3 px-6 text-[10.5px] font-mono font-bold uppercase tracking-wider text-[#A1A4AE] border-y border-white/[0.08]"
                    >
                      {cat.category}
                    </td>
                  </tr>

                  {/* Rows inside category */}
                  {cat.rows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="py-3 px-6 text-xs text-neutral-300 font-medium">
                        {row.dimension}
                      </td>
                      <td className="py-3 px-6 text-xs bg-white/[0.03] border-x border-white/10 font-medium text-white">
                        {renderValue(row.codexa)}
                      </td>
                      <td className="py-3 px-6 text-xs text-neutral-400">
                        {renderValue(row.cursor)}
                      </td>
                      <td className="py-3 px-6 text-xs text-neutral-400">
                        {renderValue(row.antigravity)}
                      </td>
                      <td className="py-3 px-6 text-xs text-neutral-400">
                        {renderValue(row.vscode)}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 2: Dedicated Compare Pricing & AI Usage Section */}
        <div className="pt-8 border-t border-white/10">
          <div className="text-center mb-12">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#A1A4AE] font-bold block mb-2">
              FINANCIAL &amp; USAGE TRANSPARENCY
            </span>
            <h3 className="text-2xl sm:text-3xl font-orbitron font-bold text-white">
              Compare Pricing &amp; AI Usage
            </h3>
            <p className="text-xs sm:text-sm text-white/60 max-w-xl mx-auto mt-2">
              Direct comparison of billing structures, currencies, free tier access, and monthly token pools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {PRICING_COMPARISON_CARDS.map((card, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-2xl border flex flex-col justify-between transition-all ${
                  card.highlight
                    ? "bg-[#111218] border-white/20 shadow-xl ring-1 ring-white/20"
                    : "bg-[#0B0C10] border-white/[0.08]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-base font-bold font-orbitron text-white">
                      {card.product}
                    </h4>
                    {card.highlight && (
                      <span className="text-[9px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                        Indian UPI / INR
                      </span>
                    )}
                  </div>

                  <div className="space-y-3 text-xs mb-6">
                    <div>
                      <div className="text-[10px] font-mono text-white/40 uppercase">Free Tier</div>
                      <div className="text-white/80 font-medium">{card.freeTier}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-white/40 uppercase">Entry Price</div>
                      <div className="text-white font-bold">{card.starterPrice}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-white/40 uppercase">Higher Tier</div>
                      <div className="text-white/80 font-medium">{card.proPrice}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-white/40 uppercase">AI Token Pool</div>
                      <div className="text-neutral-300 leading-snug">{card.aiUsageStructure}</div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.06] text-[10.5px] font-mono text-white/40">
                  {card.notes}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footnotes & Fairness Disclaimer */}
        <div className="mt-12 pt-6 border-t border-white/5 text-[11px] text-white/40 space-y-1.5 font-mono">
          <p>
            * Official competitor sources verified as of November 2026: visualstudio.com/pricing, cursor.com/pricing, antigravity.google/pricing.
          </p>
          <p>
            * VS Code core editor is completely free under Microsoft license; GitHub Copilot is an optional add-on subscription ($10/mo).
          </p>
          <p>
            * Total development costs vary depending on model choice, request concurrency, and token volume.
          </p>
        </div>
      </div>
    </section>
  );
}